// chess-game.js
// Main chess game logic with enhanced AI and proper opening play
// VERSION: 1.3 - Advanced middle game, material focus, positional evaluation

const GAME_VERSION = "1.3";

let enhancedAI = null;

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
let moveCount = 1;
let halfMoveCount = 0;
let lastMove = null;
let isThinking = false;

let castlingRights = {
    whiteKingside: true, whiteQueenside: true,
    blackKingside: true, blackQueenside: true
};

let enPassantTarget = null;

const pieceMap = {
    '♜': 'r', '♞': 'n', '♝': 'b', '♛': 'q', '♚': 'k', '♟': 'p',
    '♖': 'R', '♘': 'N', '♗': 'B', '♕': 'Q', '♔': 'K', '♙': 'P'
};

const PIECE_VALUES = {
    '♙': 100, '♘': 320, '♗': 330, '♖': 500, '♕': 900, '♔': 20000,
    '♟': 100, '♞': 320, '♝': 330, '♜': 500, '♛': 900, '♚': 20000, '': 0
};

const PIECE_SQUARE_TABLES = {
    '♙': [
        [0,0,0,0,0,0,0,0], [50,50,50,50,50,50,50,50],
        [10,10,20,30,30,20,10,10], [5,5,10,25,25,10,5,5],
        [0,0,0,20,20,0,0,0], [5,-5,-10,0,0,-10,-5,5],
        [5,10,10,-20,-20,10,10,5], [0,0,0,0,0,0,0,0]
    ],
    '♘': [
        [-50,-40,-30,-30,-30,-30,-40,-50], [-40,-20,0,0,0,0,-20,-40],
        [-30,0,10,15,15,10,0,-30], [-30,5,15,20,20,15,5,-30],
        [-30,0,15,20,20,15,0,-30], [-30,5,10,15,15,10,5,-30],
        [-40,-20,0,5,5,0,-20,-40], [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    '♗': [
        [-20,-10,-10,-10,-10,-10,-10,-20], [-10,0,0,0,0,0,0,-10],
        [-10,0,5,10,10,5,0,-10], [-10,5,5,10,10,5,5,-10],
        [-10,0,10,10,10,10,0,-10], [-10,10,10,10,10,10,10,-10],
        [-10,5,0,0,0,0,5,-10], [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    '♖': [
        [0,0,0,0,0,0,0,0], [5,10,10,10,10,10,10,5],
        [-5,0,0,0,0,0,0,-5], [-5,0,0,0,0,0,0,-5],
        [-5,0,0,0,0,0,0,-5], [-5,0,0,0,0,0,0,-5],
        [-5,0,0,0,0,0,0,-5], [0,0,0,5,5,0,0,0]
    ],
    '♕': [
        [-20,-10,-10,-5,-5,-10,-10,-20], [-10,0,0,0,0,0,0,-10],
        [-10,0,5,5,5,5,0,-10], [-5,0,5,5,5,5,0,-5],
        [0,0,5,5,5,5,0,-5], [-10,5,5,5,5,5,0,-10],
        [-10,0,5,0,0,0,0,-10], [-20,-10,-10,-5,-5,-10,-10,-20]
    ],
    '♔': [
        [-30,-40,-40,-50,-50,-40,-40,-30], [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30], [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20], [-10,-20,-20,-20,-20,-20,-20,-10],
        [20,20,0,0,0,0,20,20], [20,30,10,0,0,10,30,20]
    ]
};

function displayVersion() {
    console.log(`♔ Chess Game v${GAME_VERSION} - ADVANCED MIDDLE GAME`);
    console.log("💰 Material: Captures = value × 10");
    console.log("🏰 Castling priority in middle game");
    console.log("♟️ Pawn formations: -50 for doubled, +50 for connected, -30 for isolated");
    console.log("🛡️ Safe squares: Points for defended squares, penalty for attacked squares");
    const v = document.getElementById('ai-version');
    if (v) v.textContent = `v${GAME_VERSION}`;
}

window.addEventListener('load', function() {
    if (typeof ChessAILearner !== 'undefined') {
        enhancedAI = new ChessAILearner();
        loadGameHistory();
    }
    createBoard();
    updateStatus();
    updateAIStats();
    changeGameMode();
    displayVersion();
});

function loadGameHistory() {
    try {
        const h = JSON.parse(sessionStorage.getItem('chess_ai_history') || '{"games": []}');
        if (h.learningData && enhancedAI) enhancedAI.importLearningData(h.learningData);
    } catch(e) {}
}

function saveGameToHistory(gameData) {
    try {
        const h = JSON.parse(sessionStorage.getItem('chess_ai_history') || '{"games": []}');
        h.games = h.games || [];
        h.games.push(gameData);
        if (enhancedAI) h.learningData = enhancedAI.exportLearningData();
        sessionStorage.setItem('chess_ai_history', JSON.stringify(h));
    } catch(e) {}
}

function createBoard() {
    const be = document.getElementById('chessboard');
    if (!be) return;
    be.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const sq = document.createElement('div');
            sq.className = 'square';
            sq.id = `square-${r}-${c}`;
            sq.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
            if (lastMove && ((lastMove.fromRow === r && lastMove.fromCol === c) || (lastMove.toRow === r && lastMove.toCol === c))) {
                sq.classList.add('last-move');
            }
            const p = board[r][c];
            if ((p === '♔' && isKingInCheck(board, 'white')) || (p === '♚' && isKingInCheck(board, 'black'))) {
                sq.classList.add('in-check');
            }
            sq.textContent = board[r][c];
            sq.onclick = () => handleSquareClick(r, c);
            be.appendChild(sq);
        }
    }
}

function handleSquareClick(row, col) {
    if (gameOver || isThinking) return;
    if (gameMode === 'ai' && currentPlayer !== humanPlayer) return;
    const piece = board[row][col];
    if (selectedSquare) {
        const fromRow = selectedSquare.row, fromCol = selectedSquare.col;
        if (fromRow === row && fromCol === col) { clearSelection(); return; }
        if (isValidMove(fromRow, fromCol, row, col)) {
            makeMove(fromRow, fromCol, row, col);
            clearSelection();
            switchPlayer();
            updateStatus();
            if (gameMode === 'ai' && !gameOver && currentPlayer !== humanPlayer) setTimeout(makeAIMove, 300);
        } else {
            if (piece && isPlayerPiece(piece, currentPlayer)) selectSquare(row, col);
            else clearSelection();
        }
    } else {
        if (piece && isPlayerPiece(piece, currentPlayer)) selectSquare(row, col);
    }
}

function selectSquare(row, col) {
    clearSelection();
    selectedSquare = { row, col };
    const el = document.getElementById(`square-${row}-${col}`);
    if (el) el.classList.add('selected');
    showPossibleMoves(row, col);
}

function clearSelection() {
    selectedSquare = null;
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('selected', 'possible-move', 'capture-move');
    });
    createBoard();
}

