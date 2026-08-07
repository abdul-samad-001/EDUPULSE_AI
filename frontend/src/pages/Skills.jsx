import { useState, useEffect, useMemo } from "react";
import skillService from "../services/skillService";

import SkillsHero from "../components/skills/SkillsHero";
import SkillsFilterBar from "../components/skills/SkillsFilterBar";
import SkillList from "../components/skills/SkillList";
import LearningInsightsWidget from "../components/skills/LearningInsightsWidget";

import AddSkillModal from "../components/skills/AddSkillModal";
import EditSkillModal from "../components/skills/EditSkillModal";
import DeleteSkillModal from "../components/skills/DeleteSkillModal";
import SkillDetailsModal from "../components/skills/SkillDetailsModal";

import { LoadingSpinner, Card, Button } from "../components/ui";
import { AlertCircle } from "lucide-react";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeEditTarget, setActiveEditTarget] = useState(null);
  const [activeDeleteTarget, setActiveDeleteTarget] = useState(null);
  const [activeDetailsTarget, setActiveDetailsTarget] = useState(null);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await skillService.getAllSkills();
      setSkills(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchSkills = async () => {
      try {
        const data = await skillService.getAllSkills();
        if (isMounted) {
          setSkills(data || []);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to load skills.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddSkillSubmit = async (name, category) => {
    try {
      const added = await skillService.createSkill(name, category);
      setSkills((prev) => [...prev, added]);
    } catch (err) {
      console.error(err);
      alert("Unable to create skill.");
    }
  };

  const handleEditSkillSubmit = async (id, fields) => {
    try {
      const updated = await skillService.updateSkill(id, fields);
      setSkills((prev) =>
        prev.map((s) => (s._id === id ? updated : s))
      );
    } catch (err) {
      console.error(err);
      alert("Unable to update skill.");
    }
  };

  const handleDeleteSkillSubmit = async (id) => {
    try {
      await skillService.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Unable to delete skill.");
    }
  };

  const handleProgressPipelineUpdate = (
    id,
    progress,
    streakFields = {}
  ) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill._id === id
          ? {
              ...skill,
              progress,
              completed: progress === 100,
              ...streakFields,
            }
          : skill
      )
    );
  };

  // Filter and Sort Pipeline
  const processedSkills = useMemo(() => {
    let list = Array.isArray(skills) ? [...skills] : [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          (s.skillName || "").toLowerCase().includes(q) ||
          (s.category || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter === "active") {
      list = list.filter((s) => (s.progress || 0) < 100);
    } else if (statusFilter === "completed") {
      list = list.filter((s) => (s.progress || 0) === 100);
    }

    if (categoryFilter !== "all") {
      list = list.filter((s) => s.category === categoryFilter);
    }

    if (sortBy === "newest") {
      list.reverse();
    } else if (sortBy === "oldest") {
      // Keep original array order
    } else if (sortBy === "highest") {
      list.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    } else if (sortBy === "alphabetical") {
      list.sort((a, b) => (a.skillName || "").localeCompare(b.skillName || ""));
    }

    return list;
  }, [skills, searchQuery, statusFilter, categoryFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingSpinner size="lg" label="Loading EduPulse Skill Library..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="max-w-md text-center p-8">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark-text mb-4">{error}</h2>
          <Button variant="primary" onClick={loadSkills}>
            Retry Loading
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-10">
      {/* 1. HERO SECTION */}
      <SkillsHero skills={skills} onAddSkillClick={() => setIsAddOpen(true)} />

      {/* 2. SEARCH & FILTERS */}
      <SkillsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* 3. SKILLS GRID + AI RECOMMENDATION CARD */}
      <SkillList
        skills={processedSkills}
        onProgressUpdate={handleProgressPipelineUpdate}
        onEditTrigger={setActiveEditTarget}
        onDeleteTrigger={setActiveDeleteTarget}
        onOpenModal={() => setIsAddOpen(true)}
        onAddSuggested={handleAddSkillSubmit}
      />

      {/* 4. LEARNING INSIGHTS WIDGET */}
      <LearningInsightsWidget skills={skills} />

      {/* MODALS */}
      <AddSkillModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddSkillSubmit}
      />

      <EditSkillModal
        key={activeEditTarget?._id || "none"}
        isOpen={!!activeEditTarget}
        skill={activeEditTarget}
        onClose={() => setActiveEditTarget(null)}
        onUpdate={handleEditSkillSubmit}
      />

      <DeleteSkillModal
        isOpen={!!activeDeleteTarget}
        skill={activeDeleteTarget}
        onClose={() => setActiveDeleteTarget(null)}
        onConfirm={handleDeleteSkillSubmit}
      />

      <SkillDetailsModal
        isOpen={!!activeDetailsTarget}
        skill={activeDetailsTarget}
        onClose={() => setActiveDetailsTarget(null)}
      />
    </div>
  );
}

export default Skills;