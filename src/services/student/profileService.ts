import api from "@/lib/api";

// Types

export interface StudentProfile {
  email: string;
  username: string;
  full_name: string;
  bio: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  cv_url: string | null;
  cv_completed: boolean;
}

export interface UpdateProfilePayload {
  full_name?: string;
  bio?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  email?: string;
}

export interface UpdateProfileResponse {
  message: string;
  profile: {
    user_id: string;
    full_name: string;
    bio: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    portfolio_url: string | null;
    cv_url: string | null;
    cv_completed: boolean;
    updated_at: string;
  };
}

export interface UploadCVResponse {
  message: string;
  CVCompletionStatus: boolean;
}

export interface CVUrlResponse {
  cv_url: string;
}

export interface DeleteCVResponse {
  message: string;
}

const BASE = "/profile";

// Service
const studentProfileService = {
  // Get Student Profile
  getProfile: async (): Promise<StudentProfile> => {
    const res = await api.get(`${BASE}/my-profile`);
    return res.data;
  },

  // Update Profile
  updateProfile: async (
    data: UpdateProfilePayload,
  ): Promise<UpdateProfileResponse> => {
    const res = await api.patch(`${BASE}/update-profile`, data);
    return res.data;
  },

  // Upload CV
  uploadCV: async (file: File): Promise<UploadCVResponse> => {
    const formData = new FormData();
    formData.append("cv", file);

    const res = await api.patch(`${BASE}/me/cv`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  // Get Signed CV URL
  getCVUrl: async (): Promise<CVUrlResponse> => {
    const res = await api.get(`${BASE}/me/cv`);
    return res.data;
  },

  // Delete CV
  deleteCV: async (): Promise<DeleteCVResponse> => {
    const res = await api.delete(`${BASE}/me/cv`);
    return res.data;
  },
};

export default studentProfileService;
