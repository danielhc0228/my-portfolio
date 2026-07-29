import { styled } from "styled-components";
import { motion } from "framer-motion";
import { IPost } from "./timeline";

/* Deterministic hue per nickname, so the same person keeps the same avatar
   colour across visits without storing anything extra in Firestore. */
function hueFromName(name: string) {
    let hash = 7;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) % 360;
    }
    return hash;
}

function formatRelative(timestamp: number) {
    if (!timestamp) return "";
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const Wrapper = styled(motion.article)<{ $hue: number }>`
    --hue: ${(props) => props.$hue};
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 14px;
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    transition:
        border-color 0.3s ease,
        background 0.3s ease,
        transform 0.3s ease;

    &:hover {
        transform: translateX(3px);
        border-color: hsla(var(--hue), 80%, 65%, 0.4);
        background: rgba(255, 255, 255, 0.05);
    }

    @media (prefers-reduced-motion: reduce) {
        &:hover {
            transform: none;
        }
    }
`;

const Avatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 15px;
    font-weight: 700;
    color: hsl(var(--hue), 85%, 80%);
    background: hsla(var(--hue), 70%, 55%, 0.18);
    border: 1px solid hsla(var(--hue), 75%, 65%, 0.45);
    user-select: none;
`;

const Head = styled.div`
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 14px;
    color: #fff;
`;

const PostDate = styled.time`
    color: rgba(255, 255, 255, 0.38);
    font-size: 12px;
`;

const Payload = styled.p`
    margin: 6px 0 0;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.78);
    /* Keeps the author's line breaks and stops one long unbroken string from
       blowing out the column width. */
    white-space: pre-wrap;
    overflow-wrap: anywhere;
`;

export default function Post({ username, post, createdAt }: IPost) {
    const name = username || "Anonymous";
    const hue = hueFromName(name);

    return (
        <Wrapper
            $hue={hue}
            layout
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
            <Avatar aria-hidden='true'>{name.charAt(0).toUpperCase()}</Avatar>
            <div>
                <Head>
                    <Username>{name}</Username>
                    <PostDate
                        dateTime={
                            createdAt
                                ? new Date(createdAt).toISOString()
                                : undefined
                        }
                        title={
                            createdAt
                                ? new Date(createdAt).toLocaleString()
                                : undefined
                        }
                    >
                        {formatRelative(createdAt)}
                    </PostDate>
                </Head>
                <Payload>{post}</Payload>
            </div>
        </Wrapper>
    );
}
