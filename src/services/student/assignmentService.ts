import api from "@/lib/api";

// Types for assignments, submissions, and feedback
export type AssignmentStatus = "pending" | "submitted" | "graded";

export interface Assignment {
  id: string;
  course_id: string;
  course_title: string;
  title: string;
  description?: string;
  type?: string;
  due_date?: string;
  max_score?: number;
  created_at: string;
  submission_status?: "pending" | "ungraded" | "graded";
  due_status?: "overdue" | "due" | "upcoming";
  submission_url?: string;
  comment?: string;
  rating?: number;
}

export interface SubmissionResponse {
  message: string;
  submission: {
    id: string;
    assignment_id: string;
    student_id: string;
    submission_url: string;
    submitted_at: string;
    status: string;
    score: number;
  };
}

export interface Feedback {
  id: string;
  submission_id: string;
  instructor_id: string;
  rating?: number;
  comment?: string;
  is_locked: boolean;
  locked_at?: string;
  created_at: string;
}

export interface PendingAssignmentsResponse {
  courses: {
    course_title: string;
    pending_assignments: Assignment[];
  }[];
}

const API_BASE = "/student/courses";

const assignmentService = {
  // Get all assignments for the student
  getAllAssignments: async (): Promise<Assignment[]> => {
    const res = await api.get(`${API_BASE}/assignment/my-assignments`);
    return res.data.assignments;
  },

  // Get all pending assignments
  getPendingAssignments: async () => {
    const res = await api.get<PendingAssignmentsResponse>(
      `${API_BASE}/assignment/my-pending`,
    );
    return res.data.courses;
  },

  // Get assignments by course
  getAssignmentsByCourse: async (courseId: string): Promise<Assignment[]> => {
    const res = await api.get(`${API_BASE}/assignment/${courseId}`);
    return res.data.Assignements;
  },

  // Submit an assignment
  submitAssignment: async (
    assignmentId: string,
    submission_url: string,
  ): Promise<SubmissionResponse> => {
    const res = await api.post(`${API_BASE}/submissions/${assignmentId}`, {
      submission_url,
    });
    return res.data;
  },

  // Edit a submission
  editSubmission: async (
    assignmentId: string,
    submission_url: string,
  ): Promise<any> => {
    const res = await api.patch(`${API_BASE}/submissions/${assignmentId}`, {
      submission_url,
    });
    return res.data;
  },

  // Get feedback for a specific assignment
  getFeedback: async (assignmentId: string): Promise<Feedback> => {
    const res = await api.get(`/student/feedback/${assignmentId}`);
    return res.data;
  },
};

export default assignmentService;
