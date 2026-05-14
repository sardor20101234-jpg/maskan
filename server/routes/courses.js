const express = require('express');
const crypto = require('crypto');
const db = require('../db/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all courses (public, filterable by subject)
router.get('/', (req, res) => {
  try {
    const { subject } = req.query;
    let query = `
      SELECT c.*, u.name as teacher_name,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as student_count
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
    `;
    const params = [];

    if (subject) {
      query += ' WHERE c.subject = ?';
      params.push(subject);
    }

    query += ' ORDER BY c.created_at DESC';
    const courses = db.prepare(query).all(...params);
    res.json(courses);
  } catch (err) {
    console.error('Get courses error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get my courses (enrolled or teaching)
router.get('/my', authenticateToken, (req, res) => {
  try {
    let courses;
    if (req.user.role === 'teacher') {
      courses = db.prepare(`
        SELECT c.*, u.name as teacher_name,
          (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as student_count
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        WHERE c.teacher_id = ?
        ORDER BY c.created_at DESC
      `).all(req.user.id);
    } else {
      courses = db.prepare(`
        SELECT c.*, u.name as teacher_name,
          (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as student_count
        FROM courses c
        JOIN users u ON c.teacher_id = u.id
        JOIN enrollments e ON e.course_id = c.id
        WHERE e.student_id = ?
        ORDER BY e.enrolled_at DESC
      `).all(req.user.id);
    }
    res.json(courses);
  } catch (err) {
    console.error('Get my courses error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single course
router.get('/:id', (req, res) => {
  try {
    const course = db.prepare(`
      SELECT c.*, u.name as teacher_name,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as student_count
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      WHERE c.id = ?
    `).get(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create course (teacher only)
router.post('/', authenticateToken, requireRole('teacher'), (req, res) => {
  try {
    const { title, subject, description, cover_color } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ error: 'Title and subject are required' });
    }

    const code = crypto.randomBytes(3).toString('hex').toUpperCase();
    const result = db.prepare(
      'INSERT INTO courses (title, subject, description, teacher_id, cover_color, code) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(title, subject, description || '', req.user.id, cover_color || '#6366f1', code);

    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(course);
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Enroll in course (student only)
router.post('/:id/enroll', authenticateToken, requireRole('student'), (req, res) => {
  try {
    const courseId = req.params.id;
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existing = db.prepare(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?'
    ).get(req.user.id, courseId);

    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    db.prepare('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)').run(req.user.id, courseId);
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unenroll from course (student only)
router.delete('/:id/enroll', authenticateToken, requireRole('student'), (req, res) => {
  try {
    db.prepare('DELETE FROM enrollments WHERE student_id = ? AND course_id = ?').run(req.user.id, req.params.id);
    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    console.error('Unenroll error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get students in a course (teacher only)
router.get('/:id/students', authenticateToken, requireRole('teacher'), (req, res) => {
  try {
    const students = db.prepare(`
      SELECT u.id, u.name, u.email, u.avatar, e.enrolled_at
      FROM users u
      JOIN enrollments e ON e.student_id = u.id
      WHERE e.course_id = ?
      ORDER BY u.name
    `).all(req.params.id);
    res.json(students);
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check enrollment status
router.get('/:id/enrollment', authenticateToken, (req, res) => {
  try {
    const enrollment = db.prepare(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?'
    ).get(req.user.id, req.params.id);
    res.json({ enrolled: !!enrollment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
