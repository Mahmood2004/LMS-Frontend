import api from "@/lib/api";

interface SkillsPayload {
  skills: string[];
}

export const skillsService = {
  // Get all skills
  getAllSkills: async () => {
    const response = await api.get("/skills/getAllSkills");
    return response.data;
  },

  // Add new skills to global skills table
  addSkills: async (skills: string[]) => {
    const response = await api.post("/skills/addSkillGlobaly", {
      skills,
    } as SkillsPayload);

    return response.data;
  },

  // Delete skills from global skills table
  deleteSkills: async (skills: string[]) => {
    const response = await api.delete("/skills/deleteSkillGlobaly", {
      data: { skills } as SkillsPayload,
    });

    return response.data;
  },
};
