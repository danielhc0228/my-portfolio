// components/NotFound.jsx
import styled from "styled-components";
const Container = styled.div`
    height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    color: var(--text);
`;
function NotFound() {
    return (
        <Container>
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
        </Container>
    );
}

export default NotFound;
