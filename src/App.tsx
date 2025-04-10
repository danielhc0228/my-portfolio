import { useState } from "react";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import Me from "./components/Me";
import Projects from "./components/Projects";

function App() {
    const [isUnlocked, setIsUnlocked] = useState(true);
    return (
        <>
            <Intro isUnlocked={isUnlocked} setIsUnlocked={setIsUnlocked} />
            {isUnlocked ? (
                <>
                    <Me /> <Projects />
                </>
            ) : null}
            <Footer></Footer>
        </>
    );
}

export default App;
