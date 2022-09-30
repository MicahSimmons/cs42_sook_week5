//simplied steps for making a Phaser based game

// 1. defining a set of game configuration properties to pass thsoe values to the phaser game engine later on when we create a new Phaser.Game object.
let config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 700,
    backgroundColor: 135206250,
    physics: {
      default: 'arcade'
    },
    scene: {
      preload: myPreload,
      create: myCreate,
      update: myUpdate
    }
  };
  
  // 2. define global variables
  let bomb, death, barrel;
  
  // 3. We have at least three functions to successfully create a single scene in our Phaser: preload, create, update
  function myPreload() {
    this.load.image( 'background', 'img/background.jpg');

    this.load.image( 'barrel_image', 'img/barrel.png');
    this.load.image( 'death', 'img/death.png');
    this.load.image( 'bomb_image', 'img/bomb.png');
    this.load.image( 'flower_pink', 'img/flower_pink.png');
    this.load.image( 'flower_blue', 'img/flower_blue.png');
    this.load.image( 'flower_green', 'img/flower_green.png');

    this.load.audio( 'bell', 'img/pleasing-bell.wav');
  }
  
  function myCreate() {
    // take advantage of built-in feature of engine: make the edges of stage collidable
    // setBoundsCollison takes 4 arguments boolean
    this.physics.world.setBoundsCollision( true, true, true, false );
  
   let bgimg = this.add.image( 400, 350, 'background');
   bgimg.setDepth(-99);
   bgimg.setScale(1.3);

    // create the first game object: bomb
   bomb = this.physics.add.image( 400, 500, 'bomb_image' );
   bomb.setCollideWorldBounds(true);
   bomb.setBounce(1);
    // make the barrel
   barrel = this.physics.add.image( 400, 550, 'barrel_image' );
    barrel.setScale(2, 1);
    barrel.setImmovable();
    // make a group of death
    death = this.physics.add.staticGroup(
      {
        key: 'death',
        quantity: 120,
        gridAlign: {
          width: 20,
          height: 6,
          cellWidth: 32,
          cellHeight: 48,
          x: 112,
          y: 100
        }
      }
    );
    death.getChildren().forEach( (oneDeath) => oneDeath.setDepth(-20))

    flowers = this.physics.add.staticGroup();

    //now establish the collisions we care about detecting
    this.physics.add.collider( bomb, barrel, hitBarrel, null, this );
    this.physics.add.collider( bomb, death, hitDeath, null, this );
  
    // manage user input
    this.input.on('pointermove', moveBarrel, this);
    this.input.on('pointerup', launchBomb, this);
  
    
  }
  
  function myUpdate() {
    //flowers.getChildren().forEach( (flower) => { flower.setVelocityY(flower.body.velocity + 1) })
  }
  
  // 4. We might also define other custom functions, each one designed to respond to some specific event that happens (collision very typical)
  function hitBarrel() {
    // since the collision is enabled, phaser will make bomb bounce off barrel
  }
  
  function hitDeath(bomb_hit, death_hit) {
    death_hit.disableBody(true, true);

    let flowerTypes = [ 'flower_pink', 'flower_blue', 'flower_green' ]

    for (let i=0; i<5; i++) {
      newFlower = this.physics.add.image( death_hit.x, 
        death_hit.y, 
        flowerTypes[Math.floor(Math.random() * flowerTypes.length)]);
      newFlower.setDepth(-10);
      newFlower.setScale(0.2);
      newFlower.setVelocity((Math.random() * 100) - 50, -35);
      flowers.add(newFlower);
    }

    let bell = this.sound.add('bell', { loop: false });
    bell.play();
  }
  
  function moveBarrel(pointer) {
    barrel.x = pointer.x;
  }
  
  function launchBomb() {
   bomb.setVelocity( -75, -300 );
  }
  // 5. Create a new phaser game object and pass the config properties to Phaser
  let mygame = new Phaser.Game( config );
       