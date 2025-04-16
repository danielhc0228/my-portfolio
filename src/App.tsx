import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import Me from "./components/Me";
import Projects from "./components/Projects";
import Board from "./components/Board";
import NotFound from "./components/NotFound";
import Header from "./components/Header";

function App() {
    const [isUnlocked, setIsUnlocked] = useState(true);
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

            <Footer></Footer>
        </Router>
    );
}

export default App;
