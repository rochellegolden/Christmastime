let christmasvillage, elf, santa, gingerbreadMan;
let gingerbreadMen = 1;
const MAX_GINGERBREAD_MEN = 15; // Added missing constant
let isBoxOpened = false;
let elfX = -500;
let elfY = parseInt(window.outerHeight * .40);
let ELFY = parseInt(window.outerHeight * .40);
let santaX = 0;
let santaSpeed = 2;
let santaY = 200;
let isSantaFlying = false;
let elfVelocityY = 0;
let gravity = 0.5;
let isJumping = false;
let rotationY = 0;
let elfZ = 0;
let santaZ = 50;
let spin = 0;
let lastBounceTime = 0; // Added for bounce sound control
// Tickle text variables
let message = "Help the elf deliver gifts by pressing a, q and j. Press S to see Santa!";
let x, y; // X and Y coordinates of text
let hr, vr; // horizontal and vertical radius of the text
let snowflakes = new Array(200);
let WorkSans;
let audioP = false;
let audio = document.getElementById('backgroundMusic');

function preload() {

  console.log("Loading images...");
  christmasvillage = loadImage("Data/Christmasvillage.png");
  elf = loadImage("Data/Elf.png");
  santa = loadImage("Data/Santa.png");
  // Check if images loaded successfully
  if (christmasvillage == null) {
    console.log("ERROR: Christmasvillage.png not found!");
  } else {
    console.log("Christmasvillage.png loaded successfully");
  }

  if (elf == null) {
    console.log("ERROR: Elf.png not found!");
  } else {
    console.log("Elf.png loaded successfully");
  }

  if (santa == null) {
    console.log("ERROR: Santa.png not found!");
  } else {
    console.log("Santa.png loaded successfully");
  }

}

function setup() {
  createCanvas(window.outerWidth, window.outerHeight, WEBGL);
  stroke(5);
  WorkSans = loadFont("Data/WorkSans-Medium.ttf");
  textFont(WorkSans);



  // Setup for tickle text
  textSize(20);
  textAlign(CENTER, CENTER);
  hr = textWidth(message) / 2;
  vr = (textAscent() + textDescent()) / 2;
  stroke(4);
  x = -width / 10;
  y = -height / 3; // Positioned at top quarter of screen


  // Initialize snowflakes
  for (i = 0; i < snowflakes.length; i++) {
    snowflakes[i] = new Snowflake();
  }
}

function draw() {
  background(0);
  smooth();

  if (!mousePressed) {
    lights();
  }

  // Draw background image in 2D
  if (christmasvillage != null) {
    image(christmasvillage, -window.outerWidth / 2, -window.outerHeight / 2, window.outerWidth, window.outerHeight);
  }
  spin += 0.01;

  // Draw the rotating box
  push();
  translate(parseInt(window.outerWidth * .25), parseInt(window.outerHeight * .35), 0);
  rotateX(PI / 9);
  rotateY(PI / 5 + spin);
  strokeWeight(5);
  stroke(34, 170, 42);
  fill(227, 23, 23); // Add a light gray color to the box
  box(150);
  pop();

  // Update and draw gingerbread men
  if (gingerbreadMen <= MAX_GINGERBREAD_MEN) {

    // for (i = 0; i <= MAX_GINGERBREAD_MEN; i--) {
    gingerbreadMen++;
    let gbm = new GingerbreadMan(50 + random(-20, 20),
      -720 - 75,
      random(-20, 20));
    gbm.update();
    gbm.display();
    // console.log("gingerbreadMen.length: " + gingerbreadMen);
    // Remove gingerbread men that have fallen too far
    if (false && gbm.y > 1000) {
      gingerbreadMen--;
      gingerbreadMen.remove(i);
    }
    // }
  }

  // Begin 3D rendering for characters
  push();
  translate(width / 2, height / 2, 0);
  rotateY(rotationY);
  translate(-width / 2, -height / 2, 0);

  // Elf movement and jumping
  if (isJumping) {
    elfY += elfVelocityY;
    elfVelocityY += gravity;

    if (elfY >= ELFY) {
      elfY = ELFY;
      elfVelocityY = 0;
      isJumping = false;
    }
  }

  elfX += 2;
  if (elfX > width) {
    elfX = -100;
  }

  // Draw the elf in 3D
  push();
  translate(elfX, elfY, elfZ);
  rotateY(-rotationY);
  if (elf != null) {
    imageMode(CENTER);
    image(elf, 0, 0, 50, 50);
    imageMode(CORNER);
  }
  pop();

  // Draw Santa in 3D
  if (isSantaFlying && santa != null) {
    push();
    let bob = sin(frameCount * 0.05) * 20;
    let wrappedSantaX = santaX % (width + 200);
    translate(wrappedSantaX, santaY + bob, santaZ);
    rotateY(-rotationY);
    imageMode(CENTER);
    image(santa, 0, 0, 100, 100);
    imageMode(CORNER);
    pop();

    santaX += santaSpeed;
  }

  pop();

  // Draw snowflakes in 2D
  for (let snowflake of snowflakes) {
    snowflake.fall();
  }



  // Draw tickle text
  // hint(DISABLE_DEPTH_TEST); // Ensure text renders on top
  // If the cursor is over the text, change the position
  if (abs(mouseX - x) < hr && abs(mouseY - y) < vr) {
    x += random(-5, 5);
    y += random(-5, 5);
  }
  fill(255); // White text
  text(message, x, y);
  // hint(ENABLE_DEPTH_TEST);
}

