import { getSubjectStyle } from '../utils/constants';

export default function SubjectBadge({ subject, size = 'sm' }) {
  const style = getSubjectStyle(subject);
  
  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${style.lightColor} ${style.textColor} ${sizes[size]}`}>
      <span>{style.icon}</span>
      {subject}
    </span>
  );
}
