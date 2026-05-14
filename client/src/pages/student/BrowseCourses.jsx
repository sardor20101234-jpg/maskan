import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import CourseCard from '../../components/CourseCard';
import { SUBJECTS } from '../../utils/constants';

export default function BrowseCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    try {
      // Fetch all courses with teacher name and my enrollment status
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles(name),
          enrollments!left(id)
        `)
        .eq('enrollments.student_id', user?.id);

      if (error) throw error;
      
      setCourses(data.map(c => ({
        ...c,
        teacher_name: c.teacher?.name,
        isEnrolled: c.enrollments?.length > 0
      })));
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) return alert('Please log in to enroll');
    setEnrolling(courseId);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([{ student_id: user.id, course_id: courseId }]);

      if (error) throw error;
      loadCourses();
    } catch (err) {
      alert(err.message || 'Enrollment failed');
    } finally {
      setEnrolling(null);
    }
  };

  const filtered = filter === 'All' ? courses : courses.filter(c => c.subject === filter);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Browse Courses 🔍</h1>
        <p className="text-surface-500 mt-1">Discover and enroll in courses across all subjects</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === 'All' ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-surface-600 border border-surface-200 hover:border-primary-300'}`}>All Subjects</button>
        {Object.entries(SUBJECTS).map(([name, s]) => (
          <button key={name} onClick={() => setFilter(name)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${filter === name ? `${s.color} text-white shadow-md` : `bg-white ${s.textColor} border ${s.borderColor} hover:shadow-sm`}`}>
            {s.icon} {name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-surface-500">No courses found for this subject</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={{ ...course, onEnroll: handleEnroll, isEnrolled: course.isEnrolled }}
              linkBase="/student/course"
              actions={course.isEnrolled ? null : "enroll"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
