import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiMoon, FiSun } from "react-icons/fi";

/* The <html> data attribute is the single source of truth — index.html sets it
   before first paint, so state is seeded from the DOM rather than from
   localStorage a second time. */
const readMode = () =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const Button = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: rgba(var(--fg), 0.62);
    cursor: pointer;
    transition:
        color 0.25s ease,
        background 0.25s ease;

    &:hover {
        color: var(--text);
        background: rgba(var(--fg), 0.07);
    }
`;

export default function ThemeToggle() {
    const [mode, setMode] = useState(readMode);

    useEffect(() => {
        document.documentElement.dataset.theme = mode;
        try {
            localStorage.setItem("theme", mode);
        } catch {
            // Private-mode Safari and friends: the toggle still works, it just
            // won't be remembered.
        }
    }, [mode]);

    const next = mode === "dark" ? "light" : "dark";

    return (
        <Button
            type='button'
            onClick={() => setMode(next)}
            aria-label={`Switch to ${next} mode`}
            title={`Switch to ${next} mode`}
        >
            {mode === "dark" ? <FiSun size={15} /> : <FiMoon size={15} />}
        </Button>
    );
}
