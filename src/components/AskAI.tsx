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

/* Anchors the answer panel to the composer, which now lives in the header.
   The header gains `backdrop-filter` when scrolled, which would make a fixed
   panel position against the header box anyway — absolute is the honest form. */
const Wrap = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
`;

const TriggerForm = styled.form`
    display: flex;
    align-items: center;
    gap: 6px;
    width: clamp(150px, 34vw, 400px);
    padding: 3px 3px 3px 12px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    transition:
        border-color 0.25s ease,
        background 0.25s ease;

    &:focus-within {
        border-color: rgba(163, 132, 255, 0.7);
        background: rgba(255, 255, 255, 0.08);
    }
`;

const Spark = styled.span`
    display: grid;
    place-items: center;
    flex-shrink: 0;
    color: #a384ff;
`;

const Input = styled.input`
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    color: #fff;
    font: inherit;
    font-size: clamp(0.72rem, 2.4vw, 0.86rem);
    outline: none;

    &::placeholder {
        color: rgba(255, 255, 255, 0.35);
    }
`;

const SendBtn = styled.button`
    display: grid;
    place-items: center;
    height: clamp(26px, 7vw, 32px);
    width: clamp(26px, 7vw, 32px);
    flex-shrink: 0;
    border: none;
    border-radius: 50%;
    color: #0d0d0d;
    cursor: pointer;
    background: ${gradient};
    background-size: 200% 100%;
    animation: ${gradientShift} 7s linear infinite;

    &:disabled {
        opacity: 0.35;
        cursor: default;
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const Panel = styled(motion.div)`
    position: absolute;
    top: calc(100% + 14px);
    left: 50%;
    z-index: 42;
    width: min(420px, calc(100vw - 24px));
    height: min(440px, 60vh);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform-origin: top center;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(13, 13, 13, 0.92);
    backdrop-filter: blur(18px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
`;

const PanelHead = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const HeadMark = styled.span`
    width: 26px;
    height: 26px;
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
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #fff;
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
        setIsOpen(true);
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
                        i === prev.length - 1
                            ? { ...m, text: m.text + part }
                            : m,
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
        <Wrap>
            <TriggerForm onSubmit={send}>
                <Spark aria-hidden='true'>
                    <HiSparkles size={14} />
                </Spark>
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder='Ask AI about Daniel…'
                    aria-label='Ask AI about Daniel'
                />
                <SendBtn
                    type='submit'
                    disabled={isPending || !draft.trim()}
                    aria-label='Send'
                >
                    <FiSend size={14} />
                </SendBtn>
            </TriggerForm>

            <AnimatePresence>
                {isOpen && (
                    <Panel
                        key='panel'
                        initial={{ opacity: 0, scale: 0.94, y: -8, x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.94, y: -8, x: "-50%" }}
                        transition={{
                            duration: 0.25,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <PanelHead>
                            <HeadMark aria-hidden='true'>
                                <HiSparkles size={14} />
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
                    </Panel>
                )}
            </AnimatePresence>
        </Wrap>
    );
}
