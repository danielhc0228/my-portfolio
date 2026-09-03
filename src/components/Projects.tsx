import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import {
    AnimatePresence,
    motion,
    useScroll,
    useTransform,
} from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { subProjects, mainProjects } from "../project-list";

type Project = {
    title: string;
    note?: string;
    summary?: string;
    description: ReactNode;
    tags: string[];
    sampleImg?: string;
    githubLink: string;
    demoLink: string;
};

/* One accent per card, as an "r, g, b" triple so it can be composed into
   rgba() at any opacity for the hover glow. */
const ACCENTS = [
    "255, 92, 122",
    "94, 214, 255",
    "255, 184, 76",
    "163, 132, 255",
    "80, 227, 168",
    "255, 128, 191",
    "120, 168, 255",
    "255, 138, 96",
    "126, 231, 255",
    "205, 180, 255",
    "142, 240, 130",
    "255, 214, 102",
];

/* Vertical scroll distance per pixel of horizontal travel. Below 1 the track
   outruns the scrollbar, which keeps the pinned section from becoming an
   absurdly tall page. */
const SCROLL_PACE = 0.7;

const Wrapper = styled.section`
    width: 100%;
    background: #0d0d0d;
    color: white;
`;

/* Tall spacer: its height is what the pinned pane consumes while the track
   slides sideways. */
const ScrollSpace = styled.div<{ $distance: number }>`
    position: relative;
    height: ${(props) =>
        props.$distance > 0
            ? `calc(100vh + ${props.$distance * SCROLL_PACE}px)`
            : "100vh"};
`;

const StickyPane = styled.div`
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
`;

const Header = styled.div`
    position: absolute;
    top: clamp(32px, 5vh, 80px);
    left: 6vw;
    right: 6vw;
    display: flex;
    align-items: baseline;
    gap: 18px;
    flex-wrap: wrap;
`;

const Title = styled.h1`
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: bold;
    margin: 0;
`;

const Hint = styled.span`
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
`;

const Track = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: clamp(20px, 3vw, 44px);
    padding: 0 6vw;
    width: max-content;
    will-change: transform;
`;

const ProgressRail = styled.div`
    position: absolute;
    left: 6vw;
    right: 6vw;
    bottom: clamp(28px, 6vh, 56px);
    height: 2px;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 2px;
    overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
    height: 100%;
    background: rgba(255, 255, 255, 0.75);
    transform-origin: 0% 50%;
`;

/* ---------- card ---------- */

/* Shell carries the glow (needs to bleed outside the rounded edge), Inner
   clips the content — hence the two elements rather than one. */
const CardShell = styled.article<{ $accent: string }>`
    --accent: ${(props) => props.$accent};
    position: relative;
    flex: 0 0 auto;
    /* Two per screen at most: 44vw + gap leaves a sliver of the third. */
    width: clamp(260px, 44vw, 640px);
    height: min(66vh, 620px);
    cursor: pointer;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);

    &::before {
        content: "";
        position: absolute;
        inset: -6px;
        border-radius: 34px;
        background: rgba(var(--accent), 0.75);
        filter: blur(26px);
        opacity: 0;
        transition: opacity 0.45s ease;
        pointer-events: none;
    }

    &:hover,
    &:focus-within {
        transform: translateY(-12px);
    }

    &:hover::before,
    &:focus-within::before {
        opacity: 0.55;
    }

    @media (max-width: 900px) {
        width: 78vw;
        height: min(70vh, 560px);
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover,
        &:focus-within {
            transform: none;
        }
    }
`;

const CardInner = styled.div`
    position: relative;
    height: 100%;
    border-radius: 28px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #121218;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition:
        border-color 0.45s ease,
        box-shadow 0.45s ease;

    ${CardShell}:hover &,
    ${CardShell}:focus-within & {
        border-color: rgba(var(--accent), 0.55);
        box-shadow: inset 0 0 60px rgba(var(--accent), 0.12);
    }
`;

/* Top half: artwork. */
const Media = styled.div`
    position: relative;
    flex: 1 1 50%;
    min-height: 0;
    overflow: hidden;
    background: linear-gradient(
        140deg,
        rgba(var(--accent), 0.35),
        rgba(var(--accent), 0.05)
    );

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        display: block;
        transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }

    ${CardShell}:hover & img {
        transform: scale(1.06);
    }

    /* Fades the screenshot into the text half so the seam isn't a hard line. */
    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            transparent 55%,
            rgba(18, 18, 24, 0.9)
        );
    }
`;

const MediaFallback = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 800;
    color: rgba(var(--accent), 0.85);
    letter-spacing: -0.04em;
`;

