import { ChevronDown, ChevronRight, PlayCircle, CheckCircle2, FileText, Plus } from 'lucide-react';
import { useCourseStore } from '@/store/useCourseStore';
import type { Chapter } from '@/types';

interface ChapterTreeProps {
  chapters: Chapter[];
  currentVideoId?: string;
  onVideoSelect?: (video: Chapter['videos'][0]) => void;
  onAssignmentClick?: (chapter: Chapter) => void;
  showAddButtons?: boolean;
  onAddVideo?: (chapterId: string) => void;
  onAddChapter?: () => void;
}

export default function ChapterTree({
  chapters,
  currentVideoId,
  onVideoSelect,
  onAssignmentClick,
  showAddButtons = false,
  onAddVideo,
  onAddChapter,
}: ChapterTreeProps) {
  const { expandedChapters, toggleChapter } = useCourseStore();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedChapters = [...chapters].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="space-y-1">
      {sortedChapters.map((chapter) => {
        const isExpanded = expandedChapters[chapter.id] ?? chapter.isExpanded ?? false;
        const completedCount = chapter.videos.filter((v) => v.isCompleted).length;
        const totalCount = chapter.videos.length;

        return (
          <div key={chapter.id} className="rounded-lg overflow-hidden">
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {isExpanded ? (
                  <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
                )}
                <span className="font-medium text-slate-700 text-sm truncate">
                  {chapter.title}
                </span>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                {completedCount}/{totalCount}
              </span>
            </button>

            {isExpanded && (
              <div className="bg-white border-l-2 border-slate-100 ml-2 animate-slide-down">
                <ul className="py-1">
                  {chapter.videos
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((video) => {
                      const isActive = video.id === currentVideoId;
                      const isCompleted = video.isCompleted;

                      return (
                        <li key={video.id}>
                          <button
                            onClick={() => onVideoSelect?.(video)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActive
                                ? 'bg-primary-50 text-primary-600 border-l-2 border-primary-500'
                                : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={16} className="text-accent-500 flex-shrink-0" />
                            ) : (
                              <PlayCircle
                                size={16}
                                className={`flex-shrink-0 ${
                                  isActive ? 'text-primary-500' : 'text-slate-300'
                                }`}
                              />
                            )}
                            <span className="text-sm flex-1 truncate">{video.title}</span>
                            <span className="text-xs text-slate-400 flex-shrink-0">
                              {formatDuration(video.duration)}
                            </span>
                          </button>
                        </li>
                      );
                    })}

                  {chapter.assignment && (
                    <li>
                      <button
                        onClick={() => onAssignmentClick?.(chapter)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 text-slate-600 transition-colors"
                      >
                        <FileText size={16} className="text-warning-500 flex-shrink-0" />
                        <span className="text-sm flex-1 truncate">
                          {chapter.assignment.title}
                        </span>
                        <span className="text-xs text-warning-500 flex-shrink-0 font-medium">
                          作业
                        </span>
                      </button>
                    </li>
                  )}

                  {showAddButtons && (
                    <li>
                      <button
                        onClick={() => onAddVideo?.(chapter.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-slate-400 hover:text-primary-500 hover:bg-slate-50 transition-colors"
                      >
                        <Plus size={14} />
                        <span>添加视频</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      {showAddButtons && (
        <button
          onClick={onAddChapter}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50 transition-colors text-sm"
        >
          <Plus size={18} />
          <span>添加章节</span>
        </button>
      )}
    </div>
  );
}
