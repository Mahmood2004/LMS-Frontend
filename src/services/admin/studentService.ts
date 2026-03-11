import api from "@/lib/api";

export interface Student {
  id: string;
  username: string;
  email: string;
  full_name?: string | null;
  is_active?: boolean;
  created_at?: string;
  courses_count?: number;
}

export interface StudentProfile extends Student {
  bio?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  cv_url?: string | null;
  cv_completed?: boolean;
  skills?: string[];
  courses?: {
    id: string;
    title: string;
  }[];
}

export interface UpdateStudentPayload {
  fullName?: string;
  bio?: string;
  email?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

const BASE_URL = "/admin/students";

const studentService = {
  // Get all students
  getAll: async (): Promise<Student[]> => {
    const res = await api.get(BASE_URL);
    return res.data;
  },

  // Search students
  search: async (query: string): Promise<Student[]> => {
    const res = await api.get(`${BASE_URL}/search`, {
      params: { query },
    });
    return res.data;
  },

  // Get student profile
  getById: async (id: string): Promise<StudentProfile> => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  },

  // Update student profile
  updateById: async (
    id: string,
    payload: UpdateStudentPayload
  ) => {
    const res = await api.patch(`${BASE_URL}/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  },

  // Get student CV signed URL
  getStudentCV: async (id: string): Promise<string> => {
    const res = await api.get(`${BASE_URL}/${id}/cv`);
    return res.data.cv_url;
  },
};

export default studentService;