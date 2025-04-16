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

        tags: ["JavaScript", "HTML", "CSS"],
        sampleImg: `/uq-project.png`,
        githubLink:
            "https://github.com/danielhc0228/UQ-CompSci-Project-Olympic-App-FrontEnd",
        demoLink: "https://youtu.be/IL9nFx0_cxk",
    },
];

export const mainProjects = [
    {
        title: "Netflix Clone",
        description: (
            <>
                A personal project that was developed using React, TypeScript
                and Framer Motion Library.
                <br />
                The goal was to clone the main home page and search function of
                the actual Netflix website.
                <br />
                The development took about 3 weeks spending about 1 to 4 hours a
                day excluding weekends.
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
        tags: ["TypeScript", "React", "HTML"],
        sampleImg: `/netflix.png`,
        githubLink: "https://github.com/danielhc0228/netflix-clone",
        demoLink: "https://hojinflix.netlify.app/",
    },
    {
        title: "Twitter Clone",
        description: (
            <>
                A personal project that was developed using React, TypeScript
                and Firebase backend.
                <br />
                The goal was to clone the main feature of X, which was used to
                be called Twitter.
                <br />
                <br />
                <b>Features:</b>
                <br />
                <b>Tweeting posts and images:</b>
                <br />
                <b>profile page and change profile image.:</b>
                <br />
                <b>
                    Edit and delete posts but only the user who posted are able
                    to.
                </b>
                <br />
                <br />
                The development took about a week spending about 1 to 2 hours a
                day.
                <br />
                I have no backend experience but Firebase has done majority of
                the backend work for me. Although, Firebase no longer provides
                "Storage" feature so I couldn't store images there, instead, I
                changed the image into base64 format and stored it in the
                Firebase database and load that value to display images.
                <br />
            </>
        ),
        tags: ["TypeScript", "React", "Firebase", "HTML"],
        sampleImg: `/twitter.png`,
        githubLink: "https://github.com/danielhc0228/twitter-clone",
        demoLink: "https://twitter-clone-15a8b.web.app/",
    },
];

export const subProjects = [
    {
        title: "Trello Clone",
        description:
            "Trello Clone built using React and hello-pangea/dnd library. Users can create boards and cards for various purposes like todo-list etc.",
        tags: ["Typescript", "React", "HTML"],
        githubLink: "https://github.com/danielhc0228/trello-clone",
        demoLink: "https://trello-clone-dc.netlify.app/",
    },
    {
        title: "My Portfolio",
        description:
            "My portfolio website built using all my current skills such as React, TypeScript, and libraries like Framer Motion, styled-component, hello-pangea/dnd.",
        tags: ["TypeScript", "React", "HTML"],
        githubLink: "https://github.com/danielhc0228/my-portfolio",
        demoLink: "/",
    },
    {
        title: "Weather App",
        description:
            "Live weather updates using Weatherbit.io API. Backend written by ChatGPT and its server running by Render.",
        tags: ["JavaScript", "React", "HTML", "CSS"],
        githubLink: "https://github.com/danielhc0228/Weather-App-Frontend",
        demoLink: "https://weatherappdchung.netlify.app/",
    },
    {
        title: "Todo App",
        description:
            "A website that allows users to create and orgainise their own todo-list.",
        tags: ["TypeScript", "JavaScript", "HTML", "React"],
        githubLink: "https://github.com/danielhc0228/todo-app",
        demoLink: "https://todo-app-dc.netlify.app/",
    },
    {
        title: "Crypto Tracker",
        description:
            "A website that shows live crypto coin currencies such as Bitcoin using API.",
        tags: ["TypeScript", "React", "HTML"],
        githubLink: "https://github.com/danielhc0228/crypto-tracker",
        demoLink: "https://danielhc0228.github.io/crypto-tracker/",
    },
    {
        title: "Wordle Game",
        description:
            "A Wordle Game website built from watching YouTube. JavaScript, HTML and CSS were used.",
        tags: ["JavaScript", "React", "HTML", "CSS"],
        githubLink: "https://github.com/danielhc0228/Wordle-Game",
        demoLink: "https://wordlebydchung.netlify.app/",
    },
];
