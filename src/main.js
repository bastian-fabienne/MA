import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Einfache Grafiken werden per Graphics API erzeugt – kein Asset-Loading nötig
  }

  create() {
    const { width, height } = this.scale;

    // Hintergrund-Gradient (Rechteck-Streifen)
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0f3460, 0x0f3460, 0x16213e, 0x16213e, 1);
    bg.fillRect(0, 0, width, height);

    // Boden
    this.ground = this.physics.add.staticGroup();
    const groundGraphics = this.add.graphics();
    groundGraphics.fillStyle(0x4ade80, 1);
    groundGraphics.fillRect(0, height - 32, width, 32);
    groundGraphics.generateTexture('ground', width, 32);
    groundGraphics.destroy();

    const groundSprite = this.ground.create(width / 2, height - 16, 'ground');
    groundSprite.setDisplaySize(width, 32).refreshBody();

    // Spieler (farbiges Rechteck)
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x60a5fa, 1);
    playerGraphics.fillRoundedRect(0, 0, 40, 48, 6);
    // Augen
    playerGraphics.fillStyle(0xffffff, 1);
    playerGraphics.fillCircle(12, 14, 6);
    playerGraphics.fillCircle(28, 14, 6);
    playerGraphics.fillStyle(0x1e3a8a, 1);
    playerGraphics.fillCircle(14, 14, 3);
    playerGraphics.fillCircle(30, 14, 3);
    playerGraphics.generateTexture('player', 40, 48);
    playerGraphics.destroy();

    this.player = this.physics.add.sprite(120, height - 80, 'player');
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.ground);

    // Münzen
    const coinGfx = this.add.graphics();
    coinGfx.fillStyle(0xfbbf24, 1);
    coinGfx.fillCircle(12, 12, 12);
    coinGfx.fillStyle(0xfde68a, 1);
    coinGfx.fillCircle(10, 10, 5);
    coinGfx.generateTexture('coin', 24, 24);
    coinGfx.destroy();

    this.coins = this.physics.add.staticGroup();
    const coinPositions = [200, 340, 480, 620, 760];
    coinPositions.forEach((x) => {
      this.coins.create(x, height - 80, 'coin');
    });

    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // Steuerung
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'monospace',
    });

    // Hinweis-Text
    this.add.text(width / 2, 20, 'Pfeiltasten / WASD zum Bewegen  |  Hoch / W zum Springen', {
      fontSize: '13px',
      fill: '#94a3b8',
      fontFamily: 'monospace',
    }).setOrigin(0.5, 0);
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.coins.countActive(true) === 0) {
      this.scoreText.setText('Score: ' + this.score + '  –  Gewonnen!');
    }
  }

  update() {
    const onGround = this.player.body.blocked.down;
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const jump = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                 Phaser.Input.Keyboard.JustDown(this.wasd.up);

    if (left) {
      this.player.setVelocityX(-220);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.setVelocityX(220);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (jump && onGround) {
      this.player.setVelocityY(-520);
    }
  }
}

const config = {
  type: Phaser.CANVAS,
  canvas: document.getElementById('game-canvas'),
  width: 900,
  height: 500,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  scene: GameScene,
};

new Phaser.Game(config);
