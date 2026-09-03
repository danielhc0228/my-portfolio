import styled, { keyframes } from "styled-components";
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa"; // Using Lucide icons

const FooterContainer = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 50vh;
    gap: 20px;
    background: #0d0d0d;
    color: #fff;
    padding: 130px 0;
`;

const FooterContent = styled.div`
    max-width: 1200px;
    padding-top: 50px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SocialIcons = styled.div`
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
`;

/* Each link hovers to its own brand colour. Instagram's identity is a
   gradient, so it takes the pink its logo resolves to at one stop. */
const Social = styled.a<{ $brand: string }>`
    color: white;
    display: inline-flex;
    transition: color 0.3s ease-in-out;

    &:hover {
        color: ${(props) => props.$brand};
    }
`;

const FooterLinks = styled.div`
    display: flex;
    gap: 15px;
    margin-bottom: 10px;

    a {
        color: white;
        text-decoration: none;
        font-size: 14px;
        transition: opacity 0.3s ease-in-out;
        &:hover {
            opacity: 0.7;
        }
    }
`;

const Copyright = styled.p`
    font-size: 12px;
    opacity: 0.6;
`;

const TextWrapper = styled.div`
    text-align: center;
`;

const typing = keyframes`
  from { width: 0% }
  to { width: 100% }
`;

const blink = keyframes`
  0%, 100% { border-color: transparent }
  50% { border-color: white }
`;

const TypingText = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    border-right: 3px solid white;
    width: 0%;
    animation: ${typing} 1s steps(22, end) forwards,
        ${blink} 0.75s step-end infinite;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FadeInText = styled.h2`
    font-size: 2rem;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
    opacity: 0;
    animation: ${fadeIn} 0.5s ease-in forwards;
    animation-delay: 1s;
`;

function Footer() {
    return (
        <FooterContainer>
            <TextWrapper>
                <TypingText>Contact</TypingText>
            </TextWrapper>
            <FadeInText>
                Please give me a message if you want to work with me!
            </FadeInText>
            <FooterContent>
                <SocialIcons>
                    <Social
                        href='https://www.facebook.com/daniel.chung.7509836/'
                        target='_blank'
                        $brand='#1877f2'
                        aria-label='Facebook'
                    >
                        <FaFacebook size={20} />
                    </Social>
                    <Social
                        href='https://github.com/danielhc0228'
                        target='_blank'
                        $brand='#8b949e'
                        aria-label='GitHub'
                    >
                        <FaGithub size={20} />
                    </Social>
                    <Social
                        href='https://www.instagram.com/danielchung2802/'
                        target='_blank'
                        $brand='#e1306c'
                        aria-label='Instagram'
                    >
                        <FaInstagram size={20} />
                    </Social>
                    <Social
                        href='https://www.linkedin.com/in/daniel-chung-83451522b/'
                        target='_blank'
                        $brand='#0a66c2'
                        aria-label='LinkedIn'
                    >
                        <FaLinkedin size={20} />
                    </Social>
                </SocialIcons>

                <FooterLinks>
                    <a href='https://github.com/danielhc0228/my-portfolio'>
                        Github
                    </a>
                    <a href='mailto:daniel20020228@gmail.com'>Contact</a>
                </FooterLinks>

                <Copyright>
                    © {new Date().getFullYear()} Daniel's Portfolio. All Rights
                    Reserved.
                </Copyright>
            </FooterContent>
        </FooterContainer>
    );
}

export default Footer;
