class Snake {
    canvas;
    context;
    body = [];
    direction = '';
    previousDirection = '';
    food = {
        x: 0,
        y: 0
    };
    score = 0;
    highScore = 0;
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.canvas.width = 421;
        this.canvas.height = 421;
        this.reset();
        this.draw();
    }

    drawBody() {
        const size = 20;
        const color = '#FCCB33';
        for (var i = 0; i < this.body.length; i++) {
            this.context.beginPath();
            this.context.fillStyle = color;
            this.context.arc(this.body[i].x + 10, this.body[i].y + 10, 10, 0, 2 * Math.PI);
            this.context.fill();
            if (i === this.body.length - 1) {

                this.context.font = "20px serif";
                this.context.fillText("😋", this.body[i].x, this.body[i].y + 17);

            }
        }
    }

    updateScore() {
        const score = document.getElementById('score');
        const highScore = document.getElementById('high-score');
        score.innerHTML = `Score: ${this.score}`;
        highScore.innerHTML = `High Score: ${this.highScore}`;
    }

    drawFood() {
        // draw apple with branch
        const size = 10;
        const color = '#ff0800';
        if (this.food.x === 0 && this.food.y === 0) {
            do {
                this.food.x = Math.floor(Math.random() * 21) * 20;
                this.food.y = Math.floor(Math.random() * 21) * 20;
            } while (this.body.some((bodyPart) => bodyPart.x === this.food.x && bodyPart.y === this.food.y))
        }
        this.context.font = "20px serif";
        this.context.fillText("🍎", this.food.x, this.food.y + 17);
    }

    move() {
        const x = this.body[this.body.length - 1].x;
        const y = this.body[this.body.length - 1].y;
        switch (this.direction) {
            case 'ArrowRight':
                if (this.previousDirection === 'ArrowLeft') {
                    this.direction = this.previousDirection;
                    break;
                }
                this.body.shift();
                this.body.push({ x: x + 20, y: y });
                this.checkCollisionSelf();
                this.previousDirection = 'ArrowRight';
                break;
            case 'ArrowLeft':
                if (this.previousDirection === 'ArrowRight') {
                    this.direction = this.previousDirection;
                    break;
                }
                this.body.shift();
                this.body.push({ x: x - 20, y: y });
                this.checkCollisionSelf();
                this.previousDirection = 'ArrowLeft';
                break;
            case 'ArrowUp':
                if (this.previousDirection === 'ArrowDown') {
                    this.direction = this.previousDirection;
                    break;
                }
                this.body.shift();
                this.body.push({ x: x, y: y - 20 });
                this.checkCollisionSelf();
                this.previousDirection = 'ArrowUp';
                break;
            case 'ArrowDown':
                if (this.previousDirection === 'ArrowUp') {
                    this.direction = this.previousDirection;
                    break;
                }
                this.body.shift();
                this.body.push({ x: x, y: y + 20 });
                this.checkCollisionSelf();
                this.previousDirection = 'ArrowDown';
                break;
            default:
                this.direction = this.previousDirection;
                break;
        }
        this.checkCollision();
    }


    drawGrid() {
        const color = "green";
        const size = 420;
        const bw = 420;
        const bh = 420;
        const p = 0;
        for (var x = 0; x <= bw; x += size) {
            this.context.moveTo(0.5 + x + p, p);
            this.context.lineTo(0.5 + x + p, bh + p);
        }

        for (var x = 0; x <= bh; x += size) {
            this.context.moveTo(p, 0.5 + x + p);
            this.context.lineTo(bw + p, 0.5 + x + p);
        }
        this.context.strokeStyle = color;
        this.context.stroke();
    }

    reset() {
        this.body = [
            {
                x: 0,
                y: 0
            },
            {
                x: 20,
                y: 0
            },
            {
                x: 40,
                y: 0
            }
        ];
        this.food = {
            x: 0,
            y: 0
        }
        this.direction = ''
        this.previousDirection = '';
    }

    checkCollision() {
        this.checkCollisionWall();
        this.checkCollisionFood();
    }

    checkCollisionWall() {
        const x = this.body[this.body.length - 1].x;
        const y = this.body[this.body.length - 1].y;
        if (x < 0 || x > 400 || y < 0 || y > 400) {
            this.reset();
            this.highScore = Math.max(this.score, this.highScore);
            this.score = 0;
        }
    }

    checkCollisionFood() {
        if (this.body[this.body.length - 1].x === this.food.x && this.body[this.body.length - 1].y === this.food.y) {
            this.grow();
            this.score += 1;
            this.food = {
                x: 0,
                y: 0
            }
        }
    }

    checkCollisionSelf() {
        const headX = this.body[this.body.length - 1].x;
        const headY = this.body[this.body.length - 1].y;
        for (var i = 0; i < this.body.length - 1; i++) {
            const bodyX = this.body[i].x;
            const bodyY = this.body[i].y;
            if (headX === bodyX && headY === bodyY) {
                this.reset();
                this.highScore = Math.max(this.score, this.highScore);
                this.score = 0;
            }
        }
    }

    grow() {
        this.food = {
            x: 0,
            y: 0
        }
        this.body.push({ x: this.body[this.body.length - 1].x, y: this.body[this.body.length - 1].y });
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawBody();
        this.move();
        this.drawFood();
        this.updateScore();
        setTimeout(() => {
            requestAnimationFrame(this.draw.bind(this));
        }, 100);

    }

}

let snake;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-board');
    const context = canvas.getContext('2d');
    snake = new Snake(canvas, context);
});

document.addEventListener('keydown', (event) => {
    snake.direction = event.key;
})