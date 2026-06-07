import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, FileText, BookOpen, Settings } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import ChapterTree from '@/components/ChapterTree';
import VideoPlayer from '@/components/VideoPlayer';
import type { Video, Chapter } from '@/types';

type TabType = 'content' | 'students' | 'assignments';

export default function TeacherCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, currentCourse, setCurrentCourse, currentVideo, setCurrentVideo, getSubmissionsForAssignment } = useCourseStore();
  const [activeTab, setActiveTab] = useState<TabType>('content');

  useEffect(() => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setCurrentCourse(course);
    }
  }, [id, courses, setCurrentCourse]);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
  };

  const handleAssignmentClick = (chapter: Chapter) => {
    setActiveTab('assignments');
  };

  const totalVideos = currentCourse?.chapters.reduce((acc, ch) => acc + ch.videos.length, 0) || 0;
  const totalSubmissions = currentCourse?.chapters.reduce(
    (acc, ch) => acc + (ch.assignment ? getSubmissionsForAssignment(ch.assignment.id).length : 0),
    0
  ) || 0;

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
              onClick={() => navigate('/teacher/courses')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mr-4"
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-slate-800 truncate">
                {currentCourse.title}
              </h1>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-slate-700 transition-colors">
              <Settings size={18} />
              <span className="hidden sm:inline">设置</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden sticky top-20">
              <div className="px-4 py-3 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">课程目录</h2>
                <p className="text-xs text-slate-500 mt-0.5">{totalVideos} 节视频</p>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin p-3">
                <ChapterTree
                  chapters={currentCourse.chapters}
                  currentVideoId={currentVideo?.id}
                  onVideoSelect={handleVideoSelect}
                  onAssignmentClick={handleAssignmentClick}
                  showAddButtons={true}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex gap-2 mb-6 border-b border-slate-200">
              {[
                { key: 'content', label: '课程内容', icon: BookOpen },
                { key: 'students', label: '学生管理', icon: Users },
                { key: 'assignments', label: '作业管理', icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    activeTab === tab.key
                      ? 'text-primary-600 border-primary-500'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                  {tab.key === 'assignments' && totalSubmissions > 0 && (
                    <span className="px-1.5 py-0.5 bg-warning-100 text-warning-600 text-xs rounded-full">
                      {totalSubmissions}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'content' && (
              <div className="space-y-6">
                <VideoPlayer
                  video={currentVideo}
                  chapterTitle={
                    currentCourse.chapters.find((ch) =>
                      ch.videos.some((v) => v.id === currentVideo?.id)
                    )?.title
                  }
                />

                {currentVideo && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-semibold text-slate-800 mb-2">
                      {currentVideo.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      视频时长：{Math.floor(currentVideo.duration / 60)}分
                      {currentVideo.duration % 60}秒
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800">报名学生</h3>
                  <span className="text-sm text-slate-500">共 3 名学生</span>
                </div>
                <div className="space-y-3">
                  {['小明', '小红', '小刚'].map((name, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-white font-medium">
                          {name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">{name}</p>
                          <p className="text-xs text-slate-500">报名于 2024-01-20</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-accent-600">{(idx + 1) * 30}%</p>
                        <p className="text-xs text-slate-400">学习进度</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                {currentCourse.chapters
                  .filter((ch) => ch.assignment)
                  .map((chapter) => {
                    const submissions = chapter.assignment
                      ? getSubmissionsForAssignment(chapter.assignment.id)
                      : [];
                    return (
                      <div
                        key={chapter.id}
                        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-slate-800">
                                {chapter.assignment?.title}
                              </h3>
                              <p className="text-sm text-slate-500 mt-0.5">
                                所属章节：{chapter.title}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-700">
                                {submissions.length} 份提交
                              </p>
                              <p className="text-xs text-slate-400">
                                截止：{chapter.assignment?.dueDate}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {submissions.length === 0 ? (
                            <p className="px-6 py-8 text-center text-sm text-slate-400">
                              暂无学生提交
                            </p>
                          ) : (
                            submissions.map((sub) => (
                              <div
                                key={sub.id}
                                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-sm font-medium">
                                    {sub.studentName[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-700">
                                      {sub.studentName}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      提交于 {sub.submittedAt}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {sub.status === 'graded' ? (
                                    <span className="text-accent-600 font-semibold">
                                      {sub.score} 分
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-600">
                                      待批改
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
