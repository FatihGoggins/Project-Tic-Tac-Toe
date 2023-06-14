const Player = (playerName, playerMarker) => {
	return { playerName, playerMarker };
};
const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

const gameInitializer = (() => {
	const displayText = document.querySelector(".display-text");
	const playerTwoButtons = Array.from(document.querySelectorAll(".player-2 button"));
	const playerTwoImage = document.querySelector(".player-2 img");
	const playerTwoText = document.createElement("p");
	playerTwoText.classList.add("player2-text");
	const playerTwoNode = document.querySelector(".player-2");
	const startButton = document.querySelector(".start");
	playerTwoButtons.forEach((button) => {
		button.addEventListener("click", function (event) {
			const targetText = event.target.textContent;
			displayText.textContent = `Human vs ${targetText}`;
			startButton.classList.remove("display-none");
			if (event.target.textContent === "Human") {
				playerTwoImage.setAttribute("src", "./svg/p2.svg");
				playerTwoText.textContent = "Player 2";
				playerTwoButtons[0].style.cssText = "background-color: darkblue; color: yellow; scale:1.2;";
				playerTwoButtons[1].style.cssText = "background-color: black; color: green; scale:1.0;";
			} else {
				playerTwoImage.setAttribute("src", "./svg/computer.svg");
				playerTwoText.textContent = "Computer";
				playerTwoButtons[1].style.cssText = "background-color: darkblue; color: yellow; scale:1.2;";
				playerTwoButtons[0].style.cssText = "background-color: black; color: green; scale:1.0;";
			}
		});
	});

	startButton.addEventListener("click", function () {
		if (displayText.textContent === "Human vs ?") {
			return;
		} else {
			displayText.textContent = "Player 1, You Go First";
			playerTwoButtons.forEach((button) => button.remove());
			playerTwoNode.appendChild(playerTwoText);
			startButton.remove();
			Game.start();
		}
	});
	return {};
})();

const Game = (() => {
	let currentPlayer = player1;
	const gameDisplayText = document.querySelector(".display-text");
	const player1Array = [];
	const player2Array = [];
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
	const gameBoard = Array.from(document.querySelectorAll(".game-board .unit"));
	const start = () => {
		gameBoard.forEach((unit) => {
			unit.addEventListener("click", unitProgress);
		});
	};

	function unitProgress(event) {
		event.target.removeEventListener("click", unitProgress);
		const playerMarkerImage = document.createElement("img");
		const nthChild = gameBoard.indexOf(event.target);
		let isGameOver;
		if (currentPlayer.playerMarker === "X") {
			playerMarkerImage.setAttribute("src", "./svg/plus.svg");
			currentPlayer = player2;
			gameDisplayText.textContent = "Player 2's Turn (O)";
			player1Array.push(nthChild);
		} else {
			playerMarkerImage.setAttribute("src", "./svg/circle.svg");
			currentPlayer = player1;
			gameDisplayText.textContent = "Player 1's Turn (X)";
			player2Array.push(nthChild);
		}
		event.target.appendChild(playerMarkerImage);
		isGameOver = gameEnd(player1Array, player2Array);
		if (isGameOver) {
			gameDisplayText.textContent = isGameOver;
			clearGameBoard();
		}
	}

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

	const clearGameBoard = () => {
		gameBoard.forEach((unit) => {
			unit.removeEventListener("click", unitProgress);
		});
		const resetButton = document.createElement("button");
		const gameArea = document.querySelector(".game-area");
		resetButton.classList.add("start");
		resetButton.textContent = "Reset";
		resetButton.addEventListener("click", function (event) {
			location.reload();
		});
		gameArea.appendChild(resetButton);
	};

	return { start };
})();
