// chess-game.js - ENHANCED VERSION
// Improved with better rules implementation and smarter AI

// Initialize enhanced AI system
let enhancedAI = null;

// Chess board representation
let board = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

let currentPlayer = 'white';
let selectedSquare = null;
let gameHistory = [];
let moveHistory = [];
let gameOver = false;
let gameMode = 'ai';
let humanPlayer = 'white';
const aiDepth = 4;
let moveCount = 1;
let halfMoveCount = 0;
let lastMove = null;
let isThinking = false;

// Game state tracking
let castlingRights = {
    whiteKingside: true,
    whiteQueenside: true,
    blackKingside: true,
    blackQueenside: true
};

let enPassantTarget = null;

// Enhanced piece mappings with better move generation
const pieceMap = {
    '♜': 'r', '♞': 'n', '♝': 'b', '♛': 'q', '♚': 'k', '♟': 'p',
    '♖': 'R', '♘': 'N', '♗': 'B', '♕': 'Q', '♔': 'K', '♙': 'P'
};

// Enhanced piece values for evaluation with better balance
const PIECE_VALUES = {
    '♙': 100, '♘': 320, '♗': 330, '♖': 500, '♕': 900, '♔': 20000,
    '♟': 100, '♞': 320, '♝': 330, '♜': 500, '♛': 900, '♚': 20000,
    '': 0
};

// Enhanced position evaluation tables with better piece placement
const PIECE_SQUARE_TABLES = {
    '♙': [ // White pawns - better center control
        [  0,  0,  0,  0,  0,  0,  0,  0],
        [ 50, 50, 50, 50, 50, 50, 50, 50],
        [ 10, 10, 20, 30, 30, 20, 10, 10],
        [  5,  5, 10, 27, 27, 10,  5,  5],
        [  0,  0,  0, 25, 25,  0,  0,  0],
        [  5, -5,-10,  0,  0,-10, -5,  5],
        [  5, 10, 10,-25,-25, 10, 10,  5],
        [  0,  0,  0,  0,  0,  0,  0,  0]
    ],
    '♘': [ // White knights - better centralization
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 20, 25, 25, 20,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    '♗': [ // White bishops - better diagonals
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  0, 10, 12, 12, 10,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    '♖': [ // White rooks - better file control
        [  0,  0,  0,  5,  5,  0,  0,  0],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [ -5,  0,  0,  0,  0,  0,  0, -5],
        [  5, 10, 10, 10, 10, 10, 10,  5],
        [  0,  0,  0,  0,  0,  0,  0,  0]
    ],
    '♕': [ // White queen - better mobility
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [  0,  0,  5,  5,  5,  5,  0, -5],
        [ -5,  0,  5,  5,  5,  5,  0, -5],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    '♔': [ // White king - better safety
        [ 20, 30, 10,  0,  0, 10, 30, 20],
        [ 20, 20,  0,  0,  0,  0, 20, 20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30]
    ]
};

// Enhanced mobility weights for better position evaluation
const MOBILITY_WEIGHTS = {
    '♙': 0.1, '♟': 0.1,
    '♘': 0.4, '♞': 0.4,
    '♗': 0.4, '♝': 0.4,
    '♖': 0.3, '♜': 0.3,
    '♕': 0.5, '♛': 0.5,
    '♔': 0.1, '♚': 0.1
};

// Initialize on page load
window.addEventListener('load', function() {
    if (typeof ChessAILearner !== 'undefined') {
        enhancedAI = new ChessAILearner();
        loadGameHistory();
        console.log("🧠 Enhanced AI learning system loaded with professional openings!");
    } else {
        console.log("ChessAILearner not found, using basic AI");
    }
    
    createBoard();
    updateStatus();
    updateAIStats();
    changeGameMode();
    
    console.log("♔ Enhanced Chess Game Loaded! ♛");
});

// Enhanced game history loading
function loadGameHistory() {
    try {
        const history = JSON.parse(sessionStorage.getItem('chess_ai_history') || '{"games": []}');
        if (history.learningData && enhancedAI) {
            enhancedAI.importLearningData(history.learningData);
            updateAIStatsDisplay(history);
        }
    } catch (e) {
        console.log("No previous game history found, starting fresh");
    }
}

// Enhanced game saving with better data structure
function saveGameToHistory(gameData) {
    try {
        const history = JSON.parse(sessionStorage.getItem('chess_ai_history') || '{"games": []}');
        history.games = history.games || [];
        history.games.push({
            ...gameData,
            timestamp: new Date().toISOString(),
            boardState: board.map(row => [...row]),
            currentPlayer: currentPlayer
        });
        
        history.metadata = {
            ...history.metadata,
            lastUpdated: new Date().toISOString(),
            totalGames: history.games.length,
            humanWins: history.games.filter(g => g.result === 'loss').length,
            aiWins: history.games.filter(g => g.result === 'win').length,
            draws: history.games.filter(g => g.result === 'draw').length
        };
        
        if (enhancedAI) {
            history.learningData = enhancedAI.exportLearningData();
        }
        sessionStorage.setItem('chess_ai_history', JSON.stringify(history));
    } catch (e) {
        console.warn("Could not save game history:", e);
    }
}

// Enhanced board creation with better visual feedback
function createBoard() {
    const boardElement = document.getElementById('chessboard');
    if (!boardElement) return;
    
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.id = `square-${row}-${col}`;
            square.dataset.row = row;
            square.dataset.col = col;
            
            if ((row + col) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            
            // Highlight last move
            if (lastMove && 
                ((lastMove.fromRow === row && lastMove.fromCol === col) ||
                 (lastMove.toRow === row && lastMove.toCol === col))) {
                square.classList.add('last-move');
            }
            
            // Highlight king in check
            const piece = board[row][col];
            if ((piece === '♔' && isKingInCheck(board, 'white')) ||
                (piece === '♚' && isKingInCheck(board, 'black'))) {
                square.classList.add('in-check');
            }
            
            square.textContent = board[row][col];
            square.onclick = () => handleSquareClick(row, col);
            
            boardElement.appendChild(square);
        }
    }
}

// Enhanced click handling with better move validation
function handleSquareClick(row, col) {
    if (gameOver || isThinking) return;
    
    if (gameMode === 'ai' && currentPlayer !== humanPlayer) return;
    
    const piece = board[row][col];
    
    if (selectedSquare) {
        const fromRow = selectedSquare.row;
        const fromCol = selectedSquare.col;
        
        if (fromRow === row && fromCol === col) {
            clearSelection();
            return;
        }
        
        if (isValidMove(fromRow, fromCol, row, col)) {
            makeMove(fromRow, fromCol, row, col);
            clearSelection();
            switchPlayer();
            updateStatus();
            
            if (gameMode === 'ai' && !gameOver && currentPlayer !== humanPlayer) {
                setTimeout(makeAIMove, 500);
            }
        } else {
            if (piece && isPlayerPiece(piece, currentPlayer)) {
                selectSquare(row, col);
            } else {
                clearSelection();
            }
        }
    } else {
        if (piece && isPlayerPiece(piece, currentPlayer)) {
            selectSquare(row, col);
        }
    }
}

function selectSquare(row, col) {
    clearSelection();
    selectedSquare = { row, col };
    const squareElement = document.getElementById(`square-${row}-${col}`);
    if (squareElement) {
        squareElement.classList.add('selected');
    }
    showPossibleMoves(row, col);
}

function clearSelection() {
    selectedSquare = null;
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('selected', 'possible-move', 'capture-move');
    });
    createBoard();
}

