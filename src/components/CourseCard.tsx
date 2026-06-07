import { BookOpen, Clock, User } from 'lucide-react';
import type { Course } from '@/types';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course;
  progress?: number;
  onClick?: () => void;
  role?: 'teacher' | 'student';
}

export default function CourseCard({ course, progress = 0, onClick, role = 'student' }: CourseCardProps) {
  const totalVideos = course.chapters.reduce((acc, ch) => acc + ch.videos.length, 0);
  const totalDuration = course.chapters.reduce(
    (acc, ch) => acc + ch.videos.reduce((a, v) => a + v.duration, 0),
    0
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-slate-100 hover:border-primary-200 hover:-translate-y-1"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
            {course.category}
          </span>
        </div>
        {role === 'student' && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <ProgressBar progress={progress} size="sm" color="accent" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{course.teacherName}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{totalVideos} 节视频</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDuration(totalDuration)}</span>
          </div>
        </div>

        {role === 'student' && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500">学习进度</span>
              <span className="text-sm font-semibold text-accent-600">{progress}%</span>
            </div>
            <ProgressBar progress={progress} size="sm" color="accent" />
          </div>
        )}

        {role === 'teacher' && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">章节数</span>
              <span className="text-sm font-semibold text-primary-600">
                {course.chapters.length} 章
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
