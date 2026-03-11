import api from "@/lib/api";

// Types
export interface Announcement {
  announcement_id: string;
  title: string;
  message: string;
  created_at?: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  message: string;
}

export interface CreateAnnouncementResponse {
  message: string;
  announcement_id: string;
}

export interface DeleteAnnouncementResponse {
  message: string;
}

const InstructorAnnouncementServices = {
  // Post announcement
  createAnnouncement: async (
    payload: CreateAnnouncementPayload,
  ): Promise<CreateAnnouncementResponse> => {
    const res = await api.post(
      "/instructor/notification/post-announcment",
      payload,
    );
    return res.data;
  },

  // Delete announcement
  deleteAnnouncement: async (
    announcementId: string,
  ): Promise<DeleteAnnouncementResponse> => {
    const res = await api.delete(`/instructor/notification/${announcementId}`);
    return res.data;
  },
};

export default InstructorAnnouncementServices;