/* Bottom half: copy. */
const Body = styled.div`
    flex: 1 1 50%;
    min-height: 0;
    padding: clamp(18px, 2.4vw, 30px);
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const CardTitle = styled.h2`
    font-size: clamp(1.05rem, 1.7vw, 1.5rem);
    font-weight: 700;
    margin: 0;
    line-height: 1.25;
`;

const Summary = styled.p`
    margin: 0;
    font-size: clamp(0.82rem, 1vw, 0.95rem);
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.62);
    /* Keeps every card's text block the same height regardless of copy length. */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: auto;
`;

const Tag = styled.span`
    font-size: 0.68rem;
    padding: 4px 10px;
    border-radius: 999px;
    color: rgba(var(--accent), 0.95);
    background: rgba(var(--accent), 0.12);
    border: 1px solid rgba(var(--accent), 0.28);
    white-space: nowrap;
`;

const OpenCue = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(var(--accent), 0.9);
    opacity: 0.55;
    transition: opacity 0.35s ease;

    ${CardShell}:hover & {
        opacity: 1;
    }
`;

/* ---------- reduced-motion fallback ---------- */

const StaticHeader = styled.div`
    padding: 60px 6vw 0;
`;

const StaticGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
    padding: 60px 6vw 100px;

    @media (max-width: 900px) {
        grid-template-columns: minmax(0, 1fr);
    }

    ${CardShell} {
        width: 100%;
    }
`;

/* ---------- modal ---------- */

const Backdrop = styled(motion.div)`
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.78);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(16px, 4vw, 48px);
`;

const Modal = styled(motion.div)<{ $accent: string }>`
    --accent: ${(props) => props.$accent};
    position: relative;
    width: min(1040px, 100%);
    max-height: 90vh;
    overflow-y: auto;
    overscroll-behavior: contain;
    border-radius: 24px;
    background: #131319;
    border: 1px solid rgba(var(--accent), 0.4);
    box-shadow:
        0 0 40px rgba(var(--accent), 0.25),
        0 30px 80px rgba(0, 0, 0, 0.6);
    color: white;
`;

const ModalImage = styled.img`
    width: 100%;
    display: block;
    border-bottom: 1px solid rgba(var(--accent), 0.25);
`;

const ModalBody = styled.div`
    padding: clamp(22px, 3vw, 40px);
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ModalTitle = styled.h2`
    margin: 0;
    font-size: clamp(1.4rem, 3vw, 2.1rem);
    font-weight: 700;
`;

const Notes = styled.p`
    margin: 0;
    color: rgba(var(--accent), 0.9);
    font-size: 0.85rem;
`;

const Description = styled.div`
    font-size: 0.95rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.8);

    b,
    strong {
        font-weight: 700;
        color: white;
    }
`;

const LinkRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 6px;
`;

const LinkButton = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 11px 20px;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
    color: white;
    border: 1px solid rgba(var(--accent), 0.5);
    background: rgba(var(--accent), 0.12);
    transition:
        background 0.25s ease,
        transform 0.2s ease,
        color 0.25s ease;

    &:hover {
        background: rgba(var(--accent), 0.85);
        color: #0d0d0d;
        transform: translateY(-2px);
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 14px;
    right: 14px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    cursor: pointer;
    backdrop-filter: blur(4px);

    &:hover {
        background: rgba(var(--accent), 0.85);
        color: #0d0d0d;
        border-color: transparent;
    }
`;

const pulse = keyframes`
  0%, 100% { opacity: .35; }
  50%      { opacity: 1; }
`;

