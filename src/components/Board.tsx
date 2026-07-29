import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { styled, keyframes, css } from "styled-components";
import { db } from "../firebase";
import Timeline from "./timeline";

/* Single source of truth for the limit — the old code capped the textarea at
   500 but silently rejected anything over 180 on submit. */
const MAX_LENGTH = 500;
const NAME_MAX_LENGTH = 20;
const ACCENT = "77, 163, 255";

const Section = styled.section`
    background: #0d0d0d;
    color: white;
    padding: clamp(60px, 10vh, 120px) 0 clamp(80px, 12vh, 140px);
`;

const Inner = styled.div`
    width: min(1180px, 88vw);
    margin: 0 auto;
`;

const Title = styled.h1`
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: bold;
    margin: 0 0 10px;
`;

const Lede = styled.p`
    margin: 0 0 clamp(28px, 5vh, 48px);
    max-width: 52ch;
    font-size: 0.95rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.45);
`;

const Layout = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(24px, 4vw, 48px);
    align-items: start;

    @media (min-width: 900px) {
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    }
`;

const ComposeCard = styled.form`
    --accent: ${ACCENT};
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: clamp(20px, 2.6vw, 30px);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition:
        border-color 0.35s ease,
        box-shadow 0.35s ease;

    /* Lights the whole card while the user is typing anywhere inside it. */
    &:focus-within {
        border-color: rgba(var(--accent), 0.45);
        box-shadow: 0 0 40px rgba(var(--accent), 0.14);
    }

    @media (min-width: 900px) {
        position: sticky;
        top: 100px;
    }
`;

const Label = styled.label`
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
`;

const fieldStyles = css`
    width: 100%;
    padding: 13px 16px;
    border-radius: 14px;
    font-size: 15px;
    font-family: inherit;
    color: white;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition:
        border-color 0.25s ease,
        background 0.25s ease;

    &::placeholder {
        color: rgba(255, 255, 255, 0.28);
    }

    &:focus {
        outline: none;
        border-color: rgba(var(--accent), 0.7);
        background: rgba(0, 0, 0, 0.5);
    }
`;

/* A nickname is one line — an <input> gives the right keyboard, the right
   Enter behaviour and no resize handle. */
const NameInput = styled.input`
    ${fieldStyles}
`;

const TextArea = styled.textarea`
    ${fieldStyles}
    min-height: 130px;
    resize: vertical;
    line-height: 1.6;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 7px;
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
`;

const Counter = styled.span<{ $state: "ok" | "warn" | "over" }>`
    font-size: 0.78rem;
    font-variant-numeric: tabular-nums;
    color: ${(props) =>
        props.$state === "over"
            ? "rgb(255, 107, 107)"
            : props.$state === "warn"
              ? "rgb(255, 196, 88)"
              : "rgba(255, 255, 255, 0.35)"};
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.span`
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: white;
    animation: ${spin} 0.7s linear infinite;
`;

const SubmitBtn = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 12px 26px;
    border-radius: 999px;
    border: 1px solid rgba(var(--accent), 0.6);
    background: rgba(var(--accent), 0.16);
    color: white;
    font-size: 0.92rem;
    font-weight: 600;
    cursor: pointer;
    transition:
        background 0.25s ease,
        color 0.25s ease,
        transform 0.2s ease,
        opacity 0.25s ease;

    &:hover:not(:disabled) {
        background: rgba(var(--accent), 0.9);
        color: #0d0d0d;
        transform: translateY(-2px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

const Status = styled.p<{ $tone: "error" | "success" }>`
    margin: 0;
    font-size: 0.82rem;
    color: ${(props) =>
        props.$tone === "error"
            ? "rgb(255, 107, 107)"
            : "rgb(120, 230, 170)"};
`;

export default function Board() {
    const [isLoading, setLoading] = useState(false);
    const [post, setPost] = useState("");
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState<{
        tone: "error" | "success";
        message: string;
    } | null>(null);

    const trimmed = post.trim();
    const isOverLimit = post.length > MAX_LENGTH;
    const canSubmit = !isLoading && trimmed.length > 0 && !isOverLimit;

    const counterState = isOverLimit
        ? "over"
        : post.length > MAX_LENGTH * 0.9
          ? "warn"
          : "ok";

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;
        try {
            setLoading(true);
            setStatus(null);
            await addDoc(collection(db, "posts"), {
                post: trimmed,
                createdAt: Date.now(),
                username: username.trim() || "Anonymous",
            });
            setPost("");
            setStatus({ tone: "success", message: "Posted — thanks!" });
        } catch (error) {
            console.error("Failed to add comment", error);
            setStatus({
                tone: "error",
                message: "Couldn't post that. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Section id='comments'>
            <Inner>
                <Title>Comments</Title>
                <Lede>
                    A live guestbook backed by Firebase Firestore — new comments
                    appear here in real time, no refresh needed.
                </Lede>

                <Layout>
                    <ComposeCard onSubmit={onSubmit}>
                        <Field>
                            <Label htmlFor='comment-name'>Nickname</Label>
                            <NameInput
                                id='comment-name'
                                type='text'
                                maxLength={NAME_MAX_LENGTH}
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                placeholder='Anonymous'
                                autoComplete='off'
                            />
                        </Field>

                        <Field>
                            <Label htmlFor='comment-body'>Message</Label>
                            <TextArea
                                id='comment-body'
                                required
                                rows={5}
                                maxLength={MAX_LENGTH}
                                onChange={(e) => setPost(e.target.value)}
                                value={post}
                                placeholder='Leave a note, some feedback, or just say hi.'
                            />
                        </Field>

                        <Footer>
                            <Counter $state={counterState}>
                                {post.length} / {MAX_LENGTH}
                            </Counter>
                            <SubmitBtn type='submit' disabled={!canSubmit}>
                                {isLoading && <Spinner aria-hidden='true' />}
                                {isLoading ? "Posting…" : "Post comment"}
                            </SubmitBtn>
                        </Footer>

                        {status && (
                            <Status $tone={status.tone} role='status'>
                                {status.message}
                            </Status>
                        )}
                    </ComposeCard>

                    <Timeline />
                </Layout>
            </Inner>
        </Section>
    );
}
