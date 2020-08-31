let board; // board that contains all the buttons
let hp = "X"; // human player
let ap = "O"; //ai player
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
const bs = document.getElementsByClassName("b"); // buttons
const db = document.getElementById("db");
const edb = document.getElementById("edb"); //ai wins
const rdb = document.getElementById("rdb"); // tie
function select(order) {
	if(order === 'first') {
		 hp = "X";
		 ap = "O";
	} else if (order === 'second') {
		hp = "O";
		ap = "X"; 
		change(aiMove(),ap); // ai go first
	}
	db.open = false;
}

start();

function start() {
	board = Array.from(Array(9).keys()); // board = [0,1,2,3,4,5,6,7,8]
	for(let i = 0; i < bs.length; i++) {
		bs[i].innerText = "";
		bs[i].disabled = false;
		bs[i].addEventListener("click",go);
		db.open = true;
		rdb.open = false;
		edb.open = false;
	}
}

function go(event) { 
		change(event.target.id, hp) // human click
		if(empty(board).length > 0) {
		change(aiMove(),ap);
		Checktie();
		} else {
			tieConfirm();
		}
}

function change(id,player) {
	board[id] = player; // change board
	bs[id].innerText = player;
	bs[id].disabled = true;
	let winner = checkWin(board,player);
	if(winner) over(winner); // if winner appears
}
function checkWin(board,player) {
	//reduce (1 accumulator 2 currentValue 3 currentIndex 4 array)
	let plays = board.reduce((a, e, i) => 
	(e === player) ? a.concat(i) : a, []); // add changed indexies to the empty array a
	//array.entries -> return the index and the value of each elements in the array
	let winner;
	for(let [index,win] of winCombos.entries()) {
		if(win.every(e => plays.indexOf(e) != -1)) {
			winner = {i: index, p: player}; // winning combos and who win
		}
	}
	return winner;
}
//game over, ai wins
function over() {
	for(let i =0; i < bs.length; i++) {
		bs[i].disabled = true;
	}
	edb.open = true;
}
// search abailable spots for ai
function empty(board) {
	return board.filter(e => typeof e === "number");
}

function Checktie() {
	if(empty(board).length == 0) {
		tieConfirm();
	}
}
function tieConfirm() {
	rdb.open = true;
}

function aiMove() {
	return minimax(board,ap).index;
}

function minimax(board,player) {
	let availSpots = empty(board);
	if (checkWin(board, hp)) {
		return {score: -10};
	} else if (checkWin(board, ap)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	let moves = [];
	for(let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = board[availSpots[i]];
		board[availSpots[i]] = player;

		if (player == ap) {
			let result = minimax(board, hp);
			move.score = result.score;
		} else {
			let result = minimax(board, ap);
			move.score = result.score;
		}
		board[availSpots[i]] = move.index;
		moves.push(move);
	}

	let bestMove;
	if(player === ap) {
		let c = -Infinity;
		for(let i = 0; i< moves.length; i++) {
			if(moves[i].score > c) {
				c = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let c = Infinity;
		for(let i = 0; i < moves.length; i++) {
			if(moves[i].score < c) {
				c = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}
