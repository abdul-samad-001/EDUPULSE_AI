import axiosInstance from "./axiosInstance";

const skillService = {
  getAllSkills: async () => {
    // Changed from "/api/skills" to just "/skills"
    const res = await axiosInstance.get("/skills");
    return res.data.skills || res.data || [];
  },

  createSkill: async (skillName, category) => {
    // Changed from "/api/skills" to just "/skills"
    const res = await axiosInstance.post("/skills", { skillName, category });
    return res.data.skill || res.data;
  },

  updateSkill: async (skillId, updatedFields) => {
    // Changed from "/api/skills/:id" to just "/skills/:id"
    const res = await axiosInstance.put(`/skills/${skillId}`, updatedFields);
    return res.data.skill || res.data;
  },

  deleteSkill: async (skillId) => {
    // Changed from "/api/skills/:id" to just "/skills/:id"
    const res = await axiosInstance.delete(`/skills/${skillId}`);
    return res.data;
  },

  getTasks: async (skillId) => {
    // Changed from "/api/tasks/:id" to just "/tasks/:id"
    const res = await axiosInstance.get(`/tasks/${skillId}`);
    return res.data.tasks || res.data || [];
  },

  createTask: async (skillId, taskName) => {
    // Changed from "/api/tasks/:id" to just "/tasks/${skillId}"
    const res = await axiosInstance.post(`/tasks/${skillId}`, { taskName });
    return res.data.task || res.data;
  },

  toggleTask: async (taskId, completed) => {
    // Changed from "/api/tasks/:id" to just "/tasks/:id"
    const res = await axiosInstance.put(`/tasks/${taskId}`, { completed });
    return res.data;
  },

  // NEW — AI Roadmap Generator. Same defensive unwrap pattern as getTasks.
  generateRoadmap: async (skillId) => {
    const res = await axiosInstance.post(`/tasks/${skillId}/generate`);
    return res.data.tasks || res.data || [];
  },
};

export default skillService;