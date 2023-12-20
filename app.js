document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const screenWidth = canvas.width;
    const screenHeight = canvas.height;

    const playerImages = [];
    let currentImageIndex = 0;
    let imagesLoaded = 0;
    const totalImages = 4; // Number of player images to load

    const enemyImg = new Image();
    enemyImg.src = "./images/enemy1.png";

    const coinImg = new Image();
    coinImg.src = "./images/enemy1.png";

    for (let i = 1; i <= totalImages; i++) {
        const img = new Image();
        img.src = `./images/run${i}.png`;
        playerImages.push(img);

        img.onload = function () {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                startGame();
            }
        };
    }

    function updatePlayerImage() {
        currentImageIndex = (currentImageIndex + 1) % playerImages.length;
    }

    function startGame() {
        const player = {
            x: 50,
            y: 320,
            width: 100,
            height: 120,
            speed: 5,
            velX: 0,
            velY: 0,
            jumping: false,
            grounded: false,
            lives: 3,
            coinsCollected: 0
        };

        const keys = {};
        document.addEventListener("keydown", e => {
            keys[e.code] = true;
        });

        document.addEventListener("keyup", e => {
            keys[e.code] = false;
        });

        const enemies = [];
        const enemySize = 20;

        const coins = [];
        const coinSize = 20;
        const totalCoinsToWin = 3;

        const maxJumpDuration = 30;
        let jumpDuration = 0;

        function createEnemy() {
            const newEnemy = {
                x: screenWidth,
                y: 360,
                width: enemySize,
                height: enemySize,
                speed: 3
            };
            enemies.push(newEnemy);
        }

    function createCoin() {
        const newCoin = {
            x: screenWidth,
            y: Math.random() * screenHeight,
            width: coinSize,
            height: coinSize
        };
        coins.push(newCoin);
    }

    function update() {
        updatePlayerImage();

        if (Math.random() < 0.005) {
            createEnemy();
        }

        if (Math.random() < 0.005) {
            createCoin();
        }

        if (keys["ArrowRight"]) {
            if (player.velX < player.speed) {
                player.velX++;
            }
        }

        if (keys["ArrowLeft"]) {
            if (player.velX > -player.speed) {
                player.velX--;
            }
        }

        if (keys["Space"] && !player.jumping && player.grounded) {
            player.velY = -15;
            player.jumping = true;
            player.grounded = false;
            jumpDuration = 0;
        }

        if (player.jumping) {
            if (jumpDuration < maxJumpDuration) {
                player.velY -= 1;
                jumpDuration++;
            } else {
                player.jumping = false;
                jumpDuration = 0;
            }
        }

        player.velY += 1.5;
        player.x += player.velX;
        player.y += player.velY;

        if (player.x >= screenWidth - player.width) {
            player.x = screenWidth - player.width;
        } else if (player.x <= 0) {
            player.x = 0;
        }

        if (player.y >= screenHeight - player.height) {
            player.y = screenHeight - player.height;
            player.jumping = false;
            player.grounded = true;
            player.velY = 0;
        }

        for (let i = 0; i < enemies.length; i++) {
            enemies[i].x -= enemies[i].speed;

            if (
                player.x < enemies[i].x + enemies[i].width &&
                player.x + player.width > enemies[i].x &&
                player.y < enemies[i].y + enemies[i].height &&
                player.y + player.height > enemies[i].y
            ) {
                player.lives--;
                if (player.lives <= 0) {
                    alert("Game Over");
                    return;
                } else {
                    player.x = 50;
                    player.y = 320;
                }
                enemies.splice(i, 1);
                i--;
            }   
        }

        for (let i = 0; i < coins.length; i++) {
            if (
                player.x < coins[i].x + coins[i].width &&
                player.x + player.width > coins[i].x &&
                player.y < coins[i].y + coins[i].height &&
                player.y + player.height > coins[i].y
            ) {
                player.coinsCollected++;
                if (player.coinsCollected >= totalCoinsToWin) {
                    alert("You Win!");
                    return;
                }
                coins.splice(i, 1);
                i--;
            }
            if(coins[i])
            {
            coins[i].x -= 1;
            } // Move the coin towards the left
        }

        ctx.clearRect(0, 0, screenWidth, screenHeight);
        
        // Draw player image
        ctx.drawImage(playerImages[currentImageIndex], player.x, player.y, player.width, player.height);

        // Draw enemies
        for (let i = 0; i < enemies.length; i++) {
            ctx.drawImage(enemyImg, enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
        }

        // Draw coins
        for (let i = 0; i < coins.length; i++) {
            ctx.drawImage(coinImg, coins[i].x, coins[i].y, coins[i].width, coins[i].height);
        }

        requestAnimationFrame(update);
    }
    update();
}
});