// Enhanced possible moves display
function showPossibleMoves(row, col) {
    const possibleMoves = [];
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(row, col, r, c)) {
                possibleMoves.push({row: r, col: c});
                const square = document.getElementById(`square-${r}-${c}`);
                if (square) {
                    if (board[r][c] && isPlayerPiece(board[r][c], currentPlayer === 'white' ? 'black' : 'white')) {
                        square.classList.add('capture-move');
                    } else {
                        square.classList.add('possible-move');
                    }
                }
            }
        }
    }
    
    // Log possible moves for debugging
    if (possibleMoves.length > 0) {
        console.log(`Possible moves from (${row},${col}):`, possibleMoves);
    }
}

function isPlayerPiece(piece, player) {
    if (!piece) return false;
    const whitePieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
    const blackPieces = ['♚', '♛', '♜', '♝', '♞', '♟'];
    
    return player === 'white' ? whitePieces.includes(piece) : blackPieces.includes(piece);
}

// Enhanced move validation with better rule enforcement
function isValidMove(fromRow, fromCol, toRow, toCol) {
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];
    
    if (!piece) return false;
    if (targetPiece && isPlayerPiece(targetPiece, currentPlayer)) return false;
    
    // Enhanced castling validation
    if ((piece === '♔' || piece === '♚') && Math.abs(toCol - fromCol) === 2 && fromRow === toRow) {
        return canCastle(fromRow, fromCol, toRow, toCol);
    }
    
    // Enhanced en passant validation
    if ((piece === '♙' || piece === '♟') && enPassantTarget && 
        toRow === enPassantTarget.row && toCol === enPassantTarget.col) {
        return isValidEnPassant(fromRow, fromCol, toRow, toCol);
    }
    
    const pieceCode = pieceMap[piece];
    if (!isValidPieceMove(pieceCode, fromRow, fromCol, toRow, toCol)) return false;
    
    // Enhanced check detection
    return !wouldLeaveKingInCheck(fromRow, fromCol, toRow, toCol);
}

function isValidPieceMove(piece, fromRow, fromCol, toRow, toCol) {
    const dx = toCol - fromCol;
    const dy = toRow - fromRow;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    switch (piece.toLowerCase()) {
        case 'p':
            return isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, dx, dy);
        case 'r':
            return (dx === 0 || dy === 0) && isPathClear(fromRow, fromCol, toRow, toCol);
        case 'n':
            return (absDx === 2 && absDy === 1) || (absDx === 1 && absDy === 2);
        case 'b':
            return absDx === absDy && isPathClear(fromRow, fromCol, toRow, toCol);
        case 'q':
            return (dx === 0 || dy === 0 || absDx === absDy) && isPathClear(fromRow, fromCol, toRow, toCol);
        case 'k':
            return absDx <= 1 && absDy <= 1;
        default:
            return false;
    }
}

// Enhanced pawn move validation
function isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, dx, dy) {
    const direction = piece === 'P' ? -1 : 1;
    const startRow = piece === 'P' ? 6 : 1;
    const absDx = Math.abs(dx);
    
    // Normal pawn move
    if (dx === 0) {
        if (dy === direction && !board[toRow][toCol]) return true;
        if (fromRow === startRow && dy === 2 * direction && !board[toRow][toCol] && 
            !board[fromRow + direction][fromCol]) return true;
    } 
    // Capture move
    else if (absDx === 1 && dy === direction) {
        if (board[toRow][toCol]) return true;
        // En passant
        if (enPassantTarget && toRow === enPassantTarget.row && toCol === enPassantTarget.col) {
            return true;
        }
    }
    
    return false;
}

