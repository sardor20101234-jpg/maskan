const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');
const announcementRoutes = require('./routes/announcements');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dashboard stats
const db = require('./db/database');
const { authenticateToken } = require('./middleware/auth');

app.get('/api/stats', authenticateToken, (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      const totalCourses = db.prepare('SELECT COUNT(*) as count FROM courses WHERE teacher_id = ?').get(req.user.id).count;
      const totalStudents = db.prepare(`
        SELECT COUNT(DISTINCT e.student_id) as count 
        FROM enrollments e 
        JOIN courses c ON e.course_id = c.id 
        WHERE c.teacher_id = ?
      `).get(req.user.id).count;
      const totalAssignments = db.prepare(`
        SELECT COUNT(*) as count 
        FROM assignments a 
        JOIN courses c ON a.course_id = c.id 
        WHERE c.teacher_id = ?
      `).get(req.user.id).count;
      const pendingGrading = db.prepare(`
        SELECT COUNT(*) as count 
        FROM submissions s 
        JOIN assignments a ON s.assignment_id = a.id 
        JOIN courses c ON a.course_id = c.id 
        WHERE c.teacher_id = ? AND s.grade IS NULL
      `).get(req.user.id).count;

      res.json({ totalCourses, totalStudents, totalAssignments, pendingGrading });
    } else {
      const enrolledCourses = db.prepare('SELECT COUNT(*) as count FROM enrollments WHERE student_id = ?').get(req.user.id).count;
      const totalAssignments = db.prepare(`
        SELECT COUNT(*) as count 
        FROM assignments a 
        JOIN enrollments e ON a.course_id = e.course_id 
        WHERE e.student_id = ?
      `).get(req.user.id).count;
      const submittedCount = db.prepare('SELECT COUNT(*) as count FROM submissions WHERE student_id = ?').get(req.user.id).count;
      const averageGrade = db.prepare('SELECT AVG(grade) as avg FROM submissions WHERE student_id = ? AND grade IS NOT NULL').get(req.user.id).avg;

      res.json({
        enrolledCourses,
        totalAssignments,
        submittedCount,
        averageGrade: averageGrade ? Math.round(averageGrade) : null
      });
    }
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 EduClass server running on http://localhost:${PORT}`);
});