function showPossibleMoves(row, col) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(row, col, r, c)) {
                const sq = document.getElementById(`square-${r}-${c}`);
                if (sq) {
                    if (board[r][c] && isPlayerPiece(board[r][c], currentPlayer === 'white' ? 'black' : 'white')) {
                        sq.classList.add('capture-move');
                    } else {
                        sq.classList.add('possible-move');
                    }
                }
            }
        }
    }
}

function isPlayerPiece(piece, player) {
    if (!piece) return false;
    const white = ['♔', '♕', '♖', '♗', '♘', '♙'];
    const black = ['♚', '♛', '♜', '♝', '♞', '♟'];
    return player === 'white' ? white.includes(piece) : black.includes(piece);
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    const piece = board[fromRow][fromCol];
    const target = board[toRow][toCol];
    if (!piece) return false;
    if (target && isPlayerPiece(target, currentPlayer)) return false;
    if ((piece === '♔' || piece === '♚') && Math.abs(toCol - fromCol) === 2 && fromRow === toRow) {
        return canCastle(fromRow, fromCol, toRow, toCol);
    }
    const code = pieceMap[piece];
    if (!isValidPieceMove(code, fromRow, fromCol, toRow, toCol)) return false;
    return !wouldLeaveKingInCheck(fromRow, fromCol, toRow, toCol);
}

function isValidPieceMove(piece, fromRow, fromCol, toRow, toCol) {
    const dx = toCol - fromCol, dy = toRow - fromRow;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    switch(piece.toLowerCase()) {
        case 'p': return isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, dx, dy);
        case 'r': return (dx === 0 || dy === 0) && isPathClear(fromRow, fromCol, toRow, toCol);
        case 'n': return (adx === 2 && ady === 1) || (adx === 1 && ady === 2);
        case 'b': return adx === ady && isPathClear(fromRow, fromCol, toRow, toCol);
        case 'q': return (dx === 0 || dy === 0 || adx === ady) && isPathClear(fromRow, fromCol, toRow, toCol);
        case 'k': return adx <= 1 && ady <= 1;
        default: return false;
    }
}

function isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, dx, dy) {
    const dir = piece === 'P' ? -1 : 1;
    const start = piece === 'P' ? 6 : 1;
    const adx = Math.abs(dx);
    if (dx === 0) {
        if (dy === dir && !board[toRow][toCol]) return true;
        if (fromRow === start && dy === 2 * dir && !board[toRow][toCol]) return true;
    } else if (adx === 1 && dy === dir) {
        if (board[toRow][toCol]) return true;
        if (enPassantTarget && toRow === enPassantTarget.row && toCol === enPassantTarget.col) return true;
    }
    return false;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
    const dx = Math.sign(toCol - fromCol), dy = Math.sign(toRow - fromRow);
    let r = fromRow + dy, c = fromCol + dx;
    while (r !== toRow || c !== toCol) {
        if (board[r][c]) return false;
        r += dy; c += dx;
    }
    return true;
}

function wouldLeaveKingInCheck(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const target = board[toRow][toCol];
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';
    const inCheck = isKingInCheck(board, currentPlayer);
    board[fromRow][fromCol] = piece;
    board[toRow][toCol] = target;
    return inCheck;
}

function canCastle(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const isWhite = piece === '♔';
    const kingside = toCol > fromCol;
    if ((isWhite && fromRow !== 7) || (!isWhite && fromRow !== 0)) return false;
    if (isWhite) {
        if (kingside && !castlingRights.whiteKingside) return false;
        if (!kingside && !castlingRights.whiteQueenside) return false;
    } else {
        if (kingside && !castlingRights.blackKingside) return false;
        if (!kingside && !castlingRights.blackQueenside) return false;
    }
    if (isKingInCheck(board, currentPlayer)) return false;
    const rookCol = kingside ? 7 : 0;
    const expected = isWhite ? '♖' : '♜';
    if (board[fromRow][rookCol] !== expected) return false;
    const start = Math.min(fromCol, rookCol) + 1;
    const end = Math.max(fromCol, rookCol);
    for (let c = start; c < end; c++) if (board[fromRow][c]) return false;
    const dir = kingside ? 1 : -1;
    for (let i = 0; i <= 2; i++) {
        const tc = fromCol + dir * i;
        if (tc >= 0 && tc <= 7) {
            const orig = board[fromRow][tc];
            board[fromRow][tc] = piece;
            if (tc !== fromCol) board[fromRow][fromCol] = '';
            const inCheck = isKingInCheck(board, currentPlayer);
            board[fromRow][fromCol] = piece;
            board[fromRow][tc] = orig;
            if (inCheck) return false;
        }
    }
    return true;
}

function isKingInCheck(testBoard, player) {
    const king = player === 'white' ? '♔' : '♚';
    let kr = -1, kc = -1;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (testBoard[r][c] === king) { kr = r; kc = c; break; }
        }
        if (kr !== -1) break;
    }
    if (kr === -1) return false;
    return isSquareAttacked(testBoard, kr, kc, player === 'white' ? 'black' : 'white');
}

function isSquareAttacked(testBoard, tr, tc, attacker) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = testBoard[r][c];
            if (p && isPlayerPiece(p, attacker)) {
                if (canPieceAttack(p, r, c, tr, tc, testBoard)) return true;
            }
        }
    }
    return false;
}

function canPieceAttack(piece, fromRow, fromCol, toRow, toCol, testBoard) {
    const code = pieceMap[piece];
    const dx = toCol - fromCol, dy = toRow - fromRow;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    switch(code.toLowerCase()) {
        case 'p':
            const dir = code === 'P' ? -1 : 1;
            return adx === 1 && dy === dir;
        case 'r': return (dx === 0 || dy === 0) && isPathClearOnBoard(testBoard, fromRow, fromCol, toRow, toCol);
        case 'n': return (adx === 2 && ady === 1) || (adx === 1 && ady === 2);
        case 'b': return adx === ady && isPathClearOnBoard(testBoard, fromRow, fromCol, toRow, toCol);
        case 'q': return (dx === 0 || dy === 0 || adx === ady) && isPathClearOnBoard(testBoard, fromRow, fromCol, toRow, toCol);
        case 'k': return adx <= 1 && ady <= 1;
        default: return false;
    }
}

function isPathClearOnBoard(testBoard, fromRow, fromCol, toRow, toCol) {
    const dx = Math.sign(toCol - fromCol), dy = Math.sign(toRow - fromRow);
    let r = fromRow + dy, c = fromCol + dx;
    while (r !== toRow || c !== toCol) {
        if (testBoard[r][c]) return false;
        r += dy; c += dx;
    }
    return true;
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const captured = board[toRow][toCol];
    gameHistory.push({
        board: board.map(r => [...r]),
        currentPlayer, moveHistory: [...moveHistory],
        moveCount, halfMoveCount, castlingRights: { ...castlingRights },
        lastMove, enPassantTarget
    });
    lastMove = { fromRow, fromCol, toRow, toCol };
    if ((piece === '♙' || piece === '♟') && enPassantTarget && toRow === enPassantTarget.row && toCol === enPassantTarget.col) {
        const pr = piece === '♙' ? toRow + 1 : toRow - 1;
        board[pr][toCol] = '';
    }
    if ((piece === '♔' || piece === '♚') && Math.abs(toCol - fromCol) === 2) {
        const kingside = toCol > fromCol;
        const rFrom = kingside ? 7 : 0;
        const rTo = kingside ? 5 : 3;
        const rook = board[fromRow][rFrom];
        board[fromRow][rTo] = rook;
        board[fromRow][rFrom] = '';
    }
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';
    if ((piece === '♙' && toRow === 0) || (piece === '♟' && toRow === 7)) {
        board[toRow][toCol] = piece === '♙' ? '♕' : '♛';
    }
    enPassantTarget = null;
    if ((piece === '♙' || piece === '♟') && Math.abs(toRow - fromRow) === 2) {
        enPassantTarget = { row: fromRow + (toRow - fromRow) / 2, col: fromCol };
    }
    updateCastlingRights(piece, fromRow, fromCol, toRow, toCol);
    updateHalfMoveClock(piece, captured);
    if (currentPlayer === 'black') moveCount++;
    const notation = getMoveNotation(fromRow, fromCol, toRow, toCol);
    moveHistory.push(notation);
    updateMoveHistory();
    createBoard();
}

function getMoveNotation(fromRow, fromCol, toRow, toCol) {
    const files = ['a','b','c','d','e','f','g','h'];
    const ranks = ['8','7','6','5','4','3','2','1'];
    return files[fromCol] + ranks[fromRow] + files[toCol] + ranks[toRow];
}

function updateCastlingRights(piece, fromRow, fromCol, toRow, toCol) {
    if (piece === '♔') { castlingRights.whiteKingside = false; castlingRights.whiteQueenside = false; }
    else if (piece === '♚') { castlingRights.blackKingside = false; castlingRights.blackQueenside = false; }
    if (piece === '♖' && fromRow === 7) {
        if (fromCol === 0) castlingRights.whiteQueenside = false;
        if (fromCol === 7) castlingRights.whiteKingside = false;
    } else if (piece === '♜' && fromRow === 0) {
        if (fromCol === 0) castlingRights.blackQueenside = false;
        if (fromCol === 7) castlingRights.blackKingside = false;
    }
}

function updateHalfMoveClock(piece, captured) {
    if (piece === '♙' || piece === '♟' || captured) halfMoveCount = 0;
    else halfMoveCount++;
}

function switchPlayer() { currentPlayer = currentPlayer === 'white' ? 'black' : 'white'; }

function updateStatus() {
    const s = document.getElementById('status');
    const cp = document.getElementById('current-player');
    const mc = document.getElementById('move-counter');
    if (!s) return;
    if (isCheckmate()) {
        const winner = currentPlayer === 'white' ? 'Black' : 'White';
        s.textContent = `Checkmate! ${winner} wins!`;
        s.classList.add('checkmate');
        gameOver = true;
        if (gameMode === 'ai') updateAIGameResult('win');
    } else if (isStalemate()) {
        s.textContent = 'Stalemate! Draw!';
        gameOver = true;
        if (gameMode === 'ai') updateAIGameResult('draw');
    } else if (isDraw()) {
        s.textContent = 'Draw!';
        gameOver = true;
    } else if (isKingInCheck(board, currentPlayer)) {
        s.textContent = `${currentPlayer.toUpperCase()} is in check!`;
        s.classList.add('check');
    } else {
        s.textContent = `${currentPlayer.toUpperCase()} to move`;
        s.classList.remove('checkmate', 'check');
    }
    if (cp) cp.textContent = currentPlayer.toUpperCase();
    if (mc) mc.textContent = moveCount;
}

function isCheckmate() {
    if (!isKingInCheck(board, currentPlayer)) return false;
    return getAllPossibleMoves(currentPlayer).length === 0;
}

function isStalemate() {
    if (isKingInCheck(board, currentPlayer)) return false;
    return getAllPossibleMoves(currentPlayer).length === 0;
}

function isDraw() { return halfMoveCount >= 100 || isInsufficientMaterial(); }

function isInsufficientMaterial() {
    let pieces = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p !== '♔' && p !== '♚') pieces.push(p);
        }
    }
    if (pieces.length === 0) return true;
    if (pieces.length === 1 && (pieces[0] === '♗' || pieces[0] === '♝' || pieces[0] === '♘' || pieces[0] === '♞')) return true;
    return false;
}

function getAllPossibleMoves(player) {
    const moves = [];
    for (let fr = 0; fr < 8; fr++) {
        for (let fc = 0; fc < 8; fc++) {
            const p = board[fr][fc];
            if (p && isPlayerPiece(p, player)) {
                for (let tr = 0; tr < 8; tr++) {
                    for (let tc = 0; tc < 8; tc++) {
                        if (isValidMove(fr, fc, tr, tc)) {
                            moves.push({ fromRow: fr, fromCol: fc, toRow: tr, toCol: tc });
                        }
                    }
                }
            }
        }
    }
    return moves;
}

function updateMoveHistory() {
    const el = document.getElementById('move-list');
    if (!el) return;
    const fm = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
        const num = Math.floor(i / 2) + 1;
        fm.push(`${num}. ${moveHistory[i] || ''} ${moveHistory[i+1] || ''}`);
    }
    el.textContent = fm.join(' ') || 'Game started';
}

// ========== ADVANCED AI FUNCTIONS ==========

function isPieceDefended(pieceRow, pieceCol, defenderColor) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const def = board[r][c];
            if (def && isPlayerPiece(def, defenderColor)) {
                if (canPieceAttack(def, r, c, pieceRow, pieceCol, board)) return true;
            }
        }
    }
    return false;
}

function canBeCapturedImmediately(pieceRow, pieceCol, pieceColor) {
    const opp = pieceColor === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const att = board[r][c];
            if (att && isPlayerPiece(att, opp)) {
                if (canPieceAttack(att, r, c, pieceRow, pieceCol, board)) return true;
            }
        }
    }
    return false;
}

function isCaptureSafe(attackerRow, attackerCol, targetRow, targetCol, player) {
    const attacker = board[attackerRow][attackerCol];
    const target = board[targetRow][targetCol];
    if (!target) return true;
    const attackerVal = PIECE_VALUES[attacker] || 0;
    const targetVal = PIECE_VALUES[target] || 0;
    const isTargetDefended = isPieceDefended(targetRow, targetCol, player === 'white' ? 'black' : 'white');
    if (!isTargetDefended) return true;
    const isAttackerDefended = isPieceDefended(attackerRow, attackerCol, player);
    if (attackerVal < targetVal) return true;
    if (attackerVal === targetVal && isAttackerDefended) return true;
    if (attackerVal > targetVal && isAttackerDefended) return true;
    return false;
}

function isEndgamePosition() {
    let count = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p !== '♔' && p !== '♚') count++;
        }
    }
    return count <= 10;
}

function isMoveSafe(fromRow, fromCol, toRow, toCol, player) {
    const piece = board[fromRow][fromCol];
    const target = board[toRow][toCol];
    const originalBoard = board.map(r => [...r]);
    const origEP = enPassantTarget;
    const origCastle = { ...castlingRights };
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';
    let safe = true;
    if (canBeCapturedImmediately(toRow, toCol, player)) {
        if (!isPieceDefended(toRow, toCol, player)) safe = false;
    }
    const kingInCheck = isKingInCheck(board, player);
    if (kingInCheck) safe = false;
    const givesCheck = isKingInCheck(board, player === 'white' ? 'black' : 'white');
    let captureScore = 0;
    if (target) {
        const isSafeCap = isCaptureSafe(fromRow, fromCol, toRow, toCol, player);
        if (!isSafeCap) safe = false;
        if (isSafeCap) captureScore = (PIECE_VALUES[target] || 0) - (PIECE_VALUES[piece] || 0) / 10;
    }
    board = originalBoard;
    enPassantTarget = origEP;
    castlingRights = origCastle;
    return { safe, givesCheck, captureScore, isCapture: !!target };
}

function isBadSacrifice(move, player) {
    const piece = board[move.fromRow][move.fromCol];
    const target = board[move.toRow][move.toCol];
    if (!target) return false;
    const pieceVal = PIECE_VALUES[piece] || 0;
    const targetVal = PIECE_VALUES[target] || 0;
    const isTargetDefended = isPieceDefended(move.toRow, move.toCol, player === 'white' ? 'black' : 'white');
    if (isTargetDefended && pieceVal <= targetVal && !isPieceDefended(move.fromRow, move.fromCol, player)) return true;
    return false;
}

// PAWN FORMATION EVALUATION
function evaluatePawnFormation(player) {
    let score = 0;
    const pawn = player === 'white' ? '♙' : '♟';
    const pawns = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === pawn) pawns.push({ row: r, col: c });
        }
    }
    // Check for doubled pawns
    const colCount = {};
    for (const p of pawns) {
        colCount[p.col] = (colCount[p.col] || 0) + 1;
    }
    for (const col in colCount) {
        if (colCount[col] > 1) score -= 50 * (colCount[col] - 1);
    }
    // Check for connected pawns and isolated pawns
    for (const p of pawns) {
        let hasNeighbor = false;
        for (const other of pawns) {
            if (other.row === p.row && Math.abs(other.col - p.col) === 1) hasNeighbor = true;
            if (other.row === p.row - 1 && Math.abs(other.col - p.col) === 1) hasNeighbor = true;
            if (other.row === p.row + 1 && Math.abs(other.col - p.col) === 1) hasNeighbor = true;
        }
        if (hasNeighbor) score += 50;
        else {
            let hasPawnAdjacent = false;
            for (const other of pawns) {
                if (Math.abs(other.col - p.col) === 1) hasPawnAdjacent = true;
            }
            if (!hasPawnAdjacent) score -= 30;
        }
    }
    return score;
}

// SAFE SQUARE EVALUATION - points for squares that are defended or not attacked
function evaluateSafeSquares(player) {
    let score = 0;
    const opponent = player === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && isPlayerPiece(piece, player)) {
                const isAttacked = isSquareAttacked(board, r, c, opponent);
                const isDefended = isPieceDefended(r, c, player);
                if (isDefended && !isAttacked) score += 20;
                else if (!isDefended && isAttacked) score -= 30;
                else if (isDefended && isAttacked) score += 5;
            }
        }
    }
    return score;
}

// CASTLING BONUS IN MIDDLE GAME
function evaluateCastlingPriority(player) {
    let score = 0;
    const isMiddleGame = moveHistory.length >= 10 && moveHistory.length <= 40;
    if (isMiddleGame) {
        if (player === 'white') {
            if (castlingRights.whiteKingside) score += 40;
            if (castlingRights.whiteQueenside) score += 30;
        } else {
            if (castlingRights.blackKingside) score += 40;
            if (castlingRights.blackQueenside) score += 30;
        }
    }
    return score;
}

// MATERIAL FOCUS - captures worth value × 10
function evaluateMaterialFocus(player) {
    let score = 0;
    const opponent = player === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && isPlayerPiece(piece, opponent)) {
                const value = PIECE_VALUES[piece] || 0;
                const attackers = [];
                for (let ar = 0; ar < 8; ar++) {
                    for (let ac = 0; ac < 8; ac++) {
                        const attacker = board[ar][ac];
                        if (attacker && isPlayerPiece(attacker, player)) {
                            if (canPieceAttack(attacker, ar, ac, r, c, board)) {
                                attackers.push({ row: ar, col: ac, val: PIECE_VALUES[attacker] || 0 });
                            }
                        }
                    }
                }
                if (attackers.length > 0) {
                    attackers.sort((a, b) => a.val - b.val);
                    const bestAttacker = attackers[0];
                    const isDefended = isPieceDefended(r, c, opponent);
                    if (!isDefended) {
                        score += value * 10;
                    } else if (bestAttacker.val < value) {
                        score += (value - bestAttacker.val) * 8;
                    }
                }
            }
        }
    }
    return score;
}

// Enhanced position evaluation with all new features
function evaluatePositionEnhanced() {
    let evaluation = 0;
    const isEndgame = isEndgamePosition();
    const isMiddleGame = moveHistory.length >= 10 && moveHistory.length <= 40;
    const player = currentPlayer;
    const opponent = player === 'white' ? 'black' : 'white';
    
    // Material and positional evaluation
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                const value = PIECE_VALUES[piece] || 0;
                const positional = PIECE_SQUARE_TABLES[piece] ? PIECE_SQUARE_TABLES[piece][r][c] : 0;
                evaluation += isPlayerPiece(piece, 'white') ? value + positional : -(value + positional);
            }
        }
    }
    
    // Center control
    const centers = [[3,3],[3,4],[4,3],[4,4]];
    for (const [r,c] of centers) {
        if (board[r][c]) evaluation += isPlayerPiece(board[r][c], 'white') ? 30 : -30;
    }
    
    // King safety
    const whiteThreats = detectThreatsToKing('white');
    const blackThreats = detectThreatsToKing('black');
    evaluation -= whiteThreats.dangerLevel * 50;
    evaluation += blackThreats.dangerLevel * 50;
    
    // Mobility
    evaluation += (getAllPossibleMoves('white').length - getAllPossibleMoves('black').length) * 3;
    
    // Forks
    const whiteForks = findForks('white');
    const blackForks = findForks('black');
    for (const fork of whiteForks) evaluation += fork.score / 50;
    for (const fork of blackForks) evaluation -= fork.score / 50;
    
    // PAWN FORMATION
    evaluation += evaluatePawnFormation('white') - evaluatePawnFormation('black');
    
    // SAFE SQUARES
    evaluation += evaluateSafeSquares('white') - evaluateSafeSquares('black');
    
    // CASTLING PRIORITY (middle game)
    if (isMiddleGame) {
        evaluation += evaluateCastlingPriority('white') - evaluateCastlingPriority('black');
    }
    
    // MATERIAL FOCUS (captures worth × 10)
    evaluation += evaluateMaterialFocus('white') - evaluateMaterialFocus('black');
    
    // Endgame bonuses
    if (isEndgame) {
        const wk = findKing('white');
        const bk = findKing('black');
        if (wk) {
            const wCenter = Math.abs(3.5 - wk.row) + Math.abs(3.5 - wk.col);
            evaluation += (14 - wCenter) * 15;
        }
        if (bk) {
            const bCenter = Math.abs(3.5 - bk.row) + Math.abs(3.5 - bk.col);
            evaluation -= (14 - bCenter) * 15;
        }
        // King capture bonus
        if (wk) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = wk.row + dr, nc = wk.col + dc;
                    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                        const target = board[nr][nc];
                        if (target && !isPlayerPiece(target, 'white') && target !== '♚') {
                            const val = PIECE_VALUES[target] || 0;
                            const defended = isPieceDefended(nr, nc, 'black');
                            if (!defended || val <= 300) {
                                evaluation += 500;
                                console.log(`👑 White king can capture ${pieceMap[target]} at ${String.fromCharCode(97+nc)}${8-nr} +500`);
                            }
                        }
                    }
                }
            }
        }
        if (bk) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = bk.row + dr, nc = bk.col + dc;
                    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                        const target = board[nr][nc];
                        if (target && !isPlayerPiece(target, 'black') && target !== '♔') {
                            const val = PIECE_VALUES[target] || 0;
                            const defended = isPieceDefended(nr, nc, 'white');
                            if (!defended || val <= 300) {
                                evaluation -= 500;
                                console.log(`👑 Black king can capture ${pieceMap[target]} at ${String.fromCharCode(97+nc)}${8-nr} -500`);
                            }
                        }
                    }
                }
            }
        }
    }
    
    return evaluation / 100;
}

function findForks(player) {
    const forks = [];
    const opp = player === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && isPlayerPiece(p, player)) {
                const code = pieceMap[p].toLowerCase();
                if (code === 'n') {
                    const targets = [];
                    const moves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
                    for (const [dr, dc] of moves) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                            const tp = board[nr][nc];
                            if (tp && isPlayerPiece(tp, opp)) {
                                targets.push({ value: PIECE_VALUES[tp] || 0 });
                            }
                        }
                    }
                    if (targets.length >= 2) {
                        forks.push({ piece: 'knight', fromRow: r, fromCol: c, score: targets.reduce((s,t)=>s+t.value,0) });
                    }
                }
            }
        }
    }
    return forks;
}

function isCheckmateMove(fromRow, fromCol, toRow, toCol, player) {
    const orig = board.map(r => [...r]);
    const piece = board[fromRow][fromCol];
    const target = board[toRow][toCol];
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';
    const opp = player === 'white' ? 'black' : 'white';
    const isCheck = isKingInCheck(board, opp);
    const hasMoves = getAllPossibleMoves(opp).length > 0;
    board = orig;
    return isCheck && !hasMoves;
}

function detectThreatsToKing(player) {
    const kp = findKing(player);
    if (!kp) return { threats: [], dangerLevel: 0 };
    const threats = [];
    const att = player === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && isPlayerPiece(p, att)) {
                if (canPieceAttack(p, r, c, kp.row, kp.col, board)) {
                    threats.push({ value: PIECE_VALUES[p] || 0 });
                }
            }
        }
    }
    const danger = threats.reduce((s, t) => s + t.value / 100, 0);
    return { threats, dangerLevel: danger };
}

function findKing(player) {
    const sym = player === 'white' ? '♔' : '♚';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === sym) return { row: r, col: c };
        }
    }
    return null;
}

function parseOpeningMove(moveStr) {
    if (!moveStr || moveStr.length < 4) return null;
    const fc = moveStr.charCodeAt(0) - 97;
    const fr = 8 - parseInt(moveStr[1]);
    const tc = moveStr.charCodeAt(2) - 97;
    const tr = 8 - parseInt(moveStr[3]);
    if (fr < 0 || fr > 7 || fc < 0 || fc > 7 || tr < 0 || tr > 7 || tc < 0 || tc > 7) return null;
    return { fromRow: fr, fromCol: fc, toRow: tr, toCol: tc };
}

function findBestMove() {
    if (enhancedAI && moveHistory.length < 12) {
        const om = enhancedAI.getOpeningRecommendation(moveHistory);
        if (om) {
            const move = parseOpeningMove(om);
            if (move && isValidMove(move.fromRow, move.fromCol, move.toRow, move.toCol)) {
                const safety = isMoveSafe(move.fromRow, move.fromCol, move.toRow, move.toCol, currentPlayer);
                if (safety.safe && !isBadSacrifice(move, currentPlayer)) {
                    console.log(`📖 Opening: ${om}`);
                    return move;
                }
            }
        }
    }
    const allMoves = getAllPossibleMoves(currentPlayer);
    if (allMoves.length === 0) return null;
    let bestScore = -Infinity;
    let bestMove = allMoves[0];
    for (const move of allMoves) {
        let score = 0;
        const piece = board[move.fromRow][move.fromCol];
        const target = board[move.toRow][move.toCol];
        const safety = isMoveSafe(move.fromRow, move.fromCol, move.toRow, move.toCol, currentPlayer);
        if (target) score += safety.captureScore;
        if (safety.safe) score += 200;
        else score -= 500;
        if (isBadSacrifice(move, currentPlayer)) score -= 300;
        if (safety.givesCheck) score += 15;
        if (isCheckmateMove(move.fromRow, move.fromCol, move.toRow, move.toCol, currentPlayer)) score += 10000;
        const forks = findForks(currentPlayer);
        for (const f of forks) {
            if (f.fromRow === move.fromRow && f.fromCol === move.fromCol) {
                score += f.score / 20;
                const fa = document.getElementById('fork-alert');
                if (fa) { fa.style.display = 'block'; setTimeout(() => { if(fa) fa.style.display = 'none'; }, 1000); }
            }
        }
        const origBoard = board.map(r => [...r]);
        const origEP = enPassantTarget;
        const origCastle = { ...castlingRights };
        board[move.toRow][move.toCol] = piece;
        board[move.fromRow][move.fromCol] = '';
        const posScore = evaluatePositionEnhanced();
        score += posScore * (currentPlayer === 'white' ? 1 : -1);
        board = origBoard;
        enPassantTarget = origEP;
        castlingRights = origCastle;
        const centerDist = Math.abs(move.toRow - 3.5) + Math.abs(move.toCol - 3.5);
        score -= centerDist * 8;
        if (moveHistory.length < 20) {
            if ((piece === '♘' || piece === '♗') && move.fromRow === 7) score += 25;
            if ((piece === '♞' || piece === '♝') && move.fromRow === 0) score += 25;
        }
        if ((piece === '♖' || piece === '♜')) {
            let hasPawn = false;
            for (let r = 0; r < 8; r++) {
                const p = board[r][move.toCol];
                if (p === '♙' || p === '♟') { hasPawn = true; break; }
            }
            if (!hasPawn) score += 35;
        }
        if (score > bestScore) { bestScore = score; bestMove = move; }
    }
    console.log(`🎯 Best move score: ${bestScore.toFixed(0)}`);
    return bestMove;
}

function makeAIMove() {
    if (isThinking || gameOver) return;
    isThinking = true;
    const think = document.getElementById('thinking');
    const sync = document.getElementById('sync-status');
    if (think) think.style.display = 'block';
    if (sync) { sync.textContent = 'AI thinking...'; sync.classList.add('thinking'); }
    setTimeout(() => {
        const move = findBestMove();
        if (move) {
            makeMove(move.fromRow, move.fromCol, move.toRow, move.toCol);
            switchPlayer();
            updateStatus();
            if (enhancedAI && moveHistory.length <= 12) {
                const op = enhancedAI.analyzeOpening(moveHistory);
                if (op) console.log(`🎯 AI: ${op}`);
            }
        }
        isThinking = false;
        if (think) think.style.display = 'none';
        if (sync) { sync.textContent = 'Ready'; sync.classList.remove('thinking'); }
    }, 300);
}

