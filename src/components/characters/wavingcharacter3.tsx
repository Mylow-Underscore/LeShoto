import React from 'react';

const WavingCharacter3: React.FC = () => {
    return (
        <>
            <div className="max-md:hidden md:flex" style={styles.container}>
                <style>
                    {`
                        @keyframes pulseSpark {
                            0%, 100% { opacity: 0.3; transform: scale(0.8); }
                            50% { opacity: 1; transform: scale(1.2); }
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

                        .spark-1 { animation: pulseSpark 2.5s ease-in-out infinite; transform-origin: 30px 40px; }
                        .spark-2 { animation: pulseSpark 2.2s ease-in-out infinite 0.3s; transform-origin: 90px 30px; }
                        .spark-3 { animation: pulseSpark 2.8s ease-in-out infinite 0.6s; transform-origin: 50px 110px; }
                        .spark-4 { animation: pulseSpark 2.4s ease-in-out infinite 0.2s; transform-origin: 370px 80px; }
                        .spark-5 { animation: pulseSpark 2.6s ease-in-out infinite 0.5s; transform-origin: 410px 120px; }
                        .spark-6 { animation: pulseSpark 2.3s ease-in-out infinite 0.4s; transform-origin: 390px 180px; }
                    `}
                </style>

                <div style={styles.svgContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 600" width="100%" height="100%">
                        <g transform="translate(30, 40)">
                            {}
                            <g className="spark-1">
                                <path d="M 30 5 L 38 35 L 70 42 L 38 49 L 30 79 L 22 49 L -10 42 L 22 35 Z" className="pink-fill" />
                            </g>
                            <g className="spark-2">
                                <path d="M 90 15 L 95 32 L 115 37 L 95 42 L 90 59 L 85 42 L 65 37 L 85 32 Z" className="pink-fill" />
                            </g>
                            <g className="spark-3">
                                <path d="M 50 75 L 54 92 L 74 97 L 54 102 L 50 119 L 46 102 L 26 97 L 46 92 Z" className="pink-fill" />
                            </g>
                            <g className="spark-4">
                                <path d="M 370 50 L 375 70 L 398 75 L 375 80 L 370 100 L 365 80 L 342 75 L 365 70 Z" className="pink-fill" />
                            </g>
                            <g className="spark-5">
                                <path d="M 410 85 L 414 98 L 430 102 L 414 106 L 410 119 L 406 106 L 390 102 L 406 98 Z" className="pink-fill" />
                            </g>
                            <g className="spark-6">
                                <path d="M 390 130 L 395 152 L 420 158 L 395 164 L 390 186 L 385 164 L 360 158 L 385 152 Z" className="pink-fill" />
                            </g>

                            {}
                            <rect x="150" y="80" width="90" height="110" className="pink-stroke" />
                            <line x1="195" y1="110" x2="195" y2="160" stroke="#ff66c4" strokeWidth="14" strokeLinecap="butt" />
                            <path d="M 165 40 Q 195 20 225 40 L 210 60 Q 195 45 180 60 Z" className="pink-stroke" strokeWidth="6" strokeLinejoin="round" />

                            {}
                            <rect x="157" y="215" width="76" height="135" className="pink-stroke" />
                            <line x1="195" y1="260" x2="233" y2="260" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />
                            <line x1="157" y1="305" x2="195" y2="305" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />

                            {}
                            <line x1="172" y1="355" x2="172" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />
                            <line x1="215" y1="355" x2="245" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />

                            {}
                            {/* Left Arm bent with elbow pointing left/outward */}
                            <polyline points="150,230 110,190 80,120" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />

                            {/* Right Arm bent with elbow pointing right/outward */}
                            <polyline points="235,230 300,190 340,140" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />
                        </g>
                    </svg>
                </div>
            </div>

            {}
            <div className="max-md:flex md:hidden" style={styles.containermobile}>
                <style>
                    {`
                        @keyframes pulseSparkMobile {
                            0%, 100% { opacity: 0.3; transform: scale(0.8); }
                            50% { opacity: 1; transform: scale(1.2); }
                        }
                        .spark-1 { animation: pulseSpark 2.5s ease-in-out infinite; transform-origin: 30px 40px; }
                        .spark-2 { animation: pulseSpark 2.2s ease-in-out infinite 0.3s; transform-origin: 90px 30px; }
                        .spark-3 { animation: pulseSpark 2.8s ease-in-out infinite 0.6s; transform-origin: 50px 110px; }
                        .spark-4 { animation: pulseSpark 2.4s ease-in-out infinite 0.2s; transform-origin: 370px 80px; }
                        .spark-5 { animation: pulseSpark 2.6s ease-in-out infinite 0.5s; transform-origin: 410px 120px; }
                        .spark-6 { animation: pulseSpark 2.3s ease-in-out infinite 0.4s; transform-origin: 390px 180px; }
                    `}
                </style>
                <div style={styles.svgContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 600" width="100%" height="100%">
                        <g transform="translate(30, 40)">
                            <g className="spark-1">
                                <path d="M 30 5 L 38 35 L 70 42 L 38 49 L 30 79 L 22 49 L -10 42 L 22 35 Z" className="pink-fill" />
                            </g>
                            <g className="spark-2">
                                <path d="M 90 15 L 95 32 L 115 37 L 95 42 L 90 59 L 85 42 L 65 37 L 85 32 Z" className="pink-fill" />
                            </g>
                            <g className="spark-3">
                                <path d="M 50 75 L 54 92 L 74 97 L 54 102 L 50 119 L 46 102 L 26 97 L 46 92 Z" className="pink-fill" />
                            </g>
                            <g className="spark-4">
                                <path d="M 370 50 L 375 70 L 398 75 L 375 80 L 370 100 L 365 80 L 342 75 L 365 70 Z" className="pink-fill" />
                            </g>
                            <g className="spark-5">
                                <path d="M 410 85 L 414 98 L 430 102 L 414 106 L 410 119 L 406 106 L 390 102 L 406 98 Z" className="pink-fill" />
                            </g>
                            <g className="spark-6">
                                <path d="M 390 130 L 395 152 L 420 158 L 395 164 L 390 186 L 385 164 L 360 158 L 385 152 Z" className="pink-fill" />
                            </g>
                            <rect x="150" y="80" width="90" height="110" className="pink-stroke" />
                            <line x1="195" y1="110" x2="195" y2="160" stroke="#ff66c4" strokeWidth="14" strokeLinecap="butt" />
                            <path d="M 165 40 Q 195 20 225 40 L 210 60 Q 195 45 180 60 Z" className="pink-stroke" strokeWidth="6" strokeLinejoin="round" />
                            <rect x="157" y="215" width="76" height="135" className="pink-stroke" />
                            <line x1="195" y1="260" x2="233" y2="260" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />
                            <line x1="195" y1="255" x2="195" y2="310" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />
                            <line x1="157" y1="305" x2="195" y2="305" stroke="#ff66c4" strokeWidth="12" strokeLinecap="butt" />
                            <line x1="172" y1="355" x2="172" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />
                            <line x1="215" y1="355" x2="245" y2="480" stroke="#ff66c4" strokeWidth="18" strokeLinecap="butt" />
                            <polyline points="150,230 110,190 80,120" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />
                            <polyline points="235,230 300,190 340,140" className="pink-stroke" strokeWidth="18" strokeLinejoin="miter" />
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
        width: '220px',
        height: '300px',
    },
    containermobile: {
        position: 'absolute' as const,
        top: '0px',
        right: '20px',
        zIndex: 10,
        width: '120px',
        height: '180px',
    },
    svgContainer: {
        width: '100%',
        height: '100%',
    }
};

export default WavingCharacter3;