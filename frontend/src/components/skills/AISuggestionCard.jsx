import { useState, useMemo, useEffect } from "react";
import { Card, Button, Badge } from "../ui";
import { Sparkles, Compass, Clock, ArrowRight, RotateCw } from "lucide-react";
import mlService from "../../services/mlService";

const RECOMMENDATION_CATALOG = [
  {
    name: "Kubernetes & Cloud Orchestration",
    category: "DevOps",
    level: "Intermediate",
    duration: "~4 weeks (16 hrs)",
    description: "Master container orchestration, automated deployments, horizontal scaling, and cloud cluster management.",
    keywords: ["kubernetes", "k8s", "orchestration", "cluster"],
  },
  {
    name: "TypeScript & Advanced Architecture",
    category: "Web Development",
    level: "Intermediate",
    duration: "~3 weeks (12 hrs)",
    description: "Build type-safe, maintainable enterprise applications with static typing, generics, and modern design patterns.",
    keywords: ["typescript", "ts"],
  },
  {
    name: "GraphQL & Declarative APIs",
    category: "Backend",
    level: "Intermediate",
    duration: "~3 weeks (10 hrs)",
    description: "Design high-performance declarative APIs with schemas, resolvers, subscriptions, and query optimizations.",
    keywords: ["graphql", "apollo"],
  },
  {
    name: "PostgreSQL & Database Performance",
    category: "Database",
    level: "Advanced",
    duration: "~3 weeks (14 hrs)",
    description: "Master relational schema design, indexing strategies, query execution plans, and transaction isolation.",
    keywords: ["postgres", "postgresql", "sql", "database"],
  },
  {
    name: "Redis Caching & In-Memory Stores",
    category: "Backend",
    level: "Intermediate",
    duration: "~2 weeks (8 hrs)",
    description: "Implement in-memory caching strategies, pub/sub messaging, rate limiting, and fast session state storage.",
    keywords: ["redis", "cache", "caching"],
  },
  {
    name: "System Design & Distributed Systems",
    category: "Backend",
    level: "Advanced",
    duration: "~5 weeks (20 hrs)",
    description: "Learn scalability, load balancing, message queues, microservices patterns, and fault-tolerant architecture.",
    keywords: ["system design", "distributed", "scalability"],
  },
  {
    name: "Docker & Microservices Architecture",
    category: "DevOps",
    level: "Intermediate",
    duration: "~4 weeks (15 hrs)",
    description: "Master containerization, multi-stage Dockerfiles, compose networks, and microservice container deployment.",
    keywords: ["docker", "container", "microservice"],
  },
  {
    name: "Next.js & Fullstack SSR Frameworks",
    category: "Web Development",
    level: "Intermediate",
    duration: "~3 weeks (12 hrs)",
    description: "Leverage server-side rendering, static site generation, API routes, and React Server Components.",
    keywords: ["next.js", "nextjs", "ssr"],
  },
  {
    name: "Go (Golang) Microservices",
    category: "Backend",
    level: "Intermediate",
    duration: "~4 weeks (16 hrs)",
    description: "Build ultra-fast, concurrent backend services with goroutines, channels, and minimal memory overhead.",
    keywords: ["go", "golang"],
  },
  {
    name: "PyTorch & Deep Learning Foundations",
    category: "AI & Data Science",
    level: "Advanced",
    duration: "~5 weeks (22 hrs)",
    description: "Train neural networks, build transformer models, and optimize machine learning models for production inference.",
    keywords: ["pytorch", "deep learning", "machine learning", "ml"],
  },
];

function AISuggestionCard({ existingSkills = [], onAddSuggested }) {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [mlConfidence, setMlConfidence] = useState(88);
  const [adding, setAdding] = useState(false);

  // Fetch live ML confidence from Model 3 V2 recommendation engine
  useEffect(() => {
    let isMounted = true;
    const fetchML = async () => {
      try {
        const res = await mlService.getRecommendationPrediction().catch(() => null);
        if (isMounted && res?.data?.confidence) {
          setMlConfidence(Math.round(res.data.confidence * 100));
        }
      } catch (err) {
        console.warn("AI Suggestion ML fetch warning:", err?.message);
      }
    };
    fetchML();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter out any skills the user ALREADY has in their roadmap
  const unlearnedRecommendations = useMemo(() => {
    const existingNamesLower = (existingSkills || []).map((s) =>
      (s.skillName || s.name || "").toLowerCase().trim()
    );

    return RECOMMENDATION_CATALOG.filter((item) => {
      const itemNameLower = item.name.toLowerCase();
      // Check exact match or keyword match
      const alreadyHasExact = existingNamesLower.some(
        (existing) =>
          existing === itemNameLower ||
          existing.includes(itemNameLower) ||
          itemNameLower.includes(existing)
      );

      if (alreadyHasExact) return false;

      // Check key term match (e.g. if user has "docker", don't recommend Docker)
      const hasKeyTerm = item.keywords.some((kw) =>
        existingNamesLower.some((existing) => existing.includes(kw))
      );

      return !hasKeyTerm;
    });
  }, [existingSkills]);

  // Active recommended skill
  const recommendation = useMemo(() => {
    if (unlearnedRecommendations.length === 0) {
      return {
        name: "Advanced System Architecture",
        category: "Backend",
        level: "Advanced",
        duration: "~4 weeks (18 hrs)",
        description: "You've mastered core topics! Challenge yourself with advanced cloud infrastructure & distributed architecture.",
      };
    }
    const idx = cycleIndex % unlearnedRecommendations.length;
    return unlearnedRecommendations[idx];
  }, [unlearnedRecommendations, cycleIndex]);

  const handleCycleRecommendation = () => {
    setCycleIndex((prev) => prev + 1);
  };

  const handleAddClick = async () => {
    if (adding || !recommendation) return;
    try {
      setAdding(true);
      await onAddSuggested(recommendation.name, recommendation.category);
    } catch (err) {
      console.error("Add suggested skill failed:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card
      title="🤖 AI Recommended Skill"
      subtitle={`Personalized roadmap expansion (${mlConfidence}% ML Match)`}
      headerAction={
        <div className="flex items-center gap-1.5">
          <Badge variant="primary" icon={Sparkles} size="sm">
            Recommended
          </Badge>
          {unlearnedRecommendations.length > 1 && (
            <button
              onClick={handleCycleRecommendation}
              className="p-1 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-border transition-colors"
              title="Suggest Another Skill"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      }
      className="w-full h-full flex flex-col justify-between border-dashed border-primary/40 bg-linear-to-br from-primary/5 via-dark-card to-dark-card"
    >
      <div className="space-y-3 my-auto py-1">
        <div>
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-primary">
            <span>Next Learning Milestone</span>
            <span className="text-[10px] font-bold text-dark-muted lowercase">
              ({recommendation.category})
            </span>
          </div>
          <h3 className="text-base font-extrabold text-dark-text tracking-tight mt-0.5">
            {recommendation.name}
          </h3>
          <p className="text-xs text-dark-muted mt-1 leading-relaxed">
            {recommendation.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="warning" icon={Compass} size="sm">
            {recommendation.level}
          </Badge>
          <Badge variant="neutral" icon={Clock} size="sm">
            {recommendation.duration}
          </Badge>
        </div>
      </div>

      <div className="pt-3">
        <Button
          variant="primary"
          fullWidth
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={handleAddClick}
          disabled={adding}
        >
          {adding ? "Adding to Roadmap..." : "Add to Skill Roadmap"}
        </Button>
      </div>
    </Card>
  );
}

export default AISuggestionCard;
