// define html elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo= document.getElementById('logo');
const score= document.getElementById('score');
const highScoreText= document.getElementById('highScore');

// define game variables
// let var bcaz the snake's height n width  keeps changing
// start at 10 on x and ends 10 on y
const gridSize=20;
let snake=[{x:10, y:10}];
let food=generateFood();
let highScore =0;
let direction='right';
let gameInterval;
let gameSpeedDelay= 200;
let gameStarted= false;


// Draw game map , snake , food
function draw() {
    // the board will get reset everytime we draw
    board.innerHTML = '';  
    drawSnake();
    drawFood();
    updateScore();
}

// draw snake 
function drawSnake() {
    snake.forEach ((segment) => {
        const snakeElement= createGameElement('div', 'snake');
        setPosition (snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// create a snake or food cube/div 
function createGameElement(tag, className) {
    // creating my own element tag which will target the div
    const element=document.createElement(tag);
    element.className=className;
    return element;
}

// set the position of the snake/food
 function setPosition(element,position) {
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}


// testing draw function
// draw();

// draw food
function drawFood() {
    if(gameStarted) {
        const foodElement= createGameElement('div', 'food');
        setPosition(foodElement, food)
        board.appendChild(foodElement);
    }
}

function generateFood(){
    // if the size is 1.99 the math floor function will make it to 1
    const x = Math.floor(Math.random()* gridSize) +1;
    const y = Math.floor(Math.random()* gridSize) +1;
    return{x,y};
}

// moving the snake
function move() {
    const head= {...snake[0] }; // copy the head of the snake
    switch (direction) {
        case 'up':
            head.y--;  // move the head up
            break;
        case 'down':
            head.y++;  // move the head down
            break;
        case 'left':
            head.x--;   // move the head left
            break;
        case 'right':   // move the head right
            head.x++;
            break;
    }
     
    snake.unshift(head);  //adds the head at the beginning , elongating the snake

    // snake.pop();   //rebuilt n destroy the tail of the snake

    if(head.x==food.x && head.y==food.y) { // if the head of the snake is at the same position as food
        food=generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // clear past interval
        gameInterval =setInterval(() => {
            move();
            checkCollision();
            draw();
            
        }, gameSpeedDelay);
    } else{
        snake.pop(); 
    }
}
// test move
// setInterval(() => {
//     move();  //move first
//     draw();  // then draw again new position
// }, 200);

// start game function
function startGame() {
    gameStarted = true; //keep track of running game
    instructionText.style.display='none';
    logo.style.display='none';
    gameInterval=setInterval(() =>{
        move();
        checkCollision();
        draw();

    }, gameSpeedDelay);
}

// keypress event listener
function handleKeyPress(event) {
    if ( !gameStarted && event.code == 'Space'){
        startGame();
    } else {
        switch (event.key){
            case 'ArrowUp':
                direction='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                direction='right';
                break;
        }
           
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    // console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -=5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;              
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;              
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;              
    }
}

function checkCollision() {
    const head=snake[0];
    if (head.x < 1 || head.x >gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for(let i=1; i<snake.length; i++){
        if (head.x == snake[i].x && head.y == snake[i].y) {
            resetGame();  
        }
    } 
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x:10 , y:10}];
    food=generateFood();
    direction='right';
    gameSpeedDelay = 200;
    updateScore();
    draw();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart (3, '0');  // padStart to make it retain the three decimals
}
 
function stopGame(){
    clearInterval(gameInterval);
    gameStarted=false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}
