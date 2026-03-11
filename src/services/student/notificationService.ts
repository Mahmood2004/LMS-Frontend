import api from "@/lib/api";

// TYPES
export type NotificationType = "announcement" | "assignment" | "feedback";

export interface Notification {
  id: string;
  user_id: string;
  announcement_id?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  reference_type?: string | null;
  reference_id?: string | null;
  created_at: string;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface ReadNotificationResponse {
  message: string;
}

const API_BASE = "/student/notification";

const StudentNotificationServices = {
  // Get all notifications
  async getMyNotifications(): Promise<GetNotificationsResponse> {
    const res = await api.get<GetNotificationsResponse>(`${API_BASE}/my-notification`);

    return res.data;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ReadNotificationResponse> {
    const res = await api.patch<ReadNotificationResponse>(
      `${API_BASE}/read-notification/${notificationId}`,
    );

    return res.data;
  },
};

export default StudentNotificationServices;
