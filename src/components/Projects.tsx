import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
    height: 100vh;
    color: white;
`;

const Title = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    color: white;
    margin-bottom: 12px;
`;

const TeamProjects = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
`;

const PersonalProjects = styled.div`
    display: flex;
`;

const SemiTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 20px;
`;

export default function Projects() {
    const projects = [
        {
            title: "Notion Clone",
            description: "Fullstack productivity app with React and Firebase.",
            tags: ["typescript", "React"],
        },
        {
            title: "Portfolio Site",
            description: "Responsive portfolio built with styled-components.",
            tags: ["typescript", "React"],
        },
        {
            title: "Weather App",
            description: "Live weather updates using OpenWeather API.",
            tags: ["typescript", "React"],
        },
        {
            title: "Weather App",
            description: "Live weather updates using OpenWeather API.",
            tags: ["typescript", "React"],
        },
        {
            title: "Weather App",
            description: "Live weather updates using OpenWeather API.",
            tags: ["typescript", "React"],
        },
        {
            title: "Weather App",
            description: "Live weather updates using OpenWeather API.",
            tags: ["typescript", "React"],
        },
        {
            title: "Weather App",
            description: "Live weather updates using OpenWeather API.",
            tags: ["typescript", "React"],
        },
        {
            title: "Weather App",
            description: "Live weather updates using OpenWeather API.",
            tags: ["typescript", "React"],
        },
        {
            title: "Weather App",
            description: "Live weather updates using OpenWeather API.",
            tags: ["typescript", "React"],
        },
    ];
    return (
        <Container>
            <Title>Projects</Title>
            <SemiTitle>Team Projects</SemiTitle>
            <TeamProjects>
                {projects.map((project, idx) => (
                    <Card
                        key={idx}
                        title={project.title}
                        description={project.description}
                        tags={project.tags}
                    />
                ))}
            </TeamProjects>
            <SemiTitle>Personal Projects</SemiTitle>
            <PersonalProjects></PersonalProjects>
        </Container>
    );
}
