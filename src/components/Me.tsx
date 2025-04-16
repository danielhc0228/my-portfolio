import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";

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
                    src='src\components\Images\MyEmoji.png'
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
                <span>Skills</span>
            </SectionTitle>
            <SkillsContainer>
                <SkillItem>
                    <SkillIcon src='/html.svg' alt='HTML' />
                    <SkillLabel>HTML</SkillLabel>
                </SkillItem>
                <SkillItem>
                    <SkillIcon src='/css.svg' alt='CSS' />
                    <SkillLabel>CSS</SkillLabel>
                </SkillItem>
                <SkillItem>
                    <SkillIcon src='/javascript.svg' alt='JavaScript' />
                    <SkillLabel>JavaScript</SkillLabel>
                </SkillItem>
                <SkillItem>
                    <SkillIcon src='/typescript.svg' alt='TypeScript' />
                    <SkillLabel>TypeScript</SkillLabel>
                </SkillItem>
                <SkillItem>
                    <SkillIcon src='/react.svg' alt='React' />
                    <SkillLabel>React</SkillLabel>
                </SkillItem>
                <SkillItem>
                    <SkillIcon src='/firebase.svg' alt='Firebase' />
                    <SkillLabel>Firebase</SkillLabel>
                </SkillItem>
            </SkillsContainer>
        </div>
    );
}
