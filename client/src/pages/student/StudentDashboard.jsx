import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import StatsCard from '../../components/StatsCard';
import CourseCard from '../../components/CourseCard';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // 1. Fetch enrolled courses
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          course:courses (
            *,
            teacher:profiles (name)
          )
        `)
        .eq('student_id', user.id);

      if (enrollError) throw enrollError;
      
      const enrolledCourses = enrollments.map(e => ({
        ...e.course,
        teacher_name: e.course.teacher.name
      }));
      setCourses(enrolledCourses);

      // 2. Fetch Stats
      const courseIds = enrolledCourses.map(c => c.id);

      const [assignmentsCount, submissionsData] = await Promise.all([
        // Total assignments in enrolled courses
        supabase
          .from('assignments')
          .select('*', { count: 'exact', head: true })
          .in('course_id', courseIds),
        
        // All my submissions
        supabase
          .from('submissions')
          .select('grade')
          .eq('student_id', user.id)
      ]);

      const gradedSubmissions = submissionsData.data.filter(s => s.grade !== null);
      const avgGrade = gradedSubmissions.length > 0
        ? Math.round(gradedSubmissions.reduce((acc, s) => acc + s.grade, 0) / gradedSubmissions.length)
        : null;

      setStats({
        enrolledCourses: enrolledCourses.length,
        totalAssignments: assignmentsCount.count || 0,
        submittedCount: submissionsData.data.length,
        averageGrade: avgGrade
      });

    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Hey, {user?.name?.split(' ')[0]}! 🎓</h1>
        <p className="text-surface-500 mt-1">Here's your learning overview for today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatsCard icon="📚" label="Enrolled Courses" value={stats?.enrolledCourses} color="primary" />
        <StatsCard icon="📝" label="Total Assignments" value={stats?.totalAssignments} color="amber" />
        <StatsCard icon="✅" label="Submitted" value={stats?.submittedCount} color="emerald" />
        <StatsCard icon="⭐" label="Avg. Grade" value={stats?.averageGrade ? `${stats.averageGrade}%` : '—'} color="purple" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-surface-900">My Courses</h2>
        <a href="/student/browse" className="text-sm font-semibold text-primary-600 hover:text-primary-700">Browse More →</a>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-surface-700 mb-2">No courses yet</h3>
          <p className="text-surface-500 mb-6">Browse available courses and enroll to get started!</p>
          <a href="/student/browse" className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Browse Courses</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} linkBase="/student/course" />
          ))}
        </div>
      )}
    </div>
  );
}
