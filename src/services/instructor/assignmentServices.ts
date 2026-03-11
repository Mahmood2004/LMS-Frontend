import api from "@/lib/api";

export interface AssignmentPayload {
  title?: string;
  description?: string;
  type: "assignment" | "project";
  due_date?: string | null;
}

export interface UpdateAssignmentPayload {
  title?: string;
  description?: string;
  type?: "assignment" | "project";
  due_date?: string | null;
}

const BASE_URL = "/instructor/courses/assignment";

const InstructorAssignmentServices = {
  // Create a new assignment for a course
  createAssignment: async (courseId: string, data: AssignmentPayload) => {
    const res = await api.post(`${BASE_URL}/${courseId}`, data);
    return res.data;
  },

  // Get all assignments for a course
  getAssignmentsByCourse: async (courseId: string) => {
    const res = await api.get(`${BASE_URL}/${courseId}`);
    return res.data.assignments;
  },

  // Update assignment
  updateAssignment: async (
    assignmentId: string,
    data: UpdateAssignmentPayload,
  ) => {
    const res = await api.patch(`${BASE_URL}/${assignmentId}`, data);
    return res.data;
  },

  // Delete assignment
  deleteAssignment: async (assignmentId: string) => {
    const res = await api.delete(`${BASE_URL}/${assignmentId}`);
    return res.data;
  },
};

export default InstructorAssignmentServices;
