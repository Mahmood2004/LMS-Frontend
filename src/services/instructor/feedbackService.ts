import api from "@/lib/api";

// Types
export interface Feedback {
  id: string;
  submission_id: string;
  instructor_id: string;
  rating: number | null;
  comment: string | null;
  is_locked: boolean;
  created_at?: string;
  locked_at?: string | null;
}

export interface ViewFeedbackResponse {
  feedback: Feedback;
}

export interface FeedbackPayload {
  rating?: number;
  comment?: string;
}

export interface FeedbackActionResponse {
  message: string;
  feedback: Feedback;
}

const BASE_URL = "/instructor/feedback";

const InstructorFeedbackServices = {
  // View feedback or draft for a submission
  viewFeedback: async (submissionId: string): Promise<ViewFeedbackResponse> => {
    const res = await api.get<ViewFeedbackResponse>(
      `${BASE_URL}/${submissionId}`,
    );
    return res.data;
  },

  // Save feedback as draft
  saveDraft: async (
    submissionId: string,
    payload: FeedbackPayload,
  ): Promise<FeedbackActionResponse> => {
    const res = await api.patch<FeedbackActionResponse>(
      `${BASE_URL}/${submissionId}`,
      payload,
    );
    return res.data;
  },

  // Submit feedback (finalize)
  submitFeedback: async (
    submissionId: string,
    payload: FeedbackPayload,
  ): Promise<FeedbackActionResponse> => {
    const res = await api.patch<FeedbackActionResponse>(
      `${BASE_URL}/submit/${submissionId}`,
      payload,
    );
    return res.data;
  },
};

export default InstructorFeedbackServices;
