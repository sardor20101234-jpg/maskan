import { formatDate, isOverdue } from '../utils/constants';

export default function AssignmentCard({ assignment, onSubmit, onViewSubmissions, showSubmissionStatus }) {
  const overdue = isOverdue(assignment.due_date);
  const submitted = assignment.mySubmission;
  const graded = submitted?.grade !== null && submitted?.grade !== undefined;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📝</span>
            <h4 className="font-semibold text-surface-900">{assignment.title}</h4>
          </div>
          {assignment.description && (
            <p className="text-sm text-surface-500 mb-3 line-clamp-2">{assignment.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              overdue && !submitted
                ? 'bg-red-50 text-red-600'
                : 'bg-surface-100 text-surface-600'
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(assignment.due_date)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 text-primary-700">
              ⭐ {assignment.points} pts
            </span>
            {showSubmissionStatus && submitted && (
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                graded 
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {graded ? `✅ ${submitted.grade}/${assignment.points}` : '⏳ Submitted'}
              </span>
            )}
            {assignment.submission_count !== undefined && (
              <span className="text-xs text-surface-400">
                {assignment.submission_count} submissions
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {onSubmit && !submitted && (
            <button
              onClick={() => onSubmit(assignment)}
              className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all whitespace-nowrap"
            >
              Submit
            </button>
          )}
          {onSubmit && submitted && !graded && (
            <button
              onClick={() => onSubmit(assignment)}
              className="text-sm font-medium px-4 py-2 bg-surface-100 text-surface-600 rounded-xl hover:bg-surface-200 transition-colors whitespace-nowrap"
            >
              Resubmit
            </button>
          )}
          {onViewSubmissions && (
            <button
              onClick={() => onViewSubmissions(assignment)}
              className="text-sm font-semibold px-4 py-2 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors whitespace-nowrap"
            >
              View Work
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
