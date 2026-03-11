import api from "@/lib/api";

export interface InstructorProfile {
  email: string;
  username: string;
  full_name?: string;
  bio: string | null;
}

export interface UpdateInstructorProfilePayload {
  fullName?: string;
  bio?: string | null;
  email?: string;
}

const API_BASE = "/instuctor/profile";

const instructorProfileServices = {
  // Get instructor Profile
  getProfile: async (): Promise<InstructorProfile> => {
    const res = await api.get(`${API_BASE}/my-profile`);
    return res.data;
  },

  // Update Profile
  updateProfile: async (
    data: UpdateInstructorProfilePayload,
  ): Promise<void> => {
    await api.patch(`${API_BASE}/my-profile`, data);
  },
};

export default instructorProfileServices;
