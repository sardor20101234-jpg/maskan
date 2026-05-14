import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import StatsCard from '../../components/StatsCard';
import CourseCard from '../../components/CourseCard';

export default function TeacherDashboard() {
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
      // 1. Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*, enrollments(count)')
        .eq('teacher_id', user.id);

      if (coursesError) throw coursesError;
      setCourses(coursesData.map(c => ({ ...c, student_count: c.enrollments[0]?.count || 0 })));

      // 2. Fetch Stats
      const courseIds = coursesData.map(c => c.id);
      
      const [studentsCount, assignmentsCount, pendingCount] = await Promise.all([
        // Total unique students across all my courses
        supabase
          .from('enrollments')
          .select('student_id', { count: 'exact', head: true })
          .in('course_id', courseIds),
        
        // Total assignments across all my courses
        supabase
          .from('assignments')
          .select('*', { count: 'exact', head: true })
          .in('course_id', courseIds),
        
        // Submissions that need grading
        supabase
          .from('submissions')
          .select('*, assignments!inner(course_id)', { count: 'exact', head: true })
          .is('grade', null)
          .in('assignments.course_id', courseIds)
      ]);

      setStats({
        totalCourses: coursesData.length,
        totalStudents: studentsCount.count || 0,
        totalAssignments: assignmentsCount.count || 0,
        pendingGrading: pendingCount.count || 0
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
        <h1 className="text-2xl font-bold text-surface-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-surface-500 mt-1">Here's what's happening in your classes today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatsCard icon="📚" label="My Courses" value={stats?.totalCourses} color="primary" />
        <StatsCard icon="👥" label="Total Students" value={stats?.totalStudents} color="emerald" />
        <StatsCard icon="📝" label="Assignments" value={stats?.totalAssignments} color="amber" />
        <StatsCard icon="⏳" label="Needs Grading" value={stats?.pendingGrading} color="rose" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-surface-900">My Courses</h2>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
          <div className="text-5xl mb-4">📖</div>
          <h3 className="text-lg font-semibold text-surface-700 mb-2">No courses yet</h3>
          <p className="text-surface-500 mb-6">Create your first course to get started!</p>
          <a href="/teacher/create-course" className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
            Create Course
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} linkBase="/teacher/course" actions="manage" />
          ))}
        </div>
      )}
    </div>
  );
}
