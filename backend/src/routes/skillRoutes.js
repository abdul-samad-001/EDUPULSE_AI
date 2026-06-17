const express = require("express");
const router = express.Router();

const { addSkill, getSkills, deleteSkill,updateSkill } = require(
  "../controllers/skillController"
);

const { protect } = require(
  "../middleware/authMiddleware"
);

router.post("/", protect, addSkill);
router.get("/", protect, getSkills);
router.delete("/:id", protect, deleteSkill);
router.put("/:id", protect, updateSkill);
module.exports = router;