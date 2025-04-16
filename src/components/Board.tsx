import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Timeline from "./timeline";

const Container = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0d0d0d;
    color: white;
    gap: 40px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 30%;
    gap: 10px;
`;

const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
        sans-serif;
    &::placeholder {
        font-size: 16px;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf0;
    }
`;

const NameTextArea = styled(TextArea)`
    padding: 10px;
`;

const SubmitBtn = styled.input`
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 0px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`;

export default function Board() {
    const [isLoading, setLoading] = useState(false);
    const [post, setPosts] = useState("");
    const [username, setUsername] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPosts(e.target.value);
    };
    const onChangeName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUsername(e.target.value);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading || post === "" || post.length > 180) return;
        try {
            setLoading(true);
            await addDoc(collection(db, "posts"), {
                post,
                createdAt: Date.now(),
                username: username || "Anonymous",
            });
            setPosts("");
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Form onSubmit={onSubmit}>
                <NameTextArea
                    required
                    rows={1}
                    maxLength={20}
                    onChange={onChangeName}
                    value={username}
                    placeholder='What is your nickname?'
                />
                <TextArea
                    required
                    rows={5}
                    maxLength={500}
                    onChange={onChange}
                    value={post}
                    placeholder='What is happening?!'
                />
                <SubmitBtn
                    type='submit'
                    value={isLoading ? "Posting..." : "Post your thoughts"}
                />
            </Form>
            <Timeline />
        </Container>
    );
}
