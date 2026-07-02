export const teamMainProjects = [
    {
        title: "Olympic Planner & Translator - UQ Project",
        note: "*UQ Server is no longer hosted. Demo can be viewed via YouTube",
        description: (
            <>
                A mobile app offering event planning and live guidance for
                culturally and linguistically diverse visitors to the Brisbane
                2032 Olympics.
                <br />
                <br />
                <b>Key Features:</b>
                <br />
                • Browse Olympic events and build a personal schedule
                <br />
                • Real-time speech translation to overcome language barriers
                <br />
                • Culturally mindful UX with AI/ML-driven event recommendations
            </>
        ),

        tags: ["JavaScript", "CSS"],
        sampleImg: `/uq-project.png`,
        githubLink:
            "https://github.com/danielhc0228/UQ-CompSci-Project-Olympic-App-FrontEnd",
        demoLink: "https://youtu.be/IL9nFx0_cxk",
    },
];

export const mainProjects = [
    {
        title: "DC-Market",
        note: "*Adding Product feature is currently unavailable as no online storage has been set for this website yet. ",
        description: (
            <>
                A full-featured second-hand trading marketplace built with
                Next.js, TypeScript, Prisma and Supabase.
                <br />
                <br />
                <b>Key Features:</b>
                <br />
                • Trade items with direct buyer-seller chat and post-transaction
                reviews
                <br />
                • Infinite-scroll browsing and zod-validated forms
                <br />
                • Responsive, mobile-friendly UI with Tailwind CSS and Headless UI
                <br />
                <br />
                Built over ~2 months; ChatGPT assisted with debugging and
                TypeScript optimization.
            </>
        ),
        tags: [
            "TypeScript",
            "React",
            "Next.js",
            "Prisma",
            "Supabase",
            "Tailwind CSS",
        ],
        sampleImg: `/dc-market.png`,
        githubLink: "https://github.com/danielhc0228/DC-Market",
        demoLink: "https://dc-market.vercel.app/",
    },
    {
        title: "Tennis League Web App",
        note: "*Some admin features require authentication and are not accessible to public users.",
        description: (
            <>
                A tennis league management platform built with Next.js,
                TypeScript, Prisma and PostgreSQL, made for my tennis-group
                friends.
                <br />
                <br />
                <b>Key Features:</b>
                <br />
                • Player, league and availability tracking
                <br />
                • Authenticated admin tools via NextAuth.js
                <br />
                • Fully responsive layouts, deployed on Vercel
                <br />
                <br />
                Built over ~3-4 weeks; ChatGPT assisted with debugging Prisma
                queries and improving UI/UX.
            </>
        ),
        tags: [
            "TypeScript",
            "React",
            "Next.js",
            "Prisma",
            "PostgreSQL",
            "Tailwind CSS",
        ],
        sampleImg: `/htp.png`,
        githubLink: "https://github.com/danielhc0228/my-tennis-app",
        demoLink: "https://htp-league.vercel.app/",
    },

    {
        title: "HojinFlix",
        description: (
            <>
                A Netflix-style movie streaming site built with React,
                TypeScript and Framer Motion, named after my Korean name.
                <br />
                <br />
                <b>Key Features:</b>
                <br />
                • Live show data pulled from the TMDB API
                <br />
                • Modal, slider and scroll animations powered by Framer Motion
                <br />
                <br />
                Built in ~3 weeks; ChatGPT sped up CSS development.
            </>
        ),
        tags: ["TypeScript", "React"],
        sampleImg: `/netflix.png`,
        githubLink: "https://github.com/danielhc0228/HojinFlix-Movie-Website",
        demoLink: "https://hojinflix.netlify.app/",
    },
    {
        title: "SNS Platform - 𝓗",
        description: (
            <>
                A Twitter/X-style social networking platform built with React,
                TypeScript and Firebase, named after my Korean name initial.
                <br />
                <br />
                <b>Key Features:</b>
                <br />
                • Post creation with image uploads, editing and deletion
                <br />
                • Profile pages with custom profile images
                <br />
                • Images stored as base64 in Firestore, working around the lack
                of Firebase Storage
                <br />
                <br />
                Built in 8 days as my first backend-adjacent project.
            </>
        ),
        tags: ["TypeScript", "React", "Firebase"],
        sampleImg: `/twitter.png`,
        githubLink:
            "https://github.com/danielhc0228/Social-Network-Service-project",
        demoLink: "https://twitter-clone-15a8b.web.app/",
    },
];

export const subProjects = [
    {
        title: "Trello Clone",
        description:
            "Trello Clone built using React and hello-pangea/dnd library. Users can create boards and cards for various purposes like todo-list etc.",
        tags: ["Typescript", "React"],
        sampleImg: `/trello.png`,
        githubLink: "https://github.com/danielhc0228/trello-clone",
        demoLink: "https://trello-clone-dc.netlify.app/",
    },
    {
        title: "My Portfolio",
        description:
            "My portfolio website built using all my current skills such as React, TypeScript, and libraries like Framer Motion, styled-component, hello-pangea/dnd.",
        tags: ["TypeScript", "React", "Firebase"],
        sampleImg: `/portfolio.png`,
        githubLink: "https://github.com/danielhc0228/my-portfolio",
        demoLink: "/",
    },
    {
        title: "Weather App",
        description:
            "Live weather updates using Weatherbit.io API. Backend written by ChatGPT and its server running by Render.",
        tags: ["JavaScript", "React", "CSS"],
        sampleImg: `/weather.png`,
        githubLink: "https://github.com/danielhc0228/Weather-App-Frontend",
        demoLink: "https://weatherappdchung.netlify.app/",
    },
    {
        title: "Todo App",
        description:
            "A website that allows users to create and orgainise their own todo-list.",
        tags: ["TypeScript", "JavaScript", "React"],
        sampleImg: `/todo.png`,
        githubLink: "https://github.com/danielhc0228/todo-app",
        demoLink: "https://todo-app-dc.netlify.app/",
    },
    {
        title: "Crypto Tracker",
        description:
            "A website that shows live crypto coin currencies such as Bitcoin using API.",
        tags: ["TypeScript", "React"],
        sampleImg: `/crypto.png`,
        githubLink: "https://github.com/danielhc0228/crypto-tracker",
        demoLink: "https://danielhc0228.github.io/crypto-tracker/",
    },
    {
        title: "Wordle Game",
        description:
            "A Wordle Game website built from watching YouTube. JavaScript, HTML and CSS were used.",
        tags: ["JavaScript", "React", "CSS"],
        sampleImg: `/wordle.png`,
        githubLink: "https://github.com/danielhc0228/Wordle-Game",
        demoLink: "https://wordlebydchung.netlify.app/",
    },
];
