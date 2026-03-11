import api from "@/lib/api";

export interface CourseContent {
  id: string;
  course_id: string;
  title: string;
  text_body: string;
  content_type: string;
  content_url: string;
  created_at: string;
}

interface ContentResponse {
  content: CourseContent[];
}

const contentService = {
  // Get all content for a specific course
  getCourseContent: async (courseId: string): Promise<CourseContent[]> => {
    const res = await api.get<ContentResponse>(
      `/student/courses/content/${courseId}`,
    );
    return res.data.content;
  },
};

export default contentService;
