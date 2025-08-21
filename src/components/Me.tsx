import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";

const skills = [
    {
        name: "HTML",
        icon: "/html.svg",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },
    {
        name: "CSS",
        icon: "/css.svg",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },
    {
        name: "JavaScript",
        icon: "/javascript.svg",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
        name: "TypeScript",
        icon: "/typescript.svg",
        url: "https://www.typescriptlang.org/",
    },
    { name: "React", icon: "/react.svg", url: "https://reactjs.org/" },
    {
        name: "Firebase",
        icon: "/firebase.svg",
        url: "https://firebase.google.com/",
    },
    { name: "Next.js", icon: "/nextjs.svg", url: "https://nextjs.org/" },
    { name: "Prisma", icon: "/prisma.png", url: "https://www.prisma.io/" },
    { name: "Supabase", icon: "/supabase.png", url: "https://supabase.com/" },
];

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: #0d0d0d;
    color: white;
    justify-content: space-around;
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
        height: 35vh;
    }

    @media (max-width: 480px) {
        height: 25vh;
    }

    ${(props) =>
        props.$isVisible &&
        css`
            animation: ${fadeInUp} 1s ease-out forwards;
        `}
`;

const VerticalLine = styled.div`
    height: 200px;
    border-left: 4px solid white;
`;

const InfoContainer = styled.div`
    height: 65vh;
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

const SkillItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;

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
    const imageRef = useRef<HTMLImageElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsImageVisible(true);
                    observer.disconnect(); // Stop observing once the image is visible
                }
            },
            { threshold: 0.5 } // Image is considered visible when 50% of it is in the viewport
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
                <VerticalLine />
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
                            2021/03 ~ 2024/07 University of Queensland (Bachelor
                            of Computer Science)
                        </SubTitle>

                        <SectionTitle $isVisible={isImageVisible}>
                            <span>Experience</span>
                        </SectionTitle>
                        <Divider />
                        <SubTitle>
                            Bus Sanitiser, Waterless Car Wash - Multhana
                        </SubTitle>
                        <SubTitle>Cashier - Alien Night Market</SubTitle>

                        <SectionTitle $isVisible={isImageVisible}>
                            <span>Career Goal</span>
                        </SectionTitle>
                        <Divider />
                        <SubTitle>
                            Build and get involved in a Project that anyone
                            would know.
                        </SubTitle>
                    </ContentWrapper>
                </InfoContainer>
            </Container>
            <SectionTitle ref={titleRef} $isVisible={isImageVisible}>
                <span>Tech Stack</span>
            </SectionTitle>
            <SkillsContainer>
                {skills.map((skill) => (
                    <a
                        key={skill.name}
                        href={skill.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ textDecoration: "none" }}
                    >
                        <SkillItem>
                            <SkillIcon src={skill.icon} alt={skill.name} />
                            <SkillLabel>{skill.name}</SkillLabel>
                        </SkillItem>
                    </a>
                ))}
            </SkillsContainer>
        </div>
    );
}
