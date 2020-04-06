SI.Game = function() {
  this.ctx = null;
  this.pressedKey = null;
  this.rocketsByPlayer = [];
  this.rocketsByEnemies = [];
  this.playerShip = null;
  this.points = 0;
  this.lives = 2;
  this.enemies = {};
  this.frames = 0;
  this.detector = null;
  this.enemyPhase = 0;
  this.okToFire = true;
  this.turnToFire = 0;
  this.gameStarted = false;
  this.gameNextLevelScreen = false;
  this.gameOver = false;
};
SI.Game.prototype.start = function() {
  this.attachKeyboardEventsGameStarted();
  this.initializeGame();
  this.drawAllElements();
};
SI.Game.prototype.initializeCanvas = function() {
  var $canvas = $("#gameview");
  this.ctx = $canvas[0].getContext("2d");
  this.ctx.imageSmoothingEnabled = false;
  this.ctx.canvas.height = SI.Sizes.height;
  this.ctx.canvas.width = SI.Sizes.width;
  this.ctx.font = SI.Sizes.font;
};
SI.Game.prototype.attachKeyboardEventsStart = function() {
  var self = this;
  $(window).resize(function() {
    var $canvas = $("#gameview");
    this.ctx = $canvas[0].getContext("2d");
    this.ctx.canvas.height = $(".divCentral").height();
    this.ctx.canvas.width = $(".divCentral").width();
  });
  $(document).keydown(function(e) {
    self.onKeyDownStart(e);
  });
  $(document).keyup(function(e) {
    self.onKeyUpStart(e);
  });
  $(document).bind("touchmove", function(e) {
    e.preventDefault();
  });
  $(document).bind("touchstart", function(e) {
    e.preventDefault();
    self.onTouchStart();
  });
  $("#gameview").click(function(e) {
    self.onTouchStart();
  });
};

SI.Game.prototype.attachKeyboardEventsGameStarted = function() {
  var self = this;
  $(document).keydown(function(e) {
    self.onKeyDownGameStarted(e);
  });
  $(document).keyup(function(e) {
    self.onKeyUpGameStarted(e);
  });
  $(document).bind("touchmove", function(e) {
    self.onTouchMoveGameStarted(e);
  });
  $(document).bind("touchstart", function(e) {
    self.onTouchGameStarted();
  });
};
SI.Game.prototype.attachKeyboardEventsGameNextLevelScreen = function() {
  var self = this;
  $(document).keydown(function(e) {
    self.onKeyDownGameNextLevelScreen(e);
  });
  $(document).keyup(function(e) {
    self.onKeyUpGameNextLevelScreen(e);
  });
  $(document).bind("touchmove", function(e) {
    e.preventDefault();
    self.onTouchGameNextLevelScreen();
  });
  $(document).bind("touchstart", function(e) {
    e.preventDefault();
    self.onTouchGameNextLevelScreen();
  });
};
SI.Game.prototype.attachKeyboardEventsGameOver = function() {
  var self = this;
  $(document).keydown(function(e) {
    self.onKeyDownGameOver(e);
  });
  $(document).keyup(function(e) {
    self.onKeyUpGameOver(e);
  });

  $(document).bind("touchmove", function(e) {
    e.preventDefault();
    self.onTouchGameOver();
  });
  $(document).bind("touchstart", function(e) {
    e.preventDefault();
    self.onTouchGameOver();
  });
  $(document).bind("click", function(e) {
    e.preventDefault();
    self.onClickShareFacebook(e);
  });
};