// Enhanced en passant validation
function isValidEnPassant(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece || (piece !== '♙' && piece !== '♟')) return false;
    
    const direction = piece === '♙' ? -1 : 1;
    const dx = toCol - fromCol;
    const dy = toRow - fromRow;
    
    return Math.abs(dx) === 1 && dy === direction;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
    const dx = Math.sign(toCol - fromCol);
    const dy = Math.sign(toRow - fromRow);
    let currentRow = fromRow + dy;
    let currentCol = fromCol + dx;
    
    while (currentRow !== toRow || currentCol !== toCol) {
        if (board[currentRow][currentCol]) return false;
        currentRow += dy;
        currentCol += dx;
    }
    
    return true;
}

function wouldLeaveKingInCheck(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const originalTarget = board[toRow][toCol];
    
    // Handle en passant capture simulation
    let capturedEnPassant = null;
    if ((piece === '♙' || piece === '♟') && enPassantTarget && 
        toRow === enPassantTarget.row && toCol === enPassantTarget.col) {
        capturedEnPassant = {
            row: piece === '♙' ? toRow + 1 : toRow - 1,
            col: toCol,
            piece: board[piece === '♙' ? toRow + 1 : toRow - 1][toCol]
        };
        board[capturedEnPassant.row][capturedEnPassant.col] = '';
    }
    
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';
    
    const inCheck = isKingInCheck(board, currentPlayer);
    
    // Restore board
    board[fromRow][fromCol] = piece;
    board[toRow][toCol] = originalTarget;
    if (capturedEnPassant) {
        board[capturedEnPassant.row][capturedEnPassant.col] = capturedEnPassant.piece;
    }
    
    return inCheck;
}

// Enhanced castling validation
function canCastle(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const isWhite = piece === '♔';
    const isKingside = toCol > fromCol;
    
    if ((isWhite && fromRow !== 7) || (!isWhite && fromRow !== 0)) return false;
    
    // Check castling rights
    if (isWhite) {
        if (isKingside && !castlingRights.whiteKingside) return false;
        if (!isKingside && !castlingRights.whiteQueenside) return false;
    } else {
        if (isKingside && !castlingRights.blackKingside) return false;
        if (!isKingside && !castlingRights.blackQueenside) return false;
    }
    
    // King cannot be in check
    if (isKingInCheck(board, currentPlayer)) return false;
    
    const rookCol = isKingside ? 7 : 0;
    const expectedRook = isWhite ? '♖' : '♜';
    if (board[fromRow][rookCol] !== expectedRook) return false;
    
    // Check if squares between king and rook are empty
    const start = Math.min(fromCol, rookCol) + 1;
    const end = Math.max(fromCol, rookCol);
    
    for (let col = start; col < end; col++) {
        if (board[fromRow][col] !== '') return false;
    }
    
    // Check if king passes through attacked squares
    const direction = isKingside ? 1 : -1;
    for (let i = 0; i <= 2; i++) {
        const testCol = fromCol + (direction * i);
        if (testCol >= 0 && testCol <= 7) {
            const originalPiece = board[fromRow][testCol];
            board[fromRow][testCol] = piece;
            if (testCol !== fromCol) board[fromRow][fromCol] = '';
            
            const inCheck = isKingInCheck(board, currentPlayer);
            
            board[fromRow][fromCol] = piece;
            board[fromRow][testCol] = originalPiece;
            
            if (inCheck) return false;
        }
    }
    
    return true;
}

function isKingInCheck(testBoard, player) {
    const kingSymbol = player === 'white' ? '♔' : '♚';
    let kingRow = -1, kingCol = -1;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (testBoard[row][col] === kingSymbol) {
                kingRow = row;
                kingCol = col;
                break;
            }
        }
        if (kingRow !== -1) break;
    }
    
    if (kingRow === -1) return false;
    
    return isSquareAttacked(testBoard, kingRow, kingCol, player === 'white' ? 'black' : 'white');
}

function isSquareAttacked(testBoard, targetRow, targetCol, attackerColor) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = testBoard[row][col];
            if (piece && isPlayerPiece(piece, attackerColor)) {
                if (canPieceAttack(piece, row, col, targetRow, targetCol, testBoard)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canPieceAttack(piece, fromRow, fromCol, toRow, toCol, testBoard) {
    const pieceCode = pieceMap[piece];
    const dx = toCol - fromCol;
    const dy = toRow - fromRow;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    switch (pieceCode.toLowerCase()) {
        case 'p':
            const direction = pieceCode === 'P' ? -1 : 1;
            return absDx === 1 && dy === direction;
        case 'r':
            return (dx === 0 || dy === 0) && isPathClearOnBoard(testBoard, fromRow, fromCol, toRow, toCol);
        case 'n':
            return (absDx === 2 && absDy === 1) || (absDx === 1 && absDy === 2);
        case 'b':
            return absDx === absDy && isPathClearOnBoard(testBoard, fromRow, fromCol, toRow, toCol);
        case 'q':
            return (dx === 0 || dy === 0 || absDx === absDy) && isPathClearOnBoard(testBoard, fromRow, fromCol, toRow, toCol);
        case 'k':
            return absDx <= 1 && absDy <= 1;
        default:
            return false;
    }
}

function isPathClearOnBoard(testBoard, fromRow, fromCol, toRow, toCol) {
    const dx = Math.sign(toCol - fromCol);
    const dy = Math.sign(toRow - fromRow);
    let currentRow = fromRow + dy;
    let currentCol = fromCol + dx;
    
    while (currentRow !== toRow || currentCol !== toCol) {
        if (testBoard[currentRow][currentCol]) return false;
        currentRow += dy;
        currentCol += dx;
    }
    
    return true;
}

// Enhanced move making with better state management
function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const capturedPiece = board[toRow][toCol];
    
    // Save game state for undo
    gameHistory.push({
        board: board.map(row => [...row]),
        currentPlayer: currentPlayer,
        moveHistory: [...moveHistory],
        moveCount: moveCount,
        halfMoveCount: halfMoveCount,
        castlingRights: { ...castlingRights },
        lastMove: lastMove,
        enPassantTarget: enPassantTarget
    });
    
    lastMove = { fromRow, fromCol, toRow, toCol };
    
    // Handle en passant capture
    if ((piece === '♙' || piece === '♟') && enPassantTarget && 
        toRow === enPassantTarget.row && toCol === enPassantTarget.col) {
        const capturedPawnRow = piece === '♙' ? toRow + 1 : toRow - 1;
        board[capturedPawnRow][toCol] = '';
    }
    
    // Handle castling
    if ((piece === '♔' || piece === '♚') && Math.abs(toCol - fromCol) === 2) {
        const isKingside = toCol > fromCol;
        const rookFromCol = isKingside ? 7 : 0;
        const rookToCol = isKingside ? 5 : 3;
        const rook = board[fromRow][rookFromCol];
        
        board[fromRow][rookToCol] = rook;
        board[fromRow][rookFromCol] = '';
    }
    
    // Make the move
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';
    
    // Handle pawn promotion with smarter AI choices
    if ((piece === '♙' && toRow === 0) || (piece === '♟' && toRow === 7)) {
        const promotedPiece = getPromotionPiece(piece);
        board[toRow][toCol] = promotedPiece;
    }
    
    // Update en passant target
    enPassantTarget = null;
    if ((piece === '♙' || piece === '♟') && Math.abs(toRow - fromRow) === 2) {
        enPassantTarget = {
            row: fromRow + (toRow - fromRow) / 2,
            col: fromCol
        };
    }
    
    updateCastlingRights(piece, fromRow, fromCol, toRow, toCol);
    updateHalfMoveClock(piece, capturedPiece);
    
    if (currentPlayer === 'black') {
        moveCount++;
    }
    
    const moveNotation = getMoveNotation(fromRow, fromCol, toRow, toCol);
    moveHistory.push(moveNotation);
    updateMoveHistory();
    
    createBoard();
    
    // Add visual animation
    animatePieceMove(`square-${fromRow}-${fromCol}`, `square-${toRow}-${toCol}`);
}

function getMoveNotation(fromRow, fromCol, toRow, toCol) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    return files[fromCol] + ranks[fromRow] + files[toCol] + ranks[toRow];
}

// Enhanced pawn promotion with smarter AI choices
function getPromotionPiece(pawn) {
    if (gameMode === 'ai' && currentPlayer !== humanPlayer) {
        // AI chooses queen 90% of the time, knight 10% for special cases
        return Math.random() < 0.9 ? (pawn === '♙' ? '♕' : '♛') : (pawn === '♙' ? '♘' : '♞');
    }
    
    const isWhite = pawn === '♙';
    const pieces = isWhite ? ['♕', '♖', '♗', '♘'] : ['♛', '♜', '♝', '♞'];
    
    let choice = 0;
    const userChoice = prompt(`Promote pawn to:\n0 - Queen (Recommended)\n1 - Rook\n2 - Bishop\n3 - Knight`, '0');
    if (userChoice !== null) {
        const num = parseInt(userChoice);
        if (num >= 0 && num <= 3) {
            choice = num;
        }
    }
    
    return pieces[choice];
}

function updateCastlingRights(piece, fromRow, fromCol, toRow, toCol) {
    // Update king movement
    if (piece === '♔') {
        castlingRights.whiteKingside = false;
        castlingRights.whiteQueenside = false;
    } else if (piece === '♚') {
        castlingRights.blackKingside = false;
        castlingRights.blackQueenside = false;
    }
    
    // Update rook movement
    if (piece === '♖' && fromRow === 7) {
        if (fromCol === 0) castlingRights.whiteQueenside = false;
        if (fromCol === 7) castlingRights.whiteKingside = false;
    } else if (piece === '♜' && fromRow === 0) {
        if (fromCol === 0) castlingRights.blackQueenside = false;
        if (fromCol === 7) castlingRights.blackKingside = false;
    }
    
    // Update rook capture
    if (toRow === 7 && toCol === 0) castlingRights.whiteQueenside = false;
    if (toRow === 7 && toCol === 7) castlingRights.whiteKingside = false;
    if (toRow === 0 && toCol === 0) castlingRights.blackQueenside = false;
    if (toRow === 0 && toCol === 7) castlingRights.blackKingside = false;
}

function updateHalfMoveClock(piece, capturedPiece) {
    if (piece === '♙' || piece === '♟' || capturedPiece) {
        halfMoveCount = 0;
    } else {
        halfMoveCount++;
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}

// Enhanced status updates
function updateStatus() {
    const statusElement = document.getElementById('status');
    const currentPlayerElement = document.getElementById('current-player');
    const moveCounterElement = document.getElementById('move-counter');
    
    if (!statusElement || !currentPlayerElement || !moveCounterElement) return;
    
    if (isCheckmate()) {
        const winner = currentPlayer === 'white' ? 'Black' : 'White';
        statusElement.textContent = `Checkmate! ${winner} wins!`;
        statusElement.classList.add('checkmate');
        gameOver = true;
        if (gameMode === 'ai') {
            const aiResult = (winner === 'Black' && humanPlayer === 'white') || (winner === 'White' && humanPlayer === 'black') ? 'win' : 'loss';
            updateAIGameResult(aiResult);
        }
    } else if (isStalemate()) {
        statusElement.textContent = 'Stalemate! Draw!';
        gameOver = true;
        if (gameMode === 'ai') {
            updateAIGameResult('draw');
        }
    } else if (isDraw()) {
        statusElement.textContent = 'Draw!';
        gameOver = true;
        if (gameMode === 'ai') {
            updateAIGameResult('draw');
        }
    } else if (isKingInCheck(board, currentPlayer)) {
        statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} is in check!`;
        statusElement.classList.add('check');
    } else {
        statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} to move`;
        statusElement.classList.remove('checkmate', 'check');
    }
    
    currentPlayerElement.textContent = currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
    moveCounterElement.textContent = moveCount;
}

function isCheckmate() {
    if (!isKingInCheck(board, currentPlayer)) return false;
    return getAllPossibleMoves(currentPlayer).length === 0;
}

function isStalemate() {
    if (isKingInCheck(board, currentPlayer)) return false;
    return getAllPossibleMoves(currentPlayer).length === 0;
}

function isDraw() {
    return halfMoveCount >= 100 || isInsufficientMaterial() || isThreefoldRepetition();
}

function isInsufficientMaterial() {
    const pieces = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece !== '♔' && piece !== '♚') {
                pieces.push(piece);
            }
        }
    }
    
    if (pieces.length === 0) return true;
    if (pieces.length === 1 && (pieces[0] === '♗' || pieces[0] === '♝' || pieces[0] === '♘' || pieces[0] === '♞')) return true;
    if (pieces.length === 2 && 
        ((pieces.includes('♗') && pieces.includes('♝')) || 
         (pieces.includes('♘') && pieces.includes('♞')))) return true;
    
    return false;
}

function isThreefoldRepetition() {
    // Simplified threefold repetition check
    if (moveHistory.length < 6) return false;
    
    const recentMoves = moveHistory.slice(-6);
    const uniqueMoves = [...new Set(recentMoves)];
    
    return uniqueMoves.length <= 2;
}

function getAllPossibleMoves(player) {
    const moves = [];
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = board[fromRow][fromCol];
            if (piece && isPlayerPiece(piece, player)) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                            moves.push({ fromRow, fromCol, toRow, toCol });
                        }
                    }
                }
            }
        }
    }
    return moves;
}

function updateMoveHistory() {
    const moveListElement = document.getElementById('move-list');
    if (!moveListElement) return;
    
    const formattedMoves = [];
    
    for (let i = 0; i < moveHistory.length; i += 2) {
        const moveNumber = Math.floor(i / 2) + 1;
        const whiteMove = moveHistory[i] || '';
        const blackMove = moveHistory[i + 1] || '';
        formattedMoves.push(`${moveNumber}. ${whiteMove} ${blackMove}`);
    }
    
    moveListElement.textContent = formattedMoves.join(' ');
}

// Enhanced position evaluation with better heuristics
function evaluatePosition() {
    let evaluation = 0;
    
    // Material and positional evaluation
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                const value = PIECE_VALUES[piece] || 0;
                const positionalValue = getPiecePositionalValue(piece, row, col);
                const totalValue = value + positionalValue;
                evaluation += isPlayerPiece(piece, 'white') ? totalValue : -totalValue;
            }
        }
    }
    
    // Advanced positional evaluation
    evaluation += evaluateAdvancedPosition();
    
    return evaluation / 100;
}

function getPiecePositionalValue(piece, row, col) {
    if (PIECE_SQUARE_TABLES[piece]) {
        return PIECE_SQUARE_TABLES[piece][row][col];
    }
    
    // For black pieces, flip the table
    const whitePiece = piece.toLowerCase();
    const whiteSymbol = {
        'p': '♙', 'n': '♘', 'b': '♗', 'r': '♖', 'q': '♕', 'k': '♔'
    }[whitePiece];
    
    if (whiteSymbol && PIECE_SQUARE_TABLES[whiteSymbol]) {
        return -PIECE_SQUARE_TABLES[whiteSymbol][7-row][col];
    }
    
    return 0;
}

// Enhanced advanced position evaluation
function evaluateAdvancedPosition() {
    let score = 0;
    
    // Center control bonus
    const centerSquares = [[3,3], [3,4], [4,3], [4,4]];
    const extendedCenter = [[2,2], [2,3], [2,4], [2,5], [3,2], [3,5], [4,2], [4,5], [5,2], [5,3], [5,4], [5,5]];
    
    for (const [row, col] of centerSquares) {
        const piece = board[row][col];
        if (piece) {
            score += isPlayerPiece(piece, 'white') ? 30 : -30;
        }
    }
    
    for (const [row, col] of extendedCenter) {
        const piece = board[row][col];
        if (piece) {
            score += isPlayerPiece(piece, 'white') ? 10 : -10;
        }
    }
    
    // King safety evaluation
    score += evaluateKingSafety('white') - evaluateKingSafety('black');
    
    // Piece mobility
    const whiteMobility = getAllPossibleMoves('white').length;
    const blackMobility = getAllPossibleMoves('black').length;
    score += (whiteMobility - blackMobility) * 2;
    
    // Pawn structure evaluation
    score += evaluatePawnStructure('white') - evaluatePawnStructure('black');
    
    // Development in opening
    if (moveHistory.length < 20) {
        score += evaluateDevelopment();
    }
    
    // Endgame evaluation
    if (moveHistory.length > 40) {
        score += evaluateEndgame();
    }
    
    return score;
}

function evaluateKingSafety(player) {
    const kingPos = findKing(player);
    if (!kingPos) return 0;
    
    let safety = 0;
    
    // Penalize exposed king
    const attackers = countAttackers(kingPos.row, kingPos.col, player === 'white' ? 'black' : 'white');
    safety -= attackers * 20;
    
    // Reward pawn shield
    safety += evaluatePawnShield(player, kingPos);
    
    // Reward castling
    if (player === 'white') {
        if (!castlingRights.whiteKingside && !castlingRights.whiteQueenside) {
            safety += 50;
        }
    } else {
        if (!castlingRights.blackKingside && !castlingRights.blackQueenside) {
            safety += 50;
        }
    }
    
    return safety;
}

function evaluatePawnShield(player, kingPos) {
    let shield = 0;
    const kingRow = kingPos.row;
    const kingCol = kingPos.col;
    const pawnSymbol = player === 'white' ? '♙' : '♟';
    
    // Check for pawns in front of king
    for (let col = Math.max(0, kingCol - 1); col <= Math.min(7, kingCol + 1); col++) {
        for (let rowOffset = 1; rowOffset <= 2; rowOffset++) {
            const checkRow = player === 'white' ? kingRow - rowOffset : kingRow + rowOffset;
            if (checkRow >= 0 && checkRow <= 7 && board[checkRow][col] === pawnSymbol) {
                shield += 15;
            }
        }
    }
    
    return shield;
}

function evaluatePawnStructure(player) {
    let structure = 0;
    const pawnSymbol = player === 'white' ? '♙' : '♟';
    
    // Count doubled pawns (penalty)
    for (let col = 0; col < 8; col++) {
        let pawnsInFile = 0;
        for (let row = 0; row < 8; row++) {
            if (board[row][col] === pawnSymbol) {
                pawnsInFile++;
            }
        }
        if (pawnsInFile > 1) {
            structure -= 20 * (pawnsInFile - 1);
        }
    }
    
    // Reward connected pawns
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === pawnSymbol) {
                // Check for adjacent pawns
                for (let adjCol = Math.max(0, col - 1); adjCol <= Math.min(7, col + 1); adjCol++) {
                    if (adjCol !== col && board[row][adjCol] === pawnSymbol) {
                        structure += 10;
                    }
                }
            }
        }
    }
    
    return structure;
}

function countAttackers(targetRow, targetCol, attackerColor) {
    let count = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && isPlayerPiece(piece, attackerColor)) {
                if (canPieceAttack(piece, row, col, targetRow, targetCol, board)) {
                    count++;
                }
            }
        }
    }
    return count;
}

function evaluateDevelopment() {
    let score = 0;
    
    // White development
    if (board[7][1] !== '♘') score += 15; // Queen's knight developed
    if (board[7][6] !== '♘') score += 15; // King's knight developed
    if (board[7][2] !== '♗') score += 15; // Queen's bishop developed
    if (board[7][5] !== '♗') score += 15; // King's bishop developed
    
    // Black development
    if (board[0][1] !== '♞') score -= 15;
    if (board[0][6] !== '♞') score -= 15;
    if (board[0][2] !== '♝') score -= 15;
    if (board[0][5] !== '♝') score -= 15;
    
    // Castling bonus
    if (!castlingRights.whiteKingside && !castlingRights.whiteQueenside) score += 30;
    if (!castlingRights.blackKingside && !castlingRights.blackQueenside) score -= 30;
    
    return score;
}

function evaluateEndgame() {
    let score = 0;
    
    // King activity in endgame
    const whiteKing = findKing('white');
    const blackKing = findKing('black');
    
    if (whiteKing && blackKing) {
        // Centralized king is better in endgame
        const whiteCentrality = Math.abs(3.5 - whiteKing.row) + Math.abs(3.5 - whiteKing.col);
        const blackCentrality = Math.abs(3.5 - blackKing.row) + Math.abs(3.5 - blackKing.col);
        score += (blackCentrality - whiteCentrality) * 10;
    }
    
    return score;
}

function findKing(player) {
    const kingSymbol = player === 'white' ? '♔' : '♚';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === kingSymbol) {
                return { row, col };
            }
        }
    }
    return null;
}

function updateAIStats() {
    const gamesPlayedElement = document.getElementById('games-played');
    const winRateElement = document.getElementById('win-rate');
    
    if (!gamesPlayedElement || !winRateElement) return;
    
    if (enhancedAI) {
        const winRate = enhancedAI.getWinRate();
        const gamesPlayed = enhancedAI.performanceHistory.length;
        
        gamesPlayedElement.textContent = gamesPlayed;
        winRateElement.textContent = `${winRate}%`;
    } else {
        gamesPlayedElement.textContent = '0';
        winRateElement.textContent = '50%';
    }
}

function updateAIStatsDisplay(historyData) {
    if (historyData.metadata) {
        const gamesPlayedElement = document.getElementById('games-played');
        const winRateElement = document.getElementById('win-rate');
        
        if (gamesPlayedElement) gamesPlayedElement.textContent = historyData.metadata.totalGames || 0;
        
        if (historyData.learningData && historyData.learningData.winRate && winRateElement) {
            winRateElement.textContent = `${historyData.learningData.winRate}%`;
        }
    }
}

function updateAIGameResult(result) {
    if (enhancedAI) {
        const gameData = {
            result: result,
            playerColors: { ai: humanPlayer === 'white' ? 'black' : 'white' },
            moves: moveHistory,
            difficulty: enhancedAI.difficulty
        };
        enhancedAI.learnFromGame(gameData);
        
        saveGameToHistory({
            timestamp: new Date().toISOString(),
            result: result,
            moves: moveHistory,
            aiColor: humanPlayer === 'white' ? 'black' : 'white',
            humanColor: humanPlayer,
            gameLength: moveHistory.length,
            opening: enhancedAI.analyzeOpening(moveHistory) || 'Unknown'
        });
    }
    
    updateAIStats();
}

// Enhanced AI Move Making with Better Intelligence
function makeAIMove() {
    if (isThinking || gameOver) return;
    
    isThinking = true;
    const thinkingElement = document.getElementById('thinking');
    const syncStatusElement = document.getElementById('sync-status');
    
    if (thinkingElement) thinkingElement.style.display = 'block';
    if (syncStatusElement) {
        syncStatusElement.textContent = 'AI thinking...';
        syncStatusElement.classList.add('thinking');
    }
    
    // Simulate thinking time based on difficulty
    const thinkTime = enhancedAI ? Math.random() * 1000 + 500 : 800;
    
    setTimeout(() => {
        const bestMove = findBestMove();
        if (bestMove) {
            makeMove(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
            switchPlayer();
            updateStatus();
            
            if (enhancedAI && moveHistory.length <= 12) {
                const opening = enhancedAI.analyzeOpening(moveHistory);
                if (opening && opening !== 'Unknown Opening') {
                    console.log(`🎯 AI is playing: ${opening}`);
                }
            }
        }
        
        isThinking = false;
        if (thinkingElement) thinkingElement.style.display = 'none';
        if (syncStatusElement) {
            syncStatusElement.textContent = 'Ready';
            syncStatusElement.classList.remove('thinking');
        }
    }, thinkTime);
}

function findBestMove() {
    // Check opening book first
    if (enhancedAI && moveHistory.length < 12) {
        const openingMove = enhancedAI.getOpeningRecommendation(moveHistory);
        if (openingMove) {
            const move = parseOpeningMove(openingMove);
            if (move && isValidMove(move.fromRow, move.fromCol, move.toRow, move.toCol)) {
                console.log(`📖 AI plays opening move: ${openingMove}`);
                return move;
            }
        }
    }
    
    // Use enhanced minimax algorithm
    const depth = enhancedAI ? Math.min(enhancedAI.adjustDifficulty(), 5) : 4;
    const result = minimax(board, depth, -Infinity, Infinity, currentPlayer === 'white', currentPlayer);
    return result.move;
}

function parseOpeningMove(moveStr) {
    if (!moveStr || moveStr.length < 4) return null;
    
    const fromCol = moveStr.charCodeAt(0) - 97; // a=0, b=1, etc.
    const fromRow = 8 - parseInt(moveStr[1]);
    const toCol = moveStr.charCodeAt(2) - 97;
    const toRow = 8 - parseInt(moveStr[3]);
    
    if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
        toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
        return null;
    }
    
    return { fromRow, fromCol, toRow, toCol };
}

// Enhanced Minimax with better move ordering and evaluation
function minimax(position, depth, alpha, beta, maximizingPlayer, player) {
    if (depth === 0 || isGameOverPosition(position)) {
        return { score: evaluatePosition(), move: null };
    }
    
    const moves = getAllPossibleMoves(player);
    if (moves.length === 0) {
        return { score: maximizingPlayer ? -20000 : 20000, move: null };
    }
    
    // Enhanced move ordering - prioritize captures and checks
    moves.sort((a, b) => {
        const scoreA = evaluateMove(a);
        const scoreB = evaluateMove(b);
        return maximizingPlayer ? scoreB - scoreA : scoreA - scoreB;
    });
    
    let bestMove = moves[0];
    
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const newPosition = makeTestMove(position, move);
            const evaluation = minimax(newPosition, depth - 1, alpha, beta, false, player === 'white' ? 'black' : 'white');
            
            if (evaluation.score > maxEval) {
                maxEval = evaluation.score;
                bestMove = move;
            }
            
            alpha = Math.max(alpha, evaluation.score);
            if (beta <= alpha) break; // Alpha-beta pruning
        }
        return { score: maxEval, move: bestMove };
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const newPosition = makeTestMove(position, move);
            const evaluation = minimax(newPosition, depth - 1, alpha, beta, true, player === 'white' ? 'black' : 'white');
            
            if (evaluation.score < minEval) {
                minEval = evaluation.score;
                bestMove = move;
            }
            
            beta = Math.min(beta, evaluation.score);
            if (beta <= alpha) break; // Alpha-beta pruning
        }
        return { score: minEval, move: bestMove };
    }
}

