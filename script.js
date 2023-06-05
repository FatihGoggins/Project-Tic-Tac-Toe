const buttonsArray = Array.from(document.querySelectorAll(".player-2 button"));
const secondHumanButton = buttonsArray[0];
const computerButton = buttonsArray[1];
const secondPlayerImage = document.querySelector(".player-2 img");
let computerChecked = true;
let humanChecked = false;
computerButton.classList.add("selected-button");
buttonsArray.forEach((button) =>
	button.addEventListener("click", function (event) {
		computerChecked = computerButton.classList.contains("selected-button");
		humanChecked = secondHumanButton.classList.contains("selected-button");
		let targetButton = event.target;
		if (!computerChecked && !humanChecked) {
			button.classList.add("selected-button");
			if (targetButton === secondHumanButton) {
				secondPlayerImage.setAttribute("src", "./svg/account.svg");
				humanChecked = true;
			} else {
				secondPlayerImage.setAttribute("src", "./svg/monitor.svg");
				computerChecked = true;
			}
		} else if (computerChecked && !humanChecked) {
			if (targetButton === secondHumanButton) {
				secondHumanButton.classList.add("selected-button");
				computerButton.classList.remove("selected-button");
				secondPlayerImage.setAttribute("src", "./svg/account.svg");
			}
		} else if (!computerChecked && humanChecked) {
			if (targetButton === computerButton) {
				computerButton.classList.add("selected-button");
				secondHumanButton.classList.remove("selected-button");
				secondPlayerImage.setAttribute("src", "./svg/monitor.svg");
			}
		}
	})
);

const startButton = document.querySelector(".start");
startButton.addEventListener("click", startGame);
const gameArea = document.querySelector(".game-area");

function startGame() {
	if (!computerChecked && !humanChecked) {
		return;
	} else {
		while (gameArea.firstChild) {
			gameArea.removeChild(gameArea.firstChild);
		}
		gameArea.classList.remove("grid-area");
		gameArea.classList.add("game-area-started");
		const battleGround = document.createElement("div");
		battleGround.classList.add("battle-ground");
		gameArea.append(battleGround);
	}
}
