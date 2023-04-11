class Hero {
    constructor(image, top, left, size, speed) {
        this.image = image;
        this.top = top;
        this.left = left;
        this.size = size;
        this.speed = speed;
    }
    changeDirection() {
        this.speed = -this.speed;
    }
    getHeroElement = function () {
        return (
            '<img width="' +
            this.size +
            '"' +
            ' height="' +
            this.size +
            '"' +
            ' src="' +
            this.image +
            '"' +
            ' style="top: ' +
            this.top +
            "px; left:" +
            this.left +
            'px;position:absolute;" />'
        );
    };

    moveRight = function () {
        this.left += this.speed;
        console.log("ok: " + this.left);
    };
    moveLeft = function () {
        this.left -= this.speed;
        console.log("ok: " + this.left);
    };
}

let hero = new Hero("cat.png", 20, 30, 200, 50);

function start() {
    if (hero.left > window.innerWidth - hero.size || hero.left < 0) {
        hero.changeDirection();
    }
    hero.moveRight();
    document.getElementById("game").innerHTML = hero.getHeroElement();
    setTimeout(start, 500);
}

start();
