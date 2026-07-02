import styled, { css, keyframes } from "styled-components";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AnimatePresence, motion } from "framer-motion";

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

const Lock = styled.div`
    display: flex;
    flex-direction: row;
    gap: 200px;
`;

const keyGlowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 10px 2px rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 22px 8px rgba(255, 215, 0, 0.85); }
`;

const KeyIconWrapper = styled.div<{ $isDragging: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
    border-radius: 50%;
    cursor: grab;
    animation: ${keyGlowPulse} 1.8s ease-in-out infinite;

    &:active {
        cursor: grabbing;
    }

    ${(props) =>
        props.$isDragging &&
        css`
            animation: none;
            box-shadow: 0 0 26px 10px rgba(255, 215, 0, 0.95);
        `}
`;

const dropGlowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 10px 2px rgba(29, 155, 240, 0.3); }
  50% { box-shadow: 0 0 20px 6px rgba(29, 155, 240, 0.65); }
`;

const LockTargetWrapper = styled.div<{ $isDraggingOver: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
    border-radius: 50%;
    border: 2px dashed rgba(255, 255, 255, 0.35);
    animation: ${dropGlowPulse} 2.2s ease-in-out infinite;
    transition: border-color 0.3s ease, box-shadow 0.3s ease,
        transform 0.3s ease;

    ${(props) =>
        props.$isDraggingOver &&
        css`
            animation: none;
            border-color: #1d9bf0;
            transform: scale(1.15);
            box-shadow: 0 0 30px 10px rgba(29, 155, 240, 0.95);
        `}
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = (result: any) => {
        const { destination, draggableId } = result;

        if (!destination) return;

        // Check if dropped into the special target area
        if (
            destination.droppableId === "drop-zone" &&
            draggableId === "draggable-item"
        ) {
            setIsUnlocked(true);
        }
    };

    return (
        <Container>
            <TextWrapper>
                <TypingText>Hi, I'm Daniel.</TypingText>
                <FadeInText>A Full-stack Developer.</FadeInText>
            </TextWrapper>
            <Lock>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {/* Draggable Component */}
                    <Droppable droppableId='drag-area'>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {isUnlocked ? null : (
                                    <Draggable
                                        draggableId='draggable-item'
                                        index={0}
                                    >
                                        {(provided, snapshot) => (
                                            <KeyIconWrapper
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                $isDragging={
                                                    snapshot.isDragging
                                                }
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    strokeWidth='1.5'
                                                    stroke='white'
                                                    width='32'
                                                    height='32'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        d='M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z'
                                                    />
                                                </svg>
                                            </KeyIconWrapper>
                                        )}
                                    </Draggable>
                                )}

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* Drop Target */}
                    <Droppable droppableId='drop-zone'>
                        {(provided, snapshot) => (
                            <LockTargetWrapper
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                $isDraggingOver={snapshot.isDraggingOver}
                            >
                                <AnimatePresence mode='wait'>
                                    {isUnlocked ? (
                                        <motion.svg
                                            key='unlocked'
                                            initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                                rotate: -30,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                rotate: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                                rotate: 30,
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                ease: "easeOut",
                                            }}
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth='1.5'
                                            stroke='white'
                                            width='32'
                                            height='32'
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
                                            initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                                rotate: 30,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                rotate: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                                rotate: -30,
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                ease: "easeOut",
                                            }}
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth='1.5'
                                            stroke='white'
                                            width='32'
                                            height='32'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
                                            />
                                        </motion.svg>
                                    )}
                                </AnimatePresence>
                            </LockTargetWrapper>
                        )}
                    </Droppable>
                </DragDropContext>
            </Lock>
            {isUnlocked ? (
                <h1>Scroll Down</h1>
            ) : (
                <h1>Drag the "key" to the "lock" to proceed</h1>
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
