import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className='bg-gray-800 text-white py-2 fixed bottom-0 w-full'>
            <div className='max-w-2xl mx-auto flex justify-around items-center'>
                <a href="https://www.linkedin.com/in/ankit-singh-tanwar" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="lg" />
                </a>
                <a href="https://github.com/ankit957173" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} size="lg" />
                </a>
                <a href="https://leetcode.com/ankit957173" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faCode} size="lg" />
                </a>
                <a href="https://twitter.com/i_m_Ankit_001" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                </a>
            </div>
            {/* <div className='text-center mt-2'>
                <p className='text-xs'>&copy; {new Date().getFullYear()} Ankit Singh Tanwar. All rights reserved.</p>
            </div> */}
        </footer>
    );
}

export default Footer;