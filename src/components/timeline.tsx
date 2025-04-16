import {
    collection,
    /*getDocs,*/ limit,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
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
    margin-top: 30px;
    margin-bottom: 70px;
    height: 80vh;
    width: 50%;

    @media (max-width: 768px) {
        margin: 0px 5px;
    }
`;

const Posts = styled.div`
    display: flex;
    flex-direction: column;
    height: 90vh;
    max-height: 90vh;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    margin-top: 10px;
    overflow-y: auto;
`;

const Title = styled.h1`
    font-size: 32px;
    margin: 10px 0px;
`;

export default function Timeline() {
    const [posts, setPosts] = useState<IPost[]>([]);
    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchPosts = () => {
            const postsQuery = query(
                collection(db, "posts"),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            unsubscribe = onSnapshot(postsQuery, (snapshot) => {
                const posts = snapshot.docs.map((doc) => {
                    const { post, createdAt, username } = doc.data();
                    return {
                        post,
                        createdAt,
                        username,
                        id: doc.id,
                    };
                });
                setPosts(posts);
            });
        };

        fetchPosts();
        return () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            unsubscribe && unsubscribe();
        };
    }, []);
    return (
        <Wrapper>
            <Title>Posts</Title>
            <Posts>
                {posts.map((post) => (
                    <Post key={post.id} {...post} />
                ))}
            </Posts>
        </Wrapper>
    );
}
