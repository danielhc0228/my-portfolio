import { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const NAME = "DANIEL";
const STEP = 320; // ms between one square turning into its letter

const Screen = styled(motion.div)`
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 36px;
    background: linear-gradient(to bottom, #1a1a1a, #0d0d0d);
`;

const Row = styled(motion.div)`
    display: flex;
    gap: min(18px, 2vw);
`;

const Cell = styled.div`
    width: min(64px, 12vw);
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Square = styled(motion.div)`
    width: min(42px, 8vw);
    height: min(42px, 8vw);
    border: 3px solid white;
    background: transparent;
`;

const Letter = styled(motion.span)`
    font-size: min(3.4rem, 9vw);
    font-weight: 700;
    letter-spacing: 2px;
    color: white;
`;

const Loaded = styled(motion.h1)`
    font-size: min(2.6rem, 7vw);
    font-weight: 700;
    letter-spacing: min(8px, 2vw);
    color: white;
    height: 72px;
    display: flex;
    align-items: center;
`;

const Loader = ({ onDone }: { onDone: () => void }) => {
    const [count, setCount] = useState(0);
    const [phase, setPhase] = useState<"letters" | "loaded" | "out">("letters");

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        NAME.split("").forEach((_, i) =>
            timers.push(setTimeout(() => setCount(i + 1), (i + 1) * STEP))
        );
        timers.push(
            setTimeout(() => setPhase("loaded"), NAME.length * STEP + 300)
        );
        timers.push(
            setTimeout(() => setPhase("out"), NAME.length * STEP + 1700)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <Screen
            animate={{ opacity: phase === "out" ? 0 : 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onAnimationComplete={() => phase === "out" && onDone()}
        >
            <AnimatePresence mode='wait'>
                {phase === "letters" ? (
                    <Row
                        key='name'
                        exit={{
                            opacity: 0,
                            scale: 0.85,
                            filter: "blur(6px)",
                            transition: { duration: 0.3 },
                        }}
                    >
                        {NAME.split("").map((char, i) => (
                            <Cell key={char + i}>
                                <AnimatePresence mode='wait' initial={false}>
                                    {i < count ? (
                                        <Letter
                                            key='letter'
                                            initial={{
                                                opacity: 0,
                                                scale: 0.5,
                                                y: 12,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {char}
                                        </Letter>
                                    ) : (
                                        <Square
                                            key='square'
                                            animate={{
                                                opacity: [0.25, 1, 0.25],
                                            }}
                                            transition={{
                                                duration: 1.2,
                                                repeat: Infinity,
                                                delay: i * 0.15,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.4,
                                                rotate: 45,
                                                transition: {
                                                    duration: 0.22,
                                                    repeat: 0,
                                                },
                                            }}
                                        />
                                    )}
                                </AnimatePresence>
                            </Cell>
                        ))}
                    </Row>
                ) : (
                    <Loaded
                        key='loaded'
                        initial={{ opacity: 0, scale: 1.25, filter: "blur(6px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        LOADED 100%
                    </Loaded>
                )}
            </AnimatePresence>
        </Screen>
    );
};

export default Loader;
