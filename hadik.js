        //listeners (arrows)
        document.addEventListener('keydown', keyPush);

        //canvas
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext("2d");
        const title = document.querySelector("h1");

        //snake
        const tileSize = 50;
        let snakeSpeed = tileSize;
        let snakePosX = 0;
        let snakePosY = canvas.height / 2;  //put to middle height of canvas
        let tail = [];
        let snakeLength = 3;

        //game running
        let isGameRunning = true;
        let fps = 15;

        //which way is snake moving
        let velocityX = 1;
        let velocityY = 0;

        //tile count
        const tileCountX = canvas.width / tileSize;
        const tileCountY = canvas.height / tileSize;
        
        //score
        let score = 0;
    

        
        //gameloop
        function gameLoop() {
            if (isGameRunning) {
                drawStuff();
                moveStuff();
                //frame delay
                setTimeout(gameLoop, 1000 / fps);
            }                        
        }

        resetFood();
        gameLoop();
        

        /*
        *   draws backgroud, snake, food, etc.
        */
        function drawStuff() {
            //background grid
            drawGrid();            
            
            //snake body (tail)
            tail.forEach(snakePart => rectangle('#555', snakePart.x, snakePart.y, tileSize, tileSize));

            //snake
            rectangle("black", snakePosX, snakePosY, tileSize, tileSize);            

            //food
            rectangle("green", foodPosX, foodPosY, tileSize, tileSize);
        }

        /*
        *   moves snake, catches going through wall, etc.
        */
        function moveStuff() {
            //snake motion
            snakePosX += snakeSpeed * velocityX;
            snakePosY += snakeSpeed * velocityY;

            //border cases => go through wall
            if (snakePosX > canvas.width - tileSize) {
                snakePosX = 0;
            } 
            if (snakePosX < 0) {
                snakePosX = canvas.width;
            }
            if (snakePosY > canvas.height - tileSize) {
                snakePosY = 0;
            } 
            if (snakePosY < 0) {
                snakePosY = canvas.height;
            }

            //tail colision     GAME OVER
            tail.forEach( snakePart => {
                if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
                    gameOver();
                }
            });

            //snake tail
            tail.push({x: snakePosX, y: snakePosY});

            //remove earliest positions of snake tail
            tail = tail.slice(-1 * snakeLength);


            //food collision
            if (snakePosX === foodPosX && snakePosY === foodPosY) {
                title.textContent = ++score;
                snakeLength++;
                resetFood();
            }
        }

        //draw rectangle
        function rectangle(color, x, y, width, height) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        }

        /*
        *   keyboard catcher
        */
       function keyPush(event) {
           switch(event.key) {
               case 'ArrowLeft':
                    isGameRunning = true;
                    if (velocityX !== 1) {
                        velocityX = -1;
                        velocityY = 0;
                    }                        
                    break;
                case 'ArrowUp':
                    isGameRunning = true;
                    if (velocityY !== 1) {
                        velocityX = 0;
                        velocityY = -1;
                    }
                    break;
                case 'ArrowRight':
                    isGameRunning = true;
                    if (velocityX !== -1) {
                        velocityX = 1;
                        velocityY = 0;
                    }
                    break;
                case 'ArrowDown':
                    isGameRunning = true;
                    if (velocityY !== -1) {
                        velocityX = 0;
                        velocityY = 1;
                    }
                    break;
                default:
                    //restart game
                    if (!isGameRunning) location.reload;
                    break;
           }
       }

       //draw grid
       function drawGrid() {
            for (let i = 0; i < tileCountX; i++) {
                for (let j = 0; j < tileCountY; j++) {
                    rectangle("white", tileSize * i, tileSize * j, tileSize - 1, tileSize - 1);
                }
            }
       }

       //draw food
       function resetFood() {
            // GAME OVER (nowhere to go)
            if (snakeLength === tileCountX * tileCountY) {
                gameOver();
            }

            foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
            foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

            // dont spawn food on snakes head
            if (foodPosX === snakePosX && foodPosY === snakePosY) {
                resetFood();
            }

            // dont spawn food on any snake part
            if (
                tail.some(
                    (snakePart) => snakePart.x === foodPosX && snakePart.y === foodPosY
                )
            ) {
                resetFood();
            }
        }

        // GAME OVER
		function gameOver() {
			title.innerHTML = `☠️ <strong> ${score} </strong> ☠️`;
			isGameRunning = false;
		}
        //console.log(foodPosX);
        //console.log(snakePosX);
        //console.log(foodPosY);
        //console.log(snakePosY);

        
        drawStuff();
        gameLoop();