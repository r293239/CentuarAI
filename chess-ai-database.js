// chess-ai-database.js
// Enhanced chess AI with learning capabilities and professional opening book

class ChessAILearner {
    constructor() {
        this.performanceHistory = [];
        this.openingBook = this.initializeOpeningBook();
        this.positionEvaluations = new Map();
        this.learningRate = 0.1;
        this.difficulty = 4; // Default difficulty
        this.adaptiveLearning = true;
        this.endgameDatabase = this.initializeEndgameDatabase();
        this.middlegamePatterns = this.initializeMiddlegamePatterns();
        this.tacticalPatterns = this.initializeTacticalPatterns();
        
        console.log("🧠 Enhanced Chess AI initialized with professional opening book");
    }

    initializeOpeningBook() {
        return {
            // ==================== 1. e4 OPENINGS ====================
            'e2e4': {
                // 1...e5 - Open Games
                'e7e5': {
                    moves: ['g1f3', 'f1c4', 'f1b5', 'd2d4', 'f2f4'],
                    weights: [35, 20, 25, 15, 5],
                    variations: {
                        'g1f3': {
                            description: "King's Knight Opening",
                            responses: {
                                'b8c6': ['f1c4', 'f1b5', 'd2d4', 'b1c3'], // Italian/Ruy Lopez/Scotch
                                'g8f6': ['f3e5', 'b1c3', 'd2d4'], // Petrov Defense
                                'd7d6': ['d2d4', 'f1c4', 'b1c3'] // Philidor Defense
                            }
                        },
                        'f1c4': {
                            description: "Bishop's Opening",
                            responses: {
                                'g8f6': ['d2d4', 'b1c3', 'd2d3'],
                                'b8c6': ['d2d4', 'b1c3', 'g1f3']
                            }
                        },
                        'f1b5': {
                            description: "Ruy Lopez (Spanish Opening)",
                            responses: {
                                'b8c6': ['b5c6', 'd2d4', '0-0', 'c2c3', 'd2d3'],
                                'g8f6': ['b5c6', 'e4e5', 'd2d4']
                            }
                        }
                    }
                },
                
                // 1...c5 - Sicilian Defense
                'c7c5': {
                    moves: ['g1f3', 'b1c3', 'c2c3', 'f2f4', 'd2d4'],
                    weights: [45, 25, 15, 10, 5],
                    variations: {
                        'g1f3': {
                            description: "Open Sicilian",
                            responses: {
                                'd7d6': ['d2d4', 'b1c3', 'f1c4', 'f1e2', 'f1b5'], // Najdorf, Dragon, Classical
                                'e7e6': ['d2d4', 'b1c3', 'f1d3', 'g2g3'], // Scheveningen, Kan
                                'b8c6': ['d2d4', 'b1c3', 'f1b5', 'f1c4'], // Sveshnikov, Accelerated Dragon
                                'g8f6': ['e4e5', 'b1c3', 'd2d4'] // Nimzowitsch Variation
                            }
                        },
                        'b1c3': {
                            description: "Closed Sicilian",
                            responses: {
                                'b8c6': ['g2g3', 'f2f4', 'g1e2'],
                                'g8f6': ['g2g3', 'f2f4', 'd2d3'],
                                'e7e6': ['g2g3', 'f2f4', 'd2d3']
                            }
                        },
                        'c2c3': {
                            description: "Alapin Variation",
                            responses: {
                                'g8f6': ['e4e5', 'd2d4', 'f1d3'],
                                'd7d5': ['e4d5', 'd2d4', 'g1f3']
                            }
                        }
                    }
                },
                
                // 1...e6 - French Defense
                'e7e6': {
                    moves: ['d2d4', 'b1c3', 'b1d2', 'e4e5', 'f1d3'],
                    weights: [40, 25, 20, 10, 5],
                    variations: {
                        'd2d4': {
                            description: "Main Line French",
                            responses: {
                                'd7d5': ['b1c3', 'b1d2', 'e4e5', 'f1d3'],
                                'c7c5': ['g1f3', 'b1c3', 'f1d3']
                            }
                        }
                    }
                },
                
                // 1...c6 - Caro-Kann Defense
                'c7c6': {
                    moves: ['d2d4', 'b1c3', 'e4e5', 'g1f3', 'f1d3'],
                    weights: [40, 30, 15, 10, 5],
                    variations: {
                        'd2d4': {
                            description: "Classical Caro-Kann",
                            responses: {
                                'd7d5': ['b1c3', 'b1d2', 'e4e5']
                            }
                        },
                        'e4e5': {
                            description: "Advance Variation",
                            responses: {
                                'f7f5': ['e5f6', 'g1f3', 'f1d3']
                            }
                        }
                    }
                },
                
                // 1...d6 - Pirc Defense
                'd7d6': {
                    moves: ['d2d4', 'b1c3', 'g1f3', 'f1c4', 'f1e2'],
                    weights: [35, 30, 25, 5, 5],
                    variations: {
                        'd2d4': {
                            description: "Pirc Main Line",
                            responses: {
                                'g8f6': ['b1c3', 'g1f3', 'f1c4'],
                                'b8d7': ['b1c3', 'g1f3', 'f1c4']
                            }
                        }
                    }
                },
                
                // 1...g6 - Modern Defense
                'g7g6': {
                    moves: ['d2d4', 'b1c3', 'g1f3', 'f1c4', 'f1e2'],
                    weights: [35, 30, 25, 5, 5],
                    variations: {
                        'd2d4': {
                            description: "Modern Defense",
                            responses: {
                                'f7g8': ['b1c3', 'g1f3', 'f1c4']
                            }
                        }
                    }
                },
                
                // 1...Nf6 - Alekhine's Defense
                'g8f6': {
                    moves: ['e4e5', 'b1c3', 'd2d4', 'f1d3', 'g1f3'],
                    weights: [45, 25, 15, 10, 5],
                    variations: {
                        'e4e5': {
                            description: "Alekhine's Defense Main Line",
                            responses: {
                                'f6d5': ['d2d4', 'c2c4', 'g1f3'],
                                'f6e4': ['d2d4', 'f1d3', 'g1f3']
                            }
                        }
                    }
                },
                
                // 1...d5 - Scandinavian Defense
                'd7d5': {
                    moves: ['e4d5', 'b1c3', 'g1f3', 'd2d4', 'f1d3'],
                    weights: [70, 15, 10, 3, 2],
                    variations: {
                        'e4d5': {
                            description: "Scandinavian Main Line",
                            responses: {
                                'd8d5': ['b1c3', 'g1f3', 'd2d4'],
                                'g8f6': ['f1b5', 'd2d4', 'g1f3']
                            }
                        }
                    }
                },
                
                // 1...Nc6 - Nimzowitsch Defense
                'b8c6': {
                    moves: ['g1f3', 'd2d4', 'b1c3', 'f1b5', 'f1c4'],
                    weights: [40, 30, 20, 5, 5],
                    variations: {
                        'g1f3': {
                            description: "Nimzowitsch Defense",
                            responses: {
                                'e7e5': ['f1c4', 'd2d4', 'b1c3'],
                                'd7d6': ['d2d4', 'b1c3', 'f1c4']
                            }
                        }
                    }
                }
            },

            // ==================== 1. d4 OPENINGS ====================
            'd2d4': {
                // 1...d5 - Queen's Pawn Games
                'd7d5': {
                    moves: ['c2c4', 'g1f3', 'b1c3', 'e2e3', 'f1f4'],
                    weights: [45, 25, 15, 10, 5],
                    variations: {
                        'c2c4': {
                            description: "Queen's Gambit",
                            responses: {
                                'd5c4': ['e2e3', 'g1f3', 'f1c4', 'b1c3'], // Queen's Gambit Accepted
                                'e7e6': ['b1c3', 'g1f3', 'c4d5', 'e2e3'], // Queen's Gambit Declined
                                'c7c6': ['g1f3', 'e2e3', 'b1c3'], // Slav Defense
                                'g8f6': ['b1c3', 'g1f3', 'c4d5'] // Tarrasch Defense
                            }
                        },
                        'g1f3': {
                            description: "London System",
                            responses: {
                                'g8f6': ['f1f4', 'e2e3', 'c2c3'],
                                'e7e6': ['f1f4', 'e2e3', 'c2c3']
                            }
                        },
                        'f1f4': {
                            description: "London System Setup",
                            responses: {
                                'g8f6': ['e2e3', 'c2c3', 'g1f3']
                            }
                        }
                    }
                },
                
                // 1...Nf6 - Indian Defenses
                'g8f6': {
                    moves: ['c2c4', 'g1f3', 'b1c3', 'f1g5', 'e2e3'],
                    weights: [35, 30, 25, 5, 5],
                    variations: {
                        'c2c4': {
                            description: "Indian Game",
                            responses: {
                                'e7e6': ['b1c3', 'g1f3', 'e2e3'], // Nimzo-Indian/Queen's Indian
                                'g7g6': ['b1c3', 'e2e4', 'g1f3'], // King's Indian Defense
                                'c7c5': ['d4d5', 'b1c3', 'e2e4'], // Benoni Defense
                                'd7d6': ['b1c3', 'e2e4', 'g1f3'] // Old Indian Defense
                            }
                        }
                    }
                },
                
                // 1...e6 - Queen's Indian/Nimzo-Indian
                'e7e6': {
                    moves: ['c2c4', 'g1f3', 'b1c3', 'e2e3', 'f1g5'],
                    weights: [35, 30, 20, 10, 5],
                    variations: {
                        'c2c4': {
                            description: "Queen's Pawn Game",
                            responses: {
                                'g8f6': ['b1c3', 'g1f3', 'e2e3'], // Nimzo-Indian
                                'd7d5': ['b1c3', 'g1f3', 'c4d5'] // Queen's Gambit Declined
                            }
                        }
                    }
                },
                
                // 1...c5 - Benoni Defense
                'c7c5': {
                    moves: ['d4d5', 'c2c4', 'b1c3', 'g1f3', 'e2e4'],
                    weights: [40, 30, 15, 10, 5],
                    variations: {
                        'd4d5': {
                            description: "Benoni Defense",
                            responses: {
                                'e7e6': ['b1c3', 'c2c4', 'g1f3'],
                                'g8f6': ['b1c3', 'c2c4', 'g1f3']
                            }
                        }
                    }
                },
                
                // 1...f5 - Dutch Defense
                'f7f5': {
                    moves: ['g1f3', 'c2c4', 'g2g3', 'b1c3', 'f1g2'],
                    weights: [30, 25, 25, 10, 10],
                    variations: {
                        'g2g3': {
                            description: "Dutch Defense Main Line",
                            responses: {
                                'g8f6': ['f1g2', 'g1f3', '0-0']
                            }
                        }
                    }
                },
                
                // 1...e5 - Englund Gambit
                'e7e5': {
                    moves: ['d4e5', 'g1f3', 'b1c3', 'f1c4', 'c1f4'],
                    weights: [50, 25, 15, 5, 5],
                    variations: {
                        'd4e5': {
                            description: "Englund Gambit Accepted",
                            responses: {
                                'b8c6': ['g1f3', 'b1c3', 'f1c4'],
                                'd8e7': ['g1f3', 'b1c3', 'f1c4']
                            }
                        }
                    }
                }
            },

            // ==================== 1. Nf3 OPENINGS ====================
            'g1f3': {
                // 1...d5 - Reti Opening
                'd7d5': {
                    moves: ['c2c4', 'g2g3', 'd2d4', 'e2e3', 'f1g2'],
                    weights: [35, 30, 20, 10, 5],
                    variations: {
                        'c2c4': {
                            description: "Reti Opening",
                            responses: {
                                'd5c4': ['e2e3', 'f1c4', '0-0'],
                                'e7e6': ['g2g3', 'f1g2', '0-0']
                            }
                        }
                    }
                },
                
                // 1...Nf6 - King's Indian Attack
                'g8f6': {
                    moves: ['g2g3', 'c2c4', 'f1g2', '0-0', 'd2d4'],
                    weights: [35, 30, 25, 5, 5],
                    variations: {
                        'g2g3': {
                            description: "King's Indian Attack",
                            responses: {
                                'g7g6': ['f1g2', '0-0', 'd2d4'],
                                'd7d5': ['f1g2', '0-0', 'd2d4']
                            }
                        }
                    }
                },
                
                // 1...c5 - Sicilian Variation
                'c7c5': {
                    moves: ['c2c4', 'e2e4', 'b1c3', 'g2g3', 'f1g2'],
                    weights: [35, 30, 20, 10, 5],
                    variations: {
                        'c2c4': {
                            description: "Sicilian Variation",
                            responses: {
                                'b8c6': ['b1c3', 'e2e4', 'f1b5'],
                                'e7e6': ['b1c3', 'e2e4', 'd2d4']
                            }
                        }
                    }
                }
            },

            // ==================== 1. c4 OPENINGS ====================
            'c2c4': {
                // 1...e5 - English Opening
                'e7e5': {
                    moves: ['b1c3', 'g1f3', 'g2g3', 'e2e3', 'f1g2'],
                    weights: [35, 30, 20, 10, 5],
                    variations: {
                        'b1c3': {
                            description: "English Opening",
                            responses: {
                                'g8f6': ['g2g3', 'f1g2', 'g1f3'],
                                'b8c6': ['g2g3', 'f1g2', 'g1f3']
                            }
                        }
                    }
                },
                
                // 1...Nf6 - English Opening
                'g8f6': {
                    moves: ['b1c3', 'g1f3', 'g2g3', 'e2e4', 'f1g2'],
                    weights: [35, 30, 20, 10, 5],
                    variations: {
                        'b1c3': {
                            description: "English Opening",
                            responses: {
                                'e7e6': ['g2g3', 'f1g2', 'g1f3'],
                                'g7g6': ['g2g3', 'f1g2', 'e2e4']
                            }
                        }
                    }
                },
                
                // 1...c5 - Symmetrical English
                'c7c5': {
                    moves: ['b1c3', 'g1f3', 'g2g3', 'e2e3', 'f1g2'],
                    weights: [35, 30, 20, 10, 5],
                    variations: {
                        'b1c3': {
                            description: "Symmetrical English",
                            responses: {
                                'b8c6': ['g2g3', 'f1g2', 'g1f3'],
                                'g8f6': ['g2g3', 'f1g2', 'g1f3']
                            }
                        }
                    }
                }
            },

            // ==================== 1. e3 OPENINGS ====================
            'e2e3': {
                // Van't Kruijs Opening
                'e7e5': {
                    moves: ['d2d4', 'g1f3', 'f1d3', 'b1c3', '0-0'],
                    weights: [40, 30, 15, 10, 5]
                },
                'd7d5': {
                    moves: ['d2d4', 'g1f3', 'f1d3', 'b1d2', 'c2c4'],
                    weights: [40, 30, 15, 10, 5]
                }
            },

            // ==================== 1. g3 OPENINGS ====================
            'g2g3': {
                // Benko Opening
                'e7e5': {
                    moves: ['f1g2', 'g1f3', '0-0', 'd2d3', 'b1c3'],
                    weights: [40, 30, 15, 10, 5]
                },
                'd7d5': {
                    moves: ['f1g2', 'g1f3', '0-0', 'd2d3', 'b1c3'],
                    weights: [40, 30, 15, 10, 5]
                }
            },

            // ==================== 1. f4 OPENINGS ====================
            'f2f4': {
                // Bird's Opening
                'd7d5': {
                    moves: ['g1f3', 'e2e3', 'f1b5', 'b1c3', '0-0'],
                    weights: [35, 30, 20, 10, 5]
                },
                'e7e5': {
                    moves: ['f4e5', 'g1f3', 'e2e4', 'b1c3', 'f1c4'],
                    weights: [40, 30, 15, 10, 5]
                }
            },

            // ==================== 1. b3 OPENINGS ====================
            'b2b3': {
                // Nimzowitsch-Larsen Attack
                'e7e5': {
                    moves: ['c1b2', 'e2e3', 'g1f3', 'f1b5', '0-0'],
                    weights: [40, 30, 15, 10, 5]
                },
                'd7d5': {
                    moves: ['c1b2', 'g1f3', 'e2e3', 'f1b5', '0-0'],
                    weights: [40, 30, 15, 10, 5]
                }
            },

            // ==================== 1. Nc3 OPENINGS ====================
            'b1c3': {
                // Dunst Opening
                'd7d5': {
                    moves: ['e2e4', 'd2d4', 'g1f3', 'f1c4', '0-0'],
                    weights: [40, 30, 15, 10, 5]
                },
                'e7e5': {
                    moves: ['e2e4', 'g1f3', 'd2d4', 'f1c4', '0-0'],
                    weights: [40, 30, 15, 10, 5]
                }
            },

            // ==================== 1. b4 OPENINGS ====================
            'b2b4': {
                // Sokolsky Opening
                'e7e5': {
                    moves: ['c1b2', 'e2e3', 'g1f3', 'f1e2', '0-0'],
                    weights: [40, 30, 15, 10, 5]
                }
            },

            // ==================== 1. a3 OPENINGS ====================
            'a2a3': {
                // Anderssen's Opening
                'e7e5': {
                    moves: ['e2e4', 'g1f3', 'b1c3', 'f1c4', '0-0'],
                    weights: [40, 30, 15, 10, 5]
                }
            },

            // ==================== 1. h3 OPENINGS ====================
            'h2h3': {
                // Clemenz Opening
                'e7e5': {
                    moves: ['e2e4', 'g1f3', 'b1c3', 'f1c4', '0-0'],
                    weights: [40, 30, 15, 10, 5]
                }
            },

            // ==================== 1. d3 OPENINGS ====================
            'd2d3': {
                // Mieses Opening
                'e7e5': {
                    moves: ['g1f3', 'b1c3', 'c2c4', 'e2e4', 'f1e2'],
                    weights: [40, 30, 15, 10, 5]
                },
                'd7d5': {
                    moves: ['g1f3', 'b1c3', 'c2c4', 'e2e4', 'f1e2'],
                    weights: [40, 30, 15, 10, 5]
                }
            },

            // ==================== 1. e4 RESPONSE REFINEMENTS ====================
            // Sicilian Defense - Najdorf Variation
            'e2e4 c7c5 g1f3 d7d6': {
                'd2d4 c5d4 f3d4 g8f6 b1c3 a7a6': {
                    moves: ['f1e2', 'f1c4', 'f3e3', 'g2g3', 'f2f3'],
                    weights: [40, 25, 15, 10, 10]
                }
            },
            
            // Sicilian Defense - Dragon Variation
            'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6': {
                moves: ['f1e2', 'f1c4', 'c1e3', 'f2f3', 'd1d2'],
                weights: [35, 30, 20, 10, 5]
            },
            
            // Ruy Lopez - Berlin Defense
            'e2e4 e7e5 g1f3 b8c6 f1b5 g8f6': {
                moves: ['0-0', 'e4e5', 'b1c3', 'd2d4', 'b5c6'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Ruy Lopez - Morphy Defense
            'e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4': {
                moves: ['0-0', 'd2d4', 'c2c3', 'b1c3', 'h2h3'],
                weights: [35, 30, 20, 10, 5]
            },
            
            // Italian Game - Two Knights Defense
            'e2e4 e7e5 g1f3 b8c6 f1c4 g8f6': {
                moves: ['g1e5', 'd2d4', 'e4e5', 'b1c3', '0-0'],
                weights: [40, 25, 20, 10, 5]
            },
            
            // Italian Game - Giuoco Piano
            'e2e4 e7e5 g1f3 b8c6 f1c4 f8c5': {
                moves: ['c2c3', 'd2d4', '0-0', 'b1c3', 'c4b3'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // French Defense - Winawer Variation
            'e2e4 e7e6 d2d4 d7d5 b1c3 f8b4': {
                moves: ['e4e5', 'c2c3', 'a2a3', 'd1g4', 'g1f3'],
                weights: [40, 25, 20, 10, 5]
            },
            
            // French Defense - Classical Variation
            'e2e4 e7e6 d2d4 d7d5 b1c3 g8f6': {
                moves: ['f1g5', 'e4e5', 'f1d3', 'g1f3', 'c3b5'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Caro-Kann Defense - Classical Variation
            'e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4': {
                moves: ['f1d3', 'g1f3', 'e4g3', 'c1f4', 'd1e2'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Caro-Kann Defense - Advance Variation
            'e2e4 c7c6 d2d4 d7d5 e4e5': {
                moves: ['f1d3', 'c2c4', 'c1f4', 'g1e2', 'b1c3'],
                weights: [40, 25, 20, 10, 5]
            },
            
            // Pirc Defense - Austrian Attack
            'e2e4 d7d6 d2d4 g8f6 b1c3 g7g6': {
                moves: ['f2f4', 'c1e3', 'd1d2', 'g1f3', '0-0-0'],
                weights: [45, 25, 15, 10, 5]
            },
            
            // King's Indian Defense - Classical Variation
            'd2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6': {
                moves: ['g1f3', 'f1e2', '0-0', 'c1e3', 'd1d2'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // King's Indian Defense - Sämisch Variation
            'd2d4 g8f6 c2c4 g7g6 b1c3 f8g7 e2e4 d7d6 f2f3': {
                moves: ['c1e3', 'd1d2', '0-0-0', 'g1e2', 'c4c5'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Nimzo-Indian Defense
            'd2d4 g8f6 c2c4 e7e6 b1c3 f8b4': {
                moves: ['e2e3', 'd1c2', 'g1f3', 'f1d3', 'a2a3'],
                weights: [35, 30, 20, 10, 5]
            },
            
            // Queen's Gambit Declined - Orthodox Defense
            'd2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c4d5 e6d5': {
                moves: ['c1g5', 'e2e3', 'f1d3', 'g1f3', '0-0'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Slav Defense
            'd2d4 d7d5 c2c4 c7c6': {
                moves: ['g1f3', 'b1c3', 'e2e3', 'c4d5', 'f1d3'],
                weights: [35, 30, 20, 10, 5]
            },
            
            // Grünfeld Defense
            'd2d4 g8f6 c2c4 g7g6 b1c3 d7d5': {
                moves: ['c4d5', 'e2e4', 'f1c4', 'g1f3', 'c1e3'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Benoni Defense
            'd2d4 g8f6 c2c4 c7c5 d4d5 e7e6 b1c3 e6d5 c4d5 d7d6': {
                moves: ['e2e4', 'g1f3', 'f1d3', '0-0', 'a2a4'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // English Opening - Symmetrical Variation
            'c2c4 c7c5 b1c3 b8c6 g1f3 g8f6': {
                moves: ['d2d4', 'e2e3', 'f1e2', '0-0', 'd4c5'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // English Opening - Reversed Sicilian
            'c2c4 e7e5 b1c3 g8f6 g1f3 b8c6': {
                moves: ['e2e3', 'f1e2', '0-0', 'd2d4', 'd4e5'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Reti Opening
            'g1f3 d7d5 c2c4 d5c4': {
                moves: ['e2e3', 'f1c4', '0-0', 'b1c3', 'd1e2'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // London System
            'd2d4 d7d5 g1f3 g8f6 c1f4': {
                moves: ['e2e3', 'f1d3', 'b1d2', 'c2c3', '0-0'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Trompowsky Attack
            'd2d4 g8f6 c1g5': {
                moves: ['e2e3', 'g1f3', 'f1d3', 'b1d2', '0-0'],
                weights: [45, 25, 15, 10, 5]
            },
            
            // Catalan Opening
            'd2d4 d7d5 c2c4 e7e6 g1f3 g8f6 g2g3': {
                moves: ['f1g2', '0-0', 'b1c3', 'c4d5', 'd1c2'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Colle System
            'd2d4 d7d5 g1f3 g8f6 e2e3': {
                moves: ['f1d3', 'b1d2', '0-0', 'c2c3', 'e3e4'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Torre Attack
            'd2d4 d7d5 g1f3 g8f6 c1g5': {
                moves: ['e2e3', 'f1d3', 'b1d2', '0-0', 'c2c3'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Veresov Attack
            'd2d4 d7d5 b1c3 g8f6 c1g5': {
                moves: ['e2e3', 'f1d3', 'g1f3', '0-0', 'd1d2'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Blackmar-Diemer Gambit
            'd2d4 d7d5 e2e4 d5e4 b1c3': {
                moves: ['g1f3', 'f1c4', '0-0', 'd1e2', 'f2f3'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Budapest Gambit
            'd2d4 g8f6 c2c4 e7e5 d4e5': {
                moves: ['g1f3', 'b1c3', 'e2e4', 'f1e2', '0-0'],
                weights: [45, 25, 15, 10, 5]
            },
            
            // Dutch Defense - Stonewall
            'd2d4 f7f5 g2g3 g8f6 f1g2 e7e6 g1f3 d7d5 0-0': {
                moves: ['c2c4', 'b1c3', 'c4d5', 'd1b3', 'f1d1'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Dutch Defense - Leningrad
            'd2d4 f7f5 g2g3 g8f6 f1g2 g7g6 g1f3 f8g7 0-0 0-0': {
                moves: ['c2c4', 'b1c3', 'd1c2', 'c1f4', 'f3e5'],
                weights: [40, 30, 15, 10, 5]
            },
            
            // Modern Defense - Pseudo-Catalan
            'e2e4 g7g6 d2d4 f8g7 b1c3 d7d6': {
                moves: ['g1f3', 'c1e3', 'd1d2', '0-0-0', 'f1d3'],
                weights: [40, 30, 15, 10, 5]
            }
        };
    }

    initializeMiddlegamePatterns() {
        return {
            tactics: {
                forks: 'Knight forks on f7, c7, e5, etc.',
                pins: 'Pin pieces to the king or queen',
                skewers: 'Attack through piece to more valuable piece',
                discoveredChecks: 'Uncover check with piece movement',
                doubleChecks: 'Both pieces give check simultaneously',
                zwischenzug: 'Intermezzo moves',
                desperado: 'Sacrifice piece for maximum gain'
            },
            strategies: {
                centerControl: 'Control the center squares e4,d4,e5,d5',
                development: 'Develop pieces rapidly and castle',
                kingSafety: 'Castle early, avoid weakening pawns',
                pawnStructure: 'Avoid isolated, doubled, or backward pawns',
                spaceAdvantage: 'Control more squares than opponent',
                minorityAttack: 'Advance pawns to create weaknesses',
                oppositeCastling: 'Pawn storm against opponent king'
            },
            positionalMotifs: {
                outposts: 'Advanced knight positions protected by pawns',
                openFiles: 'Control open files with rooks/queen',
                bishopPair: 'Two bishops are often powerful in open positions',
                goodVsBadBishops: 'Bishops are stronger when pawns are on opposite color',
                weakSquares: 'Squares that cannot be defended by pawns',
                prophylaxis: 'Prevent opponent plans before executing your own'
            }
        };
    }

    initializeTacticalPatterns() {
        return {
            matingPatterns: {
                backRankMate: 'Mate on the back rank when king has no escape',
                smotheredMate: 'Knight delivers mate with king surrounded by pieces',
                AnastasiasMate: 'Rook and knight checkmate pattern',
                AnderssensMate: 'Bishop and rook checkmate pattern',
                ArabiansMate: 'Knight and rook checkmate pattern',
                BaldursMate: 'Queen and bishop checkmate pattern',
                BodenMate: 'Two bishops checkmate pattern',
                CornerMate: 'Mate in the corner with knight or bishop',
                DamianosMate: 'Queen and pawn checkmate pattern',
                EpaulettesMate: 'Queen delivers mate with pieces as epaulettes',
                FoolsMate: 'The fastest possible checkmate',
                GrecosMate: 'Bishop and knight checkmate pattern',
                KillersMate: 'Rook and bishop checkmate pattern',
                LolliMate: 'Queen and pawn checkmate pattern',
                MaxLangesMate: 'Two rooks checkmate pattern',
                MorphysMate: 'Bishop and rook checkmate pattern',
                OperaMate: 'Checkmate from the famous Opera game',
                PillsburysMate: 'Two knights checkmate pattern',
                RetisMate: 'Queen and knight checkmate pattern',
                RookRoller: 'Two rooks delivering consecutive checks',
                ScholarsMate: 'Quick checkmate with queen and bishop',
                SuffocationMate: 'King suffocated by own pieces',
                SwallowtailMate: 'Queen checkmate with pawn formation'
            },
            tacticalThemes: {
                deflection: 'Force a piece to leave its defensive position',
                decoy: 'Lure a piece to a square where it becomes vulnerable',
                interference: 'Block the line between two pieces',
                overloading: 'Piece defending too many things',
                attraction: 'Force the king into a mating net',
                clearance: 'Remove a piece to open a line',
                xRayAttack: 'Attack through a piece to a more valuable piece',
                windmill: 'Repeating discovered checks gaining material',
                perpetualCheck: 'Infinite check sequence forcing draw',
                stalemate: 'Draw when player has no legal moves',
                fortress: 'Defensive position that cannot be breached',
                zugzwang: 'Position where any move worsens position'
            }
        };
    }

    initializeEndgameDatabase() {
        return {
            pawnEndgames: {
                kingAndPawn: {
                    opposition: 'Critical square control technique',
                    triangulation: 'Losing a tempo to gain opposition',
                    squareOfThePawn: 'King must stay within pawn\'s square',
                    rookPawn: 'Special considerations for a or h pawns',
                    passedPawn: 'Promotion technique with outside passer',
                    pawnMajority: 'Creating a passed pawn on the queenside',
                    zugzwang: 'Forcing opponent into unfavorable moves'
                },
                pawnRaces: {
                    mutualPassedPawns: 'Queen race calculation',
                    queeningSquare: 'Key squares for pawn promotion',
                    underpromotion: 'When to promote to knight or rook'
                }
            },
            rookEndgames: {
                lucenaPosition: 'Winning technique with pawn on 7th rank',
                philidorPosition: 'Drawing technique with pawn on 6th rank',
                rookAndPawn: 'Cut off the king technique',
                rookVsPawn: 'Rook vs pawn on 7th rank technique',
                rookEndgamePrinciples: 'Active rook, behind passed pawn',
                vancuraPosition: 'Drawing technique with rook vs rook and pawn'
            },
            queenEndgames: {
                queenVsPawn: 'Avoid stalemate, use queen\'s mobility',
                queenVsRook: 'Winning technique with king support',
                queenAndPawn: 'Coordinate queen with king for promotion'
            },
            bishopEndgames: {
                sameColorBishops: 'Pawn structure determines outcome',
                oppositeColorBishops: 'Often drawish with few pawns',
                bishopVsKnight: 'Open positions favor bishop, closed favor knight',
                wrongColoredBishop: 'Rook pawn can be draw with wrong bishop'
            },
            knightEndgames: {
                knightVsPawn: 'Knight can struggle vs distant pawns',
                knightOutposts: 'Advanced knights supported by pawns',
                knightFork: 'Two weaknesses can be exploited'
            },
            multiplePieceEndgames: {
                queenAndPawnVsQueen: 'Draw if king exposed, win with zugzwang',
                rookAndBishopVsRook: 'Difficult win, need precise technique',
                twoKnightsVsPawn: 'Generally draw unless pawn blocks king',
                twoBishopsVsKnight: 'Win if bishops coordinate well'
            },
            fundamentalPrinciples: {
                centralizeKing: 'King becomes powerful piece in endgame',
                activePieces: 'Pieces need activity more than material',
                pawnStructure: 'Passed pawns are decisive',
                zugzwang: 'Forcing opponent to move into worse position',
                fortress: 'Building unbreachable defensive structure',
                prophylaxis: 'Prevent opponent from improving position'
            }
        };
    }

    getOpeningRecommendation(moveHistory) {
        if (moveHistory.length === 0) {
            // First move recommendations with professional weighting
            const firstMoves = ['e2e4', 'd2d4', 'g1f3', 'c2c4', 'b1c3', 'g2g3', 'b2b3'];
            const weights = [35, 35, 15, 10, 2, 2, 1];
            return this.weightedRandomChoice(firstMoves, weights);
        }

        // Try to find exact position match in opening book
        if (moveHistory.length >= 2) {
            const positionKey = moveHistory.join(' ');
            if (this.openingBook[positionKey]) {
                const data = this.openingBook[positionKey];
                if (data.moves && data.weights) {
                    return this.weightedRandomChoice(data.moves, data.weights);
                }
            }
        }

        // Try to find last two moves pattern
        if (moveHistory.length >= 2) {
            const whiteMove = moveHistory[moveHistory.length - 2];
            const blackMove = moveHistory[moveHistory.length - 1];
            const patternKey = `${whiteMove} ${blackMove}`;
            
            if (this.openingBook[patternKey]) {
                const data = this.openingBook[patternKey];
                if (data.moves && data.weights) {
                    return this.weightedRandomChoice(data.moves, data.weights);
                }
            }
        }

        // Try to find last move
        if (moveHistory.length >= 1) {
            const lastMove = moveHistory[moveHistory.length - 1];
            if (this.openingBook[lastMove]) {
                const responses = Object.keys(this.openingBook[lastMove]);
                if (responses.length > 0) {
                    const weights = responses.map(r => {
                        const responseData = this.openingBook[lastMove][r];
                        return responseData.weights ? responseData.weights[0] : 1;
                    });
                    return this.weightedRandomChoice(responses, weights);
                }
            }
        }

        return null;
    }

    getOpeningVariation(moveHistory) {
        const variationKey = moveHistory.slice(0, Math.min(8, moveHistory.length)).join(' ');
        
        // Traverse opening book to find variation description
        let currentNode = this.openingBook;
        let variationDesc = null;
        
        for (let i = 0; i < moveHistory.length; i++) {
            const move = moveHistory[i];
            if (currentNode[move]) {
                if (currentNode[move].description) {
                    variationDesc = currentNode[move].description;
                }
                if (currentNode[move].variations) {
                    currentNode = currentNode[move].variations;
                } else {
                    currentNode = currentNode[move];
                }
            } else {
                break;
            }
        }
        
        return variationDesc || 'Book position';
    }

    getMiddlegameAdvice(position) {
        const advice = [];
        const pieceActivity = this.evaluatePieceActivity(position);
        const pawnStructure = this.evaluatePawnStructure(position);
        const kingSafety = this.evaluateKingSafety(position);
        
        if (pieceActivity < 0.5) {
            advice.push('Improve piece activity - develop your pieces to active squares');
        }
        if (pawnStructure < 0.5) {
            advice.push('Fix pawn structure - avoid isolated or doubled pawns');
        }
        if (kingSafety < 0.7) {
            advice.push('Improve king safety - consider castling or creating luft');
        }
        
        return advice;
    }

    evaluatePieceActivity(position) {
        // Simplified piece activity evaluation
        // Would be replaced with actual board analysis
        return 0.7;
    }

    evaluatePawnStructure(position) {
        // Simplified pawn structure evaluation
        return 0.6;
    }

    evaluateKingSafety(position) {
        // Simplified king safety evaluation
        return 0.8;
    }

    getEndgameAdvice(position, material) {
        const advice = [];
        
        if (material.totalPieces <= 6) {
            advice.push('Activate your king - in endgames, the king becomes a powerful attacking piece');
            
            if (material.pawns > 0) {
                advice.push('Create a passed pawn - push pawns on the side with majority');
            }
            
            if (material.rooks > 0) {
                advice.push('Place rooks behind passed pawns - rook behind pawn is usually strongest');
            }
        }
        
        return advice;
    }

    weightedRandomChoice(choices, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < choices.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return choices[i];
            }
        }
        return choices[0];
    }

    learnFromGame(gameData) {
        if (!this.adaptiveLearning) return;

        this.performanceHistory.push({
            timestamp: Date.now(),
            result: gameData.result,
            difficulty: this.difficulty,
            playerColors: gameData.playerColors,
            moves: gameData.moves,
            gameLength: gameData.moves ? gameData.moves.length : 0,
            opening: gameData.moves ? this.getOpeningVariation(gameData.moves) : 'Unknown'
        });

        this.adjustDifficultyBasedOnPerformance();
        this.learnFromOpening(gameData.moves, gameData.result);
        this.updatePositionEvaluations(gameData);

        console.log(`🎓 AI learned from game. New difficulty: ${this.difficulty}`);
    }

    adjustDifficultyBasedOnPerformance() {
        const recentGames = this.performanceHistory.slice(-10);
        if (recentGames.length < 5) return;

        const wins = recentGames.filter(game => game.result === 'win').length;
        const winRate = wins / recentGames.length;

        if (winRate > 0.7) {
            this.difficulty = Math.min(8, this.difficulty + 1);
        } else if (winRate < 0.3) {
            this.difficulty = Math.max(1, this.difficulty - 1);
        }

        // Add randomness to prevent predictability
        if (Math.random() < 0.1) {
            this.difficulty += Math.random() < 0.5 ? -1 : 1;
            this.difficulty = Math.max(1, Math.min(8, this.difficulty));
        }
    }

    learnFromOpening(moves, result) {
        if (!moves || moves.length < 4) return;

        const opening = moves.slice(0, 4).join('_');
        if (!this.positionEvaluations.has(opening)) {
            this.positionEvaluations.set(opening, { games: 0, score: 0 });
        }

        const data = this.positionEvaluations.get(opening);
        data.games++;
        
        if (result === 'win') {
            data.score += 1;
        } else if (result === 'draw') {
            data.score += 0.5;
        }
        
        // If this opening performs poorly, adjust weights
        if (data.games >= 5 && (data.score / data.games) < 0.3) {
            this.adjustOpeningWeights(moves[0], moves[1], -0.05);
        } else if (data.games >= 5 && (data.score / data.games) > 0.7) {
            this.adjustOpeningWeights(moves[0], moves[1], 0.05);
        }
    }

    adjustOpeningWeights(firstMove, response, adjustment) {
        if (this.openingBook[firstMove] && this.openingBook[firstMove][response]) {
            const data = this.openingBook[firstMove][response];
            if (data.weights) {
                for (let i = 0; i < data.weights.length; i++) {
                    data.weights[i] = Math.max(1, Math.min(100, data.weights[i] + adjustment));
                }
            }
        }
    }

    updatePositionEvaluations(gameData) {
        if (!gameData.moves) return;
        
        const criticalMoves = this.identifyCriticalMoves(gameData.moves);
        
        criticalMoves.forEach(moveIndex => {
            const position = gameData.moves.slice(0, moveIndex).join('_');
            if (!this.positionEvaluations.has(position)) {
                this.positionEvaluations.set(position, { games: 0, score: 0 });
            }
            
            const data = this.positionEvaluations.get(position);
            data.games++;
            
            if (gameData.result === 'win') {
                data.score += 1;
            } else if (gameData.result === 'draw') {
                data.score += 0.5;
            }
        });
    }

    identifyCriticalMoves(moves) {
        const critical = [];
        for (let i = 10; i < Math.min(40, moves.length); i += 2) {
            critical.push(i);
        }
        return critical;
    }

    getWinRate() {
        if (this.performanceHistory.length === 0) return 50;
        
        const wins = this.performanceHistory.filter(game => game.result === 'win').length;
        const draws = this.performanceHistory.filter(game => game.result === 'draw').length;
        
        return Math.round(((wins + draws * 0.5) / this.performanceHistory.length) * 100);
    }

    getOpeningStatistics() {
        const stats = {};
        this.performanceHistory.forEach(game => {
            if (game.moves && game.moves.length >= 2) {
                const opening = game.opening || game.moves.slice(0, 2).join(' ');
                if (!stats[opening]) {
                    stats[opening] = { games: 0, wins: 0, draws: 0, winRate: 0 };
                }
                stats[opening].games++;
                if (game.result === 'win') stats[opening].wins++;
                if (game.result === 'draw') stats[opening].draws++;
                stats[opening].winRate = Math.round((stats[opening].wins / stats[opening].games) * 100);
            }
        });
        
        return stats;
    }

    exportLearningData() {
        return {
            performanceHistory: this.performanceHistory,
            difficulty: this.difficulty,
            winRate: this.getWinRate(),
            gamesPlayed: this.performanceHistory.length,
            positionEvaluations: Array.from(this.positionEvaluations.entries()),
            openingStats: this.getOpeningStatistics(),
            exportDate: new Date().toISOString()
        };
    }

    importLearningData(data) {
        if (data.performanceHistory) {
            this.performanceHistory = data.performanceHistory;
        }
        if (data.difficulty) {
            this.difficulty = data.difficulty;
        }
        if (data.positionEvaluations) {
            this.positionEvaluations = new Map(data.positionEvaluations);
        }
        
        console.log(`🔄 Imported learning data: ${this.performanceHistory.length} games, difficulty ${this.difficulty}`);
    }

    analyzeOpening(moves) {
        if (!moves || moves.length < 4) return null;
        
        const openingMoves = moves.slice(0, 6);
        const openingString = openingMoves.join(' ');
        
        // Comprehensive opening classification
        const classifications = [
            // e4 Openings
            { pattern: /e2e4 e7e5/, name: "Open Game" },
            { pattern: /e2e4 e7e5 g1f3 b8c6/, name: "King's Knight Opening" },
            { pattern: /e2e4 e7e5 g1f3 b8c6 f1c4/, name: "Italian Game" },
            { pattern: /e2e4 e7e5 g1f3 b8c6 f1b5/, name: "Ruy Lopez (Spanish)" },
            { pattern: /e2e4 e7e5 g1f3 b8c6 d2d4/, name: "Scotch Game" },
            { pattern: /e2e4 e7e5 f2f4/, name: "King's Gambit" },
            { pattern: /e2e4 e7e5 g1f3 g8f6/, name: "Petrov Defense" },
            { pattern: /e2e4 e7e5 g1f3 d7d6/, name: "Philidor Defense" },
            { pattern: /e2e4 c7c5/, name: "Sicilian Defense" },
            { pattern: /e2e4 c7c5 g1f3 d7d6/, name: "Sicilian - Najdorf Variation" },
            { pattern: /e2e4 c7c5 g1f3 e7e6/, name: "Sicilian - Scheveningen" },
            { pattern: /e2e4 c7c5 g1f3 b8c6/, name: "Sicilian - Sveshnikov" },
            { pattern: /e2e4 e7e6/, name: "French Defense" },
            { pattern: /e2e4 e7e6 d2d4 d7d5/, name: "French - Classical" },
            { pattern: /e2e4 c7c6/, name: "Caro-Kann Defense" },
            { pattern: /e2e4 d7d6/, name: "Pirc Defense" },
            { pattern: /e2e4 g7g6/, name: "Modern Defense" },
            { pattern: /e2e4 g8f6/, name: "Alekhine's Defense" },
            { pattern: /e2e4 d7d5/, name: "Scandinavian Defense" },
            { pattern: /e2e4 b8c6/, name: "Nimzowitsch Defense" },
            
            // d4 Openings
            { pattern: /d2d4 d7d5/, name: "Queen's Pawn Game" },
            { pattern: /d2d4 d7d5 c2c4/, name: "Queen's Gambit" },
            { pattern: /d2d4 d7d5 c2c4 e7e6/, name: "Queen's Gambit Declined" },
            { pattern: /d2d4 d7d5 c2c4 d5c4/, name: "Queen's Gambit Accepted" },
            { pattern: /d2d4 d7d5 c2c4 c7c6/, name: "Slav Defense" },
            { pattern: /d2d4 g8f6/, name: "Indian Game" },
            { pattern: /d2d4 g8f6 c2c4 e7e6/, name: "Nimzo-Indian Defense" },
            { pattern: /d2d4 g8f6 c2c4 g7g6/, name: "King's Indian Defense" },
            { pattern: /d2d4 g8f6 c2c4 c7c5/, name: "Benoni Defense" },
            { pattern: /d2d4 g8f6 c2c4 e7e6 g2g3/, name: "Catalan Opening" },
            { pattern: /d2d4 f7f5/, name: "Dutch Defense" },
            { pattern: /d2d4 e7e6/, name: "Queen's Indian" },
            
            // Other Openings
            { pattern: /g1f3/, name: "Reti Opening" },
            { pattern: /c2c4/, name: "English Opening" },
            { pattern: /g2g3/, name: "King's Fianchetto" },
            { pattern: /f2f4/, name: "Bird's Opening" },
            { pattern: /b2b3/, name: "Larsen's Opening" },
            { pattern: /b1c3/, name: "Dunst Opening" }
        ];
        
        for (const classification of classifications) {
            if (classification.pattern.test(openingString)) {
                return classification.name;
            }
        }
        
        return 'Unknown Opening';
    }

    getImprovementSuggestions() {
        if (this.performanceHistory.length < 10) {
            return ['Play more games to get personalized suggestions'];
        }
        
        const suggestions = [];
        const recentGames = this.performanceHistory.slice(-20);
        const avgGameLength = recentGames.reduce((sum, game) => sum + (game.gameLength || 0), 0) / recentGames.length;
        const winRate = this.getWinRate();
        
        if (avgGameLength < 25) {
            suggestions.push('💡 Focus on opening preparation - games are ending too quickly');
        } else if (avgGameLength > 80) {
            suggestions.push('💡 Study endgame technique - games are lasting very long');
        }
        
        if (winRate < 35) {
            suggestions.push('💡 Practice basic tactics and positional principles daily');
            suggestions.push('💡 Review your lost games to identify recurring mistakes');
        } else if (winRate < 50) {
            suggestions.push('💡 Work on your middlegame plans and piece coordination');
            suggestions.push('💡 Study typical pawn structures in your favorite openings');
        } else if (winRate > 70) {
            suggestions.push('💡 Excellent play! Consider playing stronger opponents');
            suggestions.push('💡 Deepen your opening repertoire with theoretical variations');
        }
        
        const openingStats = this.getOpeningStatistics();
        const weakOpenings = Object.entries(openingStats)
            .filter(([_, stats]) => stats.games >= 3 && stats.winRate < 40)
            .map(([opening, _]) => opening);
        
        if (weakOpenings.length > 0) {
            suggestions.push(`💡 Consider studying ${weakOpenings[0]} - your win rate is below 40%`);
        }
        
        return suggestions.length > 0 ? suggestions : ['💡 Keep practicing and analyzing your games!'];
    }

    getDifficultyDescription() {
        const descriptions = {
            1: 'Beginner - Makes obvious mistakes',
            2: 'Novice - Learning basic principles',
            3: 'Casual - Knows basic tactics',
            4: 'Intermediate - Solid understanding',
            5: 'Advanced - Good positional play',
            6: 'Expert - Strong tactical vision',
            7: 'Master - Deep positional understanding',
            8: 'Grandmaster - Near-perfect play'
        };
        return descriptions[this.difficulty] || 'Standard difficulty';
    }

    reset() {
        this.performanceHistory = [];
        this.positionEvaluations.clear();
        this.difficulty = 4;
        console.log('🔄 AI learning data reset');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChessAILearner;
}
