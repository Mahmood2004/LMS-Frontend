import api from "@/lib/api";

// Types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  cohort_id: string;
  created_at: string;
}

export interface CreateCoursePayload {
  title: string;
  description: string;
}

export interface CreateCourseResponse extends Course {}

export interface GetCoursesResponse {
  courses: Course[];
}

export interface GetCourseResponse {
  course: Course;
}

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
}

export interface UpdateCourseResponse {
  updatedCourse: Course;
}

export interface DeleteCourseResponse {
  message: string;
}

export interface StudentCountResponse {
  courseId: string;
  numberOfStudents: number;
}

export interface PendingSubmissionsResponse {
  courseId: string;
  ungradedSubmissions: number;
}

export interface InstructorStudent {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  cv_url?: string | null;
  skills: string[];
}

export interface CourseTitle {
  title: string;
}

export interface GetInstructorStudentsResponse {
  coursesTitles: CourseTitle[];
  formattedStudents: InstructorStudent[];
}

const BASE_URL = "/instructor/course";

//Services
const InstructorCourseServices = {
  //create new course
  createCourse: async (
    data: CreateCoursePayload,
  ): Promise<CreateCourseResponse> => {
    const res = await api.post(`${BASE_URL}/my-courses`, data);
    return res.data;
  },

  //get courses for instructor
  getInstructorCourses: async (): Promise<Course[]> => {
    const res = await api.get<GetCoursesResponse>(`${BASE_URL}/my-courses`);
    return res.data.courses;
  },

  //get courses by Id
  getCourseById: async (courseId: string): Promise<Course> => {
    const res = await api.get<GetCourseResponse>(
      `${BASE_URL}/my-courses/${courseId}`,
    );
    return res.data.course;
  },

  //update course
  updateCourse: async (
    courseId: string,
    data: UpdateCoursePayload,
  ): Promise<Course> => {
    const res = await api.patch<UpdateCourseResponse>(
      `${BASE_URL}/my-courses/${courseId}`,
      data,
    );
    return res.data.updatedCourse;
  },

  //delete course
  deleteCourse: async (courseId: string): Promise<DeleteCourseResponse> => {
    const res = await api.delete<DeleteCourseResponse>(
      `${BASE_URL}/my-courses/${courseId}`,
    );
    return res.data;
  },

  //get student count in course
  getCourseStudentCount: async (courseId: string): Promise<number> => {
    const res = await api.get<StudentCountResponse>(
      `${BASE_URL}/${courseId}/num-students`,
    );
    return res.data.numberOfStudents;
  },

  //get submission count
  getPendingSubmissionsCount: async (courseId: string): Promise<number> => {
    const res = await api.get<PendingSubmissionsResponse>(
      `${BASE_URL}/${courseId}/pending-subs`,
    );
    return res.data.ungradedSubmissions;
  },

  // get student data
  getStudentsByInstructor: async (): Promise<GetInstructorStudentsResponse> => {
    const res = await api.get<GetInstructorStudentsResponse>(
      `${BASE_URL}/students`,
    );

    return res.data;
  },
};

export default InstructorCourseServices;
