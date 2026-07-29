import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import styled, { css, keyframes } from "styled-components";
import SkillProjects from "./SkillProjects";

const skills = [
    { name: "HTML", icon: "/html.svg" },
    { name: "CSS", icon: "/css.svg" },
    { name: "JavaScript", icon: "/javascript.svg" },
    { name: "TypeScript", icon: "/typescript.svg" },
    { name: "React", icon: "/react.svg" },
    { name: "Firebase", icon: "/firebase.svg" },
    { name: "Next.js", icon: "/nextjs.svg" },
    { name: "Prisma", icon: "/prisma.png" },
    { name: "Supabase", icon: "/supabase.png" },
    { name: "Claude Code", icon: "/claude.png" },
    { name: "Gemini", icon: "/gemini.png" },
    { name: "Python", icon: "/python.png" },
    { name: "LangChain/Graph", icon: "/lang.png" },
];

const Container = styled.div`
    min-height: 100vh;
    padding-top: 50px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background: #0d0d0d;
    color: white;
    justify-content: center;
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CARD_SRC = "/MyEmoji.png";
const CARD_RATIO = "1792 / 2400";

/* Scene owns the perspective + the entrance animation, so the card itself is
   free to use `transform` exclusively for tilt/flip. */
const CardScene = styled.div<{ $isVisible: boolean }>`
    perspective: 1400px;
    padding: 40px;
    opacity: 0;
    transform: translateY(50px);

    ${(props) =>
        props.$isVisible &&
        css`
            animation: ${fadeInUp} 1s ease-out forwards;
        `}
`;

const Card = styled.div<{ $active: boolean; $flipped: boolean }>`
    --rx: 0; /* -1 .. 1, pointer offset on the X axis */
    --ry: 0; /* -1 .. 1, pointer offset on the Y axis */
    --mx: 50%; /* pointer position, used by the glare */
    --my: 50%;
    --tilt: 13deg;
    --flip: ${(props) => (props.$flipped ? "180deg" : "0deg")};
    --scale: ${(props) => (props.$active ? 1.04 : 1)};

    position: relative;
    height: clamp(340px, 62vh, 620px);
    aspect-ratio: ${CARD_RATIO};
    transform-style: preserve-3d;
    cursor: pointer;
    border: none;
    padding: 0;
    background: none;
    -webkit-tap-highlight-color: transparent;

    transform: scale(var(--scale)) rotateX(calc(var(--ry) * var(--tilt)))
        rotateY(calc(var(--rx) * var(--tilt))) rotateY(var(--flip));
    transition: transform ${(props) => (props.$active ? "0.12s" : "0.9s")}
        cubic-bezier(0.22, 1, 0.36, 1);

    &:focus-visible {
        outline: 2px solid #8ad4ff;
        outline-offset: 12px;
        border-radius: 24px;
    }

    @media (max-width: 1024px) {
        height: clamp(300px, 52vh, 520px);
    }

    @media (max-width: 480px) {
        height: clamp(260px, 42vh, 420px);
    }

    @media (prefers-reduced-motion: reduce) {
        --tilt: 0deg;
        --scale: 1;
    }
`;

/* Every layer is masked by the artwork's own alpha channel, so the foil and
   glare stop exactly at the card's rounded silhouette. */
const maskedByCard = css`
    position: absolute;
    inset: 0;
    pointer-events: none;
    -webkit-mask-image: url(${CARD_SRC});
    mask-image: url(${CARD_SRC});
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
`;

const CardFace = styled.div`
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    isolation: isolate;
    filter: drop-shadow(0 24px 34px rgba(0, 0, 0, 0.65));
`;

const CardArt = styled.img`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
`;

/* Foil: two repeating gradients blended together, then color-dodged over the
   artwork. Stationary at rest, tracks the pointer while hovered. */
const Holo = styled.div<{ $active: boolean }>`
    ${maskedByCard}
    background-image:
        repeating-linear-gradient(
            0deg,
           #0e152e 0%,
            hsl(180, 10%, 60%) 3.8%,
            hsl(180, 29%, 66%) 4.5%,
            hsl(180, 10%, 60%) 5.2%,
            #0e152e 10%,
            #0e152e 12%
        ),
        repeating-linear-gradient(
            125deg,
            #0e152e 0%,
            hsl(180, 10%, 60%) 3.8%,
            hsl(180, 29%, 66%) 4.5%,
            hsl(180, 10%, 60%) 5.2%,
            #0e152e 10%,
            #0e152e 12%
        );
    background-blend-mode: exclusion;
    background-size: 300% 400%;
    mix-blend-mode: color-dodge;
    filter: brightness(0.85) contrast(2.2) saturate(1.4);
    opacity: ${(props) => (props.$active ? 0.5 : 0.24)};
    /* Always pointer-driven: at rest --mx/--my hold their 50% defaults, so the
       foil simply sits still instead of drifting on its own. */
    background-position:
        var(--mx) var(--my),
        var(--mx) var(--my);
    transition:
        opacity 0.4s ease,
        background-position 0.1s ease-out;
`;

/* Fine glitter, parallaxed against the tilt so it reads as depth. */
const Glitter = styled.div<{ $active: boolean }>`
    ${maskedByCard}
    background-image:
        radial-gradient(
            circle at 20% 30%,
            rgba(255, 255, 255, 0.9) 0.5px,
            transparent 1.2px
        ),
        radial-gradient(
            circle at 70% 65%,
            rgba(180, 230, 255, 0.8) 0.6px,
            transparent 1.4px
        ),
        radial-gradient(
            circle at 45% 85%,
            rgba(255, 220, 180, 0.8) 0.5px,
            transparent 1.2px
        );
    background-size:
        90px 90px,
        130px 130px,
        70px 70px;
    mix-blend-mode: screen;
    opacity: ${(props) => (props.$active ? 0.75 : 0.25)};
    transform: translate3d(calc(var(--rx) * -10px), calc(var(--ry) * -10px), 0);
    transition: opacity 0.4s ease;
`;

/* Soft specular highlight that sits under the pointer. */
const Glare = styled.div<{ $active: boolean }>`
    ${maskedByCard}
    background: radial-gradient(
        circle at var(--mx) var(--my),
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0.15) 25%,
        rgba(0, 0, 0, 0.4) 70%
    );
    mix-blend-mode: overlay;
    opacity: ${(props) => (props.$active ? 1 : 0)};
    transition: opacity 0.4s ease;
`;

const CardBack = styled.div`
    position: absolute;
    inset: 0;
    transform: rotateY(180deg);
    backface-visibility: hidden;
    border-radius: 4.5% / 3.4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    overflow: hidden;
    background:
        radial-gradient(
            circle at 50% 35%,
            rgba(120, 80, 190, 0.55),
            transparent 62%
        ),
        radial-gradient(
            circle at 50% 100%,
            rgba(180, 45, 65, 0.5),
            transparent 60%
        ),
        #10101a;
    border: 6px solid #1c1c28;
    box-shadow:
        inset 0 0 0 2px rgba(255, 255, 255, 0.08),
        0 24px 34px rgba(0, 0, 0, 0.65);

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.05) 0 2px,
            transparent 2px 10px
        );
    }

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at var(--mx) var(--my),
            rgba(255, 255, 255, 0.28),
            transparent 55%
        );
    }
`;

const BackMark = styled.span`
    position: relative;
    font-size: clamp(2.5rem, 7vh, 4.5rem);
    font-weight: 800;
    letter-spacing: 2px;
    background: linear-gradient(180deg, #ffffff, #9aa2b8 55%, #4b5168);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
`;

const BackName = styled.span`
    position: relative;
    font-size: clamp(0.7rem, 1.6vh, 0.95rem);
    letter-spacing: 0.45em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.65);
`;

const FlipHint = styled.p<{ $hidden: boolean }>`
    margin: 18px 0 0;
    text-align: center;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    opacity: ${(props) => (props.$hidden ? 0 : 1)};
    transition: opacity 0.5s ease;
`;

const InfoContainer = styled.div`
    height: 65vh;
    padding-left: 30px;
    padding-right: 30px;
    display: flex;
    align-items: center;
    background: #0d0d0d;
    color: white;
`;

const ContentWrapper = styled.div`
    width: 100%;
    max-width: 800px;
    text-align: center;
`;

const typing = keyframes`
  from { width: 0% }
  to { width: 100% }
`;

const SectionTitle = styled.h1<{ $isVisible: boolean }>`
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-align: center; // Always keep centered
    white-space: nowrap;
    overflow: hidden;
    background: #0d0d0d;

    span {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        width: ${(props) => (props.$isVisible ? "100%" : "0")};
        animation: ${(props) =>
            props.$isVisible
                ? css`
                      ${typing} 1s steps(22, end) forwards
                  `
                : "none"};
    }
`;

const SubTitle = styled.h2`
    font-size: 1rem;
    margin-bottom: 10px;
    color: #f4f4f4; /* Slightly lighter color for subtitles */
`;

const Divider = styled.hr`
    border: 1px solid #fff;
    width: 50%;
    margin: 10px auto;
`;

const SkillsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    padding: 20px 90px 130px 90px;
    width: 100%;
    background: #0d0d0d;
`;

const SkillItem = styled.div<{ $isActive: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    border-radius: 12px;
    transition:
        transform 0.3s ease-in-out,
        background-color 0.3s ease-in-out;
    cursor: pointer;
    background-color: ${(props) =>
        props.$isActive ? "rgba(255, 255, 255, 0.1)" : "transparent"};

    &:hover {
        transform: scale(1.1);
    }
`;

const SkillIcon = styled.img`
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
`;

const SkillLabel = styled.span`
    color: #fff;
    font-size: 0.9rem;
    margin-top: 5px;
`;

export default function Me() {
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [isCardActive, setIsCardActive] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const imageRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const frameRef = useRef<number | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);

    const toggleSkill = (skillName: string) => {
        setSelectedSkill((prev) => (prev === skillName ? null : skillName));
    };

    /* Pointer position is written straight to CSS custom properties inside a
       rAF so tilting the card never triggers a React render. */
    const writeCardVars = useCallback(
        (rx: number, ry: number, mx: number, my: number) => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }
            frameRef.current = requestAnimationFrame(() => {
                const el = cardRef.current;
                if (!el) return;
                el.style.setProperty("--rx", `${rx}`);
                el.style.setProperty("--ry", `${ry}`);
                el.style.setProperty("--mx", `${mx}%`);
                el.style.setProperty("--my", `${my}%`);
            });
        },
        [],
    );

    const handleCardMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        // Invert the X axis so the card leans away from the cursor.
        writeCardVars(px * 2 - 1, -(py * 2 - 1), px * 100, py * 100);
    };

    const handleCardLeave = () => {
        setIsCardActive(false);
        writeCardVars(0, 0, 50, 50);
    };

    useEffect(
        () => () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }
        },
        [],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsImageVisible(true);
                    observer.disconnect(); // Stop observing once the image is visible
                }
            },
            { threshold: 0.5 }, // Image is considered visible when 50% of it is in the viewport
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }
        if (titleRef.current) {
            observer.observe(titleRef.current);
        }

        return () => {
            if (imageRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(imageRef.current);
            }
            if (titleRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(titleRef.current);
            }
        };
    }, []);

    return (
        <div>
            <Container>
                <CardScene ref={imageRef} $isVisible={isImageVisible}>
                    <Card
                        ref={cardRef}
                        role='button'
                        tabIndex={0}
                        aria-label='Daniel Chung trading card — activate to flip'
                        aria-pressed={isCardFlipped}
                        $active={isCardActive}
                        $flipped={isCardFlipped}
                        onPointerEnter={() => setIsCardActive(true)}
                        onPointerMove={handleCardMove}
                        onPointerLeave={handleCardLeave}
                        onClick={() => setIsCardFlipped((prev) => !prev)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setIsCardFlipped((prev) => !prev);
                            }
                        }}
                    >
                        <CardFace>
                            <CardArt src={CARD_SRC} alt='Daniel Chung' />
                            <Holo $active={isCardActive} />
                            <Glitter $active={isCardActive} />
                            <Glare $active={isCardActive} />
                        </CardFace>
                        <CardBack>
                            <BackMark>{"{/}"}</BackMark>
                            <BackName>Daniel Chung</BackName>
                        </CardBack>
                    </Card>
                    <FlipHint $hidden={isCardFlipped}>Click to flip</FlipHint>
                </CardScene>
                {/* <VerticalLine /> */}
                <InfoContainer>
                    <ContentWrapper>
                        <SectionTitle
                            ref={titleRef}
                            $isVisible={isImageVisible}
                        >
                            <span>Education</span>
                        </SectionTitle>
                        <Divider />
                        <SubTitle>
                            Bachelor of Computer Science | University of
                            Queensland (2024)
                        </SubTitle>
                        <SubTitle>
                            Graduate Certificate of Computer Science |
                            University of Queensland (In Progress)
                        </SubTitle>

                        <SectionTitle $isVisible={isImageVisible}>
                            <span>Experience</span>
                        </SectionTitle>
                        <Divider />
                        <SubTitle>Operations Supervisor | Multhana</SubTitle>
                        <SubTitle>
                            Sales Associate | Alien Night Market
                        </SubTitle>

                        <SectionTitle $isVisible={isImageVisible}>
                            <span>Core Philosophy</span>
                        </SectionTitle>
                        <Divider />
                        <SubTitle>
                            "Clean architecture, seamless user experience, and
                            continuous learning."
                        </SubTitle>
                    </ContentWrapper>
                </InfoContainer>
            </Container>
            <SectionTitle ref={titleRef} $isVisible={isImageVisible}>
                <span>Tech Stack</span>
            </SectionTitle>
            <SkillsContainer>
                {skills.map((skill) => (
                    <SkillItem
                        key={skill.name}
                        role='button'
                        tabIndex={0}
                        $isActive={selectedSkill === skill.name}
                        onClick={() => toggleSkill(skill.name)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleSkill(skill.name);
                            }
                        }}
                    >
                        <SkillIcon src={skill.icon} alt={skill.name} />
                        <SkillLabel>{skill.name}</SkillLabel>
                    </SkillItem>
                ))}
            </SkillsContainer>
            <AnimatePresence mode='wait'>
                {selectedSkill && (
                    <SkillProjects key={selectedSkill} skill={selectedSkill} />
                )}
            </AnimatePresence>
        </div>
    );
}
