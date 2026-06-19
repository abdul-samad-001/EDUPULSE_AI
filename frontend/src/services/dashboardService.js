import axiosInstance from './axiosInstance'; // Reusing your existing configured instance

const dashboardService = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/dashboard/stats');
    return response.data;
  },

  getRecentSkills: async () => {
    const response = await axiosInstance.get('/dashboard/recent-skills');
    return response.data;
  },

  getCategoryStats: async () => {
    const response = await axiosInstance.get('/dashboard/category-stats');
    // Backend Returns: { categories: { "Frontend": 1, "Backend": 2 } }
    // Frontend Adaptor Logic to fit Claude's UI expectation safely:
    if (response.data && response.data.categories) {
      const transformedData = Object.entries(response.data.categories).map(([category, count]) => ({
        category,
        count,
        averageProgress: 0 // Defaulting safely since existing backend schema doesn't supply progress here
      }));
      return transformedData;
    }
    return [];
  }
};

export default dashboardService;