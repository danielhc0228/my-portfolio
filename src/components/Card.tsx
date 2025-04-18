import styled from "styled-components";

// Card wrapper remains mostly the same
const Project = styled.div`
    background-color: white;
    width: 260px;
    height: 360px;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.4s ease;

    /* Entire card is grayscale by default */
    filter: grayscale(100%);

    &:hover {
        transform: scale(1.03);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);
        filter: grayscale(0%);
        cursor: pointer;
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    height: 60%;
    width: 100%;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: filter 0.4s ease;
    }
`;

// Title positioned over the image
const TitleOverlay = styled.h1`
    position: absolute;
    bottom: 0px;
    left: 12px;
    margin: 0;
    color: white;
    font-size: 25px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 0px 3px rgba(0, 0, 0, 1);

    z-index: 2;
`;

// Bottom half: content
const ContentWrapper = styled.div`
    height: 40%;
    padding: 16px 16px 40px 16px;
    position: relative;
`;

const Description = styled.p`
    font-size: 0.9rem;
    color: #444;
    line-height: 1.4;
    margin: 0 0 10px 0;
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;

const Tag = styled.span`
    background-color: #eee;
    color: #333;
    font-size: 0.7rem;
    padding: 3px 8px;
    border-radius: 12px;
`;

const LinkGroup = styled.div`
    position: absolute;
    bottom: 12px;
    left: 16px;
    display: flex;
    gap: 14px;
`;

const LinkButton = styled.a`
    font-size: 0.75rem;
    color: #0077ff;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

type CardProps = {
    title: string;
    description: string;
    tags: string[];
    sampleImg: string;
    gitLink: string;
    demoLink: string;
};

export default function Card({
    title,
    description,
    tags,
    sampleImg,
    gitLink,
    demoLink,
}: CardProps) {
    return (
        <Project>
            <ImageWrapper>
                <img src={sampleImg} alt='Project preview' />
                <TitleOverlay>{title}</TitleOverlay>
            </ImageWrapper>

            <ContentWrapper>
                <Description>{description.slice(0, 90)}...</Description>

                <TagContainer>
                    {tags.map((tag, idx) => (
                        <Tag key={idx}>{tag}</Tag>
                    ))}
                </TagContainer>

                <LinkGroup>
                    <LinkButton href={gitLink} target='_blank'>
                        GitHub
                    </LinkButton>
                    <LinkButton href={demoLink} target='_blank'>
                        Live Demo
                    </LinkButton>
                </LinkGroup>
            </ContentWrapper>
        </Project>
    );
}
