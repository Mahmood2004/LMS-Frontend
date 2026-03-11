import api from "@/lib/api";

export interface EnrolledCourse {
  user_id: string;
  course_id: string;
  enrolled_at: string;

  courses: {
    id: string;
    title: string;
    description?: string;
    created_at: string;

    users?: {
      id: string;
      profiles?: {
        full_name: string;
      };
    };
  };
}

interface CoursesResponse {
  Courses: EnrolledCourse[];
}

export interface AttendanceCourse {
  course_id: string;
  course_title: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  attendance_percentage: number;
}

interface AttendanceResponse {
  student_id: string;
  attendance: AttendanceCourse[];
}

const courseService = {
  // Get all courses the student is enrolled in
  getMyCourses: async (): Promise<EnrolledCourse[]> => {
    const res = await api.get<CoursesResponse>("/student/course/my-courses");
    return res.data.Courses;
  },

  // Get student attendance across all courses
  getMyAttendance: async (): Promise<AttendanceCourse[]> => {
    const res = await api.get<AttendanceResponse>("/attendance/my");
    return res.data.attendance;
  },
};

export default courseService;
