import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled, keyframes } from "styled-components";
import { AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import Post from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface IPost {
    id: string;
    post: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 0;
`;

const Head = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
`;

const HeadTitle = styled.h3`
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
`;

const Count = styled.span`
    font-size: 0.75rem;
    padding: 3px 9px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.55);
`;

const blink = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.35; transform: scale(0.8); }
`;

/* onSnapshot keeps this list live, so say so. */
const LiveTag = styled.span`
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(120, 230, 170, 0.8);

    &::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgb(90, 225, 150);
        animation: ${blink} 2s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
        &::before {
            animation: none;
        }
    }
`;

const Posts = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: min(560px, 60vh);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 8px;

    /* Fades the list out at the scroll edges instead of cutting it off. */
    mask-image: linear-gradient(
        to bottom,
        transparent 0,
        #000 18px,
        #000 calc(100% - 24px),
        transparent 100%
    );

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.16);
        border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Skeleton = styled.div`
    height: 84px;
    border-radius: 18px;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.03) 25%,
        rgba(255, 255, 255, 0.08) 50%,
        rgba(255, 255, 255, 0.03) 75%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.6s linear infinite;
`;

const Empty = styled.div`
    padding: 40px 20px;
    text-align: center;
    border-radius: 18px;
    border: 1px dashed rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.9rem;
    line-height: 1.6;
`;

export default function Timeline() {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchPosts = () => {
            const postsQuery = query(
                collection(db, "posts"),
                orderBy("createdAt", "desc"),
                limit(25),
            );
            unsubscribe = onSnapshot(
                postsQuery,
                (snapshot) => {
                    setPosts(
                        snapshot.docs.map((doc) => {
                            const { post, createdAt, username } = doc.data();
                            return { post, createdAt, username, id: doc.id };
                        }),
                    );
                    setLoading(false);
                },
                (error) => {
                    console.error("Failed to subscribe to posts", error);
                    setLoading(false);
                },
            );
        };

        fetchPosts();
        return () => {
            unsubscribe?.();
        };
    }, []);

    return (
        <Wrapper>
            <Head>
                <HeadTitle>Recent</HeadTitle>
                {!isLoading && <Count>{posts.length}</Count>}
                <LiveTag>live</LiveTag>
            </Head>

            {isLoading ? (
                <Posts>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </Posts>
            ) : posts.length === 0 ? (
                <Empty>
                    No comments yet.
                    <br />
                    Be the first to leave one.
                </Empty>
            ) : (
                <Posts>
                    <AnimatePresence initial={false}>
                        {posts.map((post) => (
                            <Post key={post.id} {...post} />
                        ))}
                    </AnimatePresence>
                </Posts>
            )}
        </Wrapper>
    );
}
