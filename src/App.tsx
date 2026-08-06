import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import Me from "./components/Me";
import Projects from "./components/Projects";
import Board from "./components/Board";
import NotFound from "./components/NotFound";
import Header from "./components/Header";
import Loader from "./components/Loader";
import styled from "styled-components";

const TopBtn = styled.button`
    right: 20px;
    bottom: 20px;
    height: 50px;
    width: 50px;
    background-color: transparent;
    border-radius: 100%;
    color: white;
    border: 3px solid white;
    position: fixed;
    text-align: center;
    padding-top: 7px;
    z-index: 1;
    cursor: pointer;
    &:hover {
        background-color: white;
        color: black;
    }
`;

function App() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const goUp = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Mount the site only after the loader fades, so Intro's on-mount
    // animations start when it's actually visible.
    if (!isLoaded) return <Loader onDone={() => setIsLoaded(true)} />;

    return (
        <Router>
            <Header />

            <Routes>
                <Route
                    path='/'
                    element={
                        <>
                            <Intro
                                isUnlocked={isUnlocked}
                                setIsUnlocked={setIsUnlocked}
                            />
                            {isUnlocked && (
                                <div
                                    style={{
                                        marginTop: "100vh",
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    <Me />
                                    <Projects />
                                    <Board />
                                    <Footer />
                                </div>
                            )}
                        </>
                    }
                />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <TopBtn onClick={goUp}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18'
                    />
                </svg>
            </TopBtn>
        </Router>
    );
}

export default App;
