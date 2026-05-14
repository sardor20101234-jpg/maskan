const bcrypt = require('bcryptjs');
const db = require('./database');

function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  db.exec(`
    DELETE FROM submissions;
    DELETE FROM announcements;
    DELETE FROM assignments;
    DELETE FROM enrollments;
    DELETE FROM courses;
    DELETE FROM users;
  `);

  const hashPassword = (pw) => bcrypt.hashSync(pw, 10);

  // Insert users
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  );

  const teachers = [
    { name: 'Dr. Sarah Mitchell', email: 'sarah@educlass.com', password: hashPassword('teacher123'), role: 'teacher' },
    { name: 'Prof. James Chen', email: 'james@educlass.com', password: hashPassword('teacher123'), role: 'teacher' },
    { name: 'Ms. Emily Rodriguez', email: 'emily@educlass.com', password: hashPassword('teacher123'), role: 'teacher' },
    { name: 'Mr. David Park', email: 'david@educlass.com', password: hashPassword('teacher123'), role: 'teacher' },
  ];

  const students = [
    { name: 'Alex Johnson', email: 'alex@educlass.com', password: hashPassword('student123'), role: 'student' },
    { name: 'Maria Garcia', email: 'maria@educlass.com', password: hashPassword('student123'), role: 'student' },
    { name: 'Ryan Thompson', email: 'ryan@educlass.com', password: hashPassword('student123'), role: 'student' },
    { name: 'Priya Patel', email: 'priya@educlass.com', password: hashPassword('student123'), role: 'student' },
    { name: 'Jordan Lee', email: 'jordan@educlass.com', password: hashPassword('student123'), role: 'student' },
  ];

  // Also insert the demo accounts
  insertUser.run('Teacher Demo', 'teacher@educlass.com', hashPassword('teacher123'), 'teacher');
  insertUser.run('Student Demo', 'student@educlass.com', hashPassword('student123'), 'student');

  teachers.forEach(t => insertUser.run(t.name, t.email, t.password, t.role));
  students.forEach(s => insertUser.run(s.name, s.email, s.password, s.role));

  // Get user IDs
  const getUser = db.prepare('SELECT id FROM users WHERE email = ?');
  const teacherDemo = getUser.get('teacher@educlass.com').id;
  const sarah = getUser.get('sarah@educlass.com').id;
  const james = getUser.get('james@educlass.com').id;
  const emilyR = getUser.get('emily@educlass.com').id;
  const davidP = getUser.get('david@educlass.com').id;

  const studentDemo = getUser.get('student@educlass.com').id;
  const alex = getUser.get('alex@educlass.com').id;
  const maria = getUser.get('maria@educlass.com').id;
  const ryan = getUser.get('ryan@educlass.com').id;
  const priya = getUser.get('priya@educlass.com').id;

  // Insert courses
  const insertCourse = db.prepare(
    'INSERT INTO courses (title, subject, description, teacher_id, cover_color, code) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const courses = [
    { title: 'Algebra 101', subject: 'Math', description: 'Introduction to algebraic expressions, equations, and functions. Build a strong foundation in mathematical reasoning.', teacher_id: sarah, color: '#3b82f6', code: 'ALG101' },
    { title: 'Calculus Fundamentals', subject: 'Math', description: 'Explore limits, derivatives, and integrals. Master the calculus concepts essential for advanced mathematics.', teacher_id: sarah, color: '#2563eb', code: 'CALC01' },
    { title: 'Biology Basics', subject: 'Science', description: 'Discover the building blocks of life — cells, DNA, ecosystems, and evolution. Hands-on labs included.', teacher_id: james, color: '#10b981', code: 'BIO101' },
    { title: 'Chemistry Essentials', subject: 'Science', description: 'Atoms, molecules, reactions, and the periodic table. Learn to think like a chemist.', teacher_id: james, color: '#059669', code: 'CHEM01' },
    { title: 'World History', subject: 'History', description: 'Journey through civilizations — from ancient Mesopotamia to the modern world. Understand the forces that shaped our world.', teacher_id: emilyR, color: '#f59e0b', code: 'HIST01' },
    { title: 'American History', subject: 'History', description: 'From the colonial era to the present day. Explore the events, ideas, and people that built America.', teacher_id: emilyR, color: '#d97706', code: 'AMHIST' },
    { title: 'Creative Writing', subject: 'English', description: 'Unleash your imagination through fiction, poetry, and creative nonfiction. Learn to write with style and purpose.', teacher_id: davidP, color: '#8b5cf6', code: 'WRIT01' },
    { title: 'English Literature', subject: 'English', description: 'Read and analyze classic and contemporary works. Develop critical thinking through literary analysis.', teacher_id: davidP, color: '#7c3aed', code: 'ELIT01' },
    { title: 'Geometry & Proofs', subject: 'Math', description: 'Shapes, angles, theorems, and the art of proof. A visual approach to mathematical reasoning.', teacher_id: teacherDemo, color: '#6366f1', code: 'GEO101' },
  ];

  courses.forEach(c => insertCourse.run(c.title, c.subject, c.description, c.teacher_id, c.color, c.code));

  // Enroll students in courses
  const insertEnrollment = db.prepare(
    'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)'
  );

  const getCourse = db.prepare('SELECT id FROM courses WHERE code = ?');

  // Student Demo enrolled in several courses
  [studentDemo, alex, maria].forEach(sid => {
    ['ALG101', 'BIO101', 'HIST01', 'WRIT01'].forEach(code => {
      insertEnrollment.run(sid, getCourse.get(code).id);
    });
  });

  [ryan, priya].forEach(sid => {
    ['CALC01', 'CHEM01', 'AMHIST', 'ELIT01'].forEach(code => {
      insertEnrollment.run(sid, getCourse.get(code).id);
    });
  });

  // Insert assignments
  const insertAssignment = db.prepare(
    'INSERT INTO assignments (course_id, title, description, due_date, points) VALUES (?, ?, ?, ?, ?)'
  );

  const alg101 = getCourse.get('ALG101').id;
  const bio101 = getCourse.get('BIO101').id;
  const hist01 = getCourse.get('HIST01').id;
  const writ01 = getCourse.get('WRIT01').id;

  insertAssignment.run(alg101, 'Solving Linear Equations', 'Solve the set of 20 linear equations. Show all work.', '2026-06-01', 100);
  insertAssignment.run(alg101, 'Quadratic Functions Quiz', 'Complete the online quiz on quadratic functions and graphing.', '2026-06-10', 50);
  insertAssignment.run(bio101, 'Cell Structure Lab Report', 'Write a lab report on the cell structure observation experiment.', '2026-06-05', 100);
  insertAssignment.run(bio101, 'Genetics Worksheet', 'Complete the Punnett square worksheet for genetic crosses.', '2026-06-15', 75);
  insertAssignment.run(hist01, 'Ancient Civilizations Essay', 'Write a 1000-word essay comparing two ancient civilizations.', '2026-06-08', 100);
  insertAssignment.run(writ01, 'Short Story Draft', 'Write the first draft of your short story (minimum 2000 words).', '2026-06-12', 100);
  insertAssignment.run(writ01, 'Poetry Portfolio', 'Submit a portfolio of 5 original poems with a reflective introduction.', '2026-06-20', 80);

  // Insert announcements
  const insertAnnouncement = db.prepare(
    'INSERT INTO announcements (course_id, title, content, author_id) VALUES (?, ?, ?, ?)'
  );

  insertAnnouncement.run(alg101, 'Welcome to Algebra 101!', 'Welcome everyone! Please review the syllabus and come prepared for our first class. Don\'t forget to bring your graphing calculator.', sarah);
  insertAnnouncement.run(alg101, 'Office Hours Update', 'My office hours have changed to Tuesday and Thursday, 3-5 PM. Feel free to drop by with questions!', sarah);
  insertAnnouncement.run(bio101, 'Lab Safety Reminder', 'Please remember to wear your lab coats and safety goggles during all lab sessions. Safety first!', james);
  insertAnnouncement.run(hist01, 'Guest Speaker Next Week', 'We have a guest speaker, Dr. Amanda Foster, who will talk about archaeological discoveries in Egypt. Don\'t miss it!', emilyR);
  insertAnnouncement.run(writ01, 'Writing Workshop', 'Our peer review writing workshop is this Friday. Bring printed copies of your latest draft for feedback.', davidP);

  // Insert some submissions
  const insertSubmission = db.prepare(
    'INSERT INTO submissions (assignment_id, student_id, content, grade, feedback) VALUES (?, ?, ?, ?, ?)'
  );

  const assignments = db.prepare('SELECT id FROM assignments WHERE course_id = ?').all(alg101);
  if (assignments.length > 0) {
    insertSubmission.run(assignments[0].id, studentDemo, 'Here are my solutions to the linear equations. I solved each one step by step, showing all work as requested.', 92, 'Excellent work! Minor error on problem 15.');
    insertSubmission.run(assignments[0].id, alex, 'My completed linear equations assignment with full solutions and work shown.', 88, 'Good job! Watch your signs when moving terms.');
    insertSubmission.run(assignments[0].id, maria, 'Linear equations solutions attached. I used both substitution and elimination methods.', null, null);
  }

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('Demo accounts:');
  console.log('  Teacher: teacher@educlass.com / teacher123');
  console.log('  Student: student@educlass.com / student123');
}

seed();
