import { BookOpen, GraduationCap, User } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { role } = useCourseStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSwitch = (newRole: 'teacher' | 'student') => {
    useCourseStore.getState().setRole(newRole);
    navigate(`/${newRole}/courses`);
  };

  const isTeacherPath = location.pathname.startsWith('/teacher');
  const isStudentPath = location.pathname.startsWith('/student');

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">学智云</h1>
              <p className="text-xs text-slate-500 -mt-0.5">在线教育平台</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
            <button
              onClick={() => handleRoleSwitch('student')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                role === 'student' || isStudentPath
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap size={16} />
              <span>学生端</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('teacher')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                role === 'teacher' || isTeacherPath
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User size={16} />
              <span>教师端</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
              <User size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
