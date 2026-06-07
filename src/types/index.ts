export interface Video {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  orderIndex: number;
  isCompleted?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  questions: string[];
  dueDate: string;
}

export interface Chapter {
  id: string;
  title: string;
  orderIndex: number;
  videos: Video[];
  assignment?: Assignment;
  isExpanded?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  teacherId: string;
  teacherName: string;
  category: string;
  chapters: Chapter[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: 'pending' | 'submitted' | 'graded';
}

export interface Enrollment {
  courseId: string;
  progress: number;
  completedVideos: string[];
  enrolledAt: string;
}

export type UserRole = 'teacher' | 'student';
