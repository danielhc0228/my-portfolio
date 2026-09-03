import { useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
    AnimatePresence,
    animate,
    motion,
    useMotionValue,
    useTransform,
} from "framer-motion";

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom, #1a1a1a, #0d0d0d);

    color: white;
    gap: 40px;
    z-index: 0;
`;

const TextWrapper = styled.div`
    text-align: center;
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blink = keyframes`
  0%, 100% { border-color: transparent }
  50% { border-color: white }
`;

const TypingText = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    border-right: 3px solid white;
    width: 0;
    animation: ${typing} 1s steps(22, end) forwards,
        ${blink} 0.75s step-end infinite;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FadeInText = styled.h2`
    font-size: 2rem;
    margin-top: 20px;
    opacity: 0;
    animation: ${fadeIn} 2s ease-in forwards;
    animation-delay: 1s;
`;

const KNOB = 56;
const PAD = 4;

const Track = styled.div`
    position: relative;
    width: min(320px, 80vw);
    height: ${KNOB + PAD * 2}px;
    padding: ${PAD}px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.06);
    overflow: hidden;
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const TrackLabel = styled(motion.span)`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: ${KNOB / 2}px;
    font-size: 0.95rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    pointer-events: none;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.25) 25%,
        rgba(255, 255, 255, 0.9) 50%,
        rgba(255, 255, 255, 0.25) 75%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ${shimmer} 2.5s linear infinite;
`;

const knobGlowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 10px 2px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 22px 8px rgba(255, 215, 0, 0.85); }
`;

const Knob = styled(motion.div)`
    position: relative;
    width: ${KNOB}px;
    height: ${KNOB}px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #1a1a1a;
    cursor: grab;
    touch-action: none;
    animation: ${knobGlowPulse} 1.8s ease-in-out infinite;

    &:active {
        cursor: grabbing;
    }
`;

const Down = styled(motion.div)`
    position: absolute;
    bottom: 70px;
`;

const logoVariants = {
    active: {
        y: [0, -20, 0], // replicating transform: translateY(-20px)
        transition: {
            repeat: Infinity,
            duration: 1.5,
        },
    },
};

type IntroProps = {
    isUnlocked: boolean;
    setIsUnlocked: (value: boolean) => void;
};

const Intro = ({ isUnlocked, setIsUnlocked }: IntroProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const labelOpacity = useTransform(x, [0, 90], [1, 0]);

    const maxX = () =>
        (trackRef.current?.offsetWidth ?? 0) - KNOB - PAD * 2;

    const handleDragEnd = () => {
        const max = maxX();
        if (x.get() >= max * 0.85) {
            setIsUnlocked(true);
            animate(x, max, { type: "spring", stiffness: 400, damping: 40 });
        } else {
            animate(x, 0, { type: "spring", stiffness: 500, damping: 40 });
        }
    };

    return (
        <Container>
            <TextWrapper>
                <TypingText>Hi, I'm Daniel.</TypingText>
                <FadeInText>A Full-stack Developer.</FadeInText>
            </TextWrapper>
            <Track ref={trackRef}>
                <TrackLabel style={{ opacity: labelOpacity }}>
                    Swipe to unlock
                </TrackLabel>
                <Knob
                    drag={isUnlocked ? false : "x"}
                    dragConstraints={trackRef}
                    dragElastic={0.04}
                    dragMomentum={false}
                    style={{ x }}
                    onDragEnd={handleDragEnd}
                >
                    <AnimatePresence mode='wait'>
                        {isUnlocked ? (
                            <motion.svg
                                key='unlocked'
                                initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: 30 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth='1.5'
                                stroke='white'
                                width='28'
                                height='28'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
                                />
                            </motion.svg>
                        ) : (
                            <motion.svg
                                key='locked'
                                initial={{ opacity: 0, scale: 0.8, rotate: 30 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: -30 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth='1.5'
                                stroke='white'
                                width='28'
                                height='28'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
                                />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </Knob>
            </Track>
            {isUnlocked ? (
                <h1>Scroll Down</h1>
            ) : (
                <h1>Swipe the key across to unlock</h1>
            )}

            {isUnlocked && (
                <Down variants={logoVariants} animate='active'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        width='34'
                        height='34'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5'
                        />
                    </svg>
                </Down>
            )}
        </Container>
    );
};

export default Intro;