SI.Game.prototype.getMousePos = function(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

SI.Game.prototype.onClickShareFacebook = function(evt) {
  const pos = this.getMousePos(document.getElementById("gameview"), evt);
  const posImageX = SI.Sizes.width / 2 - 80;
  const posImageY = SI.Sizes.textInitGameY;
  const imageWidth = SI.Sizes.width / 2 - 80 + 150;
  const imageHeight = SI.Sizes.textInitGameY - 52;

  if (
    pos.x > posImageX &&
    pos.x < imageWidth &&
    pos.y > posImageY &&
    pos.y > imageHeight
  ) {
    return true;
  } else {
    return false;
  }
};
SI.Game.prototype.attachKeyboardEventsGameOverMobile = function() {
  var self = this;
  self.onTouchGameOver();
};
SI.Game.prototype.initializeGame = function() {
  this.playerShip = new SI.SpaceShip({
    x: SI.Sizes.width / 2 - SI.Sizes.playerShipWidth / 2,
    y: SI.Sizes.bottomMargin - SI.Sizes.playerShipHeight,
    width: SI.Sizes.playerShipWidth,
    height: SI.Sizes.playerShipHeight,
    img: SI.Images.playerImg
  });
  this.rocketsByPlayer = [];
  this.rocketsByEnemies = [];
  this.enemies = this.createEnemyShips(
    SI.Sizes.enemyInRow,
    SI.Sizes.enemyInColumn
  );
  this.detector = new SI.CDetection();
  this.explosions = [];
  this.okToFire = true;
  this.turnToFire = 0;
  this.points = 0;
  this.lives = 1;
  this.currentLevel = 1;
  this.enemyPhase = 0;
  this.frames = 0;
  this.enemySpeed = SI.Sizes.enemyStepHort;

  var self = this;
  this.clock = setInterval(function() {
    setTimeout(() => {
      self.moveAllElements();
      self.launchEnemyRocket();
      self.freeRocketLauncher();
    }, 800);
    self.drawAllElements();
    self.deleteExplodedRockets();
    self.deleteExplodedEnemyShips();
    self.deleteDoneExplosions();
    self.checkPlayerStatus();
    self.checkEndGame();
  }, SI.Sizes.MSPF);
};
SI.Game.prototype.nextLevel = function() {
  this.rocketsByPlayer = [];
  this.rocketsByEnemies = [];
  this.enemies = this.createEnemyShips(
    SI.Sizes.enemyInRow,
    SI.Sizes.enemyInColumn
  );
  this.detector = new SI.CDetection();
  this.explosions = [];
  this.okToFire = true;
  this.turnToFire = 0;

  this.lives++;
  this.currentLevel++;

  this.enemyPhase = 0;
  this.frames = 0;
  this.enemySpeed = this.enemySpeed + 0.5;

  var self = this;
  this.clock = setInterval(function() {
    self.moveAllElements();
    self.deleteExplodedRockets();
    self.deleteExplodedEnemyShips();
    self.deleteDoneExplosions();
    self.checkPlayerStatus();
    self.drawAllElements();
    self.launchEnemyRocket();
    self.freeRocketLauncher();
    self.checkEndGame();
  }, SI.Sizes.MSPF);
};
SI.Game.prototype.checkEndGame = function() {
  if (this.enemies.ships.length == 0) {
    clearInterval(this.clock);
    this.gameNextLevelScreen = false;
    this.clearGrid();
    this.nextLevelScreen();
  } else if (
    this.lives == 0 ||
    this.enemies.ships[this.enemies.ships.length - 1][0].y >=
      SI.Sizes.bottomMargin - SI.Sizes.enemyHeight
  ) {
    const { _, setValue } = this.stateLocalStorage("HIGH-SCORE");
    clearInterval(this.clock);
    this.gameOver = false;
    this.clearGrid();
    this.gameOverScreen();
    setValue(this.points);
  }
};
SI.Game.prototype.createEnemyShips = function(rows, columns) {
  var enemiesData = {};
  enemiesData.ships = [];
  enemiesData.directions = [];
  var xPos;
  var yPos = SI.Sizes.topMargin;
  for (var i = 0; i < rows; i += 1) {
    var row = [];
    xPos = SI.Sizes.leftMargin;
    for (var j = 0; j < columns; j += 1) {
      row.push(
        new SI.SpaceShip({
          x: xPos,
          y: yPos,
          width: SI.Sizes.enemyWidth,
          height: SI.Sizes.enemyHeight,
          img: SI.Images.enemysImg[i]
        })
      );
      xPos += SI.Sizes.enemyWidth + SI.Sizes.enemySpacing;
    }
    yPos += SI.Sizes.enemyHeight + SI.Sizes.enemySpacing;
    enemiesData.ships.push(row);
    enemiesData.directions.push(SI.Directions.Right);
  }
  return enemiesData;
};
SI.Game.prototype.lockRocketLauncher = function() {
  this.okToFire = false;
};
SI.Game.prototype.freeRocketLauncher = function() {
  this.okToFire = true;
};
SI.Game.prototype.deleteExplodedRockets = function() {
  var aliveRockets = [];
  for (var i = 0; i < this.rocketsByPlayer.length; i += 1) {
    if (!this.rocketsByPlayer[i].exploded) {
      aliveRockets.push(this.rocketsByPlayer[i]);
    } else {
      this.explosions.push(
        new SI.Explosion({
          x: this.rocketsByPlayer[i].x - SI.Sizes.explosionWidth / 2,
          y: this.rocketsByPlayer[i].y
        })
      );
    }
  }
  this.rocketsByPlayer = aliveRockets;

  aliveRockets = [];
  for (var i = 0; i < this.rocketsByEnemies.length; i += 1) {
    if (!this.rocketsByEnemies[i].exploded) {
      aliveRockets.push(this.rocketsByEnemies[i]);
    }
    // else {
    // 	this.explosions.push(new SI.Explosion({
    // 		x: this.rocketsByEnemies[i].x - SI.Sizes.explosionWidth / 2,
    // 		y: this.rocketsByEnemies[i].y  - SI.Sizes.explosionHeight / 2}));
    // }
  }
  this.rocketsByEnemies = aliveRockets;
};
SI.Game.prototype.deleteExplodedEnemyShips = function() {
  var toDelete = this.detector.detectHitEnemies(
    this.rocketsByPlayer,
    this.enemies.ships
  );
  // deletes a single ship every time
  for (var i = 0; i < toDelete.length; i += 1) {
    this.enemies.ships[toDelete[i].row].splice(toDelete[i].col, 1);
    this.points += SI.Sizes.pointModifer;
  }
  // if a row is empty, remove it
  var i = 0;
  while (i < this.enemies.ships.length) {
    if (this.enemies.ships[i].length == 0) {
      this.enemies.ships.splice(i, 1);
    } else {
      i += 1;
    }
  }
};
SI.Game.prototype.deleteDoneExplosions = function() {
  var indexToSlice;
  for (
    var i = 0;
    i < this.explosions.length && this.explosions[i].done;
    i += 1
  ) {
    indexToSlice = i;
  }
  this.explosions.splice(0, i);
};
SI.Game.prototype.checkPlayerStatus = function() {
  var playerHit = this.detector.detectHitPlayer(
    this.rocketsByEnemies,
    this.playerShip
  );
  if (playerHit) {
    this.lives -= 1;
  }
};
SI.Game.prototype.launchEnemyRocket = function() {
  if (this.turnToFire == SI.Sizes.turnUntilFire) {
    var row = Math.floor(Math.random() * this.enemies.ships.length);
    var last = Math.floor(Math.random() * this.enemies.ships[row].length);
    var ship = this.enemies.ships[row][last];
    this.rocketsByEnemies.push(
      new SI.Rocket({
        x: ship.x + ship.width / 2,
        y: ship.y + ship.height / 2,
        direction: SI.Directions.Down
      })
    );
    this.turnToFire = 0;
  } else {
    if ($(window).width() > 768) {
      this.turnToFire += 1;
    } else {
      this.turnToFire += 0.5;
    }
  }
};
SI.Game.prototype.launchPlayerRocket = function() {
  if (this.currentLevel > 5) {
    SI.Sizes.maxRockets = 4;
  }
  if (this.okToFire && this.rocketsByPlayer.length < SI.Sizes.maxRockets) {
    this.lockRocketLauncher();
    this.rocketsByPlayer.push(
      new SI.Rocket({
        x:
          this.playerShip.x +
          this.playerShip.width / 2 -
          SI.Sizes.rocketWidth / 2,
        y: this.playerShip.y,
        direction: SI.Directions.Up
      })
    );
  }
};
SI.Game.prototype.onKeyDownStart = function(e) {
  if (e.which == 13 && !this.gameStarted) {
    this.gameStarted = true;
    this.start();
  }
};
SI.Game.prototype.onKeyUpStart = function(e) {
  if (e.which == 13 && !this.gameStarted) {
    this.gameStarted = true;
    this.start();
  }
};
SI.Game.prototype.onTouchStart = function() {
  if (!this.gameStarted) {
    this.gameStarted = true;
    this.start();
  }
};
SI.Game.prototype.onKeyDownGameStarted = function(e) {
  if (e.which == SI.Keys.Right) {
    this.moveRight = true;
  } else if (e.which == SI.Keys.Left) {
    this.moveLeft = true;
  } else if (e.which == SI.Keys.Up) {
    this.launchPlayerRocket();
  }
};
SI.Game.prototype.onKeyUpGameStarted = function(e) {
  if (e.which == SI.Keys.Right) {
    this.moveRight = false;
  } else if (e.which == SI.Keys.Left) {
    this.moveLeft = false;
  }
};
SI.Game.prototype.onTouchMoveGameStarted = function(e) {
  if (this.gameStarted) {
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    e.preventDefault();
    this.playerShip.setLocation(touch.pageX - this.ctx.canvas.offsetLeft);
    this.launchPlayerRocket();
  }
};
SI.Game.prototype.onTouchGameStarted = function() {
  if (this.gameStarted) {
    this.launchPlayerRocket();
  }
};
SI.Game.prototype.onKeyDownGameNextLevelScreen = function(e) {
  if (e.which == 13 && this.gameStarted && !this.gameNextLevelScreen) {
    this.gameNextLevelScreen = true;
    this.nextLevel();
  }
};
SI.Game.prototype.onKeyUpGameNextLevelScreen = function(e) {
  if (e.which == 13 && this.gameStarted && !this.gameNextLevelScreen) {
    this.gameNextLevelScreen = true;
    this.nextLevel();
  }
};
SI.Game.prototype.onTouchGameNextLevelScreen = function(e) {
  if (this.gameStarted && !this.gameNextLevelScreen) {
    this.gameNextLevelScreen = true;
    this.nextLevel();
  }
};
SI.Game.prototype.onKeyDownGameOver = function(e) {
  if (e.which == 13 && !this.gameOver) {
    this.gameOver = true;
    this.clearGrid();
    this.start();
  }
};
SI.Game.prototype.onKeyUpGameOver = function(e) {
  if (e.which == 13 && !this.gameOver) {
    this.gameOver = true;
    this.clearGrid();
    this.start();
  }
};
SI.Game.prototype.onTouchGameOver = function(e) {
  if (!this.gameOver) {
    this.gameOver = true;
    this.clearGrid();
    this.start();
  }
};
SI.Game.prototype.moveAllElements = function() {
  this.movePlayerShip();
  this.moveEnemyShips();
  this.moveRockets();
};
SI.Game.prototype.movePlayerShip = function() {
  if (this.moveRight) {
    this.playerShip.move(SI.Sizes.playerStep, 0);
  } else if (this.moveLeft) {
    this.playerShip.move(-SI.Sizes.playerStep, 0);
  }
};
SI.Game.prototype.moveEnemyShips = function() {
  var dropDown = false;
  var lastRow = this.enemies.ships.length - 1;
  for (var i = lastRow; i >= 0; i -= 1) {
    if (this.enemies.ships[i][0].x <= SI.Sizes.leftMargin) {
      this.enemies.directions[i] = SI.Directions.Right;
      if (i == lastRow && lastRow === 1) {
        dropDown = true;
      }
    } else if (
      this.enemies.ships[i][this.enemies.ships[i].length - 1].x +
        this.enemies.ships[i][0].width >=
      SI.Sizes.rightMargin
    ) {
      this.enemies.directions[i] = SI.Directions.Left;
      if (i == lastRow) {
        dropDown = true;
      }
    }
    for (var j = 0; j < this.enemies.ships[i].length; j += 1) {
      if (dropDown) {
        this.enemies.ships[i][j].move(
          this.enemies.directions[i] * this.enemySpeed,
          SI.Sizes.enemyStepVert
        );
      } else {
        this.enemies.ships[i][j].move(
          this.enemies.directions[i] * this.enemySpeed,
          0
        );
      }
    }
  }
};
SI.Game.prototype.moveRockets = function() {
  for (var i = 0; i < this.rocketsByPlayer.length; i += 1) {
    this.rocketsByPlayer[i].move(SI.Sizes.rocketStep);
  }
  for (var i = 0; i < this.rocketsByEnemies.length; i += 1) {
    this.rocketsByEnemies[i].move(SI.Sizes.rocketStep);
  }
};
SI.Game.prototype.drawAllElements = function() {
  if (this.frames % 2 == 0) {
    this.ChangePlayerSpritePhase();
  }
  if (this.frames % 1 == 0) {
    this.ChangeExplosionPhase(this.explosions);
  }
  this.frames += 1;
  this.clearGrid();
  this.drawGround();
  this.drawPlayerShip();
  this.drawEnemyShips();
  this.drawExplosions();
  this.drawRockets();
  this.drawStatus();
};
SI.Game.prototype.clearGrid = function() {
  this.ctx.clearRect(0, 0, SI.Sizes.width, SI.Sizes.height);
};
SI.Game.prototype.drawPlayerShip = function() {
  this.playerShip.draw(this.ctx);
};
SI.Game.prototype.drawEnemyShips = function() {
  for (var i = 0; i < this.enemies.ships.length; i += 1) {
    for (var j = 0; j < this.enemies.ships[i].length; j += 1) {
      this.enemies.ships[i][j].draw(this.ctx);
    }
  }
};
SI.Game.prototype.drawRockets = function() {
  for (var i = 0; i < this.rocketsByPlayer.length; i += 1) {
    this.rocketsByPlayer[i].draw(this.ctx);
  }
  for (var i = 0; i < this.rocketsByEnemies.length; i += 1) {
    this.rocketsByEnemies[i].draw(this.ctx);
  }
};
SI.Game.prototype.drawExplosions = function() {
  for (var i = 0; i < this.explosions.length; i += 1) {
    this.explosions[i].draw(this.ctx);
  }
};
SI.Game.prototype.drawGround = function() {
  this.ctx.fillStyle = SI.Colors.ground;
};
SI.Game.prototype.drawStatus = function() {
  this.ctx.fillStyle = SI.Colors.text;
  this.ctx.font = "10px Space Invaders";
  this.ctx.fillText("PONTOS", SI.Sizes.leftMargin + 5, SI.Sizes.textMargin + 14);

  this.ctx.fillStyle = SI.Colors.text;
  this.ctx.font = "22px Space Invaders";
  this.ctx.fillText(
    this.points,
    SI.Sizes.leftMargin + 60,
    SI.Sizes.textMargin + 15
  );

  this.ctx.fillStyle = "#fcbf29";
  this.ctx.font = "10px Space Invaders";
  this.ctx.fillText(
    "MAIS ALTO",
    SI.Sizes.width - 200,
    SI.Sizes.textMargin + 15
  );

  const { value } = this.stateLocalStorage("HIGH-SCORE");

  this.ctx.fillStyle = "#fcbf29";
  this.ctx.font = "22px Space Invaders";
  this.ctx.fillText(
    value || "0",
    SI.Sizes.width - 110,
    SI.Sizes.textMargin + 15
  );
};
SI.Game.prototype.ChangePlayerSpritePhase = function() {
  var newImgX;
  this.playerShip.imgX = 29 * SI.Images.playerImg.width;
  if (this.enemyPhase == SI.Images.playerImg.phases) {
    newImgX = 0;
    this.enemyPhase = 0;
  } else {
    newImgX = (this.enemyPhase + 1) * SI.Images.playerImg.width;
    this.enemyPhase += 1;
  }
  if (this.enemyPhase <= 29) {
    this.playerShip.imgX = newImgX;
  }
};
SI.Game.prototype.ChangeExplosionPhase = function(explosions) {
  for (var i = 0; i < explosions.length; i += 1) {
    if (explosions[i].expanding) {
      if (
        explosions[i].imgX ==
        SI.Images.explosionImg.phases * SI.Images.explosionImg.width
      ) {
        explosions[i].expanding = false;
      } else {
        explosions[i].imgX += SI.Images.explosionImg.width;
      }
    } else {
      if (explosions[i].imgX == 0) {
        explosions[i].done = true;
      } else {
        explosions[i].imgX -= SI.Images.explosionImg.width;
      }
    }
  }
};
SI.Game.prototype.startGame = function() {
  this.gameStarted = false;
  this.attachKeyboardEventsStart();
  this.initializeCanvas();
  this.startScreen();
};
SI.Game.prototype.startScreen = function() {
  if ($(window).width() > 768) {
    this.ctx.drawImage(
      SI.Images.logoImage,
      SI.Sizes.width / 2 - 420 / 2,
      50,
      420,
      280
    );
    this.ctx.drawImage(
      SI.Images.instructions,
      SI.Sizes.width / 2 - SI.Images.instructions.width / 2,
      SI.Sizes.height - 200
    );
  } else {
    this.ctx.drawImage(
      SI.Images.logoImage,
      SI.Sizes.width / 2 - 325 / 2,
      50,
      325,
      200
    );
    this.ctx.drawImage(
      SI.Images.instructionsMobile,
      SI.Sizes.width / 2 - SI.Images.instructionsMobile.width / 2,
      SI.Sizes.height - 200
    );
  }

  this.ctx.fillStyle = SI.Colors.text;
  if ($(window).width() > 650) {
    this.ctx.font = "35px Montserrat";
    this.ctx.fillText(
      "Clique para jogar!",
      SI.Sizes.width / 2 - this.ctx.measureText("Clique para jogar!").width / 2,
      SI.Sizes.textInitGameY + 50
    );
  } else {
    this.ctx.font = "23px Montserrat";
    this.ctx.fillText(
      "Toque na tela para começar!",
      SI.Sizes.width / 2 -
        this.ctx.measureText("Toque na tela para começar!").width / 2,
      SI.Sizes.textInitGameY + 50
    );
  }
};
SI.Game.prototype.nextLevelScreen = function() {
  setTimeout(() => {
    this.nextLevel();
  }, 3000);
  // this.attachKeyboardEventsGameNextLevelScreen();
  this.ctx.drawImage(
    SI.Images.startScreenImg,
    SI.Sizes.width / 2 - 80,
    20,
    150,
    100
  );

  const phraseSelected =
    SI.levelPhrases[Math.floor(Math.random() * SI.levelPhrases.length)];

  this.ctx.font = "bold 35px Montserrat";
  this.ctx.fillStyle = "#5ad4fc";
  this.ctx.fillText(
    phraseSelected[0] || "",
    SI.Sizes.width / 2 - this.ctx.measureText(phraseSelected[0]).width / 2,
    (SI.Sizes.height / 12) * 5
  );

  if ($(window).width() > 1024) {
    this.ctx.font = "27px Montserrat";
    this.ctx.fillStyle = "#fcbf29";
  } else {
    this.ctx.font = "20px Montserrat";
    this.ctx.fillStyle = "#fcbf29";
  }

  this.ctx.fillText(
    phraseSelected[1] || "",
    SI.Sizes.width / 2 - this.ctx.measureText(phraseSelected[1]).width / 2,
    (SI.Sizes.height / 12) * 5.5
  );
  this.ctx.fillText(
    phraseSelected[2] || "",
    SI.Sizes.width / 2 - this.ctx.measureText(phraseSelected[2]).width / 2,
    (SI.Sizes.height / 12) * 6
  );
  this.ctx.fillText(
    phraseSelected[3] || "",
    SI.Sizes.width / 2 - this.ctx.measureText(phraseSelected[3]).width / 2,
    (SI.Sizes.height / 12) * 6.5
  );

  this.ctx.fillStyle = SI.Colors.text;
  this.ctx.font = "23px Montserrat";
  this.ctx.fillStyle = SI.Colors.text;
  this.ctx.fillText(
    `Próximo nível: ${parseInt(this.currentLevel) + 1}`,
    SI.Sizes.width / 2 -
      this.ctx.measureText(`Próximo nível: ${parseInt(this.currentLevel) + 1}`)
        .width /
        2,
    SI.Sizes.textInitGameY - 100
  );

  this.ctx.font = "23px Montserrat";
  this.ctx.fillStyle = "#fcbf29";
  this.ctx.fillText(
    `Pontuação atual: ${this.points}`,
    SI.Sizes.width / 2 -
      this.ctx.measureText(`Pontuação atual: ${this.points}`).width / 2,
    SI.Sizes.textInitGameY - 40
  );
};

function share() {
  FB.ui(
    {
      display: "popup",
      method: "share",
      href: "https://nifty-cori-758978.netlify.com/"
    },
    function(response) {}
  );
}

SI.Game.prototype.gameOverScreen = function() {
  this.setCurrrentPoints();

  if ($(window).width() < 768) {
    const self = this;
    setTimeout(function() {
      // self.attachKeyboardEventsGameOver();
      self.attachKeyboardEventsGameOverMobile();
    }, 4000);
  } else {
    this.attachKeyboardEventsGameOver();
  }

  this.ctx.drawImage(
    SI.Images.startScreenImg,
    SI.Sizes.width / 2 - 80,
    20,
    150,
    100
  );

  const phraseSelected =
    SI.Phrases[Math.floor(Math.random() * SI.Phrases.length)];

  this.ctx.font = "bold 35px Montserrat";
  this.ctx.fillStyle = "#5ad4fc";
  this.ctx.fillText(
    phraseSelected[0] || "",
    SI.Sizes.width / 2 - this.ctx.measureText(phraseSelected[0]).width / 2,
    (SI.Sizes.height / 12) * 4
  );

  if ($(window).width() > 1024) {
    this.ctx.font = "24px Montserrat";
    this.ctx.fillStyle = "#fcbf29";
  } else {
    this.ctx.font = "18px Montserrat";
    this.ctx.fillStyle = "#fcbf29";
  }

  this.ctx.fillText(
    phraseSelected[1] || "",
    SI.Sizes.width / 2 - this.ctx.measureText(phraseSelected[1]).width / 2,
    (SI.Sizes.height / 12) * 4.5
  );
  this.ctx.fillText(
    phraseSelected[2] || "",
    SI.Sizes.width / 2 - this.ctx.measureText(phraseSelected[2]).width / 2,
    (SI.Sizes.height / 12) * 5
  );
  this.ctx.fillText(
    phraseSelected[3] || "",
    SI.Sizes.width / 2 - this.ctx.measureText(phraseSelected[3]).width / 2,
    (SI.Sizes.height / 12) * 5.5
  );

  this.ctx.drawImage(
    SI.Images.yourScoreImg,
    SI.Sizes.width / 2 - 75,
    (SI.Sizes.height / 12) * 6.5,
    150,
    42.13
  );

  this.ctx.font = "25px Space Invaders";
  this.ctx.fillStyle = SI.Colors.text;
  this.ctx.fillText(
    this.points,
    (SI.Sizes.width / 4) * 2 - this.ctx.measureText(this.points).width / 2,
    (SI.Sizes.height / 12) * 8
  );

  this.ctx.font = "20px Montserrat";
  this.ctx.fillStyle = "#fcbf29";
  this.ctx.fillText(
    "PRINT E COMPARTILHE",
    (SI.Sizes.width / 4) * 2 -
      this.ctx.measureText("PRINT E COMPARTILHE").width / 2,
    (SI.Sizes.height / 12) * 10
  );

  if ($(window).width() > 768) {
    this.ctx.font = "25px Montserrat";
    this.ctx.fillStyle = SI.Colors.text;
    this.ctx.fillText(
      "Pressione enter para jogar novamente!",
      (SI.Sizes.width / 4) * 2 - this.ctx.measureText("Pressione enter para jogar novamente!").width / 2,
      (SI.Sizes.height / 12) * 11.5
    );
  }
};

SI.Game.prototype.stateLocalStorage = function(key) {
  const value = localStorage.getItem(key);

  const setValue = valueUpdate => {
    const storageValue = localStorage.getItem(key);
    if (storageValue) {
      localStorage.setItem(
        key,
        parseInt(valueUpdate) > parseInt(storageValue)
          ? parseInt(valueUpdate)
          : parseInt(storageValue)
      );
    } else {
      localStorage.setItem(key, parseInt(valueUpdate));
    }
  };

  return {
    value,
    setValue
  };
};

SI.Game.prototype.setCurrrentPoints = function() {
  localStorage.setItem("CURRENT_POINTS", parseInt(this.points));
};
