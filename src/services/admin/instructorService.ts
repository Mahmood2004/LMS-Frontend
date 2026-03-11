import api from '@/lib/api';

export interface Instructor {
  id: string;
  username: string;
  email: string;
  full_name?: string | null;
  is_active?: boolean;
  created_at?: string;
  courses_count?: number;
  courses?: Array<{ id: string; title: string; description?: string }>;
  bio?: string | null;
}

interface UpdateInstructorPayload {
  fullName?: string;
  bio?: string;
  email?: string;
}

const BASE_URL = '/admin/instructors';

const instructorService = {
  // Get all instructors
  getAll: async (): Promise<Instructor[]> => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // Get instructor profile by ID
  getById: async (id: string): Promise<Instructor> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Update instructor profile by ID
  updateById: async (id: string, payload: UpdateInstructorPayload): Promise<Instructor> => {
    const response = await api.patch(`${BASE_URL}/${id}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.profile;
  },

  // Search instructors by query string
  search: async (query: string): Promise<Instructor[]> => {
    const response = await api.get(`${BASE_URL}/search`, { params: { query } });
    return response.data;
  },
};

export default instructorService;
