import { useNavigate } from 'react-router-dom';
import { Search, Filter, TrendingUp, Clock, BookOpen } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import CourseCard from '@/components/CourseCard';

export default function StudentCourseList() {
  const { courses, enrollments, getEnrollment } = useCourseStore();
  const navigate = useNavigate();

  const enrolledCourses = courses.filter((course) =>
    enrollments.some((e) => e.courseId === course.id)
  );

  const inProgressCourses = enrolledCourses.filter(
    (c) => {
      const e = getEnrollment(c.id);
      return e && e.progress > 0 && e.progress < 100;
    }
  );

  const completedCourses = enrolledCourses.filter(
    (c) => {
      const e = getEnrollment(c.id);
      return e && e.progress === 100;
    }
  );

  const totalProgress = enrolledCourses.length > 0
    ? Math.round(
        enrollments.reduce((acc, e) => acc + e.progress, 0) / enrolledCourses.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <span className="text-3xl font-bold">{enrolledCourses.length}</span>
            </div>
            <p className="text-white/80 text-sm">已报名课程</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
                <TrendingUp size={24} className="text-accent-500" />
              </div>
              <span className="text-3xl font-bold text-slate-800">{totalProgress}%</span>
            </div>
            <p className="text-slate-500 text-sm">平均学习进度</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning-50 flex items-center justify-center">
                <Clock size={24} className="text-warning-500" />
              </div>
              <span className="text-3xl font-bold text-slate-800">{inProgressCourses.length}</span>
            </div>
            <p className="text-slate-500 text-sm">正在学习中</p>
          </div>
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

        {inProgressCourses.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">继续学习</h2>
              <span className="text-sm text-slate-500">{inProgressCourses.length} 门课程</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((course) => {
                const enrollment = getEnrollment(course.id);
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={enrollment?.progress || 0}
                    role="student"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {completedCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">已完成</h2>
              <span className="text-sm text-slate-500">{completedCourses.length} 门课程</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map((course) => {
                const enrollment = getEnrollment(course.id);
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={enrollment?.progress || 0}
                    role="student"
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {enrolledCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <BookOpen size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">还没有报名课程</h3>
            <p className="text-slate-400 mb-6">浏览课程目录，开启你的学习之旅</p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              去发现课程
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
