import { motion } from "framer-motion";
import styled from "styled-components";
import { FaGithub } from "react-icons/fa";
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
        }),
    ),
    ...mainProjects.map(
        ({ title, summary, tags, sampleImg, githubLink, demoLink }) => ({
            title,
            description: summary,
            tags,
            sampleImg,
            githubLink,
            demoLink,
        }),
    ),
    ...subProjects,
];

/* Height and fading are owned by the swap area in Me.tsx, so this is a plain
   block — animating height here too would fight it. */
const Wrapper = styled.div`
    width: 100%;
    background: #0d0d0d;
`;

/* Generous padding gives the panel's outer glow room to fade before SwapArea's
   `overflow: hidden` clips it. */
const Inner = styled.div`
    max-width: 1180px;
    margin: 0 auto;
    padding: 26px 26px 70px;
`;

/* The container the skill's own colour outlines. */
const Panel = styled(motion.section)<{ $glow: string }>`
    --glow: ${(props) => props.$glow};
    position: relative;
    display: grid;
    grid-template-columns: minmax(190px, 230px) minmax(0, 1fr);
    gap: clamp(20px, 3vw, 40px);
    padding: clamp(22px, 3vw, 36px);
    border-radius: 28px;
    border: 1px solid rgba(var(--glow), 0.45);
    background:
        radial-gradient(
            120% 100% at 0% 0%,
            rgba(var(--glow), 0.1),
            transparent 60%
        ),
        #101015;
    box-shadow:
        0 0 60px rgba(var(--glow), 0.14),
        inset 0 0 60px rgba(var(--glow), 0.05);

    @media (max-width: 860px) {
        grid-template-columns: minmax(0, 1fr);
    }
`;

const Aside = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    padding-right: clamp(16px, 2vw, 28px);
    border-right: 1px solid rgba(var(--glow), 0.22);

    @media (max-width: 860px) {
        padding: 0 0 22px;
        border-right: none;
        border-bottom: 1px solid rgba(var(--glow), 0.22);
    }
`;

const halo = `radial-gradient(
    circle,
    rgba(var(--glow), 0.4),
    rgba(var(--glow), 0.08) 50%,
    transparent 72%
)`;

const BigOrb = styled(motion.div)`
    position: relative;
    display: grid;
    place-items: center;
    width: 128px;
    height: 128px;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: ${halo};
    }
`;

const BigIcon = styled.img`
    width: 76px;
    height: 76px;
    position: relative;
    filter: drop-shadow(0 0 14px rgba(var(--glow), 0.75));
`;

const SkillName = styled.h2`
    margin: 0;
    font-size: 1.35rem;
    font-weight: 700;
    color: white;
    line-height: 1.2;
`;

const CountBadge = styled.span`
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    color: rgb(var(--glow));
    background: rgba(var(--glow), 0.12);
    border: 1px solid rgba(var(--glow), 0.3);
`;

const Main = styled(motion.div)`
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
    gap: 16px;
`;

const ProjectCard = styled(motion.article)`
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition:
        transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.3s ease,
        box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        border-color: rgba(var(--glow), 0.5);
        box-shadow: 0 0 26px rgba(var(--glow), 0.18);
    }

    @media (prefers-reduced-motion: reduce) {
        &:hover {
            transform: none;
        }
    }
`;

const Thumb = styled.div`
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: linear-gradient(
        140deg,
        rgba(var(--glow), 0.3),
        rgba(var(--glow), 0.04)
    );

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        display: block;
        transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }

    ${ProjectCard}:hover & img {
        transform: scale(1.07);
    }
`;

const ThumbFallback = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    font-size: 2.4rem;
    font-weight: 800;
    color: rgba(var(--glow), 0.8);
`;

const CardBody = styled.div`
    padding: 13px 14px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
`;

const CardTitle = styled.h3`
    margin: 0;
    font-size: 0.93rem;
    font-weight: 600;
    color: white;
    line-height: 1.3;
`;

const CardText = styled.p`
    margin: 0;
    font-size: 0.76rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.55);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const TagRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: auto;
`;

/* The tag that caused this project to be listed is lit in the skill colour;
   the rest stay muted, so the match is self-explanatory. */
const Tag = styled.span<{ $match: boolean }>`
    font-size: 0.64rem;
    padding: 3px 8px;
    border-radius: 999px;
    white-space: nowrap;
    ${(props) =>
        props.$match
            ? `
        color: rgb(var(--glow));
        background: rgba(var(--glow), 0.15);
        border: 1px solid rgba(var(--glow), 0.4);
    `
            : `
        color: rgba(255, 255, 255, 0.45);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
    `}
`;

