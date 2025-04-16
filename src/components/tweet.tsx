import { styled } from "styled-components";
import { IPost } from "./timeline";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    margin-top: 10px;
`;

const Column = styled.div``;

const Username = styled.span`
    font-weight: 600;
    font-size: 14px;
`;

const PostDate = styled.span`
    padding-left: 10px;
    color: #a1a1a1;
    font-size: 14px;
`;

const Payload = styled.p`
    padding-top: 5px;
    font-size: 14px;
`;

export default function Post({ username, post, createdAt, id }: IPost) {
    const dateObj = new Date(createdAt);
    const formattedDate = dateObj.toISOString().split("T")[0];
    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                <PostDate>{formattedDate}</PostDate>
                <Payload key={id}>{post}</Payload>
            </Column>
        </Wrapper>
    );
}
