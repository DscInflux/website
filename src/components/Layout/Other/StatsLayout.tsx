import React from 'react';

interface Props {
    name: string;
    description: string;
    stats?: string;
}

const StatsCard: React.FC<Props> = ({ name, description, stats }) => {
    return (
        <div className="stats-card">
            <div className="name">
                <p className="text-3xl font-semibold text-cyber-white">{name}</p>
                <hr className="mt-4" />
            </div>
            <div className="description">
                <p className="text-white/70">{description}</p>
                <p className="text-lg font-semibold text-white mt-2 text-center">{stats}</p>
            </div>
            <style jsx>{`
                .stats-card {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    animation: glowAnimation 5s ease-in-out infinite;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    transition: transform 0.3s;
                }

                .stats-card:hover {
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    transform: scale(1.05);
                }

                .name {
                    display: flex;
                    align-items: center;
                }

                .description {
                    background-color: #0c111b;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    margin-top: 0.5rem;
                }

                @keyframes glowAnimation {
                    0% {
                        box-shadow: 0 0 8px #00ff00;
                    }
                    50% {
                        box-shadow: 0 0 12px #00ff00;
                    }
                    100% {
                        box-shadow: 0 0 8px #00ff00;
                    }
                }
            `}</style>
        </div>
    );
}

export default StatsCard;
