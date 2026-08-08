export const publicNav = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Education", "#education"],
  ["Certificates", "#certificates"],
  ["Blog", "#blog"],
  ["Resume", "#resume"],
  ["Contact", "#contact"],
] as const;

export const dashboardNav = [
  ["Dashboard", "/dashboard", "⌘"],
  ["Documents", "/dashboard/documents", "▣"],
  ["Projects", "/dashboard/projects", "◇"],
  ["Certificates", "/dashboard/certificates", "◈"],
  ["Blog", "/dashboard/blog", "✎"],
  ["Notes", "/dashboard/notes", "☰"],
  ["Job Applications", "/dashboard/jobs", "◎"],
  ["Coding Tracker", "/dashboard/coding", "{}"],
  ["Learning", "/dashboard/learning", "↗"],
  ["Goals", "/dashboard/goals", "●"],
  ["Expenses", "/dashboard/expenses", "₹"],
  ["Calendar", "/dashboard/calendar", "◷"],
  ["Settings", "/dashboard/settings", "⚙"],
] as const;

export const skillGroups = [
  { title: "Programming", skills: ["Java", "Python", "JavaScript"] },
  { title: "Backend", skills: ["Spring Boot", "REST APIs", "Spring Security", "JWT", "JPA / Hibernate"] },
  { title: "Database", skills: ["MySQL", "MongoDB"] },
  { title: "Frontend", skills: ["HTML", "CSS", "JavaScript", "React"] },
  { title: "Tools", skills: ["Git", "GitHub", "Postman", "IntelliJ IDEA", "VS Code"] },
  { title: "Other", skills: ["DSA", "OOP", "SQL", "API Development"] },
];

export const documentFolders = ["Resume", "Certificates", "College", "Projects", "Learning", "Job Applications", "Personal", "Other"];
export const noteCategories = ["Java", "SQL", "DSA", "Spring Boot", "Interview", "Personal", "Ideas"];
export const jobStatuses = ["Applied", "Assessment", "Technical Interview", "HR Interview", "Offer", "Rejected"];
export const codingPlatforms = ["LeetCode", "HackerRank", "CodeChef", "Other"];
export const codingDifficulties = ["Easy", "Medium", "Hard"];
export const learningTopicsSeed = ["Java", "Spring Boot", "SQL", "DSA", "JavaScript", "React", "Git/GitHub", "System Design", "AWS"];
export const expenseCategories = ["Food", "Travel", "Rent", "Education", "Shopping", "Other"];
export const eventTypes = ["Interview", "Coding Practice", "Learning", "Deadline", "Meeting", "Personal"];
