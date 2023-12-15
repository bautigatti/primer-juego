let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let bird = {
    x: 50,
    y: 50,
    velocity: 0
};

let tubes = [];

let score = 0; // Comienza el juego con un puntaje de 0

let lives = 3; // Comienza el juego con 3 vidas
let isGameOver = false; // Comienza el juego sin que haya terminado

// Carga la imagen
let birdImage = new Image();
birdImage.src = 'flappy.png'; // Asegúrate de que el nombre del archivo coincida con tu imagen

let tubeImage = new Image();
tubeImage.src = 'tubos.png'; // Asegúrate de que el nombre del archivo coincida con tu imagen


// Modifica la función drawBird para usar la imagen
function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, 50, 50); // Dibuja la imagen en lugar del cuadrado
}

window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        bird.velocity = -10;
    }
});

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, 50, 50); // Dibuja la imagen en lugar del cuadrado
}

function checkCollision(tube) {
    let birdLeft = bird.x;
    let birdRight = bird.x + 50; // Ajusta este valor al tamaño de tu pájaro
    let birdTop = bird.y;
    let birdBottom = bird.y + 50; // Ajusta este valor al tamaño de tu pájaro
    let tubeLeft = tube.x;
    let tubeRight = tube.x + 50; // Ajusta este valor al tamaño de tu tubo
    let tubeTop = tube.y;
    let tubeBottom = tube.y + tube.height;
    if (birdRight > tubeLeft && birdLeft < tubeRight && birdBottom > tubeTop && birdTop < tubeBottom) {
        return true;
    } else {
        return false;
    }
}

function updateBird() {
    bird.y += bird.velocity;
    bird.velocity += 0.7;
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
    if (bird.y > canvas.height) {
        bird.y = 50;
        bird.velocity = 0;
        lives -= 1;
        score = Math.floor(score / 2); // Reduce el puntaje a la mitad
        if (lives <= 0) {
            gameOver();
        }
    }
}

function addTube() {
    let gapHeight = 200; // Ajusta este valor para cambiar el tamaño del espacio entre los tubos
    let randomHeight = Math.random() * (canvas.height - gapHeight);
    let topTube = {x: canvas.width, y: 0, height: randomHeight};
    let bottomTube = {x: canvas.width, y: randomHeight + gapHeight, height: canvas.height - randomHeight - gapHeight};
    tubes.push(topTube, bottomTube);
}


function drawTubes() {
    for (let i = 0; i < tubes.length; i++) {
        let tube = tubes[i];
        ctx.drawImage(tubeImage, tube.x, tube.y, 50, tube.height);
    }
}

function updateTubes() {
    for (let i = 0; i < tubes.length; i++) {
        let tube = tubes[i];
        tube.x -= 2;
if (tube.x === bird.x) { // Si el pájaro ha pasado el tubo
    score += 0.5; // Incrementa el puntaje
}
        if (tube.x < -50) {
            tubes.splice(i, 1);
            i--;
        }
        if (checkCollision(tube)) { // Si el pájaro ha chocado con un tubo
            lives -= 1; // Disminuye la cantidad de vidas
            score = Math.floor(score / 2); // Reduce el puntaje a la mitad
            bird.y = 50; // Restablece la posición del pájaro
            bird.velocity = 0; // Restablece la velocidad del pájaro
            tubes = []; // Vacía el array de tubos
            if (lives <= 0) {
                gameOver();
            }
        }
    }
}

setInterval(addTube, 2500); // Añade un nuevo tubo cada 2 segundos

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Puntaje: ' + score, 20, canvas.height - 20);
}

function gameLoop() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawTubes(); // Dibuja el puntaje
        drawLives();
        drawScore();
        updateBird();
        updateTubes();
        requestAnimationFrame(gameLoop);
    }
}

function gameOver() {
    isGameOver = true; // Establece que el juego ha terminado
    ctx.font = '50px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('PERDISTE', canvas.width / 2, canvas.height / 2);
}

// Función para dibujar las vidas
function drawLives() {
    for (let i = 0; i < lives; i++) {
        ctx.fillStyle = 'green'; // Elige el color
        ctx.fillRect(20 + 60 * i, 20, 30, 30); // Dibuja un cuadrado para cada vida
    }
}


gameLoop();
