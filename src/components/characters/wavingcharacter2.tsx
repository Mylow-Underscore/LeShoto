import React from 'react';

const WavingCharacter2: React.FC = () => {
    return (
        <>
            <div className="max-md:hidden md:flex" style={styles.container}>
                <style>
                    {`
                        @keyframes waveArm {
                            0% { transform: rotate(0deg); }
                            25% { transform: rotate(15deg); }
                            50% { transform: rotate(-5deg); }
                            75% { transform: rotate(15deg); }
                            100% { transform: rotate(0deg); }
                        }

                        @keyframes pulseLine1 {
                            0%, 100% { opacity: 0; transform: translateY(10px) scale(0.8); }
                            50% { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        @keyframes pulseLine2 {
                            0%, 100% { opacity: 0.3; transform: translateY(5px) scale(0.9); }
                            50% { opacity: 1; transform: translateY(-5px) scale(1.1); }
                        }
                        @keyframes pulseLine3 {
                            0%, 100% { opacity: 0; transform: translateY(15px) scale(0.7); }
                            50% { opacity: 1; transform: translateY(0) scale(1.2); }
                        }
                        
                        @keyframes waveRightArm {
                            0% { transform: rotate(0deg); }
                            25% { transform: rotate(-10deg); }
                            50% { transform: rotate(5deg); }
                            75% { transform: rotate(-10deg); }
                            100% { transform: rotate(0deg); }
                        }

                        .pink-stroke {
                            stroke: #ff66c4;
                            fill: none;
                            stroke-width: 12;
                            stroke-linecap: square;
                            stroke-linejoin: miter;
                        }

                        .pink-fill {
                            fill: #ff66c4;
                        }

                        /* Transform origin is set roughly at the shoulder joint */
                        .waving-arm-group {
                            transform-origin: 245px 215px; /* Adjusted to right shoulder */
                            animation: waveRightArm 4.5s ease-in-out infinite;
                        }

                        /* Group for the action lines */
                        .action-lines-group {
                            transform-origin: 60px 100px;
                            transform: translate(-30px, -20px);
                        }
                        
                        .line-1 { animation: pulseLine1 1.5s ease-in-out infinite 0.1s; transform-origin: 20px 80px;}
                        .line-2 { animation: pulseLine2 1s ease-in-out infinite 0.2s; transform-origin: 90px 60px;}
                        .line-3 { animation: pulseLine3 1s ease-in-out infinite 0.3s; transform-origin: 120px 40px;}
                    `}
                </style>

                {}
                <div style={styles.svgContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
                        <g transform="translate(60, 40)">
                            
                            <rect x="150" y="80" width="90" height="110" className="pink-stroke" />
                            <line x1="195" y1="110" x2="195" y2="160" stroke="#ff66c4" strokeWidth="14" strokeLinecap="butt" />
                            <path d="M 165 40 Q 195 20 225 40 L 210 60 Q 195 45 180 60 Z" className="pink-stroke" strokeWidth="6" strokeLinejoin="round" />
                            <rect x="157" y="215" width="76" height="135" className="pink-stroke" />
                            <line x1="195" y1="260" x2="233" y2="260" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />
                            <line x1="157" y1="305" x2="195" y2="305" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />
                            <line x1="172" y1="355" x2="172" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />
                            <line x1="215" y1="355" x2="245" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />
                            <polyline points="157,215 120,280 145,340" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />
                            <g className="waving-arm-group">
                                <polyline points="233,215 285,270 355,270" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />
                            </g>

                        </g>
                    </svg>
                </div>
            </div>

            <div className="max-md:flex md:hidden" style={styles.containermobile}>
                <style>
                    {`
                        @keyframes waveArm {
                            0% { transform: rotate(0deg); }
                            25% { transform: rotate(15deg); }
                            50% { transform: rotate(-5deg); }
                            75% { transform: rotate(15deg); }
                            100% { transform: rotate(0deg); }
                        }

                        @keyframes pulseLine1 {
                            0%, 100% { opacity: 0; transform: translateY(10px) scale(0.8); }
                            50% { opacity: 1; transform: translateY(0) scale(1); }
                        }
                        @keyframes pulseLine2 {
                            0%, 100% { opacity: 0.3; transform: translateY(5px) scale(0.9); }
                            50% { opacity: 1; transform: translateY(-5px) scale(1.1); }
                        }
                        @keyframes pulseLine3 {
                            0%, 100% { opacity: 0; transform: translateY(15px) scale(0.7); }
                            50% { opacity: 1; transform: translateY(0) scale(1.2); }
                        }
                        
                        @keyframes waveRightArm {
                            0% { transform: rotate(0deg); }
                            25% { transform: rotate(-10deg); }
                            50% { transform: rotate(5deg); }
                            75% { transform: rotate(-10deg); }
                            100% { transform: rotate(0deg); }
                        }

                        .pink-stroke {
                            stroke: #ff66c4;
                            fill: none;
                            stroke-width: 12;
                            stroke-linecap: square;
                            stroke-linejoin: miter;
                        }

                        .pink-fill {
                            fill: #ff66c4;
                        }

                        /* Transform origin is set roughly at the shoulder joint */
                        .waving-arm-group {
                            transform-origin: 245px 215px; /* Adjusted to right shoulder */
                            animation: waveRightArm 4.5s ease-in-out infinite;
                        }

                        /* Group for the action lines */
                        .action-lines-group {
                            transform-origin: 60px 100px;
                            transform: translate(-30px, -20px);
                        }
                        
                        .line-1 { animation: pulseLine1 1.5s ease-in-out infinite 0.1s; transform-origin: 20px 80px;}
                        .line-2 { animation: pulseLine2 1s ease-in-out infinite 0.2s; transform-origin: 90px 60px;}
                        .line-3 { animation: pulseLine3 1s ease-in-out infinite 0.3s; transform-origin: 120px 40px;}
                    `}
                </style>

                {}
                <div style={styles.svgContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
                        <g transform="translate(60, 40)">
                            <rect x="150" y="80" width="90" height="110" className="pink-stroke" />
                            <line x1="195" y1="110" x2="195" y2="160" stroke="#ff66c4" strokeWidth="14" strokeLinecap="butt" />
                            <path d="M 165 40 Q 195 20 225 40 L 210 60 Q 195 45 180 60 Z" className="pink-stroke" strokeWidth="6" strokeLinejoin="round" />
                            <rect x="157" y="215" width="76" height="135" className="pink-stroke" />
                            <line x1="195" y1="260" x2="233" y2="260" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />
                            <line x1="157" y1="305" x2="195" y2="305" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />

                            <line x1="172" y1="355" x2="172" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />
                            
                            <line x1="215" y1="355" x2="245" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />

                            <polyline points="157,215 120,280 145,340" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />

                            <g className="waving-arm-group">
                                <polyline points="233,215 285,270 355,270" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />
                            </g>

                        </g>
                    </svg>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        position: 'absolute' as const,
        bottom: '20px',
        left: '20px',
        zIndex: 10,
        width: '150px',
        height: '250px',
    },
    containermobile: {
        position: 'absolute' as const,
        bottom: '25px',
        left: '0px',
        zIndex: 10,
        width: '100px',
        height: '200px',
    },
    svgContainer: {
        width: '100%',
        height: '100%',
    }
};

export default WavingCharacter2;