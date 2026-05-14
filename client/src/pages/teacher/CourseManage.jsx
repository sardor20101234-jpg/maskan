import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import { getSubjectStyle, getInitials, formatDate } from '../../utils/constants';
import SubjectBadge from '../../components/SubjectBadge';
import AssignmentCard from '../../components/AssignmentCard';
import AnnouncementCard from '../../components/AnnouncementCard';
import Modal from '../../components/Modal';

export default function CourseManage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [tab, setTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Form states
  const [aTitle, setATitle] = useState('');
  const [aDesc, setADesc] = useState('');
  const [aDue, setADue] = useState('');
  const [aPoints, setAPoints] = useState(100);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      // 1. Fetch Course with student count
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*, enrollments(count)')
        .eq('id', id)
        .single();
      
      if (courseError) throw courseError;
      setCourse({ ...courseData, student_count: courseData.enrollments[0]?.count || 0 });

      // 2. Fetch Assignments
      const { data: assignData } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', id)
        .order('created_at', { ascending: false });
      setAssignments(assignData || []);

      // 3. Fetch Announcements
      const { data: annData } = await supabase
        .from('announcements')
        .select('*')
        .eq('course_id', id)
        .order('created_at', { ascending: false });
      setAnnouncements(annData || []);

      // 4. Fetch Students
      const { data: studData } = await supabase
        .from('enrollments')
        .select(`
          enrolled_at,
          student:profiles (id, name, email)
        `)
        .eq('course_id', id);
      
      setStudents(studData?.map(s => ({
        ...s.student,
        enrolled_at: s.enrolled_at
      })) || []);

    } catch (err) {
      console.error('Error loading course data:', err);
      navigate('/teacher');
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('assignments')
        .insert([{
          course_id: id,
          title: aTitle,
          description: aDesc,
          due_date: aDue || null,
          points: aPoints
        }]);

      if (error) throw error;
      setShowAssignmentModal(false);
      setATitle(''); setADesc(''); setADue(''); setAPoints(100);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create assignment');
    }
  };

  const createAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('announcements')
        .insert([{
          course_id: id,
          title: annTitle,
          content: annContent,
          author_id: user.id
        }]);

      if (error) throw error;
      setShowAnnouncementModal(false);
      setAnnTitle(''); setAnnContent('');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to post announcement');
    }
  };

  const viewSubmissions = async (assignment) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          student:profiles (name)
        `)
        .eq('assignment_id', assignment.id);

      if (error) throw error;
      setSubmissions(data.map(s => ({ ...s, student_name: s.student.name })));
      setSelectedAssignment(assignment);
      setShowGradeModal(true);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const gradeSubmission = async (submissionId, grade, feedback) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ grade: parseInt(grade), feedback })
        .eq('id', submissionId);

      if (error) throw error;
      
      // Refresh submissions in modal
      const { data } = await supabase
        .from('submissions')
        .select(`
          *,
          student:profiles (name)
        `)
        .eq('assignment_id', selectedAssignment.id);
      
      setSubmissions(data.map(s => ({ ...s, student_name: s.student.name })));
    } catch (err) {
      console.error('Error grading submission:', err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;
  if (!course) return null;

  const style = getSubjectStyle(course.subject);
  const tabs = [
    { key: 'assignments', label: 'Assignments', count: assignments.length },
    { key: 'announcements', label: 'Announcements', count: announcements.length },
    { key: 'students', label: 'Students', count: students.length },
  ];

  return (
    <div className="animate-fade-in">
      <div className={`bg-gradient-to-r ${style.gradient} rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"><div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20" /></div>
        <div className="relative">
          <button onClick={() => navigate('/teacher')} className="text-white/80 hover:text-white text-sm mb-3 flex items-center gap-1">← Back to Dashboard</button>
          <SubjectBadge subject={course.subject} />
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">{course.title}</h1>
          <p className="text-white/80 mt-1 text-sm">Code: <span className="font-mono font-bold">{course.code}</span> • {course.student_count} students</p>
        </div>
      </div>

      <div className="flex gap-1 bg-surface-100 p-1 rounded-2xl mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${tab === t.key ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
            {t.label} <span className="ml-1 text-xs opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {tab === 'assignments' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-surface-900">Assignments</h2>
            <button onClick={() => setShowAssignmentModal(true)} className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all">+ New Assignment</button>
          </div>
          <div className="space-y-3 stagger-children">
            {assignments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-surface-200"><div className="text-4xl mb-3">📝</div><p className="text-surface-500">No assignments yet</p></div>
            ) : assignments.map(a => <AssignmentCard key={a.id} assignment={a} onViewSubmissions={viewSubmissions} />)}
          </div>
        </div>
      )}

      {tab === 'announcements' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-surface-900">Announcements</h2>
            <button onClick={() => setShowAnnouncementModal(true)} className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all">+ New Post</button>
          </div>
          <div className="space-y-3 stagger-children">
            {announcements.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-surface-200"><div className="text-4xl mb-3">📢</div><p className="text-surface-500">No announcements yet</p></div>
            ) : announcements.map(a => <AnnouncementCard key={a.id} announcement={a} />)}
          </div>
        </div>
      )}

      {tab === 'students' && (
        <div>
          <h2 className="font-bold text-surface-900 mb-4">Enrolled Students</h2>
          {students.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-surface-200"><div className="text-4xl mb-3">👥</div><p className="text-surface-500">No students enrolled yet</p></div>
          ) : (
            <div className="bg-white rounded-2xl border border-surface-200 divide-y divide-surface-100">
              {students.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold">{getInitials(s.name)}</div>
                  <div className="flex-1"><p className="font-semibold text-surface-900 text-sm">{s.name}</p><p className="text-xs text-surface-400">{s.email}</p></div>
                  <span className="text-xs text-surface-400">Joined {formatDate(s.enrolled_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showAssignmentModal} onClose={() => setShowAssignmentModal(false)} title="Create Assignment">
        <form onSubmit={createAssignment} className="space-y-4">
          <div><label className="block text-sm font-semibold text-surface-700 mb-1">Title</label><input type="text" value={aTitle} onChange={e => setATitle(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900" /></div>
          <div><label className="block text-sm font-semibold text-surface-700 mb-1">Description</label><textarea value={aDesc} onChange={e => setADesc(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900 resize-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-semibold text-surface-700 mb-1">Due Date</label><input type="date" value={aDue} onChange={e => setADue(e.target.value)} className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900" /></div>
            <div><label className="block text-sm font-semibold text-surface-700 mb-1">Points</label><input type="number" value={aPoints} onChange={e => setAPoints(e.target.value)} min="0" className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900" /></div>
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg transition-all">Create Assignment</button>
        </form>
      </Modal>

      <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title="Post Announcement">
        <form onSubmit={createAnnouncement} className="space-y-4">
          <div><label className="block text-sm font-semibold text-surface-700 mb-1">Title</label><input type="text" value={annTitle} onChange={e => setAnnTitle(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900" /></div>
          <div><label className="block text-sm font-semibold text-surface-700 mb-1">Content</label><textarea value={annContent} onChange={e => setAnnContent(e.target.value)} required rows={4} className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900 resize-none" /></div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg transition-all">Post Announcement</button>
        </form>
      </Modal>

      <Modal isOpen={showGradeModal} onClose={() => setShowGradeModal(false)} title={`Submissions: ${selectedAssignment?.title || ''}`}>
        {submissions.length === 0 ? (
          <p className="text-center text-surface-500 py-8">No submissions yet</p>
        ) : (
          <div className="space-y-4">
            {submissions.map(s => (
              <GradeItem key={s.id} submission={s} maxPoints={selectedAssignment?.points} onGrade={gradeSubmission} />
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

function GradeItem({ submission, maxPoints, onGrade }) {
  const [grade, setGrade] = useState(submission.grade ?? '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (grade === '') return;
    setSaving(true);
    await onGrade(submission.id, grade, feedback);
    setSaving(false);
  };

  return (
    <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-surface-900 text-sm">{submission.student_name}</span>
        {submission.grade !== null && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Graded: {submission.grade}/{maxPoints}</span>}
      </div>
      <p className="text-sm text-surface-600 mb-3 bg-white p-3 rounded-lg border border-surface-100">{submission.content}</p>
      <div className="flex gap-2">
        <input type="number" value={grade} onChange={e => setGrade(e.target.value)} placeholder="Grade" min="0" max={maxPoints} className="w-24 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900" />
        <input type="text" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Feedback (optional)" className="flex-1 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900" />
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">{saving ? '...' : 'Save'}</button>
      </div>
    </div>
  );
}