function keyPressed() {
  if (audioP == false) {
    audio = document.getElementById('backgroundMusic');
    audio.play();
    audioP = true;
  }
  console.log(key, keyCode);
  if (key == 's' || key == 'S') {
    santaX = -720;
    santaY = -parseInt(window.outerHeight * .25);
    isSantaFlying = true;
    console.log("Santa started flying: " + isSantaFlying);
  }

  if (key == ' ') {
    isSantaFlying = false;
    console.log("Santa stopped flying");
  }

  if (key == 'j' || key == 'J') {
    if (!isJumping) {
      isJumping = true;
      elfVelocityY = -12;
    }
  }

  // Controls for Z-depth
  if (key == 'q') elfZ += 10;
  if (key == 'a') elfZ -= 10;
  if (key == 'w') santaZ += 10;
  if (key == 's') santaZ -= 10;

  // Controls for Santa's speed
  if (key == ',') santaSpeed -= 0.5; // Decrease speed
  if (key == '.') santaSpeed += 0.5; // Increase speed
  santaSpeed = constrain(santaSpeed, 0.5, 10); // Keep speed within reasonable limits
}


function mouseDragged() {

  if (audioP == false) {
    audio = document.getElementById('backgroundMusic');
    audio.play();
    audioP = true;
  }
  rotationY += (mouseX - pmouseX) * 0.01;
}

function mousePressed() {

  if (audioP == false) {
    audio = document.getElementById('backgroundMusic');
    audio.play();
    audioP = true;
  }
  // Only add new gingerbread men if under the limit
  if (gingerbreadMen.length > MAX_GINGERBREAD_MEN) {
    for (i = 0; i < 3; i++) {
      gingerbreadMen.add(new GingerbreadMan(
        -500 + random(-20, 20),
        720 - 75,
        random(-20, 20)
      ));
    }
    console.log("Gingerbread men released! Total: ", gingerbreadMen);
  } else {
    console.log("Maximum gingerbread men reached!", gingerbreadMen);
  }
}


class Snowflake {
  constructor() {
    this.reset();
    this.y = random(height);
  }

  reset() {
    this.x = random(width);
    this.y = -1000;
    this.speed = random(2, 6);
    this.size = random(2, 4);
  }

  fall() {
    this.y += this.speed;
    this.x += Math.sin(frameCount * 0.05) * 0.5;

    if (this.y > height) {
      this.reset();
    }

    fill(255);
    noStroke();
    if (frameCount % 2 == 0) {
      circle(this.x, this.y, this.size);
    } else {
      circle(this.x * -1, this.y, this.size);
    }
  }
}

class GingerbreadMan {
  constructor(startX, startY, startZ) {
    this.x = startX;
    this.y = startY;
    this.z = startZ;
    this.rotY = Math.random() * (2 * Math.PI); // equivalent to random(TWO_PI)
    this.velocityY = Math.random() * (-10 - (-15)) + (-15); // random range -15 to -10
    this.velocityX = Math.random() * (5 - (-5)) + (-5); // random range -5 to 5
    this.velocityZ = random(-5, 5);
  }

  update() {
    // Apply gravity
    this.velocityY += 0.5;

    // Update position
    this.y += this.velocityY;
    this.x += this.velocityX;
    this.z += this.velocityZ;

    // Spin the gingerbread man
    this.rotY += 0.1;

    // If it falls below the box, remove it (handled in main draw)
    if (this.y > 720) {
      this.y = 720;
      this.velocityY *= -0.5; // Bounce with reduced velocity
    }
  }

  display() {

  }

}

function reportWindowSize() {
  setup();
}
window.onresize = reportWindowSize;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile || typeof screen.orientation !== 'undefined') {
  isSantaFlying = true;
}