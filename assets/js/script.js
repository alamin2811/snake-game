// script.js

$(document).ready(function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;
    
    // Game settings
    const gridSize = 20;
    let snake = [{ x: 160, y: 160 }];
    let direction = 'RIGHT';
    let food = { x: 80, y: 80 };
    let score = 0;
    let gameInterval;
    let gameSpeed = 200; // initial game speed (ms)
    let isPaused = false;
    
    function startGame() {
        $(document).keydown(function(event) {
            if (isPaused) return;
            switch(event.which) {
                case 37: // left arrow
                    if (direction !== 'RIGHT') direction = 'LEFT';
                    break;
                case 38: // up arrow
                    if (direction !== 'DOWN') direction = 'UP';
                    break;
                case 39: // right arrow
                    if (direction !== 'LEFT') direction = 'RIGHT';
                    break;
                case 40: // down arrow
                    if (direction !== 'UP') direction = 'DOWN';
                    break;
                case 80: // 'P' key for pause
                    togglePause();
                    break;
            }
        });
        
        $('#pauseBtn').click(function() {
            togglePause();
        });
        
        $('#reloadBtn').click(function() {
            location.reload();
        });

        gameInterval = setInterval(updateGame, gameSpeed);
    }
    
    function updateGame() {
        if (isPaused) return;
        moveSnake();
        checkCollisions();
        drawGame();
        
        // Increase speed gradually
        gameSpeed = Math.max(100, gameSpeed - 1); // Increase speed every update
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, gameSpeed);
    }

    function moveSnake() {
        const head = { ...snake[0] };

        switch(direction) {
            case 'LEFT':
                head.x -= gridSize;
                break;
            case 'UP':
                head.y -= gridSize;
                break;
            case 'RIGHT':
                head.x += gridSize;
                break;
            case 'DOWN':
                head.y += gridSize;
                break;
        }

        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
            score++;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function checkCollisions() {
        const head = snake[0];

        // Check wall collisions
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            endGame();
        }

        // Check self collisions
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                endGame();
            }
        }
    }

    function generateFood() {
        const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
        const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
        food = { x, y };
    }

    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        });
        
        // Draw food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, gridSize, gridSize);

        // Draw score
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 10, 20);
    }

    function endGame() {
        clearInterval(gameInterval);
        $('#finalScore').text(score);
        $('#gameOverScreen').show();
    }

    function togglePause() {
        if (isPaused) {
            isPaused = false;
            $('#pauseBtn').text('Pause');
            gameInterval = setInterval(updateGame, gameSpeed);
        } else {
            isPaused = true;
            $('#pauseBtn').text('Resume');
            clearInterval(gameInterval);
        }
    }
    
    // Initialize game elements
    $('#gameOverScreen').hide();
    startGame();
});
