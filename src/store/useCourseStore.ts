import { create } from 'zustand';
import type { Course, Chapter, Video, Assignment, Submission, Enrollment, UserRole } from '@/types';
import { mockCourses, mockSubmissions, mockEnrollments } from '@/data/mockCourses';

interface CourseState {
  role: UserRole;
  courses: Course[];
  submissions: Submission[];
  enrollments: Enrollment[];
  currentCourse: Course | null;
  currentVideo: Video | null;
  expandedChapters: Record<string, boolean>;

  setRole: (role: UserRole) => void;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentVideo: (video: Video | null) => void;
  toggleChapter: (chapterId: string) => void;
  addCourse: (course: Course) => void;
  addChapter: (courseId: string, chapter: Chapter) => void;
  addVideo: (courseId: string, chapterId: string, video: Video) => void;
  addAssignment: (courseId: string, chapterId: string, assignment: Assignment) => void;
  submitAssignment: (submission: Submission) => void;
  markVideoCompleted: (videoId: string) => void;
  getEnrollment: (courseId: string) => Enrollment | undefined;
  getSubmissionsForAssignment: (assignmentId: string) => Submission[];
}

export const useCourseStore = create<CourseState>((set, get) => ({
  role: 'student',
  courses: mockCourses,
  submissions: mockSubmissions,
  enrollments: mockEnrollments,
  currentCourse: null,
  currentVideo: null,
  expandedChapters: {},

  setRole: (role) => set({ role }),

  setCurrentCourse: (course) => {
    set({ currentCourse: course, currentVideo: null });
    if (course) {
      const expanded: Record<string, boolean> = {};
      course.chapters.forEach((ch) => {
        expanded[ch.id] = ch.isExpanded ?? false;
      });
      set({ expandedChapters: expanded });
      const firstVideo = course.chapters[0]?.videos[0] || null;
      set({ currentVideo: firstVideo });
    }
  },

  setCurrentVideo: (video) => set({ currentVideo: video }),

  toggleChapter: (chapterId) =>
    set((state) => ({
      expandedChapters: {
        ...state.expandedChapters,
        [chapterId]: !state.expandedChapters[chapterId],
      },
    })),

  addCourse: (course) =>
    set((state) => ({
      courses: [...state.courses, course],
    })),

  addChapter: (courseId, chapter) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId ? { ...c, chapters: [...c.chapters, chapter] } : c
      ),
    })),

  addVideo: (courseId, chapterId, video) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              chapters: c.chapters.map((ch) =>
                ch.id === chapterId ? { ...ch, videos: [...ch.videos, video] } : ch
              ),
            }
          : c
      ),
    })),

  addAssignment: (courseId, chapterId, assignment) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              chapters: c.chapters.map((ch) =>
                ch.id === chapterId ? { ...ch, assignment } : ch
              ),
            }
          : c
      ),
    })),

  submitAssignment: (submission) =>
    set((state) => ({
      submissions: [...state.submissions, submission],
    })),

  markVideoCompleted: (videoId) =>
    set((state) => {
      const newCourses = state.courses.map((c) => ({
        ...c,
        chapters: c.chapters.map((ch) => ({
          ...ch,
          videos: ch.videos.map((v) =>
            v.id === videoId ? { ...v, isCompleted: true } : v
          ),
        })),
      }));

      const totalVideos = newCourses.reduce(
        (acc, c) =>
          acc + c.chapters.reduce((a, ch) => a + ch.videos.length, 0),
        0
      );

      const completedVideos = newCourses.reduce(
        (acc, c) =>
          acc +
          c.chapters.reduce(
            (a, ch) => a + ch.videos.filter((v) => v.isCompleted).length,
            0
          ),
        0
      );

      return {
        courses: newCourses,
        enrollments: state.enrollments.map((e) => ({
          ...e,
          progress: totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0,
        })),
      };
    }),

  getEnrollment: (courseId) => {
    return get().enrollments.find((e) => e.courseId === courseId);
  },

  getSubmissionsForAssignment: (assignmentId) => {
    return get().submissions.filter((s) => s.assignmentId === assignmentId);
  },
}));
