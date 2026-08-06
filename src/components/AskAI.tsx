import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { FiSend, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import type { ChatSession } from "firebase/ai";
import { chatModel } from "../ai";

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const gradient = `linear-gradient(110deg, #5ed6ff, #a384ff, #ff5c7a, #ffd166, #5ed6ff)`;

/* Sits above the scroll-to-top button, which owns bottom: 20px. */
const Bubble = styled.button`
    position: fixed;
    right: 20px;
    bottom: 84px;
    z-index: 41;
    height: 54px;
    width: 54px;
    display: grid;
    place-items: center;
    border: none;
    border-radius: 50%;
    color: #0d0d0d;
    cursor: pointer;
    background: ${gradient};
    background-size: 200% 100%;
    animation: ${gradientShift} 7s linear infinite;
    box-shadow: 0 0 22px rgba(140, 160, 255, 0.4);
    transition:
        transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.3s ease;

    &:hover {
        transform: scale(1.08);
        box-shadow: 0 0 34px rgba(140, 160, 255, 0.65);
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        &:hover {
            transform: none;
        }
    }
`;

const Panel = styled(motion.div)`
    position: fixed;
    right: 20px;
    bottom: 84px;
    z-index: 42;
    width: min(380px, calc(100vw - 40px));
    height: min(540px, calc(100vh - 140px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform-origin: bottom right;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(13, 13, 13, 0.86);
    backdrop-filter: blur(18px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
`;

const PanelHead = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const HeadMark = styled.span`
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    color: #0d0d0d;
    background: ${gradient};
    background-size: 200% 100%;
    animation: ${gradientShift} 7s linear infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const HeadTitle = styled.span`
    flex: 1;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
`;

const CloseBtn = styled.button`
    display: grid;
    place-items: center;
    padding: 4px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    transition:
        color 0.25s ease,
        background 0.25s ease;

    &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
    }
`;

const Log = styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
`;

const Hint = styled.p`
    margin: auto 0;
    text-align: center;
    font-size: 0.85rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.4);
`;

const Bubbles = styled.div<{ $role: "user" | "model" }>`
    align-self: ${(props) =>
        props.$role === "user" ? "flex-end" : "flex-start"};
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 16px;
    font-size: 0.88rem;
    line-height: 1.55;
    white-space: pre-wrap;
    color: ${(props) =>
        props.$role === "user" ? "#0d0d0d" : "rgba(255,255,255,0.88)"};
    background: ${(props) =>
        props.$role === "user"
            ? "linear-gradient(110deg, #5ed6ff, #a384ff)"
            : "rgba(255,255,255,0.06)"};
    border: 1px solid
        ${(props) =>
            props.$role === "user" ? "transparent" : "rgba(255,255,255,0.08)"};
`;

const Form = styled.form`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const Input = styled.input`
    flex: 1;
    padding: 10px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
    font: inherit;
    font-size: 0.88rem;
    outline: none;

    &::placeholder {
        color: rgba(255, 255, 255, 0.35);
    }

    &:focus {
        border-color: rgba(163, 132, 255, 0.7);
    }
`;

const SendBtn = styled.button`
    display: grid;
    place-items: center;
    height: 38px;
    width: 38px;
    flex-shrink: 0;
    border: none;
    border-radius: 50%;
    color: #0d0d0d;
    cursor: pointer;
    background: ${gradient};
    background-size: 200% 100%;

    &:disabled {
        opacity: 0.35;
        cursor: default;
    }
`;

type Message = { role: "user" | "model"; text: string };

export default function AskAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [draft, setDraft] = useState("");
    const [isPending, setIsPending] = useState(false);
    /* One session for the whole visit, so the model keeps the conversation
       history without us re-sending it by hand. */
    const chatRef = useRef<ChatSession | null>(null);
    const logRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    }, [messages]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) =>
            e.key === "Escape" && setIsOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const send = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text || isPending) return;

        setDraft("");
        setIsPending(true);
        // The empty model message is the slot the stream fills in.
        setMessages((prev) => [
            ...prev,
            { role: "user", text },
            { role: "model", text: "" },
        ]);

        try {
            chatRef.current ??= chatModel.startChat();
            const { stream } = await chatRef.current.sendMessageStream(text);
            for await (const chunk of stream) {
                const part = chunk.text();
                setMessages((prev) =>
                    prev.map((m, i) =>
                        i === prev.length - 1 ? { ...m, text: m.text + part } : m,
                    ),
                );
            }
        } catch (err) {
            console.error("[AskAI]", err);
            setMessages((prev) =>
                prev.map((m, i) =>
                    i === prev.length - 1
                        ? {
                              ...m,
                              text: "Sorry — I couldn't reach the model just now. Try again in a moment.",
                          }
                        : m,
                ),
            );
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen ? (
                    <Panel
                        key='panel'
                        initial={{ opacity: 0, scale: 0.9, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 12 }}
                        transition={{
                            duration: 0.25,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <PanelHead>
                            <HeadMark aria-hidden='true'>
                                <HiSparkles size={15} />
                            </HeadMark>
                            <HeadTitle>Ask AI</HeadTitle>
                            <CloseBtn
                                onClick={() => setIsOpen(false)}
                                aria-label='Close chat'
                            >
                                <FiX size={18} />
                            </CloseBtn>
                        </PanelHead>

                        <Log ref={logRef} aria-live='polite'>
                            {messages.length === 0 ? (
                                <Hint>
                                    Ask me anything about Daniel — his projects,
                                    stack, background — or anything else you're
                                    curious about.
                                </Hint>
                            ) : (
                                messages.map((m, i) => (
                                    <Bubbles key={i} $role={m.role}>
                                        {m.text || "…"}
                                    </Bubbles>
                                ))
                            )}
                        </Log>

                        <Form onSubmit={send}>
                            <Input
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                placeholder='Ask anything…'
                                aria-label='Message'
                                autoFocus
                            />
                            <SendBtn
                                type='submit'
                                disabled={isPending || !draft.trim()}
                                aria-label='Send'
                            >
                                <FiSend size={16} />
                            </SendBtn>
                        </Form>
                    </Panel>
                ) : (
                    <Bubble
                        key='bubble'
                        as={motion.button}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        onClick={() => setIsOpen(true)}
                        aria-label='Open AI chat'
                    >
                        <HiSparkles size={22} />
                    </Bubble>
                )}
            </AnimatePresence>
        </>
    );
}
