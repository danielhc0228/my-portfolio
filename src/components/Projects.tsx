import styled from "styled-components";
import Card from "./Card";
import { AnimatePresence, motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { subProjects, mainProjects, teamMainProjects } from "../project-list";

const Wrapper = styled.div`
    width: 100%;
    background: #0d0d0d;
`;

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
    margin-bottom: 40px;
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
`;

const SliderBtnLeft = styled.div`
    width: 50px;
    height: 50px;
    position: absolute;
    top: 170px;
    transform: translateY(-50%);
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;

    &:hover {
        transform: translateY(-55%) scale(1.1); /* Slight scale effect */
    }

    &:active {
        transform: scale(0.9); /* Shrinks when clicked */
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
        <Wrapper>
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
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='size-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M15.75 19.5 8.25 12l7.5-7.5'
                                />
                            </svg>
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
                                                description={
                                                    project.description
                                                }
                                                tags={project.tags}
                                                sampleImg={project.sampleImg}
                                                gitLink={project.githubLink}
                                                demoLink={project.demoLink}
                                            />
                                        ))}
                                </Row>
                            ))}
                        </AnimatePresence>

                        <SliderBtnRight onClick={() => incraseIndex()}>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='size-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='m8.25 4.5 7.5 7.5-7.5 7.5'
                                />
                            </svg>
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
                                sampleImg={project.sampleImg}
                                gitLink={project.githubLink}
                                demoLink={project.demoLink}
                            />
                        ))}
                    </AllSubProjects>
                ) : null}
            </Container>
        </Wrapper>
    );
}
