PImage christmasvillage;
PImage elf;
PImage santa;
PImage gingerbreadMan;
ArrayList<GingerbreadMan> gingerbreadMen = new ArrayList<GingerbreadMan>();
final int MAX_GINGERBREAD_MEN = 15;  // Added missing constant
boolean isBoxOpened = false;
float elfX = -100;
float elfY = 200;
float santaX = 0;
float santaSpeed = 2;
float santaY = 200;
boolean isSantaFlying = false;
float elfVelocityY = 0;
float gravity = 0.5;
boolean isJumping = false;
float rotationY = 0;
float elfZ = 0;
float santaZ = 50;
float spin = 0;
float lastBounceTime = 0;  // Added for bounce sound control

// Tickle text variables
String message = "Help the elf deliver gifts by pressing a, q and j. Press S to see Santa!";
float x, y; // X and Y coordinates of text
float hr, vr;  // horizontal and vertical radius of the text

// Snow array to hold snowflake positions
Snowflake[] snowflakes = new Snowflake[200];

class GingerbreadMan {
  float x, y, z;
  float rotX, rotY, rotZ;
  float velocityY;
  float velocityX;
  float velocityZ;
  
  GingerbreadMan(float startX, float startY, float startZ) {
    x = startX;
    y = startY;
    z = startZ;
    rotY = random(TWO_PI);
    velocityY = random(-15, -10); // Initial upward velocity
    velocityX = random(-5, 5);    // Random horizontal movement
    velocityZ = random(-5, 5);    // Random depth movement
  }
  
  void update() {
    // Apply gravity
    velocityY += 0.5;
    
    // Update position
    y += velocityY;
    x += velocityX;
    z += velocityZ;
    
    // Spin the gingerbread man
    rotY += 0.1;
    
    // If it falls below the box, remove it (handled in main draw)
    if (y > 720) {
      y = 720;
      velocityY *= -0.5; // Bounce with reduced velocity
    }
  }
  
  void display() {
    pushMatrix();
    translate(x, y, z);
    rotateY(rotY);
    fill(139, 69, 19); // Brown color for gingerbread
    stroke(255, 255, 255); // White outline for frosting effect
    strokeWeight(2);
    
    // Draw gingerbread man shape
    beginShape();
    // Head
    ellipse(0, -20, 20, 20);
    // Body
    rect(-15, 0, 30, 40, 5);
    // Arms
    rect(-30, 5, 15, 10, 5);
    rect(15, 5, 15, 10, 5);
    // Legs
    rect(-15, 40, 10, 20, 5);
    rect(5, 40, 10, 20, 5);
    endShape();
    
    // Add face details
    fill(255);
    // Eyes
    ellipse(-5, -22, 5, 5);
    ellipse(5, -22, 5, 5);
    // Smile
    noFill();
    arc(0, -18, 10, 10, 0, PI);
    
    popMatrix();
  }
}

class Snowflake {
  float x, y;
  float speed;
  float size;
  
  Snowflake() {
    reset();
    y = random(height);
  }
  
  void reset() {
    x = random(width);
    y = -10;
    speed = random(2, 6);
    size = random(2, 4);
  }
  
  void fall() {
    y += speed;
    x += sin(frameCount * 0.05) * 0.5;
    
    if (y > height) {
      reset();
    }
    
    fill(255);
    noStroke();
    circle(x, y, size);
  }
}

void setup() {
  size(1000, 800, P3D);
  stroke(5);
  
  println("Loading images...");
  christmasvillage = loadImage("Christmasvillage.png");
  elf = loadImage("Elf.png");
  santa = loadImage("Santa.png");
  
  // Enable depth testing
  hint(ENABLE_DEPTH_TEST);
  
  // Setup for tickle text
  textSize(30);
  textAlign(CENTER, CENTER);
  hr = textWidth(message) / 2;
  vr = (textAscent() + textDescent()) / 2;
  stroke(4);
  x = width / 2;
  y = height / 4; // Positioned at top quarter of screen
  
  // Check if images loaded successfully
  if (christmasvillage == null) {
    println("ERROR: Christmasvillage.png not found!");
  } else {
    println("Christmasvillage.png loaded successfully");
  }
  
  if (elf == null) {
    println("ERROR: Elf.png not found!");
  } else {
    println("Elf.png loaded successfully");
  }
  
  if (santa == null) {
    println("ERROR: Santa.png not found!");
  } else {
    println("Santa.png loaded successfully");
  }
  
  // Initialize snowflakes
  for (int i = 0; i < snowflakes.length; i++) {
    snowflakes[i] = new Snowflake();
  }
}

