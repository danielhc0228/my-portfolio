import styled from "styled-components";
import { useState } from "react";
import Footer from "./components/Footer";
import Intro from "./components/Intro";

const Lock = styled.div`
    height: 100vh;
    background-color: black;
`;

const Unlock = styled.div`
    height: 100vh;
    background-color: #dddd8d;
`;

function App() {
    const [isLocked, setIsLocked] = useState(true);
    const onMouseClick = () => {
        setIsLocked(!isLocked);
    };
    return (
        <>
            <Intro />
            <button onClick={onMouseClick}>Click me</button>
            {isLocked ? <Lock></Lock> : <Unlock></Unlock>}
            <Footer></Footer>
        </>
    );
}

export default App;
