import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabase';
import { SUBJECTS } from '../../utils/constants';

export default function CreateCourse() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Math');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const style = SUBJECTS[subject];
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { error: insertError } = await supabase
        .from('courses')
        .insert([{
          title,
          subject,
          description,
          teacher_id: user.id,
          cover_color: style?.color || '#6366f1',
          code
        }]);

      if (insertError) throw insertError;
      navigate('/teacher');
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Create New Course</h1>
      <p className="text-surface-500 mb-8">Set up a new course for your students</p>

      <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Course Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Algebra 101" required className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-3">Subject</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(SUBJECTS).map(([name, s]) => (
                <button key={name} type="button" onClick={() => setSubject(name)} className={`p-3 rounded-xl border-2 text-center transition-all ${subject === name ? `${s.borderColor} ${s.lightColor}` : 'border-surface-200 hover:border-surface-300'}`}>
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className={`text-xs font-semibold ${subject === name ? s.textColor : 'text-surface-500'}`}>{name}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will students learn in this course?" rows={4} className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-surface-900 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/teacher')} className="flex-1 py-3 border border-surface-200 text-surface-600 font-semibold rounded-xl hover:bg-surface-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
