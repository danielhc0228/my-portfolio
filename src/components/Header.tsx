import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    position: absolute;
    top: 30px;
    left: 30px;
    width: 100%;
    display: flex;
    gap: 20px;
`;

const HeaderLinks = styled.div`
    border-bottom: 2px solid white;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 5px 10px rgba(54, 54, 54, 0.6);
        cursor: pointer;
    }
`;

export default function Header() {
    return (
        <Container>
            <HeaderLinks>
                <Link to='/'>Home</Link>
            </HeaderLinks>
            <HeaderLinks>
                <a
                    href='https://github.com/danielhc0228/my-portfolio'
                    target='_blank'
                >
                    Github
                </a>
            </HeaderLinks>
            <HeaderLinks>
                <Link to='/board'>Board</Link>
            </HeaderLinks>
        </Container>
    );
}
