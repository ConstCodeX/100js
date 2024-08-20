const config = {
  type: Phaser.AUTO,
  width: 800, // Ancho de la vista de la cámara
  height: 600, // Altura de la vista de la cámara
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let players = [];

function preload() {
  this.load.image('map', './assets/mapa.webp');
}

function create() {
  // Crear el mapa
  const map = this.add.image(0, 0, 'map').setOrigin(0, 0);

  // Ajustar el tamaño del mapa
  map.setDisplaySize(1600, 1600); // Aumentar el tamaño del mapa

  // Configurar la cámara
  this.cameras.main.setBounds(0, 0, map.displayWidth, map.displayHeight);
  this.cameras.main.setZoom(1);

  // Habilitar las teclas de flechas para mover la cámara
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  // Movimiento de la cámara con las flechas del teclado
  const speed = 5;

  if (this.cursors.left.isDown) {
    this.cameras.main.scrollX -= speed;
  }
  if (this.cursors.right.isDown) {
    this.cameras.main.scrollX += speed;
  }
  if (this.cursors.up.isDown) {
    this.cameras.main.scrollY -= speed;
  }
  if (this.cursors.down.isDown) {
    this.cameras.main.scrollY += speed;
  }
  
  // Movimiento de la cámara con el mouse
  const pointer = this.input.activePointer;
  if (pointer.isDown) {
    if (pointer.x < 100) {
      this.cameras.main.scrollX -= speed;
    }
    if (pointer.x > config.width - 100) {
      this.cameras.main.scrollX += speed;
    }
    if (pointer.y < 100) {
      this.cameras.main.scrollY -= speed;
    }
    if (pointer.y > config.height - 100) {
      this.cameras.main.scrollY += speed;
    }
  }
}
