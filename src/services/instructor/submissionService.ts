import api from "@/lib/api";

//Interfaces
export interface Submission {
  id: string;
  assignment_id: string;
  student_name: string | null;
  assignment_title: string | null;
  course_id: string | null;
  course_title: string | null;
  submission_date: string | null;
  assignment_type: string | null;
  submission_url?: string | null;
  score?: number | null;
  status?: string | null;
}

export interface GetSubmissionsResponse {
  assignment_title: string;
  submissions: Submission[];
}

const BASE_URL = "/instructor/courses/submissions";

// Services
const InstructorSubmissionServices = {
  // Get all submissions for an assignment
  getSubmissionsByAssignment: async (
    assignmentId: string,
  ): Promise<GetSubmissionsResponse> => {
    const res = await api.get<GetSubmissionsResponse>(
      `${BASE_URL}/${assignmentId}`,
    );
    return res.data;
  },
};

export default InstructorSubmissionServices;