// Enhanced move evaluation
function evaluateMove(move) {
    let score = 0;
    
    const capturedPiece = board[move.toRow][move.toCol];
    const movingPiece = board[move.fromRow][move.fromCol];
    
    // Prioritize captures (MVV-LVA: Most Valuable Victim - Least Valuable Attacker)
    if (capturedPiece) {
        score += (PIECE_VALUES[capturedPiece] || 0) - (PIECE_VALUES[movingPiece] || 0) / 10;
    }
    
    // Prefer central moves
    const centerDistance = Math.abs(move.toRow - 3.5) + Math.abs(move.toCol - 3.5);
    score -= centerDistance * 5;
    
    // Bonus for piece development in opening
    if (moveHistory.length < 20) {
        if (movingPiece === '♘' || movingPiece === '♗' || movingPiece === '♞' || movingPiece === '♝') {
            if ((movingPiece === '♘' || movingPiece === '♗') && move.fromRow === 7) score += 20;
            if ((movingPiece === '♞' || movingPiece === '♝') && move.fromRow === 0) score += 20;
        }
    }
    
    // Bonus for checks
    const testBoard = makeTestMove(board, move);
    const opponent = currentPlayer === 'white' ? 'black' : 'white';
    if (isKingInCheck(testBoard, opponent)) {
        score += 50;
    }
    
    // Bonus for castling
    if ((movingPiece === '♔' || movingPiece === '♚') && Math.abs(move.toCol - move.fromCol) === 2) {
        score += 40;
    }
    
    return score;
}

function makeTestMove(position, move) {
    const newPosition = position.map(row => [...row]);
    const piece = newPosition[move.fromRow][move.fromCol];
    newPosition[move.toRow][move.toCol] = piece;
    newPosition[move.fromRow][move.fromCol] = '';
    return newPosition;
}

function isGameOverPosition(position) {
    // Simplified game over detection for minimax
    return false;
}

// Enhanced Game Control Functions
function newGame() {
    board = [
        ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
        ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
    ];
    
    currentPlayer = 'white';
    selectedSquare = null;
    gameHistory = [];
    moveHistory = [];
    gameOver = false;
    moveCount = 1;
    halfMoveCount = 0;
    lastMove = null;
    isThinking = false;
    
    castlingRights = {
        whiteKingside: true,
        whiteQueenside: true,
        blackKingside: true,
        blackQueenside: true
    };
    
    enPassantTarget = null;
    
    createBoard();
    updateStatus();
    
    const moveListElement = document.getElementById('move-list');
    if (moveListElement) moveListElement.textContent = 'Game started';
    
    const thinkingElement = document.getElementById('thinking');
    const syncStatusElement = document.getElementById('sync-status');
    
    if (thinkingElement) thinkingElement.style.display = 'none';
    if (syncStatusElement) {
        syncStatusElement.textContent = 'Ready';
        syncStatusElement.classList.remove('thinking');
    }
    
    console.log("🎯 New game started!");
}

function undoMove() {
    if (gameHistory.length === 0) return;
    
    const previousState = gameHistory.pop();
    board = previousState.board;
    currentPlayer = previousState.currentPlayer;
    moveHistory = previousState.moveHistory;
    moveCount = previousState.moveCount;
    halfMoveCount = previousState.halfMoveCount;
    castlingRights = previousState.castlingRights;
    lastMove = previousState.lastMove;
    enPassantTarget = previousState.enPassantTarget;
    gameOver = false;
    
    createBoard();
    updateStatus();
    updateMoveHistory();
    
    // Clear any status classes
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.classList.remove('checkmate', 'check');
    }
}

function switchSides() {
    humanPlayer = humanPlayer === 'white' ? 'black' : 'white';
    console.log(`🔄 Switched sides. You are now playing as ${humanPlayer}`);
    
    if (gameMode === 'ai' && currentPlayer !== humanPlayer && !gameOver) {
        setTimeout(makeAIMove, 500);
    }
}

function changeGameMode() {
    const gameModeSelect = document.getElementById('gameMode');
    const gameModeDisplay = document.getElementById('game-mode-display');
    const aiInfo = document.getElementById('ai-info');
    
    if (!gameModeSelect || !gameModeDisplay) return;
    
    gameMode = gameModeSelect.value;
    
    if (gameMode === 'ai') {
        gameModeDisplay.textContent = 'vs AI';
        if (aiInfo) aiInfo.style.display = 'block';
        
        if (currentPlayer !== humanPlayer && !gameOver) {
            setTimeout(makeAIMove, 500);
        }
    } else {
        gameModeDisplay.textContent = 'vs Player';
        if (aiInfo) aiInfo.style.display = 'none';
    }
}

// Enhanced visual effects
function animatePieceMove(fromSquare, toSquare) {
    const fromElement = document.getElementById(fromSquare);
    const toElement = document.getElementById(toSquare);
    
    if (fromElement) {
        fromElement.classList.add('piece-move');
        setTimeout(() => fromElement.classList.remove('piece-move'), 300);
    }
    
    if (toElement) {
        toElement.classList.add('piece-move');
        setTimeout(() => toElement.classList.remove('piece-move'), 300);
    }
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Chess game error:', e.error);
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = 'Game error occurred. Please refresh.';
        statusElement.style.color = 'red';
    }
});

// Export game state for debugging
function exportGameState() {
    return {
        board: board,
        currentPlayer: currentPlayer,
        moveHistory: moveHistory,
        castlingRights: castlingRights,
        enPassantTarget: enPassantTarget,
        gameOver: gameOver
    };
}

// Import game state (for debugging/development)
function importGameState(state) {
    if (state.board) board = state.board;
    if (state.currentPlayer) currentPlayer = state.currentPlayer;
    if (state.moveHistory) moveHistory = state.moveHistory;
    if (state.castlingRights) castlingRights = state.castlingRights;
    if (state.enPassantTarget) enPassantTarget = state.enPassantTarget;
    if (state.gameOver !== undefined) gameOver = state.gameOver;
    
    createBoard();
    updateStatus();
    updateMoveHistory();
}

console.log("♔ Enhanced Chess Game JavaScript Loaded Successfully! ♛");
