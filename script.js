const versus = document.querySelector(".versus");
const startButton = document.querySelector(".start");
startButton.addEventListener("click", startGame);
const gameArea = document.querySelector(".game-area");

function startGame() {
	startButton.remove();
	versus.remove();
	gameArea.classList.remove("grid-area");
	gameArea.classList.add("game-area-started");
	const battleGround = document.createElement("div");
	battleGround.classList.add("battle-ground");
	gameArea.append(battleGround);
	const gameState = document.createElement("p");
	gameState.classList.add("game-state");
	gameState.textContent = `P.1 YOU GO FIRST (X)`;
	battleGround.appendChild(gameState);
	const gameBoard = document.createElement("div");
	gameBoard.classList.add("game-board");
	battleGround.appendChild(gameBoard);
	const player1 = Player("P.1", "X");
	const player2 = Player("P.2", "O");
	Game.start(gameBoard, player1, player2, gameState, battleGround);
}

const Player = (name, marker) => {
	return { name, marker };
};

const Game = (() => {
	let currentPlayer;
	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	const start = (gameBoard, player1, player2, gameState, battleGround) => {
		for (let i = 0; i < 9; i++) {
			const gameBoardUnit = document.createElement("div");
			gameBoardUnit.classList.add("game-board-unit");
			gameBoard.appendChild(gameBoardUnit);
		}
		currentPlayer = player1;
		const gameBoardArray = Array.from(document.querySelectorAll(".game-board-unit"));
		let player1Array = [];
		let player2Array = [];
		gameBoardArray.forEach((boardUnit) => {
			boardUnit.addEventListener("click", clickHandler);
		});
		function clickHandler(event) {
			event.target.removeEventListener("click", clickHandler);
			const markerImage = document.createElement("img");
			let playerMarkSvg = playerMark(currentPlayer.marker);
			markerImage.setAttribute("src", playerMarkSvg);
			event.target.appendChild(markerImage);
			currentPlayer = currentPlayer.marker === "X" ? player2 : player1;
			const nthChild = gameBoardArray.indexOf(event.target);
			const playerArrays = gameCondition(player1Array, player2Array, playerMarkSvg, nthChild);
			const doesGameEnd = gameEnd(playerArrays[0], playerArrays[1], currentPlayer);
			if (doesGameEnd) {
				gameState.textContent = doesGameEnd;
				const resetButton = document.createElement("button");
				resetButton.textContent = "Reset";
				resetButton.classList.add("reset-button");
				battleGround.appendChild(resetButton);
				resetButton.addEventListener("click", function () {
					startGame();
					location.reload();
				});

				if (doesGameEnd === "P.1 Won") {
					gameState.classList.add("p1-win");
				} else if (doesGameEnd === "Draw") {
					gameState.classList.add("draw");
				}
				gameBoardArray.forEach((unit) => {
					unit.removeEventListener("click", clickHandler);
				});
			} else {
				gameState.textContent = `${currentPlayer.name}'s Turn`;
			}
		}
	};

	const playerMark = (marker) => {
		if (marker === "X") {
			return "./svg/plus.svg";
		} else {
			return "./svg/circle.svg";
		}
	};
	const gameCondition = (player1Array, player2Array, playerMarkSvg, nthChild) => {
		if (playerMarkSvg === "./svg/plus.svg") {
			player1Array.push(nthChild);
		} else if (playerMarkSvg === "./svg/circle.svg") {
			player2Array.push(nthChild);
		}
		return [player1Array, player2Array];
	};

	const gameEnd = (p1Array, p2Array) => {
		let totalLength;
		for (let i = 0; i < winningCombinations.length; i++) {
			let currentComb = winningCombinations[i].join("");
			let p1Check = checkPlayerWin(currentComb, p1Array.join(""));
			let p2Check = checkPlayerWin(currentComb, p2Array.join(""));
			totalLength = p1Array.length + p2Array.length;
			if (p1Check === 3) {
				return "P.1 Won";
			} else if (p2Check === 3) {
				return "P.2 Won";
			} else if (p1Check !== 3 && p2Check !== 3 && totalLength !== 9) {
				continue;
			} else if (p1Check === 3 && totalLength === 9) {
				return "P.1 Won";
			} else if (p2Check === 3 && totalLength === 9) {
				return "P.2 Won";
			}
		}
		if (totalLength === 9) {
			return "Draw";
		}
	};

	function checkPlayerWin(comb, playerStr) {
		let counter = 0;
		for (let j = 0; j < 3; j++) {
			if (playerStr.includes(comb[j])) {
				counter++;
			}
		}
		return counter;
	}

	return {
		winningCombinations,
		start,
		currentPlayer,
	};
})();
