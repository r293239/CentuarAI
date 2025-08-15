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
