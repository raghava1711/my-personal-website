import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  blogPosts,
  calendarEvents,
  certificates,
  codingProblems,
  expenses,
  folders,
  goals,
  jobApplications,
  learningTopics,
  notes,
  projects,
  users,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { documentFolders, learningTopicsSeed } from "@/lib/constants";
import { slugify } from "@/lib/utils";

let seeded = false;

export async function ensureSeedData() {
  if (seeded) return;

  const adminEmail = process.env.ADMIN_EMAIL || "raghavendra@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe@123";

  const existingUsers = await db.select({ value: count() }).from(users);
  let userId: string;

  if ((existingUsers[0]?.value ?? 0) === 0) {
    const [created] = await db
      .insert(users)
      .values({
        name: "Raghavendra",
        email: adminEmail,
        passwordHash: await hashPassword(adminPassword),
        bio: "Software Engineer focused on Java backend development, REST APIs, full-stack learning, and reliable software systems.",
        githubUrl: "https://github.com/",
        linkedinUrl: "https://linkedin.com/",
        role: "owner",
      })
      .returning({ id: users.id });
    userId = created.id;
 } else {
  const [owner] = await db.select({ id: users.id }).from(users).limit(1);

  await db
    .update(users)
    .set({
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
    })
    .where(eq(users.id, owner.id));

  userId = owner.id;
}

  const existingFolders = await db.select({ value: count() }).from(folders);
  if ((existingFolders[0]?.value ?? 0) === 0) {
    await db.insert(folders).values(documentFolders.map((name) => ({ userId, name, slug: slugify(name) })));
  }

  const existingProjects = await db.select({ value: count() }).from(projects);
  if ((existingProjects[0]?.value ?? 0) === 0) {
    const sampleProjects = [
      ["Personal Portfolio & Digital Workspace", "A full-stack professional identity website with a private dashboard for documents, projects, notes, applications, learning, goals, and productivity.", "Next.js,Drizzle,PostgreSQL,Authentication"],
      ["Student Management System", "Sample academic CRUD application structure for managing students, courses, and records. Replace with your actual implementation details.", "Java,Spring Boot,MySQL,REST API"],
      ["Library Management System", "Sample library workflow project for books, borrowers, returns, and inventory operations. Update links when your repository is ready.", "Java,OOP,MySQL"],
      ["Employee Management System", "Sample HR-style project for employee records, departments, and administrative operations.", "Java,Spring Boot,JPA"],
      ["Banking Application", "Sample backend-focused banking domain project covering account, transaction, and validation flows.", "Java,Spring Boot,Security"],
      ["Online Shopping Application", "Sample ecommerce workflow project for products, carts, orders, and user-facing operations.", "Java,React,REST API"],
      ["Java Backend REST API Project", "Sample API-first backend project template for authentication, CRUD, validation, and clean API design.", "Java,Spring Boot,JWT,Postman"],
      ["Sub-6 GHz 5G Antenna Research Project", "Academic research project placeholder related to sub-6 GHz 5G antenna design and analysis. Replace with your final abstract and files.", "Research,5G,Antenna,Engineering"],
    ];
    await db.insert(projects).values(
      sampleProjects.map(([title, description, tech], index) => ({
        userId,
        title,
        slug: slugify(title),
        description,
        technologies: tech.split(","),
        githubUrl: "https://github.com/",
        liveUrl: index === 0 ? "/" : "#",
        imageUrl: "",
        featured: index < 3,
        sample: true,
      })),
    );
  }

  const existingCertificates = await db.select({ value: count() }).from(certificates);
  if ((existingCertificates[0]?.value ?? 0) === 0) {
    await db.insert(certificates).values(
      ["Java", "Python", "SQL", "Git/GitHub", "Cloud", "Other Certification"].map((name, index) => ({
        userId,
        name: `${name} Certificate`,
        issuer: "Sample issuing organization",
        issuedAt: new Date(Date.now() - index * 30 * 24 * 60 * 60 * 1000),
        certificateUrl: "#",
        imageUrl: "",
        sample: true,
      })),
    );
  }

  const existingBlogs = await db.select({ value: count() }).from(blogPosts);
  if ((existingBlogs[0]?.value ?? 0) === 0) {
    const posts = [
      ["How I Approach Java Backend Learning", "Java", "A practical roadmap placeholder for documenting backend learning, Java fundamentals, APIs, and project practice."],
      ["Spring Boot REST API Checklist", "Spring Boot", "A concise checklist placeholder for building secure and maintainable REST APIs with Spring Boot."],
      ["SQL Practice Notes for Interviews", "SQL", "A sample technical note for joins, grouping, constraints, and query practice."],
    ];
    await db.insert(blogPosts).values(
      posts.map(([title, category, excerpt]) => ({
        userId,
        title,
        slug: slugify(title),
        category,
        excerpt,
        content: `${excerpt}\n\nThis is sample content. Replace it from the private dashboard with your real article, code examples, and learning notes.`,
        thumbnailUrl: "",
        published: true,
        sample: true,
      })),
    );
  }

  const existingNotes = await db.select({ value: count() }).from(notes).where(eq(notes.userId, userId));
  if ((existingNotes[0]?.value ?? 0) === 0) {
    await db.insert(notes).values([
      { userId, title: "Spring Boot revision", category: "Spring Boot", content: "Review controllers, services, repositories, DTO validation, and exception handling.", pinned: true },
      { userId, title: "DSA practice ideas", category: "DSA", content: "Practice arrays, strings, hash maps, recursion, trees, and graph basics.", pinned: false },
    ]);
  }

  const existingJobs = await db.select({ value: count() }).from(jobApplications).where(eq(jobApplications.userId, userId));
  if ((existingJobs[0]?.value ?? 0) === 0) {
    await db.insert(jobApplications).values([
      { userId, company: "Sample Company", role: "Java Backend Developer", status: "Applied", applicationDate: new Date(), location: "Remote", jobUrl: "#", notes: "Replace sample entry with a real application." },
      { userId, company: "Interview Placeholder", role: "Software Engineer", status: "Technical Interview", applicationDate: new Date(), interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), location: "Bengaluru", jobUrl: "#", notes: "Prepare Spring Boot and SQL." },
    ]);
  }

  const existingCoding = await db.select({ value: count() }).from(codingProblems).where(eq(codingProblems.userId, userId));
  if ((existingCoding[0]?.value ?? 0) === 0) {
    await db.insert(codingProblems).values([
      { userId, platform: "LeetCode", problem: "Two Sum", difficulty: "Easy", category: "Arrays", solvedAt: new Date(), status: "Solved", notes: "Hash map pattern." },
      { userId, platform: "HackerRank", problem: "SQL Basic Select", difficulty: "Easy", category: "SQL", solvedAt: new Date(), status: "Solved", notes: "Warm-up." },
    ]);
  }

  const existingLearning = await db.select({ value: count() }).from(learningTopics).where(eq(learningTopics.userId, userId));
  if ((existingLearning[0]?.value ?? 0) === 0) {
    await db.insert(learningTopics).values(
      learningTopicsSeed.map((topic, index) => ({
        userId,
        topic,
        progress: [75, 70, 68, 55, 60, 45, 80, 25, 20][index] ?? 10,
        status: index < 3 ? "In Progress" : "Planned",
        notes: "Sample progress — update from dashboard.",
        targetDate: new Date(Date.now() + (index + 1) * 14 * 24 * 60 * 60 * 1000),
      })),
    );
  }

  const existingGoals = await db.select({ value: count() }).from(goals).where(eq(goals.userId, userId));
  if ((existingGoals[0]?.value ?? 0) === 0) {
    await db.insert(goals).values([
      { userId, title: "Become a Java Backend Developer", description: "Build strong backend projects and interview readiness.", progress: 60, deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), status: "Active" },
      { userId, title: "Master Spring Boot", description: "Security, JPA, REST APIs, testing, deployment.", progress: 70, deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), status: "Active" },
      { userId, title: "Improve DSA", description: "Consistent daily problem solving.", progress: 45, deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), status: "Active" },
    ]);
  }

  const existingExpenses = await db.select({ value: count() }).from(expenses).where(eq(expenses.userId, userId));
  if ((existingExpenses[0]?.value ?? 0) === 0) {
    await db.insert(expenses).values([
      { userId, name: "Course subscription", amount: "999", category: "Education", spentAt: new Date(), notes: "Sample expense." },
      { userId, name: "Interview travel", amount: "500", category: "Travel", spentAt: new Date(), notes: "Sample expense." },
    ]);
  }

  const existingEvents = await db.select({ value: count() }).from(calendarEvents).where(eq(calendarEvents.userId, userId));
  if ((existingEvents[0]?.value ?? 0) === 0) {
    await db.insert(calendarEvents).values([
      { userId, title: "Coding Practice", eventType: "Coding Practice", eventDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), eventTime: "19:00", description: "Arrays and strings practice." },
      { userId, title: "Mock Interview", eventType: "Interview", eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), eventTime: "10:30", description: "Spring Boot and SQL preparation." },
    ]);
  }

  seeded = true;
}
