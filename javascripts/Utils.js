SI.Utils = function(context) {
  this.context = context;
  this.width = context.canvas.width;
  this.height = context.canvas.height;
};

SI.Utils.prototype.addText = function(
  text,
  posX,
  posY,
  sizeX,
  sizeY,
  fontSize = SI.Sizes.fontSize,
  font = SI.Sizes.font,
  color = SI.Colors.text
) {
  this.context.font = `${fontSize} ${font}`;
  this.context.fillStyle = color;
  this.context.fillText(text, posX, posY, sizeX, sizeY);
};

SI.Utils.prototype.addImage = function(image, posX, posY, sizeX, sizeY) {
  this.context.drawImage(image, posX, posY, sizeX, sizeY);
};
