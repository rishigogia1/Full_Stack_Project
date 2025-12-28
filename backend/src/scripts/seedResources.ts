import mongoose from "mongoose";
import dotenv from "dotenv";
import StudyResource from "../models/StudyResource";

dotenv.config();

const resources = [
  // Documentation Resources
  {
    title: "Data Structures and Algorithms",
    description: "Comprehensive guide to DSA concepts",
    url: "https://www.geeksforgeeks.org/data-structures/",
    category: "data-structures",
    type: "documentation",
    difficulty: "intermediate",
    tags: ["dsa", "algorithms", "data structures"]
  },
  {
    title: "React Best Practices",
    description: "Frontend development with React",
    url: "https://react.dev/learn",
    category: "frontend",
    type: "documentation",
    difficulty: "beginner",
    tags: ["react", "frontend", "javascript"]
  },
  {
    title: "Node.js Documentation",
    description: "Official Node.js docs",
    url: "https://nodejs.org/en/docs/",
    category: "backend",
    type: "documentation",
    difficulty: "intermediate",
    tags: ["nodejs", "backend", "javascript"]
  },
  {
    title: "Python Official Documentation",
    description: "Complete Python language reference",
    url: "https://docs.python.org/3/",
    category: "backend",
    type: "documentation",
    difficulty: "intermediate",
    tags: ["python", "backend"]
  },
  {
    title: "PostgreSQL Documentation",
    description: "Complete PostgreSQL database guide",
    url: "https://www.postgresql.org/docs/",
    category: "backend",
    type: "documentation",
    difficulty: "intermediate",
    tags: ["database", "sql", "postgresql"]
  },
  {
    title: "JavaScript MDN Documentation",
    description: "Complete JavaScript reference",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    category: "frontend",
    type: "documentation",
    difficulty: "intermediate",
    tags: ["javascript", "frontend", "reference"]
  },
  {
    title: "Algorithms Documentation",
    description: "Comprehensive algorithms guide",
    url: "https://en.wikipedia.org/wiki/List_of_algorithms",
    category: "algorithms",
    type: "documentation",
    difficulty: "advanced",
    tags: ["algorithms", "reference", "comprehensive"]
  },
  {
    title: "Sorting Algorithms",
    description: "Guide to sorting algorithms",
    url: "https://www.geeksforgeeks.org/sorting-algorithms/",
    category: "algorithms",
    type: "documentation",
    difficulty: "intermediate",
    tags: ["sorting", "algorithms", "guide"]
  },
  {
    title: "System Design Documentation",
    description: "System design principles and patterns",
    url: "https://microservices.io/",
    category: "system-design",
    type: "documentation",
    difficulty: "advanced",
    tags: ["system design", "microservices", "architecture"]
  },
  {
    title: "DevOps Documentation",
    description: "DevOps practices and tools",
    url: "https://docs.microsoft.com/en-us/devops/",
    category: "devops",
    type: "documentation",
    difficulty: "intermediate",
    tags: ["devops", "ci/cd", "tools"]
  },
  {
    title: "Technical Interview Documentation",
    description: "Technical interview preparation guide",
    url: "https://www.techinterviewhandbook.org/",
    category: "technical",
    type: "documentation",
    difficulty: "intermediate",
    tags: ["interview", "preparation", "technical"]
  },
  {
    title: "Behavioral Interview Documentation",
    description: "Behavioral interview best practices",
    url: "https://www.themuse.com/advice/behavioral-interview-questions-answers-examples",
    category: "behavioral",
    type: "documentation",
    difficulty: "beginner",
    tags: ["behavioral", "interview", "communication"]
  },

  // Tutorial Resources
  {
    title: "System Design Interview Guide",
    description: "Learn how to design scalable systems",
    url: "https://github.com/donnemartin/system-design-primer",
    category: "system-design",
    type: "tutorial",
    difficulty: "advanced",
    tags: ["system design", "scalability", "architecture"]
  },
  {
    title: "JavaScript Algorithms Tutorial",
    description: "Step-by-step algorithm implementations",
    url: "https://www.javascript.com/learn",
    category: "algorithms",
    type: "tutorial",
    difficulty: "beginner",
    tags: ["javascript", "algorithms", "programming"]
  },
  {
    title: "Docker & Kubernetes Tutorial",
    description: "Container orchestration tutorial",
    url: "https://kubernetes.io/docs/tutorials/",
    category: "devops",
    type: "tutorial",
    difficulty: "intermediate",
    tags: ["docker", "kubernetes", "devops"]
  },
  {
    title: "SQL Query Tutorial",
    description: "Master SQL queries and optimization",
    url: "https://www.w3schools.com/sql/",
    category: "data-structures",
    type: "tutorial",
    difficulty: "beginner",
    tags: ["sql", "database", "queries"]
  },
  {
    title: "REST API Design Best Practices",
    description: "Design scalable and maintainable APIs",
    url: "https://restfulapi.net/",
    category: "backend",
    type: "tutorial",
    difficulty: "intermediate",
    tags: ["api", "rest", "backend"]
  },
  {
    title: "React Tutorial",
    description: "Official React tutorial",
    url: "https://react.dev/learn/tutorial-tic-tac-toe",
    category: "frontend",
    type: "tutorial",
    difficulty: "beginner",
    tags: ["react", "frontend", "tutorial"]
  },
  {
    title: "CSS Tutorial",
    description: "Complete CSS tutorial",
    url: "https://www.w3schools.com/css/",
    category: "frontend",
    type: "tutorial",
    difficulty: "beginner",
    tags: ["css", "frontend", "styling"]
  },
  {
    title: "Technical Interview Tutorial",
    description: "Step-by-step technical interview preparation",
    url: "https://www.interviewing.io/interview-prep/",
    category: "technical",
    type: "tutorial",
    difficulty: "intermediate",
    tags: ["interview", "preparation", "technical"]
  },
  {
    title: "Behavioral Interview Tutorial",
    description: "How to prepare for behavioral interviews",
    url: "https://www.indeed.com/career-advice/interviewing/behavioral-interview-questions",
    category: "behavioral",
    type: "tutorial",
    difficulty: "beginner",
    tags: ["behavioral", "interview", "preparation"]
  },

  // Video Resources
  {
    title: "Data Structures & Algorithms Video Series",
    description: "Complete DSA course with implementations",
    url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    category: "data-structures",
    type: "video",
    difficulty: "beginner",
    tags: ["dsa", "video", "learning"]
  },
  {
    title: "System Design Interview Preparation",
    description: "Video tutorial for system design interviews",
    url: "https://www.youtube.com/watch?v=i53Gi_K3o7I",
    category: "system-design",
    type: "video",
    difficulty: "advanced",
    tags: ["system design", "interview", "video"]
  },
  {
    title: "React Complete Course",
    description: "Comprehensive React learning guide",
    url: "https://www.youtube.com/watch?v=4UZrsTqkcW4",
    category: "frontend",
    type: "video",
    difficulty: "beginner",
    tags: ["react", "frontend", "video"]
  },
  {
    title: "Advanced JavaScript Concepts",
    description: "Deep dive into JavaScript internals",
    url: "https://www.youtube.com/watch?v=2wCpkOk2uCg",
    category: "frontend",
    type: "video",
    difficulty: "advanced",
    tags: ["javascript", "advanced", "video"]
  },
  {
    title: "Microservices Architecture",
    description: "Building microservices from scratch",
    url: "https://www.youtube.com/watch?v=y8OnoxKotPQ",
    category: "system-design",
    type: "video",
    difficulty: "advanced",
    tags: ["microservices", "architecture", "video"]
  },
  {
    title: "Scalability in System Design",
    description: "How to design scalable systems",
    url: "https://www.youtube.com/watch?v=-W9F__D3oY4",
    category: "system-design",
    type: "video",
    difficulty: "advanced",
    tags: ["scalability", "system design", "video"]
  },
  {
    title: "Algorithms Explained",
    description: "Visual algorithm explanations",
    url: "https://www.youtube.com/watch?v=p-k0sxte5Ic",
    category: "algorithms",
    type: "video",
    difficulty: "intermediate",
    tags: ["algorithms", "visual", "explanation"]
  },
  {
    title: "DevOps CI/CD Pipeline",
    description: "DevOps practices and CI/CD setup",
    url: "https://www.youtube.com/watch?v=3RHS3d1b5BY",
    category: "devops",
    type: "video",
    difficulty: "intermediate",
    tags: ["devops", "ci/cd", "pipeline"]
  },
  {
    title: "Backend Development with Node.js",
    description: "Node.js backend development tutorial",
    url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    category: "backend",
    type: "video",
    difficulty: "intermediate",
    tags: ["nodejs", "backend", "tutorial"]
  },
  {
    title: "Technical Interview Practice",
    description: "Mock technical interviews with real engineers",
    url: "https://www.youtube.com/watch?v=4UZrsTqkcW4",
    category: "technical",
    type: "video",
    difficulty: "intermediate",
    tags: ["interview", "practice", "technical"]
  },
  {
    title: "Coding Interview Tips",
    description: "Essential tips for coding interviews",
    url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    category: "technical",
    type: "video",
    difficulty: "intermediate",
    tags: ["coding", "interview", "tips"]
  },
  {
    title: "Behavioral Interview Tips",
    description: "How to answer behavioral questions",
    url: "https://www.youtube.com/watch?v=7QJeY2e9FgE",
    category: "behavioral",
    type: "video",
    difficulty: "beginner",
    tags: ["behavioral", "interview", "tips"]
  },

  // Article Resources
  {
    title: "Behavioral Interview Tips",
    description: "How to ace behavioral questions",
    url: "https://www.pramp.com/",
    category: "behavioral",
    type: "article",
    difficulty: "beginner",
    tags: ["behavioral", "interview", "communication"]
  },
  {
    title: "DevOps Fundamentals",
    description: "Introduction to DevOps practices",
    url: "https://aws.amazon.com/devops/what-is-devops/",
    category: "devops",
    type: "article",
    difficulty: "intermediate",
    tags: ["devops", "ci/cd", "automation"]
  },
  {
    title: "Tech Interview Preparation Guide",
    description: "Comprehensive guide for technical interviews",
    url: "https://www.blindhq.com/",
    category: "technical",
    type: "article",
    difficulty: "intermediate",
    tags: ["interview", "preparation", "technical"]
  },
  {
    title: "Big O Notation Explained",
    description: "Understanding time and space complexity",
    url: "https://www.digitalocean.com/community/tutorials/big-o-notation",
    category: "algorithms",
    type: "article",
    difficulty: "beginner",
    tags: ["complexity", "algorithms", "big-o"]
  },
  {
    title: "Design Patterns in Software Development",
    description: "Common design patterns and their applications",
    url: "https://refactoring.guru/design-patterns",
    category: "backend",
    type: "article",
    difficulty: "intermediate",
    tags: ["design-patterns", "architecture"]
  },
  {
    title: "Data Structures Explained",
    description: "Guide to essential data structures",
    url: "https://www.geeksforgeeks.org/data-structures/",
    category: "data-structures",
    type: "article",
    difficulty: "intermediate",
    tags: ["data structures", "guide", "algorithms"]
  },
  {
    title: "SQL Data Structures",
    description: "Data structures in SQL",
    url: "https://www.w3schools.com/sql/sql_datatypes.asp",
    category: "data-structures",
    type: "article",
    difficulty: "beginner",
    tags: ["sql", "data structures", "database"]
  },
  {
    title: "Frontend Best Practices",
    description: "Modern frontend development practices",
    url: "https://web.dev/",
    category: "frontend",
    type: "article",
    difficulty: "intermediate",
    tags: ["frontend", "best practices", "web development"]
  },
  {
    title: "System Design Articles",
    description: "Articles on system design principles",
    url: "https://www.infoq.com/system-design/",
    category: "system-design",
    type: "article",
    difficulty: "advanced",
    tags: ["system design", "articles", "architecture"]
  },
  {
    title: "Technical Interview Questions",
    description: "Common technical interview questions",
    url: "https://leetcode.com/problemset/all/",
    category: "technical",
    type: "article",
    difficulty: "intermediate",
    tags: ["interview", "questions", "technical"]
  },
  {
    title: "Behavioral Interview Questions",
    description: "Common behavioral interview questions",
    url: "https://www.thebalancecareers.com/behavioral-interview-questions-2061235",
    category: "behavioral",
    type: "article",
    difficulty: "beginner",
    tags: ["behavioral", "questions", "interview"]
  },
  {
    title: "STAR Method for Behavioral Interviews",
    description: "How to use STAR method in interviews",
    url: "https://www.indeed.com/career-advice/interviewing/star-interview-method",
    category: "behavioral",
    type: "article",
    difficulty: "beginner",
    tags: ["star", "behavioral", "interview"]
  },

  // Course Resources
  {
    title: "Complete JavaScript Bootcamp",
    description: "Full-stack JavaScript course from basics to advanced",
    url: "https://www.udemy.com/course/the-complete-javascript-course/",
    category: "frontend",
    type: "course",
    difficulty: "beginner",
    tags: ["javascript", "course", "fullstack"]
  },
  {
    title: "System Design Mastery Course",
    description: "Advanced system design patterns and practices",
    url: "https://www.educative.io/courses/grokking-the-system-design-interview",
    category: "system-design",
    type: "course",
    difficulty: "advanced",
    tags: ["system-design", "course", "interview"]
  },
  {
    title: "Database Design & Optimization",
    description: "Mastering database design and query optimization",
    url: "https://www.coursera.org/learn/database-design-queries",
    category: "data-structures",
    type: "course",
    difficulty: "intermediate",
    tags: ["database", "course", "sql"]
  },
  {
    title: "DevOps Engineering Bootcamp",
    description: "Complete DevOps tools and practices",
    url: "https://www.udemy.com/course/devops-bootcamp/",
    category: "devops",
    type: "course",
    difficulty: "intermediate",
    tags: ["devops", "course", "tools"]
  },
  {
    title: "AWS DevOps Course",
    description: "DevOps with AWS",
    url: "https://www.udemy.com/course/aws-devops/",
    category: "devops",
    type: "course",
    difficulty: "intermediate",
    tags: ["aws", "devops", "course"]
  },
  {
    title: "React & Redux Complete Course",
    description: "Modern React development with state management",
    url: "https://www.udemy.com/course/react-redux/",
    category: "frontend",
    type: "course",
    difficulty: "intermediate",
    tags: ["react", "redux", "course"]
  },
  {
    title: "Behavioral Skills for Tech Interviews",
    description: "Master communication and behavioral questions",
    url: "https://www.masterclass.com/classes/how-to-succeed-at-behavioral-interviews",
    category: "behavioral",
    type: "course",
    difficulty: "beginner",
    tags: ["behavioral", "course", "communication"]
  },
  {
    title: "Algorithms and Data Structures Course",
    description: "Comprehensive algorithms and data structures course",
    url: "https://www.coursera.org/specializations/algorithms",
    category: "algorithms",
    type: "course",
    difficulty: "intermediate",
    tags: ["algorithms", "data structures", "course"]
  },
  {
    title: "Backend Development Course",
    description: "Full backend development with Node.js and databases",
    url: "https://www.udemy.com/course/nodejs-the-complete-guide/",
    category: "backend",
    type: "course",
    difficulty: "intermediate",
    tags: ["nodejs", "backend", "course"]
  },
  {
    title: "Python Backend Course",
    description: "Backend development with Python and Django",
    url: "https://www.udemy.com/course/python-django-the-practical-guide/",
    category: "backend",
    type: "course",
    difficulty: "intermediate",
    tags: ["python", "django", "backend"]
  },
  {
    title: "Technical Interview Preparation Course",
    description: "Complete technical interview prep course",
    url: "https://www.udemy.com/course/coding-interview-bootcamp-algorithms-and-data-structure/",
    category: "technical",
    type: "course",
    difficulty: "intermediate",
    tags: ["interview", "preparation", "technical"]
  },
];

const seedResources = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MongoDB URI missing in .env (MONGO_URI or MONGODB_URI)");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    await StudyResource.deleteMany({});
    console.log("Cleared existing resources");

    await StudyResource.insertMany(resources);
    console.log("Seeded resources successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding resources:", error);
    process.exit(1);
  }
};

seedResources();