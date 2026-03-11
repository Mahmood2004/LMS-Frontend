import api from "@/lib/api";

// Types
export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
  student_id: string;
  status: AttendanceStatus;
}

export interface AttendanceSession {
  id: string;
  course_id: string;
  session_date: string;
  created_at: string;
}

export interface StudentRoster {
  student_id: string;
  student_name: string;
  student_email: string;
}

export interface CourseRosterResponse {
  course_id: string;
  roster: StudentRoster[];
}

export interface CreateSessionPayload {
  course_id: string;
  session_date: string;
}

export interface CreateSessionResponse {
  message: string;
  session: AttendanceSession;
}

export interface SubmitAttendancePayload {
  records: AttendanceRecord[];
}

export interface SubmitAttendanceResponse {
  message: string;
  saved_count: number;
  session_id: string;
}

// Service
const InstructorAttendanceServices = {
  // Create a new attendance session for a course
  createSession: async (
    payload: CreateSessionPayload,
  ): Promise<CreateSessionResponse> => {
    const res = await api.post("/attendance/sessions", payload);
    return res.data;
  },

  // Get roster (students enrolled in a course)
  getCourseRoster: async (courseId: string): Promise<CourseRosterResponse> => {
    const res = await api.get(`/attendance/courses/${courseId}/roster`);
    return res.data;
  },

  // Submit attendance records for a session
  submitAttendance: async (
    sessionId: string,
    payload: SubmitAttendancePayload,
  ): Promise<SubmitAttendanceResponse> => {
    const res = await api.post(
      `/attendance/sessions/${sessionId}/records`,
      payload,
    );
    return res.data;
  },
};

export default InstructorAttendanceServices;
