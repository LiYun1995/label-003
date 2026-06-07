import { useState } from 'react';
import { FileText, Send, Clock, Award, MessageSquare } from 'lucide-react';
import type { Assignment, Submission } from '@/types';

interface AssignmentPanelProps {
  assignment: Assignment;
  submission?: Submission;
  onSubmit?: (content: string) => void;
}

export default function AssignmentPanel({ assignment, submission, onSubmit }: AssignmentPanelProps) {
  const [content, setContent] = useState(submission?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit?.(content);
      setIsSubmitting(false);
    }, 500);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isSubmitted = submission && submission.status !== 'pending';
  const isGraded = submission?.status === 'graded';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-warning-500 to-warning-400 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{assignment.title}</h3>
            <p className="text-sm text-white/80">截止日期：{formatDate(assignment.dueDate)}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-medium text-slate-800 mb-2">作业描述</h4>
          <p className="text-slate-600 text-sm leading-relaxed">{assignment.description}</p>
        </div>

        <div>
          <h4 className="font-medium text-slate-800 mb-3">作业题目</h4>
          <ol className="space-y-3">
            {assignment.questions.map((q, index) => (
              <li key={index} className="flex gap-3 text-sm text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="pt-0.5">{q}</span>
              </li>
            ))}
          </ol>
        </div>

        {isGraded && submission?.score !== undefined && (
          <div className="bg-accent-50 border border-accent-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center">
                <Award size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-accent-600 font-medium">作业评分</p>
                <p className="text-2xl font-bold text-accent-700">
                  {submission.score}
                  <span className="text-sm font-normal text-accent-500 ml-1">分</span>
                </p>
              </div>
            </div>
            {submission.feedback && (
              <div className="mt-4 pt-4 border-t border-accent-100">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} className="text-accent-600" />
                  <span className="text-sm font-medium text-accent-700">老师评语</span>
                </div>
                <p className="text-sm text-accent-600 leading-relaxed">{submission.feedback}</p>
              </div>
            )}
          </div>
        )}

        {isSubmitted && !isGraded && (
          <div className="bg-warning-50 border border-warning-100 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-warning-500" />
              <div>
                <p className="font-medium text-warning-700">作业已提交</p>
                <p className="text-sm text-warning-600">等待老师批改中...</p>
              </div>
            </div>
            <p className="text-xs text-warning-500 mt-3">
              提交时间：{submission?.submittedAt && formatDate(submission.submittedAt)}
            </p>
          </div>
        )}

        <div>
          <h4 className="font-medium text-slate-800 mb-3">提交作业</h4>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请在此输入你的作业答案..."
            className="w-full h-48 px-4 py-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 text-sm text-slate-700 placeholder-slate-400 transition-all"
            disabled={isSubmitted}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-slate-400">{content.length} 字</span>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting || isSubmitted}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>提交中...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>提交作业</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
