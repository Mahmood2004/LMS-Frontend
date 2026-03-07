import api from "@/lib/api";

// Types
export interface Skill {
  id: number;
  name: string;
}

export interface UserSkillsResponse {
  skills: string[];
}

export interface AddSkillsResponse {
  message: string;
  addedSkills: string[];
}

export interface DeleteSkillResponse {
  message: string;
}

const BASE_URL = "/skills";
// Service
const skillService = {
  // Get all skills in the system
  getAllSkills: async (): Promise<Skill[]> => {
    const res = await api.get(`${BASE_URL}/getAllSkills`);
    return res.data;
  },

  // Get all skills for the logged-in user
  getUserSkills: async (): Promise<UserSkillsResponse> => {
    const res = await api.get(`${BASE_URL}/getUserSkills`);
    return res.data;
  },

  // Add skills to the user
  addSkillsToUser: async (skills: string[]): Promise<AddSkillsResponse> => {
    const res = await api.put(`${BASE_URL}/addSkillByUser`, { skills });
    return res.data;
  },

  // Delete a skill from the user
  deleteSkillFromUser: async (skill: string): Promise<DeleteSkillResponse> => {
    const res = await api.delete(`${BASE_URL}/deleteUserSkills`, {
      data: { skill }, // axios requires `data` for DELETE body
    });
    return res.data;
  },

  // Search skills by query (optional for autocomplete)
  findSkills: async (query: string): Promise<Skill[]> => {
    const res = await api.get(
      `${BASE_URL}/findSkill?skill=${encodeURIComponent(query)}`,
    );
    return res.data;
  },
};

export default skillService;
