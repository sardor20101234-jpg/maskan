import { formatDateTime, getInitials } from '../utils/constants';

export default function AnnouncementCard({ announcement }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-md">
          {getInitials(announcement.author_name)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-surface-900">{announcement.title}</h4>
          </div>
          <p className="text-xs text-surface-400 mb-2">
            {announcement.author_name} • {formatDateTime(announcement.created_at)}
          </p>
          <p className="text-sm text-surface-600 leading-relaxed">{announcement.content}</p>
        </div>
      </div>
    </div>
  );
}
