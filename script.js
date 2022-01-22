//create a game field
let canvas = document.getElementById("game");

let context = canvas.getContext("2d");
let myReq;
let score = 0;
//size of one cell on game field
let grid = 16;
//create speed of snake
let count = 0;
//create a snake
let snake = {
  //start coordinates
  x: 160,
  y: 160,
  //speed of snake: at the start it will move horisontally, so speed at the y-axe is equal to 0
  dx: grid,
  dy: 0,
  //create a body of snake. At the start of game it's empty (empty Array)
  cells: [],
  //create a start length of snake
  maxCells: 4,
};
//create an obstacle (red)
let obstacle = {
  //create a start coordinates of obstacle
  x: 320,
  y: 320,
};

let img = new Image();
img.src = "https://i.kym-cdn.com/entries/icons/original/000/014/879/SNAKE!.jpg";
//Create a generator of random numbers
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//create a game process
function loop() {
  // Дальше будет хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15. Для этого она пропускает три кадра из четырёх, то есть срабатывает каждый четвёртый кадр игры. Было 60 кадров в секунду, станет 15.
  myReq = requestAnimationFrame(loop);
  // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет.
  if (++count < 10) {
    return;
  }
  // Обнуляем переменную скорости
  count = 0;
  // Очищаем игровое поле
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Двигаем змейку с нужной скоростью
  snake.x += snake.dx;
  snake.y += snake.dy;
  // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной стороны
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  // Делаем то же самое для движения по вертикали
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку.
  snake.cells.unshift({ x: snake.x, y: snake.y });
  // Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно особождает клетки после себя
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // Рисуем еду — красное яблоко
  context.fillStyle = "red";
  context.fillRect(obstacle.x, obstacle.y, grid - 1, grid - 1);
  // Одно движение змейки — один новый нарисованный квадратик
  context.fillStyle = "green";
  // Обрабатываем каждый элемент змейки
  snake.cells.forEach(function (cell, index) {
    // Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, чтобы вокруг них образовалась чёрная граница
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    //collision detection
    if (cell.x === obstacle.x && cell.y === obstacle.y) {
      //make a snake 1 cell longer after collision
      snake.maxCells++;
      score++;
      console.log(score);
      // Рисуем новое яблочко
      // Помним, что размер холста у нас 400x400, при этом он разбит на ячейки — 25 в каждую сторону
      obstacle.x = getRandomInt(0, 25) * grid;
      obstacle.y = getRandomInt(0, 25) * grid;
    }
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: " + score, 8, 20);
    //Detection collision check with itself
    //Для этого перебираем весь массив и смотрим, есть ли у нас в массиве змейки две клетки с одинаковыми координатами
    for (var i = index + 1; i < snake.cells.length; i++) {
      // Если такие клетки есть — risujem kartinku game over
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        context.drawImage(img, 0, 0);
        console.log("mygame");
        window.cancelAnimationFrame(myReq);
      }
    }
  });
}
//move snake with a keyboard (arrows)
document.addEventListener("keydown", function (e) {
  // Дополнительно проверяем такой момент: если змейка движется, например, влево, то ещё одно нажатие влево или вправо ничего не поменяет — змейка продолжит двигаться в ту же сторону, что и раньше. Это сделано для того, чтобы не разворачивать весь массив со змейкой на лету и не усложнять код игры.
  // Стрелка влево
  // Если нажата стрелка влево, и при этом змейка никуда не движется по горизонтали…
  if (e.keyCode === 37 && snake.dx === 0) {
    // то даём ей движение по горизонтали, влево, а вертикальное — останавливаем
    // Та же самая логика будет и в остальных кнопках
    snake.dx = -grid;
    snake.dy = 0;
  }
  //move up
  else if (e.keyCode === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  //move right
  else if (e.keyCode === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  //move down
  else if (e.keyCode === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
requestAnimationFrame(loop);
