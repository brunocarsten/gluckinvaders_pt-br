var SI = {};
/*
 * Sizes for drawing and computing
 */
SI.Sizes = {
  width: $("canvas").width(),
  height: $("canvas").height(),
  // height: $('.divCentral').height() - ($('.divCentral').height() * 0.10),

  lineWidth: 1,
  maxRockets: 2,

  pointModifer: 5,
  //miliseconds per frame
  MSPF: 1000 / 40,

  turnUntilFire: 25,
  waitSprite: 4
};
SI.Sizes.modifier = 1;
// if (SI.Sizes.width <= 360 || SI.Sizes.height <= 640) {
//   SI.Sizes.modifier = 0.7;
// }

SI.Sizes.enemyInRow = 3;

SI.Sizes.playerShipWidth = 40 * SI.Sizes.modifier;
SI.Sizes.playerShipHeight = 64 * SI.Sizes.modifier;
SI.Sizes.playerStep = 20 * SI.Sizes.modifier;

if (SI.Sizes.width < 420) {
  SI.Sizes.enemyInColumn = Math.floor(SI.Sizes.width / SI.Sizes.modifier / 80);
  SI.Sizes.enemyWidth = 35 * SI.Sizes.modifier;
  SI.Sizes.enemyHeight = 35 * SI.Sizes.modifier;
  SI.Sizes.enemySpacing = 20 * SI.Sizes.modifier;
} else if (SI.Sizes.width < 500) {
  SI.Sizes.enemyInColumn = Math.floor(SI.Sizes.width / SI.Sizes.modifier / 85);
} else if (SI.Sizes.width < 600) {
  SI.Sizes.enemyInColumn = Math.floor(SI.Sizes.width / SI.Sizes.modifier / 60);
  SI.Sizes.enemyWidth = 45;
  SI.Sizes.enemyHeight = 45;
  SI.Sizes.enemySpacing = 0.5;
} else {
  SI.Sizes.enemyInColumn = Math.floor(SI.Sizes.width / SI.Sizes.modifier / 100);
  SI.Sizes.enemyWidth = 47 * SI.Sizes.modifier;
  SI.Sizes.enemyHeight = 47 * SI.Sizes.modifier;
  SI.Sizes.enemySpacing = 20 * SI.Sizes.modifier;
}

SI.Sizes.enemyStepHort = 1 * SI.Sizes.modifier;
SI.Sizes.enemyStepVert = 50 * SI.Sizes.modifier;
SI.Sizes.rocketHeight = 20 * SI.Sizes.modifier;
SI.Sizes.rocketWidth = 6 * SI.Sizes.modifier;
SI.Sizes.rocketStep = 20 * SI.Sizes.modifier;

SI.Sizes.explosionWidth = 50 * SI.Sizes.modifier;
SI.Sizes.explosionHeight = 50 * SI.Sizes.modifier;

SI.Sizes.font = 25 * SI.Sizes.modifier + "px Space Invaders";
SI.Sizes.messageFont =
  0.125 * SI.Sizes.modifier * SI.Sizes.width + "px Space Invaders";
SI.Sizes.topMargin = 55;
SI.Sizes.leftMargin = 10 * SI.Sizes.modifier;
SI.Sizes.bottomMargin = SI.Sizes.height - 10 * SI.Sizes.modifier;
SI.Sizes.rightMargin = SI.Sizes.width - 10 * SI.Sizes.modifier;

SI.Sizes.textMargin = 25 * SI.Sizes.modifier;
SI.Sizes.textRightMargin = SI.Sizes.width - 140 * SI.Sizes.modifier;

SI.Sizes.textInitGameX = SI.Sizes.width / 2 - 110;
SI.Sizes.textInitGameY = SI.Sizes.height - 100;

SI.Sizes.popUpX = 50 * SI.Sizes.modifier;
SI.Sizes.popUpY = 100 * SI.Sizes.modifier;
SI.Sizes.popUpWidth = SI.Sizes.width - 100 * SI.Sizes.modifier;
SI.Sizes.popUpHeight = SI.Sizes.height - 400 * SI.Sizes.modifier;

SI.Images = {};

SI.Images.startScreenImg = new Image();
SI.Images.startScreenImg.src = "images/start-screen.svg";
SI.Images.startScreenImg.width = 300;
SI.Images.startScreenImg.height = 300;

SI.Images.shareButtonImg = new Image();
SI.Images.shareButtonImg.src = "images/share_button.jpg";
SI.Images.shareButtonImg.width = 378;
SI.Images.shareButtonImg.height = 132;

SI.Images.logoImage = new Image();
SI.Images.logoImage.src = "images/LOGO_Gluck.jpg";
SI.Images.logoImage.width = 807;
SI.Images.logoImage.height = 418;

SI.Images.yourScoreImg = new Image();
SI.Images.yourScoreImg.src = "images/YOUR_SCORE.png";
SI.Images.yourScoreImg.width = 1781.43;
SI.Images.yourScoreImg.height = 500.38;

