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

const HeaderLinks = styled.a`
    border-bottom: 2px solid white;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-8px);
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
            <HeaderLinks
                href='https://github.com/danielhc0228/my-portfolio'
                target='_blank'
            >
                Github
            </HeaderLinks>
            <HeaderLinks>
                <Link to='/board'>Contact</Link>
            </HeaderLinks>
        </Container>
    );
}
