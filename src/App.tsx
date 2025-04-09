import { useState } from "react";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import Me from "./components/Me";

function App() {
    const [isUnlocked, setIsUnlocked] = useState(true);
    return (
        <>
            <Intro isUnlocked={isUnlocked} setIsUnlocked={setIsUnlocked} />
            {isUnlocked ? <Me /> : null}
            <Footer></Footer>
        </>
    );
}

export default App;
