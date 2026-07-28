import { motion } from "framer-motion";
import styled from "styled-components";
import Card from "./Card";
import { teamMainProjects, mainProjects, subProjects } from "../project-list";

type FlatProject = {
    title: string;
    description: string;
    tags: string[];
    sampleImg?: string;
    githubLink: string;
    demoLink: string;
};

const allProjects: FlatProject[] = [
    ...teamMainProjects.map(
        ({ title, summary, tags, sampleImg, githubLink, demoLink }) => ({
            title,
            description: summary,
            tags,
            sampleImg,
            githubLink,
            demoLink,
        })
    ),
    ...mainProjects.map(
        ({ title, summary, tags, sampleImg, githubLink, demoLink }) => ({
            title,
            description: summary,
            tags,
            sampleImg,
            githubLink,
            demoLink,
        })
    ),
    ...subProjects,
];

const Wrapper = styled(motion.div)`
    width: 100%;
    background: #0d0d0d;
    overflow: hidden;
`;

const Inner = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 10px 20px 60px;
`;

const Title = styled.h2`
    font-size: 1.3rem;
    font-weight: bold;
    color: white;
    text-align: center;
    margin-bottom: 24px;
`;

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
`;

const EmptyMessage = styled.p`
    text-align: center;
    color: #aaa;
    font-size: 0.95rem;
`;

type SkillProjectsProps = {
    skill: string;
};

export default function SkillProjects({ skill }: SkillProjectsProps) {
    const filtered = allProjects.filter((project) =>
        project.tags.some((tag) => tag.toLowerCase() === skill.toLowerCase())
    );

    return (
        <Wrapper
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <Inner>
                <Title>Projects using {skill}</Title>
                {filtered.length > 0 ? (
                    <Grid>
                        {filtered.map((project) => (
                            <Card
                                key={project.title}
                                title={project.title}
                                description={project.description}
                                tags={project.tags}
                                sampleImg={project.sampleImg}
                                gitLink={project.githubLink}
                                demoLink={project.demoLink}
                            />
                        ))}
                    </Grid>
                ) : (
                    <EmptyMessage>
                        No projects tagged with {skill} yet — check back soon!
                    </EmptyMessage>
                )}
            </Inner>
        </Wrapper>
    );
}
