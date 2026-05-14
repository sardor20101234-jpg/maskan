import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import { getSubjectStyle } from '../../utils/constants';
import SubjectBadge from '../../components/SubjectBadge';
import AssignmentCard from '../../components/AssignmentCard';
import AnnouncementCard from '../../components/AnnouncementCard';
import Modal from '../../components/Modal';

export default function CourseView() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [tab, setTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  // Submit modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitContent, setSubmitContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id && user) loadData();
  }, [id, user]);

  const loadData = async () => {
    try {
      // 1. Fetch Course and Enrollment status
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles(name),
          enrollments(id),
          enrollments_count:enrollments(count)
        `)
        .eq('id', id)
        .eq('enrollments.student_id', user.id)
        .single();
      
      if (courseError) throw courseError;
      
      const isEnrolled = courseData.enrollments?.length > 0;
      setEnrolled(isEnrolled);
      setCourse({
        ...courseData,
        teacher_name: courseData.teacher?.name,
        student_count: courseData.enrollments_count[0]?.count || 0
      });

      if (isEnrolled) {
        // 2. Fetch Assignments with submissions
        const { data: assignData } = await supabase
          .from('assignments')
          .select(`
            *,
            submissions!left(id, content, grade, feedback, submitted_at)
          `)
          .eq('course_id', id)
          .eq('submissions.student_id', user.id)
          .order('created_at', { ascending: false });
        
        setAssignments(assignData?.map(a => ({
          ...a,
          mySubmission: a.submissions?.[0] || null
        })) || []);

        // 3. Fetch Announcements
        const { data: annData } = await supabase
          .from('announcements')
          .select('*')
          .eq('course_id', id)
          .order('created_at', { ascending: false });
        setAnnouncements(annData || []);
      }
    } catch (err) {
      console.error('Error loading course data:', err);
      navigate('/student');
    } finally { setLoading(false); }
  };

  const handleEnroll = async () => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([{ student_id: user.id, course_id: id }]);

      if (error) throw error;
      loadData();
    } catch (err) { alert(err.message || 'Enrollment failed'); }
  };

  const openSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmitContent(assignment.mySubmission?.content || '');
    setShowSubmitModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Upsert submission
      const { error } = await supabase
        .from('submissions')
        .upsert({
          assignment_id: selectedAssignment.id,
          student_id: user.id,
          content: submitContent,
          submitted_at: new Date().toISOString()
        }, { onConflict: 'assignment_id,student_id' });

      if (error) throw error;
      setShowSubmitModal(false);
      setSubmitContent('');
      loadData();
    } catch (err) { alert(err.message || 'Submission failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;
  if (!course) return null;

  const style = getSubjectStyle(course.subject);

  return (
    <div className="animate-fade-in">
      <div className={`bg-gradient-to-r ${style.gradient} rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"><div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20" /></div>
        <div className="relative">
          <button onClick={() => navigate('/student')} className="text-white/80 hover:text-white text-sm mb-3 flex items-center gap-1">← Back to Dashboard</button>
          <SubjectBadge subject={course.subject} />
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">{course.title}</h1>
          <p className="text-white/80 mt-1 text-sm">by {course.teacher_name} • {course.student_count} students</p>
        </div>
      </div>

      {!enrolled ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
          <div className="text-5xl mb-4">{style.emoji}</div>
          <h3 className="text-lg font-semibold text-surface-700 mb-2">You're not enrolled yet</h3>
          <p className="text-surface-500 mb-2 max-w-md mx-auto">{course.description}</p>
          <button onClick={handleEnroll} className="mt-4 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Enroll in This Course</button>
        </div>
      ) : (
        <>
          <div className="flex gap-1 bg-surface-100 p-1 rounded-2xl mb-6">
            {[
              { key: 'assignments', label: 'Assignments', count: assignments.length },
              { key: 'announcements', label: 'Announcements', count: announcements.length },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
                {t.label} <span className="ml-1 text-xs opacity-60">({t.count})</span>
              </button>
            ))}
          </div>

          {tab === 'assignments' && (
            <div className="space-y-3 stagger-children">
              {assignments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-surface-200"><div className="text-4xl mb-3">📝</div><p className="text-surface-500">No assignments yet</p></div>
              ) : assignments.map(a => <AssignmentCard key={a.id} assignment={a} onSubmit={openSubmit} showSubmissionStatus />)}
            </div>
          )}

          {tab === 'announcements' && (
            <div className="space-y-3 stagger-children">
              {announcements.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-surface-200"><div className="text-4xl mb-3">📢</div><p className="text-surface-500">No announcements yet</p></div>
              ) : announcements.map(a => <AnnouncementCard key={a.id} announcement={a} />)}
            </div>
          )}
        </>
      )}

      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title={`Submit: ${selectedAssignment?.title || ''}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Your Work</label>
            <textarea value={submitContent} onChange={e => setSubmitContent(e.target.value)} required rows={6} placeholder="Type your submission here..." className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900 resize-none" />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Work'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
