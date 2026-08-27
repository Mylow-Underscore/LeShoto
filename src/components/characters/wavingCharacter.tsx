import React from 'react';

const WavingCharacter: React.FC = () => {
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

                        @keyframes pulseSpark {
                            0%, 100% { opacity: 0.5; transform: scale(0.9); }
                            50% { opacity: 1; transform: scale(1.1); }
                        }
                        @keyframes waveUpperArm {
                            0%, 100% { transform: rotate(0deg); }
                            30% { transform: rotate(12deg); }
                            50% { transform: rotate(5deg); }
                            70% { transform: rotate(10deg); }
                        }

                        /* Mouvement synchronisé pour l'avant-bras (effet de balancier du coude pour dire bonjour) */
                        @keyframes waveForeArm {
                            0%, 100% { transform: rotate(0deg); }
                            30% { transform: rotate(5deg); }
                            50% { transform: rotate(2deg); }
                            70% { transform: rotate(5deg); }
                        }

                        .upper-arm {
                            transform-origin: 150px 215px;
                            animation: waveUpperArm 2.5s ease-in-out infinite;
                        }

                        .fore-arm {
                            transform-origin: 100px 165px;
                            animation: waveForeArm 2.5s ease-in-out infinite;
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

                        .waving-arm-group {
                            transform-origin: 160px 250px;
                            animation: waveArm 4.5s ease-in-out infinite;
                        }

                        .action-lines-group {
                            transform-origin: 60px 100px;
                            transform: translate(-30px, -20px);
                        }
                        
                        .spark-1 { animation: pulseSpark 2.5s ease-in-out infinite; transform-origin: 30px 60px; }
                        .spark-2 { animation: pulseSpark 2.2s ease-in-out infinite 0.3s; transform-origin: 75px 30px; }
                        .spark-3 { animation: pulseSpark 2.8s ease-in-out infinite 0.6s; transform-origin: 110px 70px; }
                    `}
                </style>

                {}
                <div style={styles.svgContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
                        <g transform="translate(60, 40)">
                            
                            {/* Head box and details */}
                            <rect x="150" y="80" width="90" height="110" className="pink-stroke" />
                            <line x1="195" y1="110" x2="195" y2="160" stroke="#ff66c4" strokeWidth="14" strokeLinecap="butt" />
                            <path d="M 165 40 Q 195 20 225 40 L 210 60 Q 195 45 180 60 Z" className="pink-stroke" strokeWidth="6" strokeLinejoin="round" />

                            {/* Body block with 'S' */}
                            <rect x="157" y="215" width="76" height="135" className="pink-stroke" />
                            <line x1="200" y1="260" x2="233" y2="260" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />
                            <line x1="157" y1="305" x2="195" y2="305" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />

                            {/* Legs */}
                            <line x1="172" y1="355" x2="172" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />
                            <line x1="215" y1="355" x2="245" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />

                            {/* Right Arm (resting) */}
                            <polyline points="240,215 280,280 240,345" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />

                            <g className="upper-arm">
                                <line x1="150" y1="215" x2="100" y2="165" className="pink-stroke" strokeWidth="18" strokeLinecap="butt" />
                                <g className="fore-arm">
                                    <polyline points="100,165 60,110" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />
                                </g>
                            </g>
                            <g>
                                <g className="spark-1">
                                    <path d="M 30 35 L 38 52 L 60 57 L 38 62 L 30 79 L 22 62 L 0 57 L 22 52 Z" className="pink-fill" />
                                </g>
                                <g className="spark-2">
                                    <path d="M 75 10 L 81 24 L 100 28 L 81 32 L 75 46 L 69 32 L 50 28 L 69 24 Z" className="pink-fill" />
                                </g>
                                <g className="spark-3">
                                    <path d="M 110 45 L 117 62 L 140 67 L 117 72 L 110 89 L 103 72 L 80 67 L 103 62 Z" className="pink-fill" />
                                </g>                                
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

                        @keyframes pulseSpark {
                            0%, 100% { opacity: 0.5; transform: scale(0.9); }
                            50% { opacity: 1; transform: scale(1.1); }
                        }
                        @keyframes waveUpperArm {
                            0%, 100% { transform: rotate(0deg); }
                            30% { transform: rotate(12deg); }
                            50% { transform: rotate(5deg); }
                            70% { transform: rotate(10deg); }
                        }

                        /* Mouvement synchronisé pour l'avant-bras (effet de balancier du coude pour dire bonjour) */
                        @keyframes waveForeArm {
                            0%, 100% { transform: rotate(0deg); }
                            30% { transform: rotate(5deg); }
                            50% { transform: rotate(2deg); }
                            70% { transform: rotate(5deg); }
                        }

                        .upper-arm {
                            transform-origin: 150px 215px;
                            animation: waveUpperArm 2.5s ease-in-out infinite;
                        }

                        .fore-arm {
                            transform-origin: 100px 165px;
                            animation: waveForeArm 2.5s ease-in-out infinite;
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

                        .waving-arm-group {
                            transform-origin: 160px 250px;
                            animation: waveArm 4.5s ease-in-out infinite;
                        }

                        .action-lines-group {
                            transform-origin: 60px 100px;
                            transform: translate(-30px, -20px);
                        }
                        
                        .spark-1 { animation: pulseSpark 2.5s ease-in-out infinite; transform-origin: 30px 60px; }
                        .spark-2 { animation: pulseSpark 2.2s ease-in-out infinite 0.3s; transform-origin: 75px 30px; }
                        .spark-3 { animation: pulseSpark 2.8s ease-in-out infinite 0.6s; transform-origin: 110px 70px; }
                    `}
                </style>

                {}
                <div style={styles.svgContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
                        <g transform="translate(60, 40)">
                            
                            {/* Head box and details */}
                            <rect x="150" y="80" width="90" height="110" className="pink-stroke" />
                            <line x1="195" y1="110" x2="195" y2="160" stroke="#ff66c4" strokeWidth="14" strokeLinecap="butt" />
                            <path d="M 165 40 Q 195 20 225 40 L 210 60 Q 195 45 180 60 Z" className="pink-stroke" strokeWidth="6" strokeLinejoin="round" />

                            {/* Body block with 'S' */}
                            <rect x="157" y="215" width="76" height="135" className="pink-stroke" />
                            <line x1="200" y1="260" x2="233" y2="260" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />
                            <line x1="157" y1="305" x2="195" y2="305" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />

                            {/* Legs */}
                            <line x1="172" y1="355" x2="172" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />
                            <line x1="215" y1="355" x2="245" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />

                            {/* Right Arm (resting) */}
                            <polyline points="240,215 280,280 240,345" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />

                            <g className="upper-arm">
                                <line x1="150" y1="215" x2="100" y2="165" className="pink-stroke" strokeWidth="18" strokeLinecap="butt" />
                                <g className="fore-arm">
                                    <polyline points="100,165 60,110" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />
                                </g>
                            </g>
                            <g>
                                <g className="spark-1">
                                    <path d="M 30 35 L 38 52 L 60 57 L 38 62 L 30 79 L 22 62 L 0 57 L 22 52 Z" className="pink-fill" />
                                </g>
                                <g className="spark-2">
                                    <path d="M 75 10 L 81 24 L 100 28 L 81 32 L 75 46 L 69 32 L 50 28 L 69 24 Z" className="pink-fill" />
                                </g>
                                <g className="spark-3">
                                    <path d="M 110 45 L 117 62 L 140 67 L 117 72 L 110 89 L 103 72 L 80 67 L 103 62 Z" className="pink-fill" />
                                </g>                                
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
        bottom: '0px',
        left: '60px',
        zIndex: 10,
        width: '150px',
        height: '250px',
    },
    containermobile: {
        position: 'absolute' as const,
        bottom: '0px',
        left: '20px',
        zIndex: 10,
        width: '100px',
        height: '200px',
    },
    svgContainer: {
        width: '100%',
        height: '100%',
    }
};

export default WavingCharacter;