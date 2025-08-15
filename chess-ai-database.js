// chess-ai-database.js
// Professional chess games database and AI learning system

const ChessAIDatabase = {
    // Famous professional games for AI learning
    masterGames: [
        {
            id: "immortal_game_1851",
            white: "Adolf Anderssen",
            black: "Lionel Kieseritzky",
            year: 1851,
            result: "1-0",
            opening: "King's Gambit",
            eco: "C33",
            moves: [
                "e2-e4", "e7-e5", "f2-f4", "e5xf4", "f1-c4", "d8-h4",
                "e1-f1", "b7-b5", "c4xb5", "g8-f6", "g1-f3", "h4-h6",
                "d2-d3", "f6-h5", "f3-h4", "h6-g5", "h4-f5", "c7-c6",
                "g2-g4", "h5-f6", "h1-g1", "c6xb5", "h2-h4", "g5-g6",
                "h4-h5", "g6-g5", "d1-f3", "f6-g8", "c1xf4", "g5xf4",
                "f3xf4", "h8-f8", "f4-f6", "g8xf6", "g1xg7"
            ],
            keyMoments: [
                { move: 7, note: "King walks into danger - brilliant sacrifice play" },
                { move: 18, note: "Rook sacrifice for attack" },
                { move: 23, note: "Checkmate combination" }
            ]
        },
        {
            id: "evergreen_game_1852",
            white: "Adolf Anderssen",
            black: "Jean Dufresne",
            year: 1852,
            result: "1-0",
            opening: "Evans Gambit",
            eco: "C52",
            moves: [
                "e2-e4", "e7-e5", "g1-f3", "b8-c6", "f1-c4", "f8-c5",
                "b2-b4", "c5xb4", "c2-c3", "b4-a5", "d2-d4", "e5xd4",
                "e1-g1", "d7-d3", "d1-b3", "d8-f6", "e4-e5", "f6-g6",
                "f1-e1", "g8-e7", "c1-a3", "b7-b5", "c4xb5", "a8-b8"
            ],
            keyMoments: [
                { move: 7, note: "Evans Gambit accepted" },
                { move: 19, note: "Complex tactical sequence begins" },
                { move: 23, note: "Brilliant queen sacrifice leads to mate" }
            ]
        },
        {
            id: "kasparov_topalov_1999",
            white: "Garry Kasparov",
            black: "Veselin Topalov",
            year: 1999,
            result: "1-0",
            opening: "Pirc Defense",
            eco: "B06",
            moves: [
                "e2-e4", "d7-d6", "d2-d4", "g8-f6", "b1-c3", "g7-g6",
                "c1-e3", "f8-g7", "d1-d2", "c7-c6", "f2-f3", "b7-b5",
                "g1-e2", "b8-d7", "e3-h6", "g7xh6", "d2xh6", "c8-b7"
            ],
            keyMoments: [
                { move: 15, note: "Bishop sacrifice for attack" },
                { move: 24, note: "Brilliant rook sacrifice" },
                { move: 37, note: "Forced mate sequence" }
            ]
        },
        {
            id: "capablanca_marshall_1909",
            white: "José Raúl Capablanca",
            black: "Frank Marshall",
            year: 1909,
            result: "1-0",
            opening: "Ruy Lopez",
            eco: "C89",
            moves: [
                "e2-e4", "e7-e5", "g1-f3", "b8-c6", "f1-b5", "a7-a6",
                "b5-a4", "g8-f6", "e1-g1", "f8-e7", "f1-e1", "b7-b5",
                "a4-b3", "d7-d6", "c2-c3", "e8-g8", "h2-h3", "c6-a5",
                "b3-c2", "c7-c5", "d2-d4", "d8-c7", "b1-d2", "c8-d7"
            ],
            keyMoments: [
                { move: 8, note: "Marshall Attack preparation" },
                { move: 23, note: "Positional masterclass begins" },
                { move: 30, note: "Endgame technique demonstration" }
            ]
        },
        {
            id: "morphy_count_1858",
            white: "Paul Morphy",
            black: "Count Isouard and Duke of Brunswick",
            year: 1858,
            result: "1-0",
            opening: "Italian Game",
            eco: "C41",
            moves: [
                "e2-e4", "e7-e5", "g1-f3", "d7-d6", "d2-d4", "c8-g4",
                "d4xe5", "g4xf3", "d1xf3", "d6xe5", "f1-c4", "g8-f6",
                "f3-b3", "d8-e7", "b1-c3", "c7-c6", "c1-g5", "b7-b5",
                "c3xb5", "c6xb5", "c4xb5", "b8-d7", "e1-c1", "a8-d8",
                "d1xd7", "d8xd7", "h1-d1", "e7-e6", "b5xd7", "f6xd7",
                "b3-b8", "d7xb8", "d1-d8"
            ],
            keyMoments: [
                { move: 8, note: "Rapid development principles" },
                { move: 17, note: "Sacrificial attack begins" },
                { move: 25, note: "Elegant mate in the opera box" }
            ]
        },
        {
            id: "fischer_byrne_1956",
            white: "Robert Byrne",
            black: "Bobby Fischer",
            year: 1956,
            result: "0-1",
            opening: "Grünfeld Defense",
            eco: "D92",
            moves: [
                "d2-d4", "g8-f6", "c2-c4", "g7-g6", "g2-g3", "c7-c6",
                "f1-g2", "d7-d5", "c4xd5", "c6xd5", "b1-c3", "f8-g7",
                "e2-e3", "e8-g8", "g1-e2", "b8-c6", "e1-g1", "b7-b6",
                "b2-b3", "c8-a6", "c1-a3", "f8-e8", "d1-d2", "e7-e5"
            ],
            keyMoments: [
                { move: 11, note: "Fischer's brilliant piece sacrifice" },
                { move: 17, note: "The famous queen sacrifice" },
                { move: 21, note: "Game of the Century climax" }
            ]
        }
    ],

    // Comprehensive opening book
    openingBook: {
        // Starting position
        "": {
            name: "Starting Position",
            continuations: [
                { moves: ["e2-e4"], evaluation: 0.2, frequency: 40 },
                { moves: ["d2-d4"], evaluation: 0.2, frequency: 35 },
                { moves: ["g1-f3"], evaluation: 0.1, frequency: 15 },
                { moves: ["c2-c4"], evaluation: 0.15, frequency: 10 }
            ]
        },
        // King's Pawn Openings
        "e2-e4": {
            name: "King's Pawn",
            continuations: [
                { moves: ["e7-e5"], evaluation: 0.0, frequency: 60 },
                { moves: ["c7-c5"], evaluation: 0.2, frequency: 25 },
                { moves: ["e7-e6"], evaluation: 0.1, frequency: 10 },
                { moves: ["c7-c6"], evaluation: 0.15, frequency: 5 }
            ]
        },
        "e2-e4,e7-e5": {
            name: "Open Game",
            continuations: [
                { moves: ["g1-f3"], evaluation: 0.2, frequency: 70 },
                { moves: ["f2-f4"], evaluation: 0.1, frequency: 15 },
                { moves: ["f1-c4"], evaluation: 0.15, frequency: 10 },
                { moves: ["b1-c3"], evaluation: 0.05, frequency: 5 }
            ]
        },
        "e2-e4,e7-e5,g1-f3": {
            name: "King's Knight Opening",
            continuations: [
                { moves: ["b8-c6"], evaluation: 0.0, frequency: 80 },
                { moves: ["g8-f6"], evaluation: 0.1, frequency: 15 },
                { moves: ["f7-f5"], evaluation: -0.2, frequency: 3 },
                { moves: ["d7-d6"], evaluation: 0.05, frequency: 2 }
            ]
        },
        "e2-e4,e7-e5,g1-f3,b8-c6": {
            name: "King's Knight Game",
            continuations: [
                { moves: ["f1-b5"], evaluation: 0.3, frequency: 45 },
                { moves: ["f1-c4"], evaluation: 0.2, frequency: 30 },
                { moves: ["d2-d4"], evaluation: 0.25, frequency: 15 },
                { moves: ["b1-c3"], evaluation: 0.1, frequency: 10 }
            ]
        },
        "e2-e4,e7-e5,g1-f3,b8-c6,f1-b5": {
            name: "Ruy Lopez",
            continuations: [
                { moves: ["a7-a6"], evaluation: 0.0, frequency: 85 },
                { moves: ["g8-f6"], evaluation: 0.1, frequency: 10 },
                { moves: ["f7-f5"], evaluation: -0.3, frequency: 3 },
                { moves: ["f8-c5"], evaluation: 0.05, frequency: 2 }
            ]
        },
        "e2-e4,e7-e5,g1-f3,b8-c6,f1-c4": {
            name: "Italian Game",
            continuations: [
                { moves: ["f8-c5"], evaluation: 0.0, frequency: 50 },
                { moves: ["g8-f6"], evaluation: 0.1, frequency: 25 },
                { moves: ["f8-e7"], evaluation: 0.05, frequency: 20 },
                { moves: ["f7-f5"], evaluation: -0.2, frequency: 5 }
            ]
        },

        // Sicilian Defense
        "e2-e4,c7-c5": {
            name: "Sicilian Defense",
            continuations: [
                { moves: ["g1-f3"], evaluation: 0.3, frequency: 75 },
                { moves: ["b1-c3"], evaluation: 0.2, frequency: 15 },
                { moves: ["f2-f4"], evaluation: 0.1, frequency: 5 },
                { moves: ["d2-d4"], evaluation: 0.25, frequency: 5 }
            ]
        },
        "e2-e4,c7-c5,g1-f3": {
            name: "Sicilian, Open",
            continuations: [
                { moves: ["d7-d6"], evaluation: 0.2, frequency: 40 },
                { moves: ["b8-c6"], evaluation: 0.25, frequency: 30 },
                { moves: ["g7-g6"], evaluation: 0.15, frequency: 20 },
                { moves: ["e7-e6"], evaluation: 0.1, frequency: 10 }
            ]
        },

        // French Defense
        "e2-e4,e7-e6": {
            name: "French Defense",
            continuations: [
                { moves: ["d2-d4"], evaluation: 0.3, frequency: 90 },
                { moves: ["g1-f3"], evaluation: 0.15, frequency: 8 },
                { moves: ["f2-f4"], evaluation: 0.1, frequency: 2 }
            ]
        },
        "e2-e4,e7-e6,d2-d4": {
            name: "French Defense",
            continuations: [
                { moves: ["d7-d5"], evaluation: 0.0, frequency: 95 },
                { moves: ["c7-c5"], evaluation: 0.2, frequency: 5 }
            ]
        },

        // Queen's Pawn Openings
        "d2-d4": {
            name: "Queen's Pawn",
            continuations: [
                { moves: ["d7-d5"], evaluation: 0.0, frequency: 45 },
                { moves: ["g8-f6"], evaluation: 0.1, frequency: 40 },
                { moves: ["f7-f5"], evaluation: -0.1, frequency: 10 },
                { moves: ["e7-e6"], evaluation: 0.05, frequency: 5 }
            ]
        },
        "d2-d4,d7-d5": {
            name: "Closed Game",
            continuations: [
                { moves: ["c2-c4"], evaluation: 0.3, frequency: 70 },
                { moves: ["g1-f3"], evaluation: 0.2, frequency: 20 },
                { moves: ["e2-e3"], evaluation: 0.1, frequency: 10 }
            ]
        },
        "d2-d4,d7-d5,c2-c4": {
            name: "Queen's Gambit",
            continuations: [
                { moves: ["d5xc4"], evaluation: 0.0, frequency: 35 },
                { moves: ["e7-e6"], evaluation: 0.1, frequency: 30 },
                { moves: ["c7-c6"], evaluation: 0.15, frequency: 25 },
                { moves: ["g8-f6"], evaluation: 0.05, frequency: 10 }
            ]
        },
        "d2-d4,g8-f6": {
            name: "Indian Defenses",
            continuations: [
                { moves: ["c2-c4"], evaluation: 0.25, frequency: 60 },
                { moves: ["g1-f3"], evaluation: 0.2, frequency: 25 },
                { moves: ["b1-c3"], evaluation: 0.15, frequency: 10 },
                { moves: ["c1-g5"], evaluation: 0.3, frequency: 5 }
            ]
        },
        "d2-d4,g8-f6,c2-c4": {
            name: "Indian Game",
            continuations: [
                { moves: ["e7-e6"], evaluation: 0.1, frequency: 35 },
                { moves: ["g7-g6"], evaluation: 0.15, frequency: 30 },
                { moves: ["c7-c5"], evaluation: 0.2, frequency: 20 },
                { moves: ["d7-d5"], evaluation: 0.05, frequency: 15 }
            ]
        }
    ],

    // Tactical pattern database
    tacticalPatterns: {
        pins: [
            {
                name: "absolute_pin",
                description: "Piece cannot move due to king exposure",
                frequency: "common",
                value: 50,
                pieces: ["bishop", "rook", "queen"]
            },
            {
                name: "relative_pin",
                description: "Moving piece loses material",
                frequency: "very_common",
                value: 30,
                pieces: ["bishop", "rook", "queen"]
            }
        ],
        forks: [
            {
                name: "knight_fork",
                description: "Knight attacks two pieces",
                frequency: "common",
                value: 80,
                piece: "knight"
            },
            {
                name: "pawn_fork",
                description: "Pawn attacks two pieces",
                frequency: "very_common",
                value: 40,
                piece: "pawn"
            }
        ],
        skewers: [
            {
                name: "king_skewer",
                description: "King must move, exposing piece",
                frequency: "uncommon",
                value: 100,
                pieces: ["bishop", "rook", "queen"]
            }
        ],
        discoveredAttacks: [
            {
                name: "discovered_check",
                description: "Moving piece reveals check",
                frequency: "uncommon",
                value: 120,
                effect: "forces_response"
            }
        ]
    },

    // Endgame patterns
    endgamePatterns: {
        basicMates: {
            "queen_vs_king": { difficulty: 1, maxMoves: 10 },
            "rook_vs_king": { difficulty: 2, maxMoves: 16 },
            "two_bishops_vs_king": { difficulty: 4, maxMoves: 33 },
            "bishop_knight_vs_king": { difficulty: 5, maxMoves: 33 }
        },
        pawnEndgames: {
            "king_pawn_vs_king": {
                keySquares: ["promotion_square", "critical_squares"],
                concepts: ["opposition", "triangulation", "zugzwang"]
            },
            "pawn_majority": {
                technique: "create_passed_pawn",
                priority: "outside_passed_pawn"
            }
        }
    },

    // Position evaluation parameters
    evaluationWeights: {
        material: {
            pawn: 100,
            knight: 320,
            bishop: 330,
            rook: 500,
            queen: 900,
            king: 20000
        },
        positional: {
            centerControl: 25,
            pieceActivity: 20,
            kingSafety: 50,
            pawnStructure: 30,
            pieceCoordination: 15
        },
        gamePhase: {
            opening: {
                development: 40,
                centerControl: 35,
                kingSafety: 25
            },
            middlegame: {
                pieceActivity: 45,
                tacticalOpportunities: 40,
                kingSafety: 35
            },
            endgame: {
                kingActivity: 50,
                pawnAdvancement: 60,
                pieceCoordination: 30
            }
        }
    },

    // Learning parameters
    learningConfig: {
        explorationRate: 0.1,
        learningRate: 0.05,
        memoryDecay: 0.95,
        adaptiveDifficulty: true,
        maxStoredGames: 1000,
        patternRecognitionThreshold: 0.7
    }
};

// AI Learning System
class ChessAILearner {
    constructor() {
        this.database = ChessAIDatabase;
        this.gameMemory = new Map();
        this.patternRecognition = new Map();
        this.performanceHistory = [];
        this.openingStats = new Map();
        this.endgameStats = new Map();
    }

    // Learn from completed game
    learnFromGame(gameData) {
        this.performanceHistory.push({
            timestamp: Date.now(),
            result: gameData.result,
            aiColor: gameData.playerColors.ai,
            moves: gameData.moves.length,
            difficulty: gameData.difficulty || 4
        });

        // Analyze opening performance
        this.analyzeOpening(gameData.moves.slice(0, 20), gameData.result, gameData.playerColors.ai);

        // Extract tactical patterns
        this.extractTacticalPatterns(gameData.moves);

        // Update difficulty if adaptive
        if (this.database.learningConfig.adaptiveDifficulty) {
            this.adjustDifficulty();
        }

        // Keep memory manageable
        this.pruneMemory();
    }

    // Analyze opening performance
    analyzeOpening(openingMoves, result, aiColor) {
        const openingKey = openingMoves.slice(0, 10).join('|');
        
        if (!this.openingStats.has(openingKey)) {
            this.openingStats.set(openingKey, { 
                games: 0, wins: 0, draws: 0, losses: 0 
            });
        }

        const stats = this.openingStats.get(openingKey);
        stats.games++;

        if ((result === 'win' && aiColor === 'white') || 
            (result === 'win' && aiColor === 'black')) {
            stats.wins++;
        } else if (result === 'draw') {
            stats.draws++;
        } else {
            stats.losses++;
        }
    }

    // Get opening recommendation
    getOpeningRecommendation(moveHistory) {
        const openingKey = moveHistory.join(',');
        
        // Check main opening book
        if (this.database.openingBook[openingKey]) {
            const opening = this.database.openingBook[openingKey];
            return this.selectBestContinuation(opening.continuations);
        }

        // Check learned patterns
        const patternKey = moveHistory.slice(0, 8).join('|');
        if (this.openingStats.has(patternKey)) {
            const stats = this.openingStats.get(patternKey);
            if (stats.wins > stats.losses) {
                // Return a move from successful games with this pattern
                return this.getBestLearnedMove(patternKey);
            }
        }

        return null;
    }

    // Select best continuation from opening theory
    selectBestContinuation(continuations) {
        let bestMove = null;
        let bestScore = -Infinity;

        for (const continuation of continuations) {
            // Weight by evaluation and frequency, add some randomness
            const score = (continuation.evaluation * 0.6) + 
                         (continuation.frequency / 100 * 0.4) + 
                         (Math.random() * 0.1);
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = continuation.moves[0];
            }
        }

        return bestMove;
    }

    // Get win rate
    getWinRate() {
        if (this.performanceHistory.length === 0) return 50;

        const recentGames = this.performanceHistory.slice(-50);
        const wins = recentGames.filter(game => 
            game.result === 'win'
        ).length;

        return Math.round((wins / recentGames.length) * 100);
    }

    // Adjust difficulty based on performance
    adjustDifficulty() {
        const winRate = this.getWinRate();
        let newDepth = 4; // Default

        if (winRate > 75) newDepth = 5;
        else if (winRate > 85) newDepth = 6;
        else if (winRate < 25) newDepth = 3;
        else if (winRate < 15) newDepth = 2;

        return newDepth;
    }

    // Extract patterns from game
    extractTacticalPatterns(moves) {
        for (let i = 0; i < moves.length - 3; i++) {
            const sequence = moves.slice(i, i + 4);
            const pattern = this.identifyPattern(sequence);
            
            if (pattern) {
                if (!this.patternRecognition.has(pattern)) {
                    this.patternRecognition.set(pattern, { count: 0, success: 0 });
                }
                this.patternRecognition.get(pattern).count++;
            }
        }
    }

    // Identify tactical patterns (simplified)
    identifyPattern(moveSequence) {
        const sequence = moveSequence.join(' ');
        
        if (sequence.includes('x') && sequence.includes('+')) {
            return 'capture_check_combo';
        }
        if (sequence.split('x').length > 2) {
            return 'multiple_captures';
        }
        if (sequence.includes('O-O') || sequence.includes('O-O-O')) {
            return 'castling_sequence';
        }
        
        return null;
    }

    // Prune old memory to prevent overflow
    pruneMemory() {
        const maxGames = this.database.learningConfig.maxStoredGames;
        
        if (this.performanceHistory.length > maxGames) {
            this.performanceHistory = this.performanceHistory.slice(-maxGames);
        }

        // Prune old opening stats
        if (this.openingStats.size > maxGames / 10) {
            const entries = Array.from(this.openingStats.entries());
            const sortedEntries = entries.sort((a, b) => b[1].games - a[1].games);
            this.openingStats = new Map(sortedEntries.slice(0, maxGames / 20));
        }
    }

    // Export learning data
    exportLearningData() {
        return {
            performanceHistory: this.performanceHistory.slice(-100),
            openingStats: Object.fromEntries(this.openingStats),
            patternRecognition: Object.fromEntries(this.patternRecognition),
            lastUpdated: Date.now(),
            totalGames: this.performanceHistory.length,
            winRate: this.getWinRate()
        };
    }

    // Import learning data
    importLearningData(data) {
        if (data.performanceHistory) {
            this.performanceHistory = data.performanceHistory;
        }
        if (data.openingStats) {
            this.openingStats = new Map(Object.entries(data.openingStats));
        }
        if (data.patternRecognition) {
            this.patternRecognition = new Map(Object.entries(data.patternRecognition));
        }
    }

    // Get best learned move for a pattern
    getBestLearnedMove(patternKey) {
        // This would analyze successful games with this pattern
        // For now, return null to fall back to other methods
        return null;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChessAIDatabase, ChessAILearner };
} else if (typeof window !== 'undefined') {
    window.ChessAIDatabase = ChessAIDatabase;
    window.ChessAILearner = ChessAILearner;
}
