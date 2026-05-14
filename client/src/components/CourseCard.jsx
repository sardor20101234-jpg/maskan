import { Link } from 'react-router-dom';
import SubjectBadge from './SubjectBadge';
import { getSubjectStyle, getInitials } from '../utils/constants';

export default function CourseCard({ course, linkBase, actions }) {
  const style = getSubjectStyle(course.subject);

  return (
    <div className="group bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-xl hover:shadow-surface-200/50 hover:-translate-y-1 transition-all duration-300">
      {/* Color header */}
      <div className={`h-32 bg-gradient-to-br ${style.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20" />
          <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-white/15" />
        </div>
        <div className="absolute bottom-3 left-4">
          <h3 className="text-white font-bold text-lg drop-shadow-md">{course.title}</h3>
        </div>
        <div className="absolute top-3 right-3 text-3xl opacity-60">{style.emoji}</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <SubjectBadge subject={course.subject} />
          {course.code && (
            <span className="text-xs font-mono text-surface-400 bg-surface-50 px-2 py-1 rounded-md">
              {course.code}
            </span>
          )}
        </div>
        
        <p className="text-sm text-surface-500 line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-surface-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-surface-300 to-surface-400 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(course.teacher_name)}
            </div>
            <span className="text-xs text-surface-600">{course.teacher_name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-surface-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            {course.student_count || 0}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {linkBase && (
            <Link
              to={`${linkBase}/${course.id}`}
              className="flex-1 text-center text-sm font-semibold py-2.5 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors"
            >
              {actions === 'manage' ? 'Manage' : 'View Course'}
            </Link>
          )}
          {actions === 'enroll' && course.onEnroll && (
            <button
              onClick={() => course.onEnroll(course.id)}
              className="flex-1 text-sm font-semibold py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
