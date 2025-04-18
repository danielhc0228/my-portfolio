import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import Me from "./components/Me";
import Projects from "./components/Projects";
import Board from "./components/Board";
import NotFound from "./components/NotFound";
import Header from "./components/Header";
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

const BoardBtn = styled(TopBtn)`
    bottom: 80px;
`;

function App() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const goUp = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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
                                    <Footer />
                                </div>
                            )}
                        </>
                    }
                />
                <Route path='/board' element={<Board />} />
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
            <BoardBtn>
                <Link to='/board'>
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
                            d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
                        />
                    </svg>
                </Link>
            </BoardBtn>
        </Router>
    );
}

export default App;
