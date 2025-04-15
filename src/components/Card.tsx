import styled from "styled-components";

const Project = styled.div`
    background-color: white;
    width: 260px;
    height: 320px;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    padding: 24px 20px;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: scale(1.03);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);
        cursor: pointer;
    }
`;

const Title = styled.h1`
    font-size: 40px;
    font-weight: bold;
    color: #444;
`;

const Description = styled.p`
    font-size: 0.95rem;
    color: #444;
    margin-bottom: 20px;
    line-height: 1.4;
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const Tag = styled.span`
    background-color: #eee;
    color: #333;
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 12px;
`;

const LinkGroup = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    display: flex;
    gap: 16px;
`;

const LinkButton = styled.a`
    font-size: 0.8rem;
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
    gitLink: string;
    demoLink: string;
};

export default function Card({
    title,
    description,
    tags,
    gitLink,
    demoLink,
}: CardProps) {
    return (
        <>
            <Project>
                <Title>{title}</Title>
                <Description>{description}</Description>

                <TagContainer>
                    {tags.map((tag, idx) => (
                        <Tag key={idx}>{tag}</Tag>
                    ))}
                </TagContainer>

                <LinkGroup>
                    {
                        <LinkButton href={gitLink} target='_blank'>
                            GitHub
                        </LinkButton>
                    }
                    {
                        <LinkButton href={demoLink} target='_blank'>
                            Live Demo
                        </LinkButton>
                    }
                </LinkGroup>
            </Project>
        </>
    );
}
