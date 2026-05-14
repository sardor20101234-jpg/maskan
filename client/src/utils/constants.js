export const SUBJECTS = {
  Math: {
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-500 to-blue-700',
    icon: '📐',
    emoji: '🔢',
    description: 'Algebra, Calculus, Geometry & more',
  },
  Science: {
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    gradient: 'from-emerald-500 to-teal-700',
    icon: '🔬',
    emoji: '🧬',
    description: 'Biology, Chemistry, Physics & more',
  },
  History: {
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    gradient: 'from-amber-500 to-orange-600',
    icon: '🏛️',
    emoji: '📜',
    description: 'World History, Civilizations & more',
  },
  English: {
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    gradient: 'from-purple-500 to-violet-700',
    icon: '📝',
    emoji: '📖',
    description: 'Literature, Writing, Grammar & more',
  },
};

export const getSubjectStyle = (subject) => {
  return SUBJECTS[subject] || SUBJECTS.Math;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
