const getStartDate = (range = "all") => {
  const now = new Date();

  switch (range) {
    case "today": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return start;
    }

    case "week": {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return start;
    }

    case "month": {
      const start = new Date(now);
      start.setDate(now.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return start;
    }

    default:
      return null;
  }
};

module.exports = {
  getStartDate,
};