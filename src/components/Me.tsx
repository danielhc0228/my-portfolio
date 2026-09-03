import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";
import SkillProjects from "./SkillProjects";

/* `glow` is each tech's brand colour as an "r, g, b" triple, so it can be
   composed into rgba() at whatever opacity the hover state needs. */
const skills = [
    { name: "HTML", icon: "/html.svg", glow: "227, 79, 38" },
    { name: "CSS", icon: "/css.svg", glow: "41, 154, 224" },
    { name: "JavaScript", icon: "/javascript.svg", glow: "247, 223, 30" },
    { name: "TypeScript", icon: "/typescript.svg", glow: "73, 145, 220" },
    { name: "React", icon: "/react.svg", glow: "97, 218, 251" },
    { name: "Firebase", icon: "/firebase.svg", glow: "255, 202, 40" },
    { name: "Next.js", icon: "/nextjs.svg", glow: "235, 235, 235" },
    { name: "Prisma", icon: "/prisma.png", glow: "45, 212, 191" },
    { name: "Supabase", icon: "/supabase.png", glow: "62, 207, 142" },
    { name: "Claude Code", icon: "/claude.png", glow: "217, 119, 87" },
    { name: "Gemini", icon: "/gemini.png", glow: "116, 143, 255" },
    { name: "Python", icon: "/python.png", glow: "255, 212, 59" },
    { name: "LangChain/Graph", icon: "/lang.png", glow: "26, 200, 168" },
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
    /* Scales with the card so the bigger artwork doesn't get an exaggerated
       fish-eye from the same perspective depth. */
    perspective: 2000px;
    /* Custom property so the card can subtract this gutter when it works out
       how wide it's allowed to be — inherited, so Card reads the same value. */
    --gutter: clamp(16px, 5vw, 40px);
    padding: 28px var(--gutter);
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
    /* The second term keeps the card's *width* inside the viewport on narrow
       screens, since aspect-ratio derives width from height. It has to subtract
       CardScene's gutter on both sides, or the card plus its padding ends up
       wider than the viewport and the page scrolls sideways. */
    height: min(
        clamp(420px, 80vh, 860px),
        calc((100vw - 2 * var(--gutter)) * 1.34)
    );
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
        height: min(
            clamp(380px, 68vh, 700px),
            calc((100vw - 2 * var(--gutter)) * 1.34)
        );
    }

    @media (max-width: 480px) {
        height: min(
            clamp(320px, 58vh, 560px),
            calc((100vw - 2 * var(--gutter)) * 1.34)
        );
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

const SkillsContainer = styled(motion.div)`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    padding: 20px 90px 130px 90px;
    width: 100%;
    background: #0d0d0d;
`;

/* The two layers stack on top of each other and cross-fade, while SwapArea
   animates between their measured heights — so the page never collapses to
   zero between them. */
/* The whole section is opaque so nothing behind it (the fixed Intro) can show
   through any translucent child. */
const Page = styled.div`
    background: #0d0d0d;
`;

const SwapArea = styled.div`
    position: relative;
    width: 100%;
    overflow: hidden;
    /* Opaque: mid-cross-fade both layers are translucent, and without this the
       fixed Intro behind the page shows through them. */
    background: #0d0d0d;
    transition: height 0.5s cubic-bezier(0.22, 1, 0.36, 1);

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const SwapLayer = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
`;

/* The grid and the project panel swap places, so the icons stagger out on the
   way to making room and stagger back in when the panel closes. */
const gridVariants = {
    hidden: {
        opacity: 0,
        transition: { staggerChildren: 0.02, staggerDirection: -1 },
    },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.05 },
    },
};

const iconVariants = {
    hidden: { opacity: 0, scale: 0.75, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
};

const SkillItem = styled(motion.div)<{ $glow: string; $outlined: boolean }>`
    --glow: ${(props) => props.$glow};
    /* So the dragged icon's z-index actually takes effect. */
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Dragging writes transform inline every frame; leaving it in the
       transition would make the held icon ease along behind the pointer. */
    transition: ${(props) =>
        props.$outlined ? "none" : "transform 0.3s ease-in-out"};
    cursor: grab;
    user-select: none;

    &:active {
        cursor: grabbing;
    }

    &:hover {
        transform: scale(1.1);
    }

    &:focus-visible {
        outline: 2px solid rgba(var(--glow), 0.9);
        outline-offset: 4px;
    }

    @media (prefers-reduced-motion: reduce) {
        &:hover {
            transform: none;
        }
    }
`;

/* Carries the shove-away translation, so it never fights SkillItem's hover
   scale or framer-motion's drag transform. The outline lives here rather than
   on SkillItem so it travels with the icon it belongs to. */
const Pusher = styled.div<{ $outlined: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    border-radius: 12px;
    /* Always present so switching the colour on can't shift the layout. */
    border: 2px solid
        ${(props) =>
            props.$outlined ? `rgba(var(--glow), 0.85)` : "transparent"};
    /* The translate property, not transform, so it composes with the
       ancestors' transforms instead of overwriting them. */
    transition:
        translate 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.25s ease;
`;

/* Holds the halo that sits behind the logo; the logo itself can't host it
   because a radial gradient there would be clipped to the image box. */
const IconOrb = styled.div`
    position: relative;
    display: grid;
    place-items: center;
    width: 74px;
    height: 74px;
    margin-bottom: 10px;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(var(--glow), 0.5),
            rgba(var(--glow), 0.12) 45%,
            transparent 70%
        );
        opacity: 0;
        transform: scale(0.65);
        transition:
            opacity 0.35s ease,
            transform 0.35s ease;
        pointer-events: none;
    }

    ${SkillItem}:hover &::before,
    ${SkillItem}:focus-visible &::before {
        opacity: 1;
        transform: scale(1);
    }
`;

const SkillIcon = styled.img`
    width: 60px;
    height: 60px;
    position: relative;
    /* Without this the browser's own image drag-and-drop hijacks the gesture
       and framer-motion never sees the pointer move. */
    -webkit-user-drag: none;
    user-select: none;
    /* drop-shadow traces the logo's alpha, so the glow hugs the mark itself
       rather than a rectangle around it. */
    transition: filter 0.35s ease;

    ${SkillItem}:hover &,
    ${SkillItem}:focus-visible & {
        filter: drop-shadow(0 0 8px rgba(var(--glow), 0.9))
            drop-shadow(0 0 20px rgba(var(--glow), 0.55));
    }
`;

const SkillLabel = styled.span`
    color: #fff;
    font-size: 0.9rem;
    margin-top: 5px;
    transition:
        color 0.35s ease,
        text-shadow 0.35s ease;

    ${SkillItem}:hover &,
    ${SkillItem}:focus-visible & {
        color: rgb(var(--glow));
        text-shadow: 0 0 12px rgba(var(--glow), 0.6);
    }
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

    /* Drag-to-shove: the held icon pushes its neighbours out of the way. The
       neighbours are moved by writing `translate` straight to the DOM, so a
       drag never re-renders the grid — only the outline flag does. */
    const [isHolding, setIsHolding] = useState(false);
    // A press that lingers is a grab, not a click, so it must not open the
    // panel on release. framer already swallows the click after a real drag;
    // this also covers holding still and letting go.
    const pressStartedAt = useRef(0);
    const TAP_MAX_MS = 250;
    const pusherRefs = useRef<(HTMLDivElement | null)[]>([]);
    // Captured once per drag: mid-drag the pushed icons are moving, so their
    // live rects would feed back into the next frame's push.
    const restCenters = useRef<{ x: number; y: number }[]>([]);

    const PUSH_RADIUS = 130; // px from the pointer where the shove starts
    const PUSH_STRENGTH = 0.85; // fraction of the overlap turned into travel

    const captureCenters = () => {
        restCenters.current = pusherRefs.current.map((el) => {
            const rect = el?.getBoundingClientRect();
            if (!rect) return { x: 0, y: 0 };
            // Undo any push still applied, so we always store the rest position.
            const [tx, ty] = (el?.style.translate || "0px 0px")
                .split(" ")
                .map(parseFloat);
            return {
                x: rect.left + rect.width / 2 - (tx || 0),
                y: rect.top + rect.height / 2 - (ty || 0),
            };
        });
    };

    const shoveNeighbours = (
        heldIndex: number,
        pointer: { x: number; y: number },
    ) => {
        pusherRefs.current.forEach((el, i) => {
            if (!el || i === heldIndex) return;
            const center = restCenters.current[i];
            const dx = center.x - pointer.x;
            const dy = center.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist >= PUSH_RADIUS) {
                el.style.translate = "";
                return;
            }
            // Straight down is an arbitrary but stable direction for a direct hit.
            const nx = dist === 0 ? 0 : dx / dist;
            const ny = dist === 0 ? 1 : dy / dist;
            const push = (PUSH_RADIUS - dist) * PUSH_STRENGTH;
            el.style.translate = `${nx * push}px ${ny * push}px`;
        });
    };

    const releaseNeighbours = () => {
        pusherRefs.current.forEach((el) => {
            if (el) el.style.translate = "";
        });
    };

    /* Listened for on the window, not the icon: a release outside the grid (or
       a cancelled gesture) still has to drop the outlines and let everyone
       settle back. framer's own onDragEnd can't do this — it never fires for a
       press that didn't cross the drag threshold. */
    useEffect(() => {
        if (!isHolding) return;
        const end = () => {
            setIsHolding(false);
            releaseNeighbours();
        };
        window.addEventListener("pointerup", end);
        window.addEventListener("pointercancel", end);
        return () => {
            window.removeEventListener("pointerup", end);
            window.removeEventListener("pointercancel", end);
        };
    }, [isHolding]);

    const selectedSkillData = skills.find(
        (skill) => skill.name === selectedSkill,
    );

    /* Measure whichever layer is currently the live one and drive SwapArea's
       height from it. Separate refs because the outgoing layer stays mounted
       through its fade and would otherwise null out a shared ref. */
    const [swapHeight, setSwapHeight] = useState<number | null>(null);
    const gridRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const el = selectedSkill ? panelRef.current : gridRef.current;
        if (!el) return;
        const measure = () => setSwapHeight(el.offsetHeight);
        measure();
        // Project thumbnails and wrapping can change the height after mount.
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [selectedSkill]);

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
        <Page>
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
            <FlipHint $hidden={!!selectedSkillData}>
                Hold icons and play around with it
            </FlipHint>
            {/* Grid and panel are alternates in the same slot: picking a skill
                clears the icons and the panel takes their place. */}
            <SwapArea
                style={swapHeight === null ? undefined : { height: swapHeight }}
            >
                <AnimatePresence initial={false}>
                    {selectedSkillData ? (
                        <SwapLayer
                            key={selectedSkillData.name}
                            ref={panelRef}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.35, delay: 0.1 },
                            }}
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        >
                            <SkillProjects
                                skill={selectedSkillData.name}
                                icon={selectedSkillData.icon}
                                glow={selectedSkillData.glow}
                                onClose={() => setSelectedSkill(null)}
                            />
                        </SwapLayer>
                    ) : (
                        <SwapLayer
                            key='skill-grid'
                            ref={gridRef}
                            variants={gridVariants}
                            initial='hidden'
                            animate='visible'
                            exit='hidden'
                        >
                            <SkillsContainer>
                                {skills.map((skill, index) => (
                                    <SkillItem
                                        key={skill.name}
                                        variants={iconVariants}
                                        role='button'
                                        tabIndex={0}
                                        $glow={skill.glow}
                                        $outlined={isHolding}
                                        drag
                                        dragSnapToOrigin
                                        dragMomentum={false}
                                        whileDrag={{ scale: 1.15, zIndex: 2 }}
                                        onPointerDown={() => {
                                            pressStartedAt.current = Date.now();
                                            captureCenters();
                                            setIsHolding(true);
                                        }}
                                        onDrag={(event) =>
                                            shoveNeighbours(index, {
                                                x: (event as PointerEvent)
                                                    .clientX,
                                                y: (event as PointerEvent)
                                                    .clientY,
                                            })
                                        }
                                        onClick={() => {
                                            if (
                                                Date.now() -
                                                    pressStartedAt.current >
                                                TAP_MAX_MS
                                            )
                                                return;
                                            toggleSkill(skill.name);
                                        }}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                toggleSkill(skill.name);
                                            }
                                        }}
                                    >
                                        <Pusher
                                            $outlined={isHolding}
                                            ref={(el) => {
                                                pusherRefs.current[index] = el;
                                            }}
                                        >
                                            <IconOrb>
                                                <SkillIcon
                                                    src={skill.icon}
                                                    alt={skill.name}
                                                />
                                            </IconOrb>
                                            <SkillLabel>{skill.name}</SkillLabel>
                                        </Pusher>
                                    </SkillItem>
                                ))}
                            </SkillsContainer>
                        </SwapLayer>
                    )}
                </AnimatePresence>
            </SwapArea>
        </Page>
    );
}
