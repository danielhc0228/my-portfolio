import styled from "styled-components";
import Card from "./Card";
import { AnimatePresence, motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";

const Container = styled.div`
    min-height: 100vh;
    margin: auto;
    width: 80%;
    color: white;
`;

const Title = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    color: white;
    margin-bottom: 12px;
`;

const SubProjects = styled.div`
    min-height: 50vh;
`;

const AllSubProjects = styled.div`
    min-height: 50vh;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 30px;
`;

const SemiTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 20px;
`;

const MainProject = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    padding-bottom: 100px;
`;

const MainProjectTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
`;

const MainProjectImg = styled(motion.img)`
    max-height: 80vh;
    border-radius: 5%;
`;

const MainProjectDescription = styled.div`
    margin-bottom: 20px;
    width: 80%;

    b,
    strong {
        font-weight: bold;
    }
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
`;

const Tag = styled.span`
    background-color: #eee;
    color: #333;
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 12px;
`;

const Link = styled.a`
    color: white;
    transition: color 0.3s ease-in-out;
    padding-right: 10px;

    &:hover {
        color: #ff4500; /* Netflix-like red */
    }
`;

const Notes = styled.h2`
    color: tomato;
    font-size: 15px;
    margin-bottom: 10px;
`;

const Slider = styled.div`
    position: relative;
`;
const Row = styled(motion.div)`
    display: flex;
    justify-content: center;
    gap: 20px;
    position: absolute;
    width: 100%;
    z-index: 1;
`;

const SliderBtnLeft = styled.div`
    width: 50px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%; /* Makes it a circle */
    position: absolute;
    left: 10px; /* Adjust for positioning */
    top: 195px;
    transform: translateY(-50%);
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
        transform: translateY(-50%) scale(1.1); /* Slight scale effect */
    }

    &:active {
        transform: translateY(-50%) scale(0.9); /* Shrinks when clicked */
    }
`;

const SliderBtnRight = styled(SliderBtnLeft)`
    right: 0;
    left: auto;
`;

const ToggleButton = styled.button`
    background-color: transparent;
    color: white;
    border: 1px solid white;
    padding: 10px 24px;
    margin-bottom: 20px;
    border-radius: 30px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease-in-out;
    letter-spacing: 0.5px;

    &:hover {
        background-color: white;
        color: black;
        transform: translateY(-2px);
    }

    &:active {
        transform: scale(0.97);
    }
`;

const logoVariants = {
    normal: {
        opacity: 1,
        y: 0, // for translateY
    },
    active: {
        opacity: [1, 0.5, 1],
        y: [0, -20, 0], // replicating transform: translateY(-20px)
        transition: {
            repeat: Infinity,
            duration: 1.5,
        },
    },
};

const getRowVariants = {
    hidden: (custom: number) => ({
        x: custom === 1 ? window.outerWidth - 5 : -window.outerWidth + 5,
    }),
    visible: {
        x: 0,
    },
    exit: (custom: number) => ({
        x: custom === 1 ? -window.outerWidth + 5 : window.outerWidth - 5,
    }),
};

export default function Projects() {
    const [leaving, setLeaving] = useState(false);
    const [index, setIndex] = useState(0);
    const [rowState, setRowState] = useState(1);
    const [isSeeAll, setSeeAll] = useState(false);

    const teamMainProjects = [
        {
            title: "Olympic Planner & Translator - UQ Project",
            note: "*UQ Server is no longer hosted. Demo can be viewed via YouTube",
            description: (
                <>
                    This mobile app aims to offer a planning tool and live guide
                    for the culturally and linguistically diverse international
                    visitors coming to the Brisbane 2032 Olympics. It emphasizes
                    a <b>culturally respectful </b>
                    event planning experience, utilizing{" "}
                    <b>speech translation</b> and
                    <b> event recommendations</b> connected to a prospective
                    AI/ML model.
                    <br />
                    <br />
                    <b>Features:</b>
                    <br />
                    <b>Event Planning:</b> Browse through all the Olympic events
                    and plan a personal schedule around the ones you are
                    interested in. <br />
                    <b>Speech Translation:</b> Real-time speech translation to
                    help overcome language barriers. <br />
                    <b>Cultural Mindfulness:</b> The app is developed with
                    “internationalisation” in mind from the get-go, ensuring a
                    culturally sensitive user experience.
                </>
            ),

            tags: ["JavaScript", "HTML", "CSS"],
            sampleImg: `src/components/Images/uq-project.png`,
            githubLink:
                "https://github.com/danielhc0228/UQ-CompSci-Project-Olympic-App-FrontEnd",
            demoLink: "https://youtu.be/IL9nFx0_cxk",
        },
    ];

    const mainProjects = [
        {
            title: "Netflix Clone",
            description: (
                <>
                    A personal project that was developed using React,
                    TypeScript and Framer Motion Library.
                    <br />
                    The goal was to clone the main home page and search function
                    of the actual Netflix website.
                    <br />
                    The development took about 3 weeks spending about 1 to 4
                    hours a day excluding weekends.
                    <br />
                    The show informations are loaded from the API data that was
                    provided by TMDB database. <br />
                    Framer Motion library has allowed the website to use modal,
                    slider components, scroll effect, smooth animations and etc
                    to be developed easily.
                    <br />
                    <br />
                    ChatGPT was used for many parts of CSS which shortened its
                    development time to a large extent.
                </>
            ),
            tags: ["TypeScript", "React", "HTML"],
            sampleImg: `src/components/Images/netflix.png`,
            githubLink: "https://github.com/danielhc0228/netflix-clone",
            demoLink: "https://hojinflix.netlify.app/",
        },
        {
            title: "Twitter Clone",
            description: (
                <>
                    A personal project that was developed using React,
                    TypeScript and Firebase backend.
                    <br />
                    The goal was to clone the main feature of X, which was used
                    to be called Twitter.
                    <br />
                    <br />
                    <b>Features:</b>
                    <br />
                    <b>Tweeting posts and images:</b>
                    <br />
                    <b>profile page and change profile image.:</b>
                    <br />
                    <b>
                        Edit and delete posts but only the user who posted are
                        able to.
                    </b>
                    <br />
                    <br />
                    The development took about a week spending about 1 to 2
                    hours a day.
                    <br />
                    I have no backend experience but Firebase has done majority
                    of the backend work for me. Although, Firebase no longer
                    provides "Storage" feature so I couldn't store images there,
                    instead, I changed the image into base64 format and stored
                    it in the Firebase database and load that value to display
                    images.
                    <br />
                </>
            ),
            tags: ["TypeScript", "React", "Firebase", "HTML"],
            sampleImg: `src/components/Images/twitter.png`,
            githubLink: "https://github.com/danielhc0228/twitter-clone",
            demoLink: "https://twitter-clone-15a8b.web.app/",
        },
    ];

    const subProjects = [
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

    const toggleLeaving = () => {
        setLeaving((prev) => !prev);
    };

    const offset = 4;

    const incraseIndex = () => {
        if (leaving) return;

        if (subProjects) {
            const maxIndex = Math.ceil(subProjects.length / offset) - 1;
            toggleLeaving();
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
            setRowState(1);
        }
    };

    const decreaseIndex = () => {
        if (leaving) return;

        if (subProjects) {
            const maxIndex = Math.ceil(subProjects.length / offset) - 1;
            toggleLeaving();
            setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
            setRowState(-1);
        }
    };

    const toggleSeeAll = () => {
        setSeeAll(!isSeeAll);
    };

    return (
        <Container>
            <Title>Projects</Title>
            <SemiTitle>Team Projects</SemiTitle>
            {teamMainProjects.map((project, idx) => (
                <MainProject key={idx}>
                    <div>
                        <MainProjectTitle>{project.title}</MainProjectTitle>
                        <Notes>{project.note}</Notes>
                        <MainProjectDescription>
                            {project.description}
                        </MainProjectDescription>
                        <TagContainer>
                            {project.tags.map((tag, idx) => (
                                <Tag key={idx}>{tag}</Tag>
                            ))}
                        </TagContainer>
                        <Link
                            href={project.githubLink}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <FaGithub size={20} />
                        </Link>
                        <Link
                            href={project.githubLink}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                width='20'
                                height='20'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244'
                                />
                            </svg>
                        </Link>
                    </div>

                    <MainProjectImg
                        src={project.sampleImg}
                        variants={logoVariants}
                        whileHover='active'
                        animate='normal'
                    />
                </MainProject>
            ))}

            <SemiTitle>Personal Projects</SemiTitle>
            {mainProjects.map((project, idx) => (
                <MainProject key={idx}>
                    <div>
                        <MainProjectTitle>{project.title}</MainProjectTitle>
                        <MainProjectDescription>
                            {project.description}
                        </MainProjectDescription>
                        <TagContainer>
                            {project.tags.map((tag, idx) => (
                                <Tag key={idx}>{tag}</Tag>
                            ))}
                        </TagContainer>
                        <Link
                            href={project.githubLink}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <FaGithub size={20} />
                        </Link>
                        <Link
                            href={project.githubLink}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                width='20'
                                height='20'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244'
                                />
                            </svg>
                        </Link>
                    </div>

                    <MainProjectImg
                        src={project.sampleImg}
                        variants={logoVariants}
                        whileHover='active'
                        animate='normal'
                    />
                </MainProject>
            ))}
            <SemiTitle>Personal Sub Projects</SemiTitle>
            <SubProjects>
                <Slider>
                    <SliderBtnLeft onClick={() => decreaseIndex()}>
                        <p>{"<"}</p>
                    </SliderBtnLeft>
                    <AnimatePresence
                        initial={false}
                        onExitComplete={toggleLeaving}
                    >
                        {[index].map((i) => (
                            <Row
                                key={i}
                                variants={getRowVariants}
                                initial='hidden'
                                animate='visible'
                                exit='exit'
                                custom={rowState}
                                transition={{
                                    type: "tween",
                                    duration: 1.5,
                                }}
                            >
                                {subProjects
                                    .slice(offset * i, offset * i + offset)
                                    .map((project, idx) => (
                                        <Card
                                            key={idx}
                                            title={project.title}
                                            description={project.description}
                                            tags={project.tags}
                                            gitLink={project.githubLink}
                                            demoLink={project.demoLink}
                                        />
                                    ))}
                            </Row>
                        ))}
                    </AnimatePresence>

                    <SliderBtnRight onClick={() => incraseIndex()}>
                        <p>{">"}</p>
                    </SliderBtnRight>
                </Slider>
            </SubProjects>
            {isSeeAll ? (
                <ToggleButton onClick={toggleSeeAll}>Collapse</ToggleButton>
            ) : (
                <ToggleButton onClick={toggleSeeAll}>See All</ToggleButton>
            )}
            {isSeeAll ? (
                <AllSubProjects>
                    {subProjects.map((project, idx) => (
                        <Card
                            key={idx}
                            title={project.title}
                            description={project.description}
                            tags={project.tags}
                            gitLink={project.githubLink}
                            demoLink={project.demoLink}
                        />
                    ))}
                </AllSubProjects>
            ) : null}
        </Container>
    );
}
