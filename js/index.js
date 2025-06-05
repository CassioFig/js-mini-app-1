let matrixGame = [];
let flippedCard1 = null;
let flippedCard2 = null;
let isBoardLocked = false;

const _randomizeMatrixGame = () => {
	for (let r = 0; r < matrixGame.length; r++) {
		for (let c = 0; c < matrixGame[r].length; c++) {
			const randomRow = Math.floor(Math.random() * matrixGame.length);
			const randomCol = Math.floor(Math.random() * matrixGame[r].length);
			[matrixGame[r][c], matrixGame[randomRow][randomCol]] = [matrixGame[randomRow][randomCol], matrixGame[r][c]];
		}
	}
}

const _populateMatrixGame = (schema = 2) => {
	const options = Array.from({ length: schema * schema / 2 }, (_, i) => i + 1).flatMap(i => [i, i]);
	for (let r = 0; r < schema; r++) {
		matrixGame[r] = [];
		for (let c = 0; c < schema; c++) {
			matrixGame[r][c] = options.pop();
		}
	}
	_randomizeMatrixGame();
}

const _resetGameArea = () => {
	matrixGame = [];
	const cardsDiv = document.querySelector('.cards');
	cardsDiv.innerHTML = '';
}

const _removeFoundedCards = () => {
	const cards = document.querySelectorAll('.card');
	cards.forEach(card => {
		if (card.classList.contains('flipped') && card.textContent !== '') {
			card.style.visibility = 'hidden';
		}
	});
}

const _checkGameOver = () => {
	const totalCards = matrixGame.length * matrixGame[0].length;
	const hiddenCards = document.querySelectorAll('.card[style*="visibility: hidden"]').length;
	if (totalCards === hiddenCards) {
		alert('Congratulations! You have found all pairs!');
		_resetGameArea();
	}
}

const _flipCard = (card) => {
	if (isBoardLocked || card.classList.contains('flipped')) return;
	card.classList.add('flipped');
	card.textContent = matrixGame[card.dataset.row][card.dataset.col];

	if (!flippedCard1) {
		flippedCard1 = card;
	} else if (!flippedCard2) {
		flippedCard2 = card;
	}

	if (flippedCard1 && flippedCard2) {
		isBoardLocked = true;
		if (flippedCard1.textContent === flippedCard2.textContent) {
			flippedCard1 = null;
			flippedCard2 = null;
			setTimeout(() => {
				_removeFoundedCards();
				_checkGameOver();
				isBoardLocked = false;
			}, 500);
		} else {
			setTimeout(() => {
				const card1 = flippedCard1;
				const card2 = flippedCard2;
		
				card1.classList.remove('flipped');
				card2.classList.remove('flipped');
				card1.classList.add('animate__animated', 'animate__flipOutY');
				card2.classList.add('animate__animated', 'animate__flipOutY');
				card1.textContent = '';
				card2.textContent = '';
		
				card1.addEventListener('animationend', () => {
						card1.classList.remove('flipped', 'animate__animated', 'animate__flipOutY');
						card1.textContent = '';
				}, { once: true });
		
				card2.addEventListener('animationend', () => {
						card2.classList.remove('flipped', 'animate__animated', 'animate__flipOutY');
						card2.textContent = '';
				}, { once: true });
		
				flippedCard1 = null;
				flippedCard2 = null;
				isBoardLocked = false;
		}, 1000);
		}
	}
}

const createGame = (schema = 2) => {
	_resetGameArea();
	_populateMatrixGame(schema);

	const cardsDiv = document.querySelector('.cards');
	cardsDiv.style.display = 'grid';
	cardsDiv.style.gridTemplateRows = `repeat(${schema}, 1fr)`;
	cardsDiv.style.gridTemplateColumns = `repeat(${schema}, 1fr)`;

	for (let r = 0; r < schema; r++) {
		for (let c = 0; c < schema; c++) {
			const card = document.createElement('div');
			card.classList.add('card');
			card.dataset.row = r;
			card.dataset.col = c;
			card.addEventListener('click', () => {
				if (isBoardLocked || card.classList.contains('flipped')) return;
				_flipCard(card, matrixGame[r][c]);
				card.classList.add('animate__animated', 'animate__flipInY');
				card.addEventListener('animationend', () => {
					card.classList.remove('animate__animated', 'animate__flipInY');
				});
			});

			cardsDiv.appendChild(card);
		}
	}
}