const LinkRow = styled.div`
    display: flex;
    gap: 8px;
    padding-top: 2px;
`;

const LinkButton = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 6px 11px;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.12);
    transition:
        background 0.25s ease,
        color 0.25s ease,
        border-color 0.25s ease;

    &:hover {
        color: #0d0d0d;
        background: rgb(var(--glow));
        border-color: transparent;
    }
`;

/* Labelled rather than a bare ✕: with the skill grid hidden, this is the only
   way back to it, so it needs to say so. */
const BackButton = styled.button`
    position: absolute;
    top: 14px;
    right: 14px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition:
        background 0.25s ease,
        color 0.25s ease,
        border-color 0.25s ease;

    &:hover {
        background: rgba(var(--glow), 0.9);
        color: #0d0d0d;
        border-color: transparent;
    }
`;

const EmptyMessage = styled.p`
    margin: 0;
    padding: 32px 20px;
    text-align: center;
    border-radius: 16px;
    border: 1px dashed rgba(var(--glow), 0.3);
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.9rem;
`;

type SkillProjectsProps = {
    skill: string;
    icon: string;
    glow: string;
    onClose: () => void;
};

export default function SkillProjects({
    skill,
    icon,
    glow,
    onClose,
}: SkillProjectsProps) {
    const filtered = allProjects.filter((project) =>
        project.tags.some((tag) => tag.toLowerCase() === skill.toLowerCase()),
    );

    return (
        <Wrapper>
            <Inner>
                <Panel
                    $glow={glow}
                    aria-label={`Projects using ${skill}`}
                    initial={{ scale: 0.97 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                    <BackButton
                        onClick={onClose}
                        aria-label='Back to all skills'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={2.2}
                            stroke='currentColor'
                            width='13'
                            height='13'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M15.75 19.5 8.25 12l7.5-7.5'
                            />
                        </svg>
                        All skills
                    </BackButton>

                    {/* Icon settles into the left column, projects into the
                        right — the two halves converge as the panel opens. */}
                    <Aside
                        initial={{ opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.45,
                            delay: 0.08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <BigOrb
                            initial={{ scale: 0.5, rotate: -14 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 220,
                                damping: 16,
                                delay: 0.12,
                            }}
                        >
                            <BigIcon src={icon} alt={skill} />
                        </BigOrb>
                        <SkillName>{skill}</SkillName>
                        <CountBadge>
                            {filtered.length}{" "}
                            {filtered.length === 1 ? "project" : "projects"}
                        </CountBadge>
                    </Aside>

                    <Main
                        initial={{ opacity: 0, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.45,
                            delay: 0.16,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {filtered.length > 0 ? (
                            <Grid>
                                {filtered.map((project, idx) => (
                                    <ProjectCard
                                        key={project.title}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.35,
                                            delay: 0.22 + idx * 0.05,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        <Thumb>
                                            {project.sampleImg ? (
                                                <img
                                                    src={project.sampleImg}
                                                    alt={project.title}
                                                    loading='lazy'
                                                />
                                            ) : (
                                                <ThumbFallback>
                                                    {project.title.charAt(0)}
                                                </ThumbFallback>
                                            )}
                                        </Thumb>
                                        <CardBody>
                                            <CardTitle>
                                                {project.title}
                                            </CardTitle>
                                            <CardText>
                                                {project.description}
                                            </CardText>
                                            <TagRow>
                                                {project.tags
                                                    .slice(0, 4)
                                                    .map((tag) => (
                                                        <Tag
                                                            key={tag}
                                                            $match={
                                                                tag.toLowerCase() ===
                                                                skill.toLowerCase()
                                                            }
                                                        >
                                                            {tag}
                                                        </Tag>
                                                    ))}
                                            </TagRow>
                                            <LinkRow>
                                                <LinkButton
                                                    href={project.githubLink}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    <FaGithub size={12} />
                                                    Code
                                                </LinkButton>
                                                <LinkButton
                                                    href={project.demoLink}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    Demo
                                                </LinkButton>
                                            </LinkRow>
                                        </CardBody>
                                    </ProjectCard>
                                ))}
                            </Grid>
                        ) : (
                            <EmptyMessage>
                                No projects tagged with {skill} yet — check back
                                soon!
                            </EmptyMessage>
                        )}
                    </Main>
                </Panel>
            </Inner>
        </Wrapper>
    );
}
