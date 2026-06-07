import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, FileText, Info } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import ChapterTree from '@/components/ChapterTree';
import VideoPlayer from '@/components/VideoPlayer';
import AssignmentPanel from '@/components/AssignmentPanel';
import ProgressBar from '@/components/ProgressBar';
import type { Video, Chapter, Submission } from '@/types';

type ViewType = 'video' | 'assignment' | 'info';

export default function StudentCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    courses,
    currentCourse,
    setCurrentCourse,
    currentVideo,
    setCurrentVideo,
    getEnrollment,
    submissions,
    submitAssignment,
    markVideoCompleted,
  } = useCourseStore();

  const [activeView, setActiveView] = useState<ViewType>('video');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setCurrentCourse(course);
      const firstChapter = course.chapters[0];
      if (firstChapter) {
        setSelectedChapter(firstChapter);
      }
    }
  }, [id, courses, setCurrentCourse]);

  const enrollment = id ? getEnrollment(id) : undefined;

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    setActiveView('video');
  };

  const handleAssignmentClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setActiveView('assignment');
  };

  const handleVideoComplete = () => {
    if (currentVideo) {
      markVideoCompleted(currentVideo.id);
    }
  };

  const handleSubmitAssignment = (content: string) => {
    if (!selectedChapter?.assignment) return;

    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId: selectedChapter.assignment.id,
      studentId: 'student-1',
      studentName: '小明',
      content,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'submitted',
    };

    submitAssignment(newSubmission);
  };

  const currentSubmission = selectedChapter?.assignment
    ? submissions.find(
        (s) =>
          s.assignmentId === selectedChapter.assignment?.id &&
          s.studentId === 'student-1'
      )
    : undefined;

  const totalVideos =
    currentCourse?.chapters.reduce((acc, ch) => acc + ch.videos.length, 0) || 0;

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">课程不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14">
            <button
              onClick={() => navigate('/student/courses')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mr-4"
            >
              <ArrowLeft size={20} />
              <span>返回课程列表</span>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-slate-800 truncate">
                {currentCourse.title}
              </h1>
            </div>
            {enrollment && (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-slate-500">学习进度</span>
                <div className="w-32">
                  <ProgressBar progress={enrollment.progress} size="sm" />
                </div>
                <span className="text-sm font-medium text-accent-600">
                  {enrollment.progress}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-20">
              <div className="px-4 py-3 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">课程目录</h2>
                <p className="text-xs text-slate-500 mt-0.5">{totalVideos} 节视频</p>
              </div>
              <div className="max-h-[calc(100vh-240px)] overflow-y-auto scrollbar-thin p-3">
                <ChapterTree
                  chapters={currentCourse.chapters}
                  currentVideoId={currentVideo?.id}
                  onVideoSelect={handleVideoSelect}
                  onAssignmentClick={handleAssignmentClick}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto scrollbar-thin">
              {[
                { key: 'video', label: '视频学习', icon: Play },
                { key: 'assignment', label: '作业', icon: FileText },
                { key: 'info', label: '课程详情', icon: Info },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveView(tab.key as ViewType)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                    activeView === tab.key
                      ? 'text-primary-600 border-primary-500'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {activeView === 'video' && (
              <VideoPlayer
                video={currentVideo}
                chapterTitle={
                  currentCourse.chapters.find((ch) =>
                    ch.videos.some((v) => v.id === currentVideo?.id)
                  )?.title
                }
                onComplete={handleVideoComplete}
              />
            )}

            {activeView === 'assignment' && selectedChapter?.assignment && (
              <AssignmentPanel
                assignment={selectedChapter.assignment}
                submission={currentSubmission}
                onSubmit={handleSubmitAssignment}
              />
            )}

            {activeView === 'assignment' && !selectedChapter?.assignment && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">请从左侧目录选择包含作业的章节</p>
              </div>
            )}

            {activeView === 'info' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 animate-fade-in">
                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <img
                    src={currentCourse.coverImage}
                    alt={currentCourse.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {currentCourse.title}
                </h2>

                <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
                  <span>讲师：{currentCourse.teacherName}</span>
                  <span>分类：{currentCourse.category}</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-3">课程简介</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {currentCourse.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {currentCourse.chapters.length}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">章节数</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent-600">{totalVideos}</p>
                    <p className="text-sm text-slate-500 mt-1">视频数</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning-600">
                      {currentCourse.chapters.filter((ch) => ch.assignment).length}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">作业数</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