const ScrollCue = styled.span`
    animation: ${pulse} 2.4s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const LinkIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        width='18'
        height='18'
    >
        <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244'
        />
    </svg>
);

function ProjectCard({
    project,
    accent,
    onOpen,
}: {
    project: Project;
    accent: string;
    onOpen: () => void;
}) {
    return (
        <CardShell
            $accent={accent}
            role='button'
            tabIndex={0}
            aria-label={`${project.title} — open details`}
            onClick={onOpen}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen();
                }
            }}
        >
            <CardInner>
                <Media>
                    {project.sampleImg ? (
                        <img
                            src={project.sampleImg}
                            alt={project.title}
                            loading='lazy'
                        />
                    ) : (
                        <MediaFallback>{project.title.charAt(0)}</MediaFallback>
                    )}
                </Media>
                <Body>
                    <CardTitle>{project.title}</CardTitle>
                    <Summary>{project.summary}</Summary>
                    <TagContainer>
                        {project.tags.slice(0, 5).map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </TagContainer>
                    <OpenCue>View details →</OpenCue>
                </Body>
            </CardInner>
        </CardShell>
    );
}

export default function Projects() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [distance, setDistance] = useState(0);
    const [reduceMotion, setReduceMotion] = useState(false);

    const spaceRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);

    /* Main and sub projects are merged into one list — the horizontal
       track is the only section, so the old headings have nothing to divide. */
    const projects = useMemo<Project[]>(
        () => [
            ...mainProjects,
            ...subProjects.map((p) => ({ ...p, summary: p.description })),
        ],
        [],
    );

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReduceMotion(query.matches);
        sync();
        query.addEventListener("change", sync);
        return () => query.removeEventListener("change", sync);
    }, []);

    /* How far the track has to travel before its right edge reaches the
       viewport's right edge. Drives both the transform and the page height. */
    useEffect(() => {
        if (reduceMotion) {
            setDistance(0);
            return;
        }
        const measure = () => {
            const track = trackRef.current;
            if (!track) return;
            setDistance(
                Math.max(
                    0,
                    track.scrollWidth - document.documentElement.clientWidth,
                ),
            );
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [reduceMotion, projects.length]);

    const { scrollYProgress } = useScroll({
        target: spaceRef,
        offset: ["start start", "end end"],
    });
    const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

    const activeProject = activeIndex === null ? null : projects[activeIndex];

    /* Close on Escape and freeze the page behind the modal. */
    useEffect(() => {
        if (!activeProject) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setActiveIndex(null);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [activeProject]);

    const cards = projects.map((project, idx) => (
        <ProjectCard
            key={project.title}
            project={project}
            accent={ACCENTS[idx % ACCENTS.length]}
            onOpen={() => setActiveIndex(idx)}
        />
    ));

    return (
        <Wrapper id='projects'>
            {reduceMotion ? (
                <>
                    <StaticHeader>
                        <Title>Projects</Title>
                    </StaticHeader>
                    <StaticGrid>{cards}</StaticGrid>
                </>
            ) : (
                <ScrollSpace ref={spaceRef} $distance={distance}>
                    <StickyPane>
                        <Header>
                            <Title>Projects</Title>
                            <Hint>
                                <ScrollCue>scroll to explore →</ScrollCue>
                            </Hint>
                        </Header>
                        <Track ref={trackRef} style={{ x }}>
                            {cards}
                        </Track>
                        <ProgressRail>
                            <ProgressBar style={{ scaleX: scrollYProgress }} />
                        </ProgressRail>
                    </StickyPane>
                </ScrollSpace>
            )}

            {/* Portalled to <body> so it escapes App's `z-index: 1` wrapper —
                otherwise the fixed header would paint over the overlay. */}
            {createPortal(
                <AnimatePresence>
                    {activeProject && activeIndex !== null && (
                        <Backdrop
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setActiveIndex(null)}
                        >
                            <Modal
                                role='dialog'
                                aria-modal='true'
                                aria-label={activeProject.title}
                                $accent={ACCENTS[activeIndex % ACCENTS.length]}
                                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                                transition={{
                                    duration: 0.3,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <CloseButton
                                    onClick={() => setActiveIndex(null)}
                                    aria-label='Close'
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth={2}
                                        stroke='currentColor'
                                        width='18'
                                        height='18'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M6 18 18 6M6 6l12 12'
                                        />
                                    </svg>
                                </CloseButton>

                                {activeProject.sampleImg && (
                                    <ModalImage
                                        src={activeProject.sampleImg}
                                        alt={activeProject.title}
                                    />
                                )}

                                <ModalBody>
                                    <ModalTitle>
                                        {activeProject.title}
                                    </ModalTitle>
                                    {activeProject.note && (
                                        <Notes>{activeProject.note}</Notes>
                                    )}
                                    <Description>
                                        {activeProject.description}
                                    </Description>
                                    <TagContainer style={{ marginTop: 0 }}>
                                        {activeProject.tags.map((tag) => (
                                            <Tag key={tag}>{tag}</Tag>
                                        ))}
                                    </TagContainer>
                                    <LinkRow>
                                        {activeProject.githubLink && (
                                            <LinkButton
                                                href={activeProject.githubLink}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <FaGithub size={18} />
                                                GitHub
                                            </LinkButton>
                                        )}
                                        {activeProject.demoLink && (
                                            <LinkButton
                                                href={activeProject.demoLink}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <LinkIcon />
                                                Live demo
                                            </LinkButton>
                                        )}
                                    </LinkRow>
                                </ModalBody>
                            </Modal>
                        </Backdrop>
                    )}
                </AnimatePresence>,
                document.body,
            )}
        </Wrapper>
    );
}
