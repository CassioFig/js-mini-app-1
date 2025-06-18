
console.log("JavaScript loaded!");

const flipSound = new Audio('sounds/flip.mp3');

const themes = {
  ratatoule: [
    "ratatoule1.png", "ratatoule2.png", "ratatoule3.png",
    "ratatoule4.png", "ratatoule5.png", "ratatoule6.png",
    "ratatoule7.png", "ratatoule8.png", "ratatoule9.png",
    "ratatoule10.png", "ratatoule11.png", "ratatoule12.png",
    "ratatoule13.png", "ratatoule14.png", "ratatoule15.png",
    "ratatoule16.png"
  ],
  fruit: [
    "fruit1.png", "fruit2.png", "fruit3.png", "fruit4.png", "fruit5.png", "fruit6.png",
    "fruit7.png", "fruit8.png", "fruit9.png", "fruit10.png", "fruit11.png", "fruit12.png",
    "fruit13.png", "fruit14.png", "fruit15.png", "fruit16.png", "fruit17.png", "fruit18.png",
    "fruit19.png", "fruit20.png"],
  animals: [
    "animal1.png", "animal2.png", "animal3.png", "animal4.png", "animal5.png", "animal6.png",
    "animal7.png", "animal8.png", "animal9.png", "animal10.png", "animal11.png", "animal12.png",
    "animal13.png", "animal14.png", "animal15.png", "animal16.png", "animal17.png", "animal18.png",
    "animal19.png", "animal20.png",
  ],
  flag: [
    "flag1.png", "flag2.png", "flag3.png", "flag4.png", "flag5.png",
    "flag6.png", "flag7.png", "flag8.png", "flag9.png", "flag10.png",
    "flag11.png", "flag12.png", "flag13.png", "flag14.png", "flag15.png",
    "flag15.png",
  ]
};

let currentTheme = "";
let selectedImages = [];
let cards = [];
let revealedCards = [];
let matchedCards = [];
let currentPlayer = 1;
let scores = [0, 0];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function chooseRandomTheme() {
  const themeKeys = Object.keys(themes);
  currentTheme = shuffle(themeKeys)[0];
  return currentTheme;
}

function startGame() {
  const theme = chooseRandomTheme();
  const allThemeImages = themes[theme];

  const pairsCount = 8;
  selectedImages = shuffle(allThemeImages).slice(0, pairsCount);
  cards = shuffle([...selectedImages, ...selectedImages]);

  revealedCards = [];
  matchedCards = [];
  currentPlayer = 1;
  scores = [0, 0];

  document.getElementById("score1").textContent = 0;
  document.getElementById("score2").textContent = 0;
  document.getElementById("current-player").textContent = currentPlayer;
  document.getElementById("winner").textContent = "";
  renderBoard();
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  console.log("aktualna téma:", currentTheme)

  cards.forEach((imgName, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");

    const back = document.createElement("div");
    back.classList.add("card-back");
    const img = document.createElement("img");
    img.src = `images/${currentTheme}/${imgName}`;
    img.alt = "card";
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    board.appendChild(card);
    card.addEventListener("click", () => flipCard(card, index));
  });
}

function flipCard(card, index) {
  if (
    revealedCards.length >= 2 ||
    card.classList.contains("revealed") ||
    matchedCards.includes(index)
  ) return;

  flipSound.currentTime = 0;
  flipSound.play();

  card.classList.add("revealed");
  revealedCards.push({ index, img: cards[index] });

  if (revealedCards.length === 2) {
    const [first, second] = revealedCards;
    if (first.img === second.img && first.index !== second.index) {
      matchedCards.push(first.index, second.index);
      scores[currentPlayer - 1]++;
      document.getElementById(`score${currentPlayer}`).textContent = scores[currentPlayer - 1];
      revealedCards = [];
      checkGameOver();
    } else {
      setTimeout(() => {
        hideCards(first.index, second.index);
        revealedCards = [];
        switchPlayer();
      }, 1000);
    }
  }
}

function hideCards(i1, i2) {
  const board = document.getElementById("board");
  board.children[i1].classList.remove("revealed");
  board.children[i2].classList.remove("revealed");
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  document.getElementById("current-player").textContent = currentPlayer;
}

function checkGameOver() {
  if (matchedCards.length === cards.length) {
    const winnerText = scores[0] > scores[1]
      ? "<strong>Player 1 wins!</strong>"
      : scores[1] > scores[0]
        ? "<strong>Player 2 wins!</strong>"
        : "<strong>It's a draw!</strong>";
    document.getElementById("winner").innerHTML = winnerText;
  
  }
}
startGame();
