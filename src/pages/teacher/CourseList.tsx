import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import CourseCard from '@/components/CourseCard';

export default function TeacherCourseList() {
  const { courses } = useCourseStore();
  const navigate = useNavigate();

  const teacherCourses = courses;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">我的课程</h1>
            <p className="text-slate-500 mt-1">管理你创建的所有课程</p>
          </div>
          <button
            onClick={() => navigate('/teacher/courses/create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
          >
            <Plus size={20} />
            <span>创建课程</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索课程..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            <span>筛选</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              role="teacher"
              onClick={() => navigate(`/teacher/courses/${course.id}`)}
            />
          ))}
        </div>

        {teacherCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Plus size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">还没有课程</h3>
            <p className="text-slate-400 mb-6">点击上方按钮创建你的第一门课程</p>
            <button
              onClick={() => navigate('/teacher/courses/create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <Plus size={18} />
              <span>立即创建</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
