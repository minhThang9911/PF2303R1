class App {
    board = document.querySelector("#board");
    context = this.board.getContext("2d");
    gameSetting;
    scoreBoard;
    boardWidth;
    boardHeight;
    foodX = 5;
    foodY = 5;
    moveX = 1;
    moveY = 0;
    intervalId = 0;
    score = 0;
    snakeBody = [
        [0, 0],
        [0, 0],
    ];
    snakeSpeed = 500;
    snakeMoving = false;
    isGameEnded = true;
    drawGrid = () => {
        this.context.beginPath();
        for (let i = 0; i <= this.gameSetting.boardWidthBlockCount; i++) {
            this.context.moveTo(i * this.gameSetting.blockSize, 0);
            this.context.lineTo(
                i * this.gameSetting.blockSize,
                this.boardHeight
            );
        }
        for (let i = 0; i <= this.gameSetting.boardHeightBlockCount; i++) {
            this.context.moveTo(0, i * this.gameSetting.blockSize);
            this.context.lineTo(
                this.boardWidth,
                i * this.gameSetting.blockSize
            );
        }
        this.context.strokeStyle = "#bbb";
        this.context.stroke();
    };
    existInSnakeBody = (block) =>
        this.snakeBody.some(
            (item) => item[0] == block[0] && item[1] == block[1]
        );
    drawSnake = (x, y, isHead, isTail) => {
        let snakeColor = this.gameSetting.bodyColor;
        if (isTail) {
            snakeColor = this.gameSetting.tailColor;
        }
        if (isHead) {
            snakeColor = this.gameSetting.headColor;
        }
        this.context.fillStyle = snakeColor;
        this.context.fillRect(
            x * this.gameSetting.blockSize,
            y * this.gameSetting.blockSize,
            this.gameSetting.blockSize,
            this.gameSetting.blockSize
        );
    };
    drawFood = () => {
        this.context.fillStyle = this.gameSetting.foodColor;
        this.context.fillRect(
            this.foodX * this.gameSetting.blockSize,
            this.foodY * this.gameSetting.blockSize,
            this.gameSetting.blockSize,
            this.gameSetting.blockSize
        );
    };

    drawBoard = () => {
        this.context.fillStyle = this.gameSetting.boardColor;
        this.context.fillRect(0, 0, this.boardWidth, this.boardHeight);
        if (this.gameSetting.isShowGrid) {
            this.drawGrid(
                this.gameSetting.boardWidthBlockCount,
                this.gameSetting.boardHeightBlockCount,
                this.board,
                this.gameSetting.blockSize
            );
        }
    };

    randomFood = () => {
        do {
            this.foodX = Math.floor(
                Math.random() * this.gameSetting.boardWidthBlockCount
            );
            this.foodY = Math.floor(
                Math.random() * this.gameSetting.boardHeightBlockCount
            );
        } while (this.existInSnakeBody([this.foodX, this.foodY]));

        this.drawFood();
    };
    updateSnake = () => {
        
        let snakeX = this.snakeBody[0][0] + this.moveX;
        let snakeY = this.snakeBody[0][1] + this.moveY;
        if (
            snakeX > (this.gameSetting.boardWidthBlockCount -1) ||
            snakeY > (this.gameSetting.boardHeightBlockCount -1) ||
            snakeX < 0 ||
            snakeY < 0 ||
            (this.snakeMoving && this.existInSnakeBody([snakeX, snakeY]))
        ) {
            this.endGame();
            return;
        }
        this.drawBoard();
        this.drawFood();
        if (snakeX === this.foodX && snakeY === this.foodY) {
            this.updateScore((this.score += 1));
            this.randomFood();
            this.snakeBody[this.snakeBody.length] = [];
        }
        this.snakeBody.unshift([snakeX, snakeY]);
        this.snakeBody.pop();
        for (let snakeBodyId in this.snakeBody) {
            let isHead = false;
            let isTail = false;
            if (snakeBodyId != this.snakeBody.length - 1) {
                if (snakeBodyId == 0) {
                    isHead = true;
                }
                if (snakeBodyId == this.snakeBody.length - 2) {
                    isTail = true;
                }
                this.drawSnake(
                    this.snakeBody[snakeBodyId][0],
                    this.snakeBody[snakeBodyId][1],
                    isHead,
                    isTail
                );
            }
        }
    };
    saveSetting = () => {
        localStorage.setItem(
            "snakeGameSetting",
            JSON.stringify(this.gameSetting)
        );
        localStorage.setItem(
            "snakeGameScoreBoard",
            JSON.stringify(this.scoreBoard)
        );
    };
    loadSetting = () => {
        this.gameSetting = JSON.parse(
            localStorage.getItem("snakeGameSetting")
        ) || {
            baseSpeed: 500,
            blockSize: 30,
            level: 0,
            boardWidthBlockCount: 20,
            boardHeightBlockCount: 20,
            boardColor: "#000000",
            foodColor: "#928f6d",
            headColor: "#ff0000",
            bodyColor: "#0c68f3",
            tailColor: "#ffffff",
            isShowGrid: false,
        };
        this.scoreBoard =
            JSON.parse(localStorage.getItem("snakeGameScoreBoard")) || [];
        this.setting.setSpeed(this.gameSetting.level);
    };
    setting = {
        setSpeed: (level) => {
            this.snakeSpeed = Math.floor(
                this.gameSetting.baseSpeed / (level + 1)
            );
            this.gameSetting.level = level;
            this.saveSetting();
        },
        setBoardWidth: (width) => {
            this.gameSetting.boardWidthBlockCount = width;
            this.boardWidth = width * this.gameSetting.blockSize;
            this.board.width = this.boardWidth;
            this.drawBoard();
            this.saveSetting();
        },
        setBoardHeight: (height) => {
            this.gameSetting.boardHeightBlockCount = height;
            this.boardHeight = height * this.gameSetting.blockSize;
            this.board.height = this.boardHeight;
            this.drawBoard();
            this.saveSetting();
        },
        setBoardColor: (color) => {
            this.gameSetting.boardColor = color;
            this.drawBoard();
            this.saveSetting();
        },
        setFoodColor: (color) => {
            this.gameSetting.foodColor = color;
            this.saveSetting();
        },
        setHeadColor: (color) => {
            this.gameSetting.headColor = color;
            this.saveSetting();
        },
        setBodyColor: (color) => {
            this.gameSetting.bodyColor = color;
            this.saveSetting();
        },
        setTailColor: (color) => {
            this.gameSetting.tailColor = color;
            this.saveSetting();
        },
        setIsShowGrid: (isShow) => {
            this.gameSetting.isShowGrid = isShow;
            this.saveSetting();
        },
    };

    updateScore = (score) => {
        document.querySelector(".snake-game-ui #current-score").innerHTML =
            score;
        this.score = score;
    };

    updateScoreBoard = () => {
        let htmlString = "";
        for (let index in this.scoreBoard) {
            htmlString += `
            <tr>
                                <td>${+index + 1}</td>
                                <td>${this.scoreBoard[index].name}</td>
                                <td>${this.scoreBoard[index].score}</td>
                            </tr>
            `;
        }
        document.querySelector(".snake-game-ui #score-table").innerHTML =
            htmlString;
    };

    startGame = () => {
        this.pauseGame();
        this.isGameEnded = false;
        this.snakeMoving = true;
        this.moveX = 1;
        this.moveY = 0;
        this.score = 0;
        this.snakeBody = [
            [0, 0],
            [0, 0],
        ];
        this.drawBoard();
        this.randomFood();
        this.intervalId = setInterval(this.updateSnake, this.snakeSpeed);
    };
    endGame = () => {
        this.pauseGame();
        this.isGameEnded = true;
        const username = prompt(
            "Số điểm của bạn đạt được: " +
                this.score +
                "!!! \nHãy nhập tên của bạn vào bảng xếp hạng!"
        );
        this.scoreBoard.push({
            name: username,
            score: this.score,
        });
        this.scoreBoard.sort((a, b) => (a.score > b.score ? -1 : 1));
        if (this.scoreBoard.length > 10) {
            this.scoreBoard = this.scoreBoard.filter((v, i) => i < 15);
        }
        this.updateScoreBoard();
        this.saveSetting();
    };
    pauseGame = () => {
        this.snakeMoving = false;
        clearInterval(this.intervalId);
    };

    render = () => {
        function addOnChangeListenerAndSetValue({
            selector,
            setting,
            callback,
        }) {
            const element = document.querySelector(selector);
            element.onchange = callback;
            if (element.type == "checkbox") {
                element.checked = setting;
            } else {
                element.value = setting;
            }
        }

        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    this.moveX = 0;
                    this.moveY = -1;
                    this.snakeMoving = true;
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    this.moveX = 0;
                    this.moveY = 1;
                    this.snakeMoving = true;
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    this.moveX = -1;
                    this.moveY = 0;
                    this.snakeMoving = true;
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    this.moveX = 1;
                    this.moveY = 0;
                    this.snakeMoving = true;
                    break;
                case "Enter":
                    e.preventDefault();
                    this.startGame();
                    break;
                case "Escape":
                    e.preventDefault();
                    if (this.snakeMoving) {
                        document.querySelector(
                            ".snake-game-ui #btn-stop"
                        ).innerHTML = "Tiếp tục";
                        this.pauseGame();
                    }
                    break;
            }
        });

        document.querySelector(".snake-game-ui #btn-start").onclick =
            this.startGame;
        document.querySelector(".snake-game-ui #btn-stop").onclick = (e) => {
            if (this.snakeMoving) {
                e.target.innerHTML = "Tiếp tục";
                this.pauseGame();
            } else {
                if (!this.isGameEnded) {
                    e.target.innerHTML = "Tạm dừng";
                    this.intervalId = setInterval(
                        this.updateSnake,
                        this.snakeSpeed
                    );
                    this.snakeMoving = true;
                }
            }
        };

        addOnChangeListenerAndSetValue({
            selector: ".snake-game-ui #level",
            setting: this.gameSetting.level,
            callback: (e) => {
                this.setting.setSpeed(+e.target.value);
                console.log(e.target.value);
                console.log(this.gameSetting.level);
            },
        });
        addOnChangeListenerAndSetValue({
            selector: ".snake-game-ui #board-width",
            setting: this.gameSetting.boardWidthBlockCount,
            callback: (e) => {
                if (!isNaN(e.target.value)) {
                    this.setting.setBoardWidth(+e.target.value);
                }
            },
        });
        addOnChangeListenerAndSetValue({
            selector: ".snake-game-ui #board-height",
            setting: this.gameSetting.boardHeightBlockCount,
            callback: (e) => {
                if (!isNaN(e.target.value)) {
                    this.setting.setBoardHeight(+e.target.value);
                }
            },
        });
        addOnChangeListenerAndSetValue({
            selector: ".snake-game-ui #board-color",
            setting: this.gameSetting.boardColor,
            callback: (e) => {
                console.log(e.target);
                this.setting.setBoardColor(e.target.value);
            },
        });
        addOnChangeListenerAndSetValue({
            selector: ".snake-game-ui #food-color",
            setting: this.gameSetting.foodColor,
            callback: (e) => this.setting.setFoodColor(e.target.value),
        });
        addOnChangeListenerAndSetValue({
            selector: ".snake-game-ui #head-color",
            setting: this.gameSetting.headColor,
            callback: (e) => this.setting.setHeadColor(e.target.value),
        });
        addOnChangeListenerAndSetValue({
            selector: ".snake-game-ui #body-color",
            setting: this.gameSetting.bodyColor,
            callback: (e) => this.setting.setBodyColor(e.target.value),
        });
        addOnChangeListenerAndSetValue({
            selector: ".snake-game-ui #tail-color",
            setting: this.gameSetting.tailColor,
            callback: (e) => this.setting.setTailColor(e.target.value),
        });

        addOnChangeListenerAndSetValue({
            selector: ".snake-game-ui #show-grid",
            setting: this.gameSetting.isShowGrid,
            callback: (e) => {
                this.setting.setIsShowGrid(e.target.checked);
                this.drawBoard();
            },
        });
    };

    init = () => {
        this.loadSetting();
        this.boardWidth =
            this.gameSetting.boardWidthBlockCount * this.gameSetting.blockSize;
        this.boardHeight =
            this.gameSetting.boardHeightBlockCount * this.gameSetting.blockSize;
        this.board.width = this.boardWidth;
        this.board.height = this.boardHeight;
        this.drawBoard();
        this.updateScoreBoard();
        this.render();
    };
}
const app = new App();
app.init();
