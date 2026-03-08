import api from "@/lib/api";

export interface CreateCoursePayload {
  title: string;
  description: string;
}

export interface CreateCourseResponse {
  id: string;
  title: string;
  description: string | null;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  cohort_id: string;
  created_at: string;
}

export interface GetCoursesResponse {
  courses: Course[];
}

const BASE = "/instructor/course";

// In courseServices.ts
const InstructorCourseServices = {
  createCourse: async (
    data: CreateCoursePayload
  ): Promise<CreateCourseResponse> => {
    const res = await api.post(`${BASE}/my-courses`, data);
    return res.data;
  },

  getCourses: async (): Promise<Course[]> => {
    const res = await api.get<GetCoursesResponse>(`${BASE}/my-courses`);
    return res.data.courses; 
  },

  getStudentCount: async (courseId: string): Promise<number> => {
    const res = await api.get(`${BASE}/${courseId}/num-students`);
    return res.data.numberOfStudents;
  },

  getPendingCount: async (courseId: string): Promise<number> => {
    const res = await api.get(`${BASE}/${courseId}/pending-subs`);
    return res.data.ungradedSubmissions;
  },
  
};

export default InstructorCourseServices;
