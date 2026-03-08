import api from "@/lib/api";

export interface CreateAssignmentPayload {
  title: string;
  description: string;
  type: "quiz" | "homework" | "project";
  due_date?: string | null;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  type: string;
  due_date: string | null;
  max_score: number;
}

export interface CreateAssignmentResponse {
  message: string;
  assignment: Assignment;
}

const BASE = "/instructor/course";

const AssignmentServices = {
  createAssignment: async (
    courseId: string,
    data: CreateAssignmentPayload
  ): Promise<Assignment> => {
    const res = await api.post<CreateAssignmentResponse>(
      `${BASE}/${courseId}/assignments`,
      data
    );

    return res.data.assignment;
  },
};

export default AssignmentServices;