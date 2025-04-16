import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

    &:hover {
        background-color: white;
        color: black;
    }
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
                                <>
                                    <Me />
                                    <Projects />
                                </>
                            )}
                        </>
                    }
                />
                <Route path='/board' element={<Board />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <Footer />
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
