import api from "@/lib/api";

export interface InstructorProfile {
  email:     string;
  username:  string;
  full_name: string;
  bio:       string | null;
}

export interface UpdateInstructorProfilePayload {
  fullName?: string;
  bio?:       string | null;
  email?:     string;
}

const BASE = "/instuctor/profile"; // matches your backend route exactly

const InstructorProfileServices = {

  getProfile: async (): Promise<InstructorProfile> => {
    const res = await api.get(`${BASE}/my-profile`);
    return res.data;
  },

  updateProfile: async (data: UpdateInstructorProfilePayload): Promise<void> => {
    await api.patch(`${BASE}/my-profile`, data);
  },

};

export default InstructorProfileServices;