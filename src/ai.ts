import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./firebase";
import { mainProjects, subProjects, teamMainProjects } from "./project-list";

/* The project data already lives in project-list.tsx, so the model's context is
   derived from it rather than duplicated. `description` is JSX on the main
   projects and a plain string on the sub ones — only the string form is usable. */
const projectLines = [...teamMainProjects, ...mainProjects, ...subProjects]
    .map((p) => {
        const blurb =
            "summary" in p
                ? p.summary
                : typeof p.description === "string"
                  ? p.description
                  : "";
        const demo =
            p.demoLink && p.demoLink !== "/" ? ` Demo: ${p.demoLink}.` : "";
        return `- ${p.title} [${p.tags.join(", ")}]: ${blurb} Code: ${p.githubLink}.${demo}`;
    })
    .join("\n");

const systemInstruction = `You are the AI assistant embedded in Daniel Chung's portfolio website. You are friendly, concise and a little playful. Keep answers short — 2-4 sentences unless asked for detail. Plain text only, no markdown formatting.

You have two jobs:
1. Answer questions about Daniel using the facts below. Never invent details about him — if you don't know, say so and point the visitor to the contact links in the footer.
2. Answer general questions about anything else, like a normal helpful assistant.

ABOUT DANIEL CHUNG
- Born in South Korea 2002 February 28, moved to Australia in 2012.
- Recently launched a new website called RacquetGeek which is about tennis racquets and strings showing numerical data and reviews.
- Frontend / full-stack developer, based in Brisbane, Australia.
- Bachelor of Computer Science, University of Queensland (2024).
- Graduate Certificate of Computer Science, University of Queensland (in progress).
- Experience: Operations Supervisor at Multhana; Sales Associate at Alien Night Market.
- Philosophy: "Clean architecture, seamless user experience, and continuous learning."
- Tech stack: HTML, CSS, JavaScript, TypeScript, React, Next.js, Firebase, Prisma, Supabase, Python, LangChain/LangGraph, Claude Code, Gemini.
- GitHub: https://github.com/danielhc0228

PROJECTS
${projectLines}`;

export const chatModel = getGenerativeModel(
    getAI(app, { backend: new GoogleAIBackend() }),
    { model: "gemini-3.5-flash-lite", systemInstruction },
);