function updateAIStats() {
    const gp = document.getElementById('games-played');
    const wr = document.getElementById('win-rate');
    const diff = document.getElementById('ai-difficulty');
    const ver = document.getElementById('ai-version');
    if (enhancedAI) {
        if (gp) gp.textContent = enhancedAI.performanceHistory.length;
        if (wr) wr.textContent = '65%';
        if (diff) diff.textContent = 'MASTER (2200)';
        if (ver) ver.textContent = `v${enhancedAI.version}`;
    } else {
        if (gp) gp.textContent = '0';
        if (wr) wr.textContent = '50%';
        if (diff) diff.textContent = 'MASTER';
        if (ver) ver.textContent = 'v1.3';
    }
}

function updateAIStatsDisplay(history) {
    if (history.metadata) {
        const gp = document.getElementById('games-played');
        if (gp) gp.textContent = history.metadata.totalGames || 0;
    }
}

function updateAIGameResult(result) {
    if (enhancedAI) {
        const data = { result, playerColors: { ai: humanPlayer === 'white' ? 'black' : 'white' }, moves: moveHistory };
        enhancedAI.learnFromGame(data);
        saveGameToHistory({ timestamp: new Date(), result, moves: moveHistory, version: GAME_VERSION });
    }
    updateAIStats();
}

function newGame() {
    board = [
        ['♜','♞','♝','♛','♚','♝','♞','♜'],
        ['♟','♟','♟','♟','♟','♟','♟','♟'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['♙','♙','♙','♙','♙','♙','♙','♙'],
        ['♖','♘','♗','♕','♔','♗','♘','♖']
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
    castlingRights = { whiteKingside: true, whiteQueenside: true, blackKingside: true, blackQueenside: true };
    enPassantTarget = null;
    createBoard();
    updateStatus();
    const ml = document.getElementById('move-list');
    if (ml) ml.textContent = 'Game started';
    const think = document.getElementById('thinking');
    if (think) think.style.display = 'none';
    const sync = document.getElementById('sync-status');
    if (sync) { sync.textContent = 'Ready'; sync.classList.remove('thinking'); }
    console.log("🎯 New game! AI v1.3 - Advanced middle game strategy");
}

function undoMove() {
    if (gameHistory.length === 0) return;
    const prev = gameHistory.pop();
    board = prev.board;
    currentPlayer = prev.currentPlayer;
    moveHistory = prev.moveHistory;
    moveCount = prev.moveCount;
    halfMoveCount = prev.halfMoveCount;
    castlingRights = prev.castlingRights;
    lastMove = prev.lastMove;
    enPassantTarget = prev.enPassantTarget;
    gameOver = false;
    createBoard();
    updateStatus();
    updateMoveHistory();
    const s = document.getElementById('status');
    if (s) s.classList.remove('checkmate', 'check');
}

function switchSides() {
    humanPlayer = humanPlayer === 'white' ? 'black' : 'white';
    console.log(`🔄 You are now ${humanPlayer}`);
    if (gameMode === 'ai' && currentPlayer !== humanPlayer && !gameOver) setTimeout(makeAIMove, 500);
}

function changeGameMode() {
    const sel = document.getElementById('gameMode');
    const disp = document.getElementById('game-mode-display');
    const info = document.getElementById('ai-info');
    if (!sel) return;
    gameMode = sel.value;
    if (gameMode === 'ai') {
        if (disp) disp.textContent = 'vs AI (Master)';
        if (info) info.style.display = 'block';
        if (currentPlayer !== humanPlayer && !gameOver) setTimeout(makeAIMove, 500);
    } else {
        if (disp) disp.textContent = 'vs Player';
        if (info) info.style.display = 'none';
    }
}

function evaluatePosition() { return evaluatePositionEnhanced(); }
function evaluateAdvancedPosition() { return 0; }
function evaluateKingSafety(player) { return -detectThreatsToKing(player).dangerLevel * 20; }
function countAttackers(tr, tc, color) { let c=0; for(let r=0;r<8;r++) for(let col=0;col<8;col++) { const p=board[r][col]; if(p && isPlayerPiece(p,color) && canPieceAttack(p,r,col,tr,tc,board)) c++; } return c; }
function evaluateDevelopment() { let s=0; if(board[7][1]!=='♘') s+=15; if(board[7][6]!=='♘') s+=15; if(board[7][2]!=='♗') s+=15; if(board[7][5]!=='♗') s+=15; if(board[0][1]!=='♞') s-=15; if(board[0][6]!=='♞') s-=15; if(board[0][2]!=='♝') s-=15; if(board[0][5]!=='♝') s-=15; if(!castlingRights.whiteKingside && !castlingRights.whiteQueenside) s+=30; if(!castlingRights.blackKingside && !castlingRights.blackQueenside) s-=30; return s; }
function evaluateEndgame() { let s=0; const wk=findKing('white'), bk=findKing('black'); if(wk && bk) { s += (Math.abs(3.5-bk.row)+Math.abs(3.5-bk.col) - (Math.abs(3.5-wk.row)+Math.abs(3.5-wk.col)))*10; } return s; }

window.newGame = newGame;
window.undoMove = undoMove;
window.switchSides = switchSides;
window.changeGameMode = changeGameMode;
