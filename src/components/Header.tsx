import { Link } from "react-router-dom";
import { useState } from "react";
import AskAI from "./AskAI";
import styled, { css } from "styled-components";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FaGithub } from "react-icons/fa";

/* Transparent over the hero, glass once you start scrolling — so it never
   competes with the intro but stays legible over content. */
const Bar = styled.header<{ $scrolled: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 40;
    /* Equal 1fr gutters keep the composer on the true centre line even when
       the brand collapses to nothing on mobile. */
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
    padding: 14px clamp(18px, 5vw, 48px);
    transition:
        background 0.35s ease,
        backdrop-filter 0.35s ease,
        border-color 0.35s ease,
        box-shadow 0.35s ease;
    border-bottom: 1px solid transparent;

    ${(props) =>
        props.$scrolled &&
        css`
            background: rgba(13, 13, 13, 0.72);
            backdrop-filter: blur(14px);
            border-bottom-color: rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
        `}
`;

const Brand = styled(Link)`
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: white;
`;

const BrandName = styled.span`
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;

    @media (max-width: 620px) {
        display: none;
    }
`;

const Nav = styled.nav`
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
`;

/* Shared by the router link and the external anchor. Active state rides on a
   data attribute so neither element needs a transient prop. */
const navItem = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 0.88rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.62);
    transition:
        color 0.25s ease,
        background 0.25s ease;

    &:hover,
    &[data-active="true"] {
        color: #fff;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.07);
    }

    /* Gradient underline that wipes out from the centre. */
    &::after {
        content: "";
        position: absolute;
        left: 16px;
        right: 16px;
        bottom: 5px;
        height: 2px;
        border-radius: 2px;
        background: linear-gradient(90deg, #5ed6ff, #a384ff);
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }

    &:hover::after,
    &[data-active="true"]::after {
        transform: scaleX(1);
    }

    @media (prefers-reduced-motion: reduce) {
        &::after {
            transition: none;
        }
    }
`;

const NavAnchor = styled.a`
    ${navItem}

    @media (max-width: 620px) {
        padding: 8px 10px;
    }
`;

/* Mobile keeps the mark only — the bar has to make room for the AI composer. */
const NavLabel = styled.span`
    @media (max-width: 620px) {
        display: none;
    }
`;

/* Doubles as decoration and a genuine read on how far down the page you are. */
const Progress = styled(motion.div)`
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    transform-origin: 0% 50%;
    background: linear-gradient(90deg, #5ed6ff, #a384ff, #ff5c7a, #ffd166);
`;

export default function Header() {
    const [isScrolled, setScrolled] = useState(false);
    const { scrollY, scrollYProgress } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 24);
    });

    return (
        <Bar $scrolled={isScrolled}>
            <Brand to='/' aria-label='Daniel Chung — home'>
                <BrandName>Daniel Chung</BrandName>
            </Brand>

            <AskAI />

            <Nav>
                <NavAnchor
                    href='https://github.com/danielhc0228/my-portfolio'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <FaGithub size={15} />
                    <NavLabel>Github</NavLabel>
                </NavAnchor>
            </Nav>

            {isScrolled && <Progress style={{ scaleX: scrollYProgress }} />}
        </Bar>
    );
}
