import styled from "styled-components";
import { useState } from "react";
import Footer from "./Footer";

const Intro = styled.div`
    height: 100vh;
    background-color: #949494;
`;

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
            <Intro>
                Hi, I am Daniel<button onClick={onMouseClick}>Click me</button>
            </Intro>
            {isLocked ? <Lock></Lock> : <Unlock></Unlock>}
            <Footer></Footer>
        </>
    );
}

export default App;
