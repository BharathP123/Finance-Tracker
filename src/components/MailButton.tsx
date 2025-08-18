import React from 'react';
import { FaEnvelope } from 'react-icons/fa'; // Using 'react-icons' for the envelope icon

interface MailButtonProps {
  email: string;  // Allows dynamic email address
}

const MailButton: React.FC<MailButtonProps> = ({ email }) => {
  return (
    <a
      href={`mailto:${email}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-16 left-5 z-50 flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg transition-all duration-300 transform hover:bg-blue-600 hover:scale-105"
      title={`Send an email to ${email}`}
    >
      <FaEnvelope className="w-6 h-6" />
    </a>
  );
};

MailButton.defaultProps = {
  email: 'your-email@example.com',  // Default email address if none provided
};

export default MailButton;
