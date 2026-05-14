const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get assignments for a course
router.get('/course/:courseId', authenticateToken, (req, res) => {
  try {
    const assignments = db.prepare(`
      SELECT a.*,
        (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id) as submission_count
      FROM assignments a
      WHERE a.course_id = ?
      ORDER BY a.due_date ASC
    `).all(req.params.courseId);

    // If student, attach their submission status
    if (req.user.role === 'student') {
      assignments.forEach(a => {
        const submission = db.prepare(
          'SELECT id, grade, submitted_at FROM submissions WHERE assignment_id = ? AND student_id = ?'
        ).get(a.id, req.user.id);
        a.mySubmission = submission || null;
      });
    }

    res.json(assignments);
  } catch (err) {
    console.error('Get assignments error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create assignment (teacher only)
router.post('/course/:courseId', authenticateToken, requireRole('teacher'), (req, res) => {
  try {
    const { title, description, due_date, points } = req.body;
    const courseId = req.params.courseId;

    // Verify teacher owns the course
    const course = db.prepare('SELECT * FROM courses WHERE id = ? AND teacher_id = ?').get(courseId, req.user.id);
    if (!course) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = db.prepare(
      'INSERT INTO assignments (course_id, title, description, due_date, points) VALUES (?, ?, ?, ?, ?)'
    ).run(courseId, title, description || '', due_date || null, points || 100);

    const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(assignment);
  } catch (err) {
    console.error('Create assignment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit assignment (student only)
router.post('/:id/submit', authenticateToken, requireRole('student'), (req, res) => {
  try {
    const { content } = req.body;
    const assignmentId = req.params.id;

    if (!content) {
      return res.status(400).json({ error: 'Submission content is required' });
    }

    // Check assignment exists
    const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check student is enrolled
    const enrollment = db.prepare(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?'
    ).get(req.user.id, assignment.course_id);
    if (!enrollment) {
      return res.status(403).json({ error: 'You are not enrolled in this course' });
    }

    // Check if already submitted
    const existing = db.prepare(
      'SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?'
    ).get(assignmentId, req.user.id);

    if (existing) {
      // Update existing submission
      db.prepare(
        'UPDATE submissions SET content = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).run(content, existing.id);
      const updated = db.prepare('SELECT * FROM submissions WHERE id = ?').get(existing.id);
      return res.json(updated);
    }

    const result = db.prepare(
      'INSERT INTO submissions (assignment_id, student_id, content) VALUES (?, ?, ?)'
    ).run(assignmentId, req.user.id, content);

    const submission = db.prepare('SELECT * FROM submissions WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(submission);
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get submissions for an assignment (teacher only)
router.get('/:id/submissions', authenticateToken, requireRole('teacher'), (req, res) => {
  try {
    const submissions = db.prepare(`
      SELECT s.*, u.name as student_name, u.email as student_email
      FROM submissions s
      JOIN users u ON s.student_id = u.id
      WHERE s.assignment_id = ?
      ORDER BY s.submitted_at DESC
    `).all(req.params.id);
    res.json(submissions);
  } catch (err) {
    console.error('Get submissions error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Grade a submission (teacher only)
router.put('/submissions/:id/grade', authenticateToken, requireRole('teacher'), (req, res) => {
  try {
    const { grade, feedback } = req.body;

    if (grade === undefined || grade === null) {
      return res.status(400).json({ error: 'Grade is required' });
    }

    db.prepare(
      'UPDATE submissions SET grade = ?, feedback = ? WHERE id = ?'
    ).run(grade, feedback || '', req.params.id);

    const submission = db.prepare(`
      SELECT s.*, u.name as student_name
      FROM submissions s
      JOIN users u ON s.student_id = u.id
      WHERE s.id = ?
    `).get(req.params.id);

    res.json(submission);
  } catch (err) {
    console.error('Grade error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