void draw() {
  background(0);
  smooth();
  if (!mousePressed) {
    lights();
  }
  
  // Draw background image in 2D
  if (christmasvillage != null) {
    image(christmasvillage, 0, 0, width, height);
  }
  spin += 0.01;

  // Draw the rotating box
  pushMatrix();
  translate(500, 720, 0);
  rotateX(PI/9);
  rotateY(PI/5 + spin);
  strokeWeight(5);
  stroke(34,170,42);
  fill(227,23,23);  // Add a light gray color to the box
  box(150);
  popMatrix();

  // Update and draw gingerbread men
  for (int i = gingerbreadMen.size() - 1; i >= 0; i--) {
    GingerbreadMan gbm = gingerbreadMen.get(i);
    gbm.update();
    gbm.display();
    
    // Remove gingerbread men that have fallen too far
    if (gbm.y > 1000) {
      gingerbreadMen.remove(i);
    }
  }

  // Begin 3D rendering for characters
  pushMatrix();
  translate(width/2, height/2, 0);
  rotateY(rotationY);
  translate(-width/2, -height/2, 0);
  
  // Elf movement and jumping
  if (isJumping) {
    elfY += elfVelocityY;
    elfVelocityY += gravity;
    
    if (elfY >= 200) {
      elfY = 200;
      elfVelocityY = 0;
      isJumping = false;
    }
  }
  
  elfX += 2;
  if (elfX > width) {
    elfX = -100;
  }
  
  // Draw the elf in 3D
  pushMatrix();
  translate(elfX, elfY, elfZ);
  rotateY(-rotationY);
  if (elf != null) {
    imageMode(CENTER);
    image(elf, 0, 0, 50, 50);
    imageMode(CORNER);
  }
  popMatrix();
  
  // Draw Santa in 3D
  if (isSantaFlying && santa != null) {
    pushMatrix();
    float bob = sin(frameCount * 0.05) * 20;
    float wrappedSantaX = santaX % (width + 200);
    translate(wrappedSantaX, santaY + bob, santaZ);
    rotateY(-rotationY);
    imageMode(CENTER);
    image(santa, 0, 0, 100, 100);
    imageMode(CORNER);
    popMatrix();
    
    santaX += santaSpeed;
  }
  
  popMatrix();
  
  // Draw snowflakes in 2D
  for (Snowflake snowflake : snowflakes) {
    snowflake.fall();
  }
  
  // Draw tickle text
  hint(DISABLE_DEPTH_TEST); // Ensure text renders on top
  // If the cursor is over the text, change the position
  if (abs(mouseX - x) < hr && abs(mouseY - y) < vr) {
    x += random(-5, 5);
    y += random(-5, 5);
  }
  fill(255); // White text
  text(message, x, y);
  hint(ENABLE_DEPTH_TEST);
}

void keyPressed() {
  if (key == 's' || key == 'S') {
    santaX = -100;
    santaY = 200;
    isSantaFlying = true;
    println("Santa started flying: " + isSantaFlying);
  }
  
  if (key == ' ') {
    isSantaFlying = false;
    println("Santa stopped flying");
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
  if (key == ',') santaSpeed -= 0.5;  // Decrease speed
  if (key == '.') santaSpeed += 0.5;  // Increase speed
  santaSpeed = constrain(santaSpeed, 0.5, 10);  // Keep speed within reasonable limits
}

void mouseDragged() {
  rotationY += (mouseX - pmouseX) * 0.01;
}

void mousePressed() {
  // Only add new gingerbread men if under the limit
  if (gingerbreadMen.size() < MAX_GINGERBREAD_MEN) {
    for (int i = 0; i < 3; i++) {
      gingerbreadMen.add(new GingerbreadMan(
        500 + random(-20, 20),
        720 - 75,
        random(-20, 20)
      ));
    }
    println("Gingerbread men released! Total: " + gingerbreadMen.size());
  }
}
