export const teamMainProjects = [
    {
        title: "Olympic Planner & Translator - UQ Project",
        note: "*UQ Server is no longer hosted. Demo can be viewed via YouTube",
        description: (
            <>
                This mobile app aims to offer a planning tool and live guide for
                the culturally and linguistically diverse international visitors
                coming to the Brisbane 2032 Olympics. It emphasizes a{" "}
                <b>culturally respectful </b>
                event planning experience, utilizing <b>
                    speech translation
                </b>{" "}
                and
                <b> event recommendations</b> connected to a prospective AI/ML
                model.
                <br />
                <br />
                <b>Features:</b>
                <br />
                <b>Event Planning:</b> Browse through all the Olympic events and
                plan a personal schedule around the ones you are interested in.{" "}
                <br />
                <b>Speech Translation:</b> Real-time speech translation to help
                overcome language barriers. <br />
                <b>Cultural Mindfulness:</b> The app is developed with
                “internationalisation” in mind from the get-go, ensuring a
                culturally sensitive user experience.
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
                A full-featured second-hand trading platform developed using
                Next.js, TypeScript, Tailwind CSS, Prisma and Supabase.
                <br />
                <br />
                <b>Goal:</b> Build a user-centric marketplace where people can
                trade items, chat directly with sellers, and leave reviews after
                transactions.
                <br />
                <br />
                <b>Development:</b> ~2 Months, averaging 2-4 hours a day.
                <br />
                <br />
                <b>Tools and Libraries:</b>
                <br />
                Prisma was used to structure and interact with the PostgreSQL
                database. Supabase enabled authentication and real-time chatroom
                logic.
                <br />
                Tailwind CSS and Headless UI were used to create clean and
                responsive layouts. <br />
                Infinite scrolling was implemented using IntersectionObserver
                API, and form validation was handled using the zod library.
                <br />
                <br />
                ChatGPT helped with debugging build issues and optimizing
                TypeScript logic during development and increasing development
                speed.
                <br />
                <br /> Mobile Friendly
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
                TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Made for my
                tennis-group friends.
                <br />
                <br />
                <b>Goal:</b> Create a streamlined system for managing players,
                leagues, and availability tracking.
                <br />
                <br />
                <b>Development:</b> ~3-4 weeks, averaging 2–4 hours a day.
                <br />
                <br />
                <b>Tools and Libraries:</b>
                <br />
                Prisma was used to design and manage the PostgreSQL database
                schema and queries.
                <br />
                NextAuth.js handled authentication, while Tailwind CSS was used
                to create responsive and visually clean layouts.
                <br />
                Form validation was managed using the zod library.
                <br />
                Deployment was done on Vercel, ensuring fast builds and easy
                integration with serverless functions.
                <br />
                <br />
                ChatGPT assisted with debugging Prisma queries, optimizing
                TypeScript logic, and improving UI/UX responsiveness during
                development.
                <br />
                <br /> Fully Mobile Friendly
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
        sampleImg: `/tennis-league.png`,
        githubLink: "https://github.com/danielhc0228/my-tennis-app",
        demoLink: "https://htp-league.vercel.app/",
    },

    {
        title: "HojinFlix",
        description: (
            <>
                A personal project that was developed using React, TypeScript
                and Framer Motion Library, named after my Korean name.
                <br />
                <br />
                <b>Goal:</b> Create a Movie Streaming website that works like a
                famous movie streaming service, Netflix.
                <br />
                <br />
                <b>Development:</b> 3 Weeks, approximately 1-4 hours a day.
                <br />
                <br />
                <b>Tools and Libraries:</b>
                <br />
                The show informations are loaded from the API data that was
                provided by TMDB database. <br />
                Framer Motion library has allowed the website to use modal,
                slider components, scroll effect, smooth animations and etc to
                be developed easily.
                <br />
                <br />
                ChatGPT was used for many parts of CSS which shortened its
                development time to a large extent.
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
                A personal project that was developed using React, TypeScript
                and Firebase backend, named after my Korean name initial.
                <br />
                <br />
                <b>Goal:</b>Create a social networking service platform that
                works similar to famous platform, X, former called Twitter.
                <br />
                <br />
                <b>Development:</b> 8 days, 1-2 hours a day.
                <br />
                <br />
                <b>Features:</b>
                <br />
                • Uploading posts and images,
                <br />
                • Set up profile page and change profile image,
                <br />
                • Edit and delete posts
                <br />
                <br />
                <b>Description:</b>
                <br />
                I have no backend experience but Firebase has done majority of
                the backend work for me. Although, Firebase no longer provides
                "Storage" feature so I couldn't store images there, instead, I
                changed the image into base64 format and stored it in the
                Firebase database and load that value to display images.
                <br />
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
