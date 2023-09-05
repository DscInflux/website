import React, { useState } from "react";

export default function PartnerCard({
  title,
  banner,
  desc,
  link1,
  link1Title,
  link1Icon,
}) {
  const [isCustomBackground, setIsCustomBackground] = useState(false);

  const handleClick = () => {
    setIsCustomBackground((prev) => !prev);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg">
      <div className={`p-3 ${banner} hover:scale-105 transition-transform`}>
        <div className="flex items-center justify-center">
          <p className="text-2xl font-semibold text-cyber-pink">{title}</p>
        </div>
      </div>
      <div className="px-6 py-4 text-center">
        <p className="text-gray-400">{desc}</p>
      </div>
      <div className="flex justify-center pb-3">
        <a
          href={link1}
          target="_blank"
          className="rounded-full px-6 py-2 bg-cyber-pink text-white hover:bg-opacity-90 focus:outline-none transform hover:scale-105 transition-transform neon-glow"
          rel="noreferrer"
        >
          <i className={`mr-2 fas ${link1Icon}`} />
          {link1Title}
        </a>
      </div>
      <style jsx>{`
        @keyframes glowAnimation {
          0% {
            box-shadow: 0 0 8px rgba(250, 42, 161, 0.6);
          }
          50% {
            box-shadow: 0 0 12px rgba(250, 42, 161, 0.9);
          }
          100% {
            box-shadow: 0 0 8px rgba(250, 42, 161, 0.6);
          }
        }

        /* Existing styles that are being used */
        .text-cyber-pink {
          color: #fa2aa1;
        }

        .neon-glow {
          animation: glowAnimation 2s ease-in-out infinite;
        }

        .bg-cyber-pink {
          background-color: #fa2aa1;
        }

        /* Additional styles */
        .text-gray-400 {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
