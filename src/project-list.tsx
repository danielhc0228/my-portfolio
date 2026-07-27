export const teamMainProjects = [
    {
        title: "Olympic Planner & Translator - UQ Project",
        note: "*Live server decommissioned post-graduation; demo available via YouTube walkthrough.",
        summary:
            "Cross-cultural Olympic event planner with real-time speech translation, built in a university team.",
        description: (
            <>
                Collaborated in a university team to design and build a
                cross-cultural event-planning mobile app for international
                visitors to the Brisbane 2032 Olympics.
                <br />
                <br />
                <b>Key Contributions:</b>
                <br />
                • Built event browsing and personalized schedule planning
                <br />
                • Integrated real-time speech translation to remove language
                barriers
                <br />• Designed an internationalization-first UX for a
                culturally diverse audience, with AI/ML-driven event
                recommendations
            </>
        ),

        tags: ["JavaScript", "HTML", "CSS"],
        sampleImg: `/uq-project.png`,
        githubLink:
            "https://github.com/danielhc0228/UQ-CompSci-Project-Olympic-App-FrontEnd",
        demoLink: "https://youtu.be/IL9nFx0_cxk",
    },
];

export const mainProjects = [
    {
        title: "DC-Market",
        note: "*Product image uploads are temporarily disabled pending cloud storage integration.",
        summary:
            "Full-stack second-hand marketplace with real-time chat, reviews and infinite scroll.",
        description: (
            <>
                A full-stack second-hand trading marketplace enabling users to
                list, discover and trade items, built end-to-end with Next.js,
                TypeScript, Prisma and Supabase.
                <br />
                <br />
                <b>Key Features:</b>
                <br />
                • Real-time buyer-seller chat and a post-transaction review
                system
                <br />
                • Infinite-scroll product feed with schema-validated forms (Zod)
                <br />
                • Relational database design and querying with Prisma +
                PostgreSQL
                <br />
                • Responsive, accessible UI built with Tailwind CSS and Headless
                UI
                <br />
                <br />
                Independently designed, built and shipped over ~2 months.
            </>
        ),
        tags: [
            "TypeScript",
            "React",
            "Next.js",
            "Prisma",
            "Supabase",
            "Tailwind CSS",
            "HTML",
        ],
        sampleImg: `/dc-market.png`,
        githubLink: "https://github.com/danielhc0228/DC-Market",
        demoLink: "https://dc-market.vercel.app/",
    },
    {
        title: "Tennis League Web App",
        note: "*Admin features require authentication and are not accessible in the public demo.",
        summary:
            "Full-stack tennis league manager with player, league and availability tracking.",
        description: (
            <>
                A full-stack tennis league management platform built for a local
                sports club to streamline player, league and availability
                management, using Next.js, TypeScript, Prisma and PostgreSQL.
                <br />
                <br />
                <b>Key Features:</b>
                <br />
                • Player, league and availability management system
                <br />
                • Secure authentication and role-based admin tools via
                NextAuth.js
                <br />
                • Relational schema design and query optimization with Prisma
                <br />
                • Fully responsive UI, deployed on Vercel
                <br />
                <br />
                Independently designed, built and deployed over ~3-4 weeks.
            </>
        ),
        tags: [
            "TypeScript",
            "React",
            "Next.js",
            "Prisma",
            "PostgreSQL",
            "Tailwind CSS",
            "HTML",
            "Supabase",
        ],
        sampleImg: `/htp.png`,
        githubLink: "https://github.com/danielhc0228/my-tennis-app",
        demoLink: "https://htp-league.vercel.app/",
    },

    {
        title: "HojinFlix",
        summary:
            "Netflix-inspired streaming UI with live TMDB data and Framer Motion animations.",
        description: (
            <>
                A Netflix-inspired movie streaming interface built with React,
                TypeScript and Framer Motion, showcasing complex UI animation
                and third-party API integration.
                <br />
                <br />
                <b>Key Features:</b>
                <br />
                • Live movie and show data fetched from the TMDB REST API
                <br />
                • Modal, carousel and scroll-triggered animations built with
                Framer Motion
                <br />
                • Component-driven architecture with reusable, typed UI elements
                <br />
                <br />
                Independently designed and built in ~3 weeks.
            </>
        ),
        tags: ["TypeScript", "React", "HTML", "CSS"],
        sampleImg: `/netflix.png`,
        githubLink: "https://github.com/danielhc0228/HojinFlix-Movie-Website",
        demoLink: "https://hojinflix.netlify.app/",
    },
    {
        title: "SNS Platform - 𝓗",
        summary:
            "Twitter/X-inspired social platform with posts, profiles and Firestore-backed storage.",
        description: (
            <>
                A Twitter/X-inspired social networking platform built with
                React, TypeScript and Firebase, covering the full user-generated
                content lifecycle.
                <br />
                <br />
                <b>Key Features:</b>
                <br />
                • Post creation, editing and deletion with image uploads
                <br />
                • User profile pages with customizable avatars
                <br />
                • Firestore-backed data layer, with images encoded and stored as
                base64 to work around the lack of Firebase Storage
                <br />
                <br />
                Independently designed and built in 8 days, demonstrating rapid
                full-stack delivery using Firebase as a backend-as-a-service.
            </>
        ),
        tags: ["TypeScript", "React", "Firebase", "HTML", "CSS"],
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
            "A Trello-style task board built with React and @hello-pangea/dnd, featuring drag-and-drop boards and cards for flexible task organization.",
        tags: ["HTML", "CSS", "TypeScript", "React"],
        sampleImg: `/trello.png`,
        githubLink: "https://github.com/danielhc0228/trello-clone",
        demoLink: "https://trello-clone-dc.netlify.app/",
    },
    {
        title: "My Portfolio",
        description:
            "This portfolio site itself — built with React, TypeScript, Framer Motion, styled-components and Firebase to demonstrate end-to-end frontend engineering and interaction design.",
        tags: ["HTML", "CSS", "TypeScript", "React", "Firebase"],
        sampleImg: `/portfolio.png`,
        githubLink: "https://github.com/danielhc0228/my-portfolio",
        demoLink: "/",
    },
    {
        title: "Weather App",
        description:
            "A live weather dashboard built with React, consuming the Weatherbit.io API through a custom backend deployed on Render.",
        tags: ["HTML", "CSS", "JavaScript", "React"],
        sampleImg: `/weather.png`,
        githubLink: "https://github.com/danielhc0228/Weather-App-Frontend",
        demoLink: "https://weatherappdchung.netlify.app/",
    },
    {
        title: "Todo App",
        description:
            "A task management app built with React and TypeScript for creating, organizing and tracking personal to-do lists.",
        tags: ["HTML", "CSS", "TypeScript", "JavaScript", "React"],
        sampleImg: `/todo.png`,
        githubLink: "https://github.com/danielhc0228/todo-app",
        demoLink: "https://todo-app-dc.netlify.app/",
    },
    {
        title: "Crypto Tracker",
        description:
            "A real-time cryptocurrency price tracker built with React and TypeScript, consuming a live market data API.",
        tags: ["HTML", "CSS", "TypeScript", "React"],
        sampleImg: `/crypto.png`,
        githubLink: "https://github.com/danielhc0228/crypto-tracker",
        demoLink: "https://danielhc0228.github.io/crypto-tracker/",
    },
    {
        title: "Wordle Game",
        description:
            "A browser-based Wordle clone built with JavaScript, HTML and CSS, replicating the core word-guessing game mechanics and win/loss logic.",
        tags: ["HTML", "CSS", "JavaScript", "React"],
        sampleImg: `/wordle.png`,
        githubLink: "https://github.com/danielhc0228/Wordle-Game",
        demoLink: "https://wordlebydchung.netlify.app/",
    },
];
