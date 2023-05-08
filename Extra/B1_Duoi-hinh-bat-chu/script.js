let btnStart = document.querySelector(".start-btn");
let mainGame = document.querySelector(".main-game");
let answerBtn = document.querySelector(".answer-btn");
let result = document.querySelector(".result");
let resultCount = document.querySelector(".result-count");
let restartBtn = document.querySelector(".restart-btn");

const ANSWER = "abc";
let count = 0;

function initGame() {
    console.log("init");
    hideMainGame();
    hideResult();
}
initGame();

function hideMainGame() {
    mainGame.style.display = "none";
}

function hideResult() {
    result.style.display = "none";
}

function hideStart() {
    btnStart.style.display = "none";
}

function showMainGame() {
    mainGame.style.display = "block";
}

function showResult() {
    result.style.display = "block";
}

function showStart() {
    btnStart.style.display = "block";
}

function answer() {
    let userAnswer = "";
    let question = "Nhập đáp án:";
    while (userAnswer != ANSWER) {
        if (count > 0) {
            question = "Bạn nhập sai rồi nhập lại đi:";
        }
        userAnswer = prompt(question);
        count++;
    }
    resultCount.innerHTML = count;
    showResult();
    hideMainGame();
}

btnStart.addEventListener("click", function () {
    console.log("start click");
    count = 0;
    showMainGame();
    hideStart();
});

answerBtn.addEventListener("click", function () {
    console.log("answer click");

    answer();
});

restartBtn.addEventListener("click", function () {
    console.log("restart click");
    count = 0;
    showStart();
    hideResult();
});
