const express = require('express');
const db = require('../db/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get announcements for a course
router.get('/course/:courseId', authenticateToken, (req, res) => {
  try {
    const announcements = db.prepare(`
      SELECT a.*, u.name as author_name
      FROM announcements a
      JOIN users u ON a.author_id = u.id
      WHERE a.course_id = ?
      ORDER BY a.created_at DESC
    `).all(req.params.courseId);

    res.json(announcements);
  } catch (err) {
    console.error('Get announcements error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create announcement (teacher only)
router.post('/course/:courseId', authenticateToken, requireRole('teacher'), (req, res) => {
  try {
    const { title, content } = req.body;
    const courseId = req.params.courseId;

    // Verify teacher owns the course
    const course = db.prepare('SELECT * FROM courses WHERE id = ? AND teacher_id = ?').get(courseId, req.user.id);
    if (!course) {
      return res.status(403).json({ error: 'You do not own this course' });
    }

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = db.prepare(
      'INSERT INTO announcements (course_id, title, content, author_id) VALUES (?, ?, ?, ?)'
    ).run(courseId, title, content, req.user.id);

    const announcement = db.prepare(`
      SELECT a.*, u.name as author_name
      FROM announcements a
      JOIN users u ON a.author_id = u.id
      WHERE a.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(announcement);
  } catch (err) {
    console.error('Create announcement error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete announcement (teacher only)
router.delete('/:id', authenticateToken, requireRole('teacher'), (req, res) => {
  try {
    const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (announcement.author_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    console.error('Delete announcement error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
