const express = require("express");
const router = express.Router();

const {
  getTasksBySkill,
  createTask,
  updateTask,
} = require("../controllers/taskController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.get(
  "/:skillId",
  protect,
  getTasksBySkill,
);
router.post(
    "/:skillId",
    protect,
    createTask
);
router.put(
    "/:id",
    protect,
    updateTask);

module.exports = router;