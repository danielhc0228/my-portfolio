import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import Me from "./components/Me";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

function App() {
    const [isUnlocked, setIsUnlocked] = useState(true);
    return (
        <Router>
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
                <Route path='/contact' element={<Contact />} />
            </Routes>

            <Footer></Footer>
        </Router>
    );
}

export default App;
