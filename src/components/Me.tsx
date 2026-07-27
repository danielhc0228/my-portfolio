import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import styled, { css, keyframes } from "styled-components";
import SkillProjects from "./SkillProjects";

const skills = [
    { name: "HTML", icon: "/html.svg" },
    { name: "CSS", icon: "/css.svg" },
    { name: "JavaScript", icon: "/javascript.svg" },
    { name: "TypeScript", icon: "/typescript.svg" },
    { name: "React", icon: "/react.svg" },
    { name: "Firebase", icon: "/firebase.svg" },
    { name: "Next.js", icon: "/nextjs.svg" },
    { name: "Prisma", icon: "/prisma.png" },
    { name: "Supabase", icon: "/supabase.png" },
    { name: "Claude Code", icon: "/claude.png" },
    { name: "Gemini", icon: "/gemini.png" },
    { name: "Python", icon: "/python.png" },
    { name: "LangChain/Graph", icon: "/lang.png" },
];

const Container = styled.div`
    min-height: 100vh;
    padding-top: 50px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background: #0d0d0d;
    color: white;
    justify-content: center;
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Image = styled.img<{ $isVisible: boolean }>`
    height: 60vh;
    border-radius: 25%;
    opacity: 0;
    transform: translateY(50px);

    /* Responsive scaling */
    @media (max-width: 1024px) {
        height: 45vh;
    }

    @media (max-width: 768px) {
        height: 45vh;
    }

    @media (max-width: 480px) {
        height: 35vh;
    }

    ${(props) =>
        props.$isVisible &&
        css`
            animation: ${fadeInUp} 1s ease-out forwards;
        `}
`;

const InfoContainer = styled.div`
    height: 65vh;
    padding-left: 30px;
    padding-right: 30px;
    display: flex;
    align-items: center;
    background: #0d0d0d;
    color: white;
`;

const ContentWrapper = styled.div`
    width: 100%;
    max-width: 800px;
    text-align: center;
`;

const typing = keyframes`
  from { width: 0% }
  to { width: 100% }
`;

const SectionTitle = styled.h1<{ $isVisible: boolean }>`
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-align: center; // Always keep centered
    white-space: nowrap;
    overflow: hidden;
    background: #0d0d0d;

    span {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        width: ${(props) => (props.$isVisible ? "100%" : "0")};
        animation: ${(props) =>
            props.$isVisible
                ? css`
                      ${typing} 1s steps(22, end) forwards
                  `
                : "none"};
    }
`;

const SubTitle = styled.h2`
    font-size: 1rem;
    margin-bottom: 10px;
    color: #f4f4f4; /* Slightly lighter color for subtitles */
`;

const Divider = styled.hr`
    border: 1px solid #fff;
    width: 50%;
    margin: 10px auto;
`;

const SkillsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
    padding-top: 20px;
    padding-bottom: 130px;
    width: 100%;
    background: #0d0d0d;
`;

const SkillItem = styled.div<{ $isActive: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    border-radius: 12px;
    transition:
        transform 0.3s ease-in-out,
        background-color 0.3s ease-in-out;
    cursor: pointer;
    background-color: ${(props) =>
        props.$isActive ? "rgba(255, 255, 255, 0.1)" : "transparent"};

    &:hover {
        transform: scale(1.1);
    }
`;

const SkillIcon = styled.img`
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
`;

const SkillLabel = styled.span`
    color: #fff;
    font-size: 0.9rem;
    margin-top: 5px;
`;

export default function Me() {
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);

    const toggleSkill = (skillName: string) => {
        setSelectedSkill((prev) => (prev === skillName ? null : skillName));
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsImageVisible(true);
                    observer.disconnect(); // Stop observing once the image is visible
                }
            },
            { threshold: 0.5 }, // Image is considered visible when 50% of it is in the viewport
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }
        if (titleRef.current) {
            observer.observe(titleRef.current);
        }

        return () => {
            if (imageRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(imageRef.current);
            }
            if (titleRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(titleRef.current);
            }
        };
    }, []);

    return (
        <div>
            <Container>
                <Image
                    ref={imageRef}
                    src='\MyEmoji.png'
                    $isVisible={isImageVisible}
                />
                {/* <VerticalLine /> */}
                <InfoContainer>
                    <ContentWrapper>
                        <SectionTitle
                            ref={titleRef}
                            $isVisible={isImageVisible}
                        >
                            <span>Education</span>
                        </SectionTitle>
                        <Divider />
                        <SubTitle>
                            Bachelor of Computer Science | University of
                            Queensland (2024)
                        </SubTitle>
                        <SubTitle>
                            Graduate Certificate of Computer Science |
                            University of Queensland (In Progress)
                        </SubTitle>

                        <SectionTitle $isVisible={isImageVisible}>
                            <span>Experience</span>
                        </SectionTitle>
                        <Divider />
                        <SubTitle>Operations Supervisor | Multhana</SubTitle>
                        <SubTitle>
                            Sales Associate | Alien Night Market
                        </SubTitle>

                        <SectionTitle $isVisible={isImageVisible}>
                            <span>Core Philosophy</span>
                        </SectionTitle>
                        <Divider />
                        <SubTitle>
                            "Clean architecture, seamless user experience, and
                            continuous learning."
                        </SubTitle>
                    </ContentWrapper>
                </InfoContainer>
            </Container>
            <SectionTitle ref={titleRef} $isVisible={isImageVisible}>
                <span>Tech Stack</span>
            </SectionTitle>
            <SkillsContainer>
                {skills.map((skill) => (
                    <SkillItem
                        key={skill.name}
                        role='button'
                        tabIndex={0}
                        $isActive={selectedSkill === skill.name}
                        onClick={() => toggleSkill(skill.name)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleSkill(skill.name);
                            }
                        }}
                    >
                        <SkillIcon src={skill.icon} alt={skill.name} />
                        <SkillLabel>{skill.name}</SkillLabel>
                    </SkillItem>
                ))}
            </SkillsContainer>
            <AnimatePresence mode='wait'>
                {selectedSkill && (
                    <SkillProjects key={selectedSkill} skill={selectedSkill} />
                )}
            </AnimatePresence>
        </div>
    );
}