SI.Images.playerImg = new Image();
SI.Images.playerImg.src = "images/Prancheta11.png";
SI.Images.playerImg.phases = 1 - 31;
SI.Images.playerImg.width = 58;
SI.Images.playerImg.height = 84;

SI.Images.instructions = new Image();
SI.Images.instructions.src = "images/Comandos1.jpg";
SI.Images.instructions.width = 164;
SI.Images.instructions.height = 60;

SI.Images.instructionsMobile = new Image();
SI.Images.instructionsMobile.src = "images/Comando_mobile1.jpg";
SI.Images.instructionsMobile.width = 84;
SI.Images.instructionsMobile.height = 94;

SI.Images.enemysImg = [];

const enemyImageOne = new Image();
enemyImageOne.src = "images/svg/ANGRY.svg";
enemyImageOne.phases = 1 - 1;

if ($(window).width() < 400) {
  enemyImageOne.width = 800;
  enemyImageOne.height = 800;
} else if ($(window).width() < 1700) {
  enemyImageOne.width = 1000;
  enemyImageOne.height = 1000;
} else if ($(window).width() < 2100) {
  enemyImageOne.width = 1500;
  enemyImageOne.height = 1500;
} else {
  enemyImageOne.width = 2000;
  enemyImageOne.height = 2000;
}

const enemyImageTwo = new Image();
enemyImageTwo.src = "images/svg/SAD.svg";
enemyImageTwo.phases = 1 - 1;

if ($(window).width() < 400) {
  enemyImageTwo.width = 800;
  enemyImageTwo.height = 800;
} else if ($(window).width() < 1700) {
  enemyImageTwo.width = 1000;
  enemyImageTwo.height = 1000;
} else if ($(window).width() < 2100) {
  enemyImageTwo.width = 1500;
  enemyImageTwo.height = 1500;
} else {
  enemyImageTwo.width = 2000;
  enemyImageTwo.height = 2000;
}

const enemyImageThree = new Image();
enemyImageThree.src = "images/svg/POKER.svg";
enemyImageThree.phases = 1 - 1;

if ($(window).width() < 400) {
  enemyImageThree.width = 800;
  enemyImageThree.height = 800;
} else if ($(window).width() < 1700) {
  enemyImageThree.width = 1000;
  enemyImageThree.height = 1000;
} else if ($(window).width() < 2100) {
  enemyImageThree.width = 1500;
  enemyImageThree.height = 1500;
} else {
  enemyImageThree.width = 2000;
  enemyImageThree.height = 2000;
}

SI.Images.enemysImg.push(enemyImageOne);
SI.Images.enemysImg.push(enemyImageTwo);
SI.Images.enemysImg.push(enemyImageThree);

SI.Images.rocketImg = new Image();
SI.Images.rocketImg.src = "images/rocket.png";

SI.Images.explosionImg = new Image();
SI.Images.explosionImg.src = "images/Prancheta13.png";
SI.Images.explosionImg.phases = 1 - 30;
SI.Images.explosionImg.width = 147;
SI.Images.explosionImg.height = 151;

/*
 * Colors for fillStyle and strokeStyle
 */
SI.Colors = {
  ground: "#fcbf29",
  text: "#5ad4ff"
};
/*
 * Directions for rockets and spaceships
 */
SI.Directions = {
  Down: 1,
  Up: -1,

  Right: 1,
  Left: -1
};

/*
 * Events key codes
 */
SI.Keys = {
  Left: 37,
  Right: 39,
  Up: 38
};

SI.levelPhrases = [
  ["Excelente!","Que o sorriso esteja com você."],
  [" ","Não existe tempo ruim com você", "não é mesmo?"],
  [' ','Eu queria que existisse','uma máquina do tempo', 'pra ver você ganhar de novo.', 'Não,  pera, existe...'],
  ["Que tal um café?", "Você deve estar cansado de","espalhar tanta felicidade…"],
  [" ","As definições de felicidade","foram atualizadas com sucesso."],
  ["Olha só!","Nós temos uma nova estrela na nossa galáxia!"],
  [" ","Houston, temos um sorriso."],
  [" ","À felicidade e além!","Bora repetir esse sucesso?"]
];

SI.Phrases = [
  ['WOW!','Você é sempre tão incrível?','Faz de novo...'],
  [' ','Você fez uma galáxia de sorrisos!'],
  ['Sem stress.', 'Quando a vida te der limões', 'faça malabares!'],
  ['Aguente firme...', 'Momentos difíceis são as','oportunidades de mudança','que estamos procurando, tente de novo'],
  ['Está ouvindo?' , 'Os motores ainda','estão ligados, continue...'],
  ['Orgulhe-se!','Nenhuma experiência','é um desperdício','mostre o que aprendeu...'],
  ['Tudo bem...','talvez você só','precise de um pouquinho','de confiança'],
  ['Opa!','Todo fim é também','um novo começo','vamos lá?']
];
