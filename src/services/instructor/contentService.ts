import api from "@/lib/api";
import { Course } from "./courseService";

// Types
export type ContentType = "pdf" | "video" | "text" | "link" | null;

export interface CourseContent {
  id: string;
  course_id: string | null;
  title: string;
  content_type: ContentType;
  content_url?: string | null;
  position?: number | null;
  created_at?: string | null;
}

export interface CourseWithContent extends Course {
  content?: CourseContent[];
}

export interface GetContentsResponse {
  contents: CourseContent[];
}

export interface ContentActionResponse {
  message: string;
  content: CourseContent;
  ai_ingest?: Record<string, unknown>;
}

export interface AddContentPayload {
  title: string;
  content_type: ContentType;
  content_url?: string;
}

export interface EditContentPayload {
  title?: string;
  content_type?: ContentType;
  content_url?: string;
}

const BASE_URL = "/instructor/courses/content";

const InstructorContentServices = {
  // Add content to a course
  addContent: async (
    courseId: string,
    payload: AddContentPayload,
  ): Promise<ContentActionResponse> => {
    const res = await api.post<ContentActionResponse>(
      `${BASE_URL}/${courseId}`,
      payload,
    );
    return res.data;
  },

  // Get all contents of a course
  getContents: async (courseId: string): Promise<GetContentsResponse> => {
    const res = await api.get<GetContentsResponse>(`${BASE_URL}/${courseId}`);
    return res.data;
  },

  // Edit existing content
  editContent: async (
    courseId: string,
    contentId: string,
    payload: EditContentPayload,
  ): Promise<ContentActionResponse> => {
    const res = await api.patch<ContentActionResponse>(
      `${BASE_URL}/${courseId}/${contentId}`,
      payload,
    );
    return res.data;
  },

  // Delete content
  deleteContent: async (
    courseId: string,
    contentId: string,
  ): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(
      `${BASE_URL}/${courseId}/${contentId}`,
    );
    return res.data;
  },
};

export default InstructorContentServices;
