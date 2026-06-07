import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useCourseStore } from '@/store/useCourseStore';
import Navbar from '@/components/Navbar';
import StudentCourseList from '@/pages/student/CourseList';
import StudentCourseDetail from '@/pages/student/CourseDetail';
import TeacherCourseList from '@/pages/teacher/CourseList';
import TeacherCourseCreate from '@/pages/teacher/CourseCreate';
import TeacherCourseDetail from '@/pages/teacher/CourseDetail';

function HomeRedirect() {
  const { role } = useCourseStore();
  return <Navigate to={`/${role}/courses`} replace />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/student/courses" element={<StudentCourseList />} />
          <Route path="/student/courses/:id" element={<StudentCourseDetail />} />

          <Route path="/teacher/courses" element={<TeacherCourseList />} />
          <Route path="/teacher/courses/create" element={<TeacherCourseCreate />} />
          <Route path="/teacher/courses/:id" element={<TeacherCourseDetail />} />

          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}
