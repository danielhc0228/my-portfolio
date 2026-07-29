import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FaGithub } from "react-icons/fa";

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

/* Transparent over the hero, glass once you start scrolling — so it never
   competes with the intro but stays legible over content. */
const Bar = styled.header<{ $scrolled: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: white;
`;

const Mark = styled.span`
    width: 40px;
    height: 40px;
    border-radius: 13px;
    display: grid;
    place-items: center;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0d0d0d;
    background: linear-gradient(
        110deg,
        #5ed6ff,
        #a384ff,
        #ff5c7a,
        #ffd166,
        #5ed6ff
    );
    background-size: 200% 100%;
    animation: ${gradientShift} 7s linear infinite;
    box-shadow: 0 0 22px rgba(140, 160, 255, 0.35);
    transition:
        transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.3s ease;

    ${Brand}:hover & {
        transform: scale(1.08) rotate(-4deg);
        box-shadow: 0 0 34px rgba(140, 160, 255, 0.6);
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;

        ${Brand}:hover & {
            transform: none;
        }
    }
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

const NavLink = styled(Link)`
    ${navItem}
`;

const NavAnchor = styled.a`
    ${navItem}
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
    const { pathname } = useLocation();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 24);
    });

    return (
        <Bar $scrolled={isScrolled}>
            <Brand to='/' aria-label='Daniel Chung — home'>
                <Mark aria-hidden='true'>DC</Mark>
                <BrandName>Daniel Chung</BrandName>
            </Brand>

            <Nav>
                <NavLink to='/' data-active={pathname === "/"}>
                    Home
                </NavLink>
                <NavAnchor
                    href='https://github.com/danielhc0228/my-portfolio'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <FaGithub size={15} />
                    Github
                </NavAnchor>
            </Nav>

            {isScrolled && <Progress style={{ scaleX: scrollYProgress }} />}
        </Bar>
    );
}
