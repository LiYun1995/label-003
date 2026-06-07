import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Video as VideoIcon, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import type { Chapter, Video, Assignment } from '@/types';

export default function CourseCreate() {
  const navigate = useNavigate();
  const { addCourse } = useCourseStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=online%20education%20course%20cover&image_size=landscape_16_9');
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 'chap-new-1',
      title: '第一章',
      orderIndex: 1,
      videos: [],
      isExpanded: true,
    },
  ]);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'chap-new-1': true,
  });

  const categories = ['前端开发', '后端开发', '移动开发', '数据科学', '设计', '运维', '产品运营'];

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: `chap-new-${Date.now()}`,
      title: `第${chapters.length + 1}章`,
      orderIndex: chapters.length + 1,
      videos: [],
      isExpanded: true,
    };
    setChapters([...chapters, newChapter]);
    setExpandedChapters((prev) => ({ ...prev, [newChapter.id]: true }));
  };

  const updateChapterTitle = (chapterId: string, title: string) => {
    setChapters(
      chapters.map((ch) => (ch.id === chapterId ? { ...ch, title } : ch))
    );
  };

  const deleteChapter = (chapterId: string) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((ch) => ch.id !== chapterId));
  };

  const addVideo = (chapterId: string) => {
    const chapter = chapters.find((ch) => ch.id === chapterId);
    if (!chapter) return;

    const newVideo: Video = {
      id: `vid-new-${Date.now()}`,
      title: `视频 ${chapter.videos.length + 1}`,
      videoUrl: '',
      duration: 0,
      orderIndex: chapter.videos.length + 1,
    };

    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, videos: [...ch.videos, newVideo] } : ch
      )
    );
  };

  const updateVideo = (chapterId: string, videoId: string, updates: Partial<Video>) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              videos: ch.videos.map((v) =>
                v.id === videoId ? { ...v, ...updates } : v
              ),
            }
          : ch
      )
    );
  };

  const deleteVideo = (chapterId: string, videoId: string) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? { ...ch, videos: ch.videos.filter((v) => v.id !== videoId) }
          : ch
      )
    );
  };

  const addAssignment = (chapterId: string) => {
    const newAssignment: Assignment = {
      id: `assign-new-${Date.now()}`,
      title: '章节作业',
      description: '',
      questions: [''],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, assignment: newAssignment } : ch
      )
    );
  };

  const updateAssignment = (chapterId: string, updates: Partial<Assignment>) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId && ch.assignment
          ? { ...ch, assignment: { ...ch.assignment, ...updates } }
          : ch
      )
    );
  };

  const addQuestion = (chapterId: string) => {
    const chapter = chapters.find((ch) => ch.id === chapterId);
    if (!chapter?.assignment) return;

    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId && ch.assignment
          ? {
              ...ch,
              assignment: {
                ...ch.assignment,
                questions: [...ch.assignment.questions, ''],
              },
            }
          : ch
      )
    );
  };

  const updateQuestion = (chapterId: string, index: number, value: string) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId && ch.assignment
          ? {
              ...ch,
              assignment: {
                ...ch.assignment,
                questions: ch.assignment.questions.map((q, i) =>
                  i === index ? value : q
                ),
              },
            }
          : ch
      )
    );
  };

  const deleteQuestion = (chapterId: string, index: number) => {
    const chapter = chapters.find((ch) => ch.id === chapterId);
    if (!chapter?.assignment || chapter.assignment.questions.length <= 1) return;

    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId && ch.assignment
          ? {
              ...ch,
              assignment: {
                ...ch.assignment,
                questions: ch.assignment.questions.filter((_, i) => i !== index),
              },
            }
          : ch
      )
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('请输入课程标题');
      return;
    }

    const newCourse = {
      id: `course-${Date.now()}`,
      title,
      description,
      coverImage,
      teacherId: 'teacher-1',
      teacherName: '李明',
      category: category || '其他',
      chapters,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addCourse(newCourse);
    navigate('/teacher/courses');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate('/teacher/courses')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>返回课程列表</span>
            </button>
            <h1 className="text-lg font-semibold text-slate-800">创建新课程</h1>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <Save size={16} />
              <span>保存课程</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">基本信息</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  课程标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入课程标题"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  课程分类
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all bg-white"
                >
                  <option value="">选择分类</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  课程描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请输入课程描述"
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  封面图片链接
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="请输入封面图片链接"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                />
                {coverImage && (
                  <div className="mt-3 aspect-video max-w-md rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={coverImage}
                      alt="封面预览"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">章节管理</h2>
              <button
                onClick={addChapter}
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
              >
                <Plus size={16} />
                <span>添加章节</span>
              </button>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter, idx) => (
                <div
                  key={chapter.id}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {expandedChapters[chapter.id] ? (
                        <ChevronDown size={18} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={18} className="text-slate-400" />
                      )}
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
                        className="flex-1 bg-transparent font-medium text-slate-700 focus:outline-none focus:bg-white px-2 py-1 rounded border border-transparent focus:border-slate-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </button>
                    <button
                      onClick={() => deleteChapter(chapter.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      disabled={chapters.length <= 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {expandedChapters[chapter.id] && (
                    <div className="p-4 space-y-4 animate-slide-down">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <VideoIcon size={16} className="text-primary-500" />
                            <span>视频列表</span>
                          </div>
                          <button
                            onClick={() => addVideo(chapter.id)}
                            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                          >
                            <Plus size={14} />
                            添加视频
                          </button>
                        </div>

                        {chapter.videos.length === 0 ? (
                          <p className="text-sm text-slate-400 py-4 text-center">
                            暂无视频，点击上方按钮添加
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {chapter.videos.map((video, vIdx) => (
                              <div
                                key={video.id}
                                className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                              >
                                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {vIdx + 1}
                                </span>
                                <div className="flex-1 space-y-2">
                                  <input
                                    type="text"
                                    value={video.title}
                                    onChange={(e) =>
                                      updateVideo(chapter.id, video.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    placeholder="视频标题"
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white"
                                  />
                                  <input
                                    type="text"
                                    value={video.videoUrl}
                                    onChange={(e) =>
                                      updateVideo(chapter.id, video.id, {
                                        videoUrl: e.target.value,
                                      })
                                    }
                                    placeholder="视频链接 (URL)"
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white"
                                  />
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">时长(秒):</span>
                                    <input
                                      type="number"
                                      value={video.duration}
                                      onChange={(e) =>
                                        updateVideo(chapter.id, video.id, {
                                          duration: parseInt(e.target.value) || 0,
                                        })
                                      }
                                      className="w-24 px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white"
                                    />
                                  </div>
                                </div>
                                <button
                                  onClick={() => deleteVideo(chapter.id, video.id)}
                                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <FileText size={16} className="text-warning-500" />
                            <span>章节作业</span>
                          </div>
                          {!chapter.assignment && (
                            <button
                              onClick={() => addAssignment(chapter.id)}
                              className="flex items-center gap-1 text-sm text-warning-600 hover:text-warning-700"
                            >
                              <Plus size={14} />
                              添加作业
                            </button>
                          )}
                        </div>

                        {chapter.assignment && (
                          <div className="p-4 bg-warning-50 rounded-lg space-y-3">
                            <input
                              type="text"
                              value={chapter.assignment.title}
                              onChange={(e) =>
                                updateAssignment(chapter.id, { title: e.target.value })
                              }
                              placeholder="作业标题"
                              className="w-full px-3 py-2 text-sm border border-warning-200 rounded-md focus:outline-none focus:ring-1 focus:ring-warning-400 bg-white"
                            />
                            <textarea
                              value={chapter.assignment.description}
                              onChange={(e) =>
                                updateAssignment(chapter.id, { description: e.target.value })
                              }
                              placeholder="作业描述"
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-warning-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-warning-400 bg-white"
                            />
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-warning-700">题目列表</span>
                                <button
                                  onClick={() => addQuestion(chapter.id)}
                                  className="text-xs text-warning-600 hover:text-warning-700 flex items-center gap-1"
                                >
                                  <Plus size={12} />
                                  添加题目
                                </button>
                              </div>
                              <div className="space-y-2">
                                {chapter.assignment.questions.map((q, qIdx) => (
                                  <div key={qIdx} className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-warning-200 text-warning-700 text-xs font-medium flex items-center justify-center flex-shrink-0 mt-1">
                                      {qIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={q}
                                      onChange={(e) =>
                                        updateQuestion(chapter.id, qIdx, e.target.value)
                                      }
                                      placeholder="请输入题目内容"
                                      className="flex-1 px-3 py-2 text-sm border border-warning-200 rounded-md focus:outline-none focus:ring-1 focus:ring-warning-400 bg-white"
                                    />
                                    <button
                                      onClick={() => deleteQuestion(chapter.id, qIdx)}
                                      className="text-warning-400 hover:text-red-500 p-1"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-warning-600">截止日期:</span>
                              <input
                                type="date"
                                value={chapter.assignment.dueDate}
                                onChange={(e) =>
                                  updateAssignment(chapter.id, { dueDate: e.target.value })
                                }
                                className="px-3 py-1.5 text-sm border border-warning-200 rounded-md focus:outline-none focus:ring-1 focus:ring-warning-400 bg-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
