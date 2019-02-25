var AM = new AssetManager();
var gameEngine = new GameEngine();

function Animation(spriteSheet, frameWidth, frameHeight,
     sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.drawFrameStill = function (ctx, x, y) {
    ctx.drawImage(this.spriteSheet,
                 0, 0, 
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game) {
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.map = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,4,4,4,4,1,
        1,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0,3,3,3,3,3,1,
        1,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,1,
        1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,1,
        1,0,0,1,0,0,0,0,2,1,0,0,1,1,0,0,0,0,0,0,0,1,
        1,0,0,1,1,1,1,1,2,1,0,0,1,1,0,0,0,0,0,0,0,1,
        1,0,0,1,0,0,0,0,2,1,0,0,1,1,0,0,0,0,0,0,0,1,
        1,0,0,1,0,0,0,0,2,1,0,0,1,1,0,0,0,0,0,0,0,1,
        1,0,0,1,0,0,0,0,2,1,0,0,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,2,1,1,1,1,1,1,0,0,1,0,0,0,0,0,1,0,0,1,
        1,0,0,2,1,0,0,0,0,0,0,0,2,1,0,0,0,1,1,0,0,1,
        1,0,0,2,1,0,0,0,0,0,0,0,0,2,1,0,1,1,0,0,0,1,
        1,0,0,2,1,1,1,1,1,1,0,0,0,0,2,1,1,0,0,0,0,1,
        1,0,0,2,1,0,0,0,0,0,0,0,0,0,2,1,1,0,0,0,0,1,
        1,0,0,2,1,0,0,0,0,0,0,0,0,2,1,0,1,1,0,0,0,1,
        1,0,0,2,1,1,1,1,1,1,0,0,2,1,0,0,0,1,1,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    ]
    this.tileArr = [[new Image(),true],[new Image(),true],[new Image(),true],
                    [new Image(),true],[new Image(),true],[new Image(),true],
                    [new Image(),true],[new Image(),true],[new Image(),true]];
    this.tileArr[0][0].src = "./img/1616tile/tile_dirt_plain.png";
    this.tileArr[1][0].src = "./img/1616tile/tile_grass.png";
    this.tileArr[2][0].src = "./img/1616tile/tile_hay.png";
    this.tileArr[3][0].src = "./img/3232tile/tile_rockwall.png";
    this.tileArr[3][1] = false;
    this.tileArr[4][0].src = "./img/3232tile/tile_walltop.png";
    this.tileArr[4][1] = false;
    this.tileArr[5][0].src = "./img/3232tile/tile_grass.png";
    this.tileArr[5][1] = false;
    this.tileArr[6][0].src = "./img/3232tile/tile_walltop_Lcorner.png";
    this.tileArr[6][1] = false;
    // this.zero = new Image();
    // this.zero.src = "./img/1616tile/tile_dirt_plain.png";
    // this.one = new Image();
    // this.one.src = "./img/1616tile/tile_grass.png";
    this.tile = null;
};

Background.prototype.draw = function () {
    for (let i = 0; i < 22; i++) {
        for (let j = 0; j < 22; j++) {
            //this.tile = (this.map[i * 22 + j] == 1)?this.one:this.zero;
            this.tile = this.tileArr[this.map[i*22 + j]];
            if (this.tile[1]){
                this.ctx.drawImage(this.tile[0], j *  32, i * 32);
                this.ctx.drawImage(this.tile[0], (j * 32) + 16, i * 32);
                this.ctx.drawImage(this.tile[0], j * 32, (i * 32) + 16);
                this.ctx.drawImage(this.tile[0], (j * 32) + 16, (i *32) + 16);
            } else {
                this.ctx.drawImage(this.tile[0],j*32,i*32);
            }
        }
    }
};
{
Background.prototype.update = function () {

};

function Monster1(game, spritesheet) {
    this.animation = new Animation(spritesheet, 40, 56, 1, 0.15, 15, true, 1);
    this.speed = 100;
    this.ctx = game.ctx;
    this.health = 100;
    this.armor = 0;
    this.maxMovespeed = 100;

    //CHANGES
    this.acceleration = {x:1,y:1};//Place holder values
    this.velocity = {x:0,y:0};
    this.isStunned = false;
    this.isSilenced = false;
    this.isBlind = false;
    this.isDisarmed = false;
    //Multipliers. Closer to '0' is faster attack speed
    this.attackSpeed = 1;
    this.attackSpeed = 1;
    this.attackDamage = 1;
    this.magicDamage = 1;


    this.buffObj = [];
    this.damageObj = [];
    Entity.call(this, game, 0, 450);
}

Monster1.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Monster1.prototype.update = function () {
    this.x -= this.game.clockTick * this.speed;
    if (this.x < 0) this.x = 680;
    Entity.prototype.update.call(this);
}

function Player(game, spritesheetLeft, spritesheetRight) {
    this.animationLeft = new Animation(spritesheetLeft, 40, 56, 1, 0.04, 13, true, 1);
    this.animationRight = new Animation(spritesheetRight, 40, 56, 1, 0.04, 13, true, 1);
    // this.animationLeft = new Animation(spritesheetLeft, 419, 381, 5, 0.04, 5, true, 0.15);
    // this.animationRight = new Animation(spritesheetRight, 419, 381, 5, 0.04, 5, true, 0.15);
    this.animationStill = this.animationRight;
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.right = true;
    this.health = 100;
    this.armor = 0;
    this.maxMovespeed = 100;
    this.acceleration = [];
    this.velocity = [];
    this.damage = 0;
    this.debuff = [];
    this.hitbox = [];
}

Player.prototype.draw = function () {
    //draw player character with no animation if player is not currently moving
    if (!gameEngine.movement) {
        this.animationStill.drawFrameStill(this.ctx, this.x, this.y);
    } else {
        if (this.right) {
            this.animationRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        } else {
            this.animationLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
        }
    }
}


Player.prototype.update = function () {
    if (gameEngine.keyW === true) {
        this.y -= 2;
    }  
    if (gameEngine.keyA === true) {
        this.x -= 2;
        this.right = false;
        this.animationStill = this.animationLeft;
    } 
    if (gameEngine.keyS === true) {
        this.y += 2;
    } 
    if (gameEngine.keyD === true) {
        this.x += 2;
        this.right = true;
        this.animationStill = this.animationRight;
    }
}






}




const Items = {
    key:"Key of Honesty",
    horn:"Immortal Horn",
    statuette:"Statuette of Sanctity",
    rod:"Rod of Fear",
    mirror:"Mirror of Hunger",
    circlet:"Runed Circlet",
    mask:"Mask of Ice",
    crown:"Lucky Crown",
    stone:"Delusion Stone",
    grail:"le Saint Graal des Anciens"
}
const ItemsArr = [
    Items.key,Items.horn,Items.statuette,Items.rod,Items.mirror
    ,Items.circlet,Items.mask,Items.crown,Items.stone,Items.grail];

    //Control unit
{
function AniUnit(theGame, theAnimationSet = []){
    this.x = 0;
    this.y = 0;
    this.velocity = {x:0,y:0};
    this.acceleration = {x:0.4,y:0.4};
    this.friction = .2;
    this.maxSpeed = 4;
    this.game = theGame;
    this.ctx = theGame.ctx;
    this.frameCount = 120;
    this.downFrames = this.frameCount;
    this.scoreMult = 1;
    this.lives = 1;
    this.score = 0;
    this.cantdie = 180;
    this.gained = "";
    this.loot = "";
    this.isDead = false;
    Entity.call(this,theGame,0,250);
    this.animationSet = [theAnimationSet[0], theAnimationSet[1]
                        ,theAnimationSet[2], theAnimationSet[3]
                        ,theAnimationSet[4], theAnimationSet[5]];
    this.currentAni = theAnimationSet[0];
    //this.animationLeft = new Animation(spritesheetLeft, 40, 56, 1, 0.04, 13, true, 1);
}

AniUnit.prototype.update = function () {
    if (this.cantdie >= 0){
        this.cantdie--;
    }
    this.MovementControl();
    if (!(this.loot===this.gained)){
        this.gained = this.loot;
        if (this.loot===""){}else{
            console.log("You gained the " + this.loot);
            //this.ctx.font = "30px Arial";
            //this.ctx.fillText("You gained the " + this.loot,100,100);
        }
        switch(this.loot){
            case Items.key:
                console.log(this.loot +": You feel as though you didn't do enough sprite animations.");
                break;
            case Items.grail:
                this.maxSpeed = 1;
                this.lives = Math.ceil(this.lives/2);
                console.log(this.loot + ": You feel old and decrepit")
                break;
            case Items.horn:
                this.lives+=5;
                console.log(this.loot + ": You feel harder to kill");
                break;
            case Items.mask:
                this.friction = 0.01;
                this.maxSpeed+=3;
                this.acceleration.x *= .2;
                this.acceleration.y *= .2;
                console.log(this.loot + ": You feel slippery");
                break;
            case Items.rod:
                this.maxSpeed++;
                this.acceleration.x *=2;
                this.acceleration.y *=2;
                console.log(this.loot + ": You feel fearful")
                break;
            case Items.statuette:
                this.cantdie += 1800;
                this.lives++;
                console.log(this.loot + ": You feel holy and devine protection");
                break;
            case Items.stone:
                console.log(this.loot + ": You feel that you can beat the wolves");
                break;
            case Items.circlet:
                this.scoreMult += 1;
                console.log(this.loot + ": You feel magical power surge from the circlet");
                break;
            case Items.crown:
                this.lives++;
                this.maxMovespeed++;
                this.cantdie+=240;
                this.gained = "a";
                console.log(this.loot + ": You feel a surge of luck");
                this.loot = ItemsArr[Math.floor(Math.random()*10)];
                break;
            case Items.mirror:
                let ani = []
                ani[0] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_up.png"),32,64,7,0.2,4,true,1);
                ani[1] = new Animation(AM.getAsset("./img/Wolf/sprite_wofl_right.png"),64,50,7,0.2,5,true,1);
                ani[2] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_down.png"),32,64,5,0.2,4,true,1);
                ani[3] = new Animation(AM.getAsset("./img/Wolf/sprite_wofl_left.png"),64,50,7,0.2,5,true,1);
                ani[4] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_still.png"),32,64,5,0.5,4,true,1);
                ani[5] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_still_final.png"),32,64,2,.4,1,true,1);
                this.animationSet = ani;
                console.log(this.loot + ": You feel the hunger of the wolves");
                break;
        }
    }
}

AniUnit.prototype.MovementControl = function () {
    if (!gameEngine.keyD && !gameEngine.keyA || this.lives <=0){
        if (Math.abs(this.velocity.x) >= this.friction){
            this.velocity.x -= this.friction*Math.sign(this.velocity.x);
        } else {
            this.velocity.x = 0;
        }
    }
    if (!gameEngine.keyW && !gameEngine.keyS || this.lives <=0){
        if (Math.abs(this.velocity.y) >= this.friction){
            this.velocity.y -= this.friction*Math.sign(this.velocity.y);
        } else {
            this.velocity.y = 0;
        }
    }
    if (this.lives>0){
        if (gameEngine.keyW){
            this.velocity.y -= this.acceleration.y;
        }
        if (gameEngine.keyS){
            this.velocity.y += this.acceleration.y;
        }
        if (gameEngine.keyA){
            this.velocity.x -= this.acceleration.x;
        }
        if (gameEngine.keyD){
            this.velocity.x += this.acceleration.x;
        }
    }
    if (this.x < 0){
        this.velocity.x = Math.abs(this.velocity.x);
    }
    if (this.x > 650){
        this.velocity.x = -Math.abs(this.velocity.x);
    }
    if (this.y < 0){
        this.velocity.y = Math.abs(this.velocity.y);
    }
    if (this.y > 650){
        this.velocity.y = -Math.abs(this.velocity.y);
    }

    ////463x
    ////132y
    if (this.x > 463 && this.y < 132){
        this.velocity.x = -Math.abs(this.velocity.x);
        this.velocity.y = +Math.abs(this.velocity.y);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    let absX = Math.abs(this.velocity.x);
    let absY = Math.abs(this.velocity.y);
    let mag = Math.sqrt(Math.pow(absX,2) + Math.pow(absY,2));
    if (absX > this.maxSpeed){this.velocity.x = this.maxSpeed*Math.sign(this.velocity.x)}
    if (absY > this.maxSpeed){this.velocity.y = this.maxSpeed*Math.sign(this.velocity.y)}
    if (mag > this.maxSpeed){
        this.velocity.x *= this.maxSpeed/mag;
        this.velocity.y *= this.maxSpeed/mag;
    }
    this.score += mag*this.scoreMult;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

AniUnit.prototype.draw = function () {
    this.SpriteDirection();
    this.currentAni.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

}

AniUnit.prototype.SpriteDirection = function () {
    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y) && this.velocity.x > 0){//Right
        this.currentAni = this.animationSet[1];
    }
    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y) && this.velocity.x < 0){//Left
        this.currentAni = this.animationSet[3];
    }
    if (Math.abs(this.velocity.x) < Math.abs(this.velocity.y) && this.velocity.y > 0){//Down
        this.currentAni = this.animationSet[2];
    }
    if (Math.abs(this.velocity.x) < Math.abs(this.velocity.y) && this.velocity.y < 0){//Up
        this.currentAni = this.animationSet[0];
    }
    if (this.velocity.y === 0 && this.velocity.x === 0 || this.lives <= 0){
        this.currentAni = this.animationSet[4];
        if (this.lives <= 0){this.downFrames--;}
        else{this.currentAni.elapsedTime = 0;}
    } else {
        this.downFrames = this.frameCount;
        this.animationSet[4].elapsedTime = 0;
    }
    if (this.downFrames <= 0){
        this.currentAni = this.animationSet[5];
        //console.log(this.x + " " + this.y);
    }
}
AniUnit.prototype.die = function (){
    if (this.cantdie <= 0){
        this.lives--;
        if (this.lives <= 0 && !this.isDead){
            this.isDead = true;
            console.log("Your score is " + Math.floor(this.score/100));
        }
    }
    if (this.cantdie <= 0 && this.lives > 0){
        console.log("You have " + this.lives + " left")
        this.cantdie = 60;
    }
}
}
//Wolf
{
function AniUnitRand(theGame, theAnimationSet = [],thePlayer){
    this.x = 0
    this.y = 0
    this.velocity = {x:0,y:0};
    this.acceleration = {x:0.4,y:0.4};
    this.friction = .05;
    this.maxSpeed = 5.5;
    this.game = theGame;
    this.ctx = theGame.ctx;
    this.huntRange = 250;
    this.frameCount = 110;
    this.downFrames = this.frameCount;
    this.player = thePlayer;
    Entity.call(this,theGame,0,250);
    this.animationSet = [theAnimationSet[0], theAnimationSet[1]
                        ,theAnimationSet[2], theAnimationSet[3]
                        ,theAnimationSet[4], theAnimationSet[5]];
    this.currentAni = theAnimationSet[0];
    this.randCounter = 80;
    //this.animationLeft = new Animation(spritesheetLeft, 40, 56, 1, 0.04, 13, true, 1);
}

AniUnitRand.prototype.update = function () {
    this.MovementControl();
}

AniUnitRand.prototype.MovementControl = function () {
    if (!gameEngine.keyD && !gameEngine.keyA){
        if (Math.abs(this.velocity.x) >= this.friction){
            this.velocity.x -= this.friction*Math.sign(this.velocity.x);
        } else {
            this.velocity.x = 0;
        }
    }
    if (!gameEngine.keyW && !gameEngine.keyS){
        if (Math.abs(this.velocity.y) >= this.friction){
            this.velocity.y -= this.friction*Math.sign(this.velocity.y);
        } else {
            this.velocity.y = 0;
        }
    }
    let dis = Math.pow((Math.pow((this.x - this.player.x),2) + Math.pow((this.y - this.player.y),2)),0.5);
    //console.log(dis);
    if (this.player.lives > 0 && dis < this.huntRange){//Hunt
        if (this.randCounter > 0){
            this.randCounter--;

        } else {
            this.randCounter = 15 + Math.random()*50;
            this.velocity.x += Math.sign(this.player.x-this.x+20)*(Math.random()*4 + 2);
            this.velocity.y += Math.sign(this.player.y-this.y+20)*(Math.random()*4 + 2);
        }
    } else {//Roam
        if (this.randCounter > 0){
            this.randCounter--;

        } else {
            this.randCounter = 30 + Math.random()*200;
            this.velocity.x = Math.random()*10 - 5;
            this.velocity.y = Math.random()*10 - 5;
        }
    }
    if (dis < 25){
        this.player.die();
    }
    if (this.x < 0){
        this.velocity.x = Math.abs(this.velocity.x);
    }
    if (this.x > 650){
        this.velocity.x = -Math.abs(this.velocity.x);
    }
    if (this.y < 0){
        this.velocity.y = Math.abs(this.velocity.y);
    }
    if (this.y > 650){
        this.velocity.y = -Math.abs(this.velocity.y);
    }
    let absX = Math.abs(this.velocity.x);
    let absY = Math.abs(this.velocity.y);
    let mag = Math.sqrt(Math.pow(absX,2) + Math.pow(absY,2));
    if (absX > this.maxSpeed){this.velocity.x = this.maxSpeed*Math.sign(this.velocity.x)}
    if (absY > this.maxSpeed){this.velocity.y = this.maxSpeed*Math.sign(this.velocity.y)}
    if (mag > this.maxSpeed){
        this.velocity.x *= this.maxSpeed/mag;
        this.velocity.y *= this.maxSpeed/mag;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

AniUnitRand.prototype.draw = function () {
    this.SpriteDirection();
    this.currentAni.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

}

AniUnitRand.prototype.SpriteDirection = function () {
    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y) && this.velocity.x > 0){//Right
        this.currentAni = this.animationSet[1];
    }
    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y) && this.velocity.x < 0){//Left
        this.currentAni = this.animationSet[3];
    }
    if (Math.abs(this.velocity.x) < Math.abs(this.velocity.y) && this.velocity.y > 0){//Down
        this.currentAni = this.animationSet[2];
    }
    if (Math.abs(this.velocity.x) < Math.abs(this.velocity.y) && this.velocity.y < 0){//Up
        this.currentAni = this.animationSet[0];
    }
    if (this.velocity.y === 0 && this.velocity.x === 0){
        this.currentAni = this.animationSet[4];
        this.downFrames--;
    } else {
        this.downFrames = this.frameCount;
        this.animationSet[4].elapsedTime = 0;
    }
    if (this.downFrames <= 0){
        this.currentAni = this.animationSet[5];
    }
}
}
//Swim
{
function AniUnitSwimRand(theGame, theAnimationSet = []){
    this.x = 0;
    this.y = 0;
    this.velocity = {x:0,y:0};
    this.acceleration = {x:0.4,y:0.4};
    this.friction = .05;
    this.maxSpeed = 4;
    this.game = theGame;
    this.ctx = theGame.ctx;
    this.frameCount = 110;
    this.downFrames = this.frameCount;
    Entity.call(this,theGame,0,250);
    this.animationSet = [theAnimationSet[0], theAnimationSet[1]
                        ,theAnimationSet[2], theAnimationSet[3]
                        ,theAnimationSet[4], theAnimationSet[5]];
    this.currentAni = theAnimationSet[0];
    this.randCounter = 30;
    //this.animationLeft = new Animation(spritesheetLeft, 40, 56, 1, 0.04, 13, true, 1);
}

AniUnitSwimRand.prototype.update = function () {
    this.MovementControl();
}

AniUnitSwimRand.prototype.MovementControl = function () {
    if (!gameEngine.keyD && !gameEngine.keyA){
        if (Math.abs(this.velocity.x) >= this.friction){
            this.velocity.x -= this.friction*Math.sign(this.velocity.x);
        } else {
            this.velocity.x = 0;
        }
    }
    if (!gameEngine.keyW && !gameEngine.keyS){
        if (Math.abs(this.velocity.y) >= this.friction){
            this.velocity.y -= this.friction*Math.sign(this.velocity.y);
        } else {
            this.velocity.y = 0;
        }
    }
    if (this.randCounter > 0){
        this.randCounter--;

    } else {
        this.randCounter = 30 + Math.random()*100;
        this.velocity.x = Math.random()*6 - 3;
        this.velocity.y = Math.random()*6 - 3;
    }
    if (this.x < 555){
        this.velocity.x = Math.abs(this.velocity.x);
        this.velocity.x *= 0.8;
    }
    if (this.x > 585){
        this.velocity.x = -Math.abs(this.velocity.x);
        this.velocity.x *= 0.8;
    }
    if (this.y < 30){
        this.velocity.y = Math.abs(this.velocity.y);
        this.velocity.y *= 0.8;
    }
    if (this.y > 75){
        this.velocity.y = -Math.abs(this.velocity.y);
        this.velocity.y *= 0.8;
    }
    let absX = Math.abs(this.velocity.x);
    let absY = Math.abs(this.velocity.y);
    let mag = Math.sqrt(Math.pow(absX,2) + Math.pow(absY,2));
    if (absX > this.maxSpeed){this.velocity.x = this.maxSpeed*Math.sign(this.velocity.x)}
    if (absY > this.maxSpeed){this.velocity.y = this.maxSpeed*Math.sign(this.velocity.y)}
    if (mag > this.maxSpeed){
        this.velocity.x *= this.maxSpeed/mag;
        this.velocity.y *= this.maxSpeed/mag;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

AniUnitSwimRand.prototype.draw = function () {
    this.SpriteDirection();
    this.currentAni.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

}

AniUnitSwimRand.prototype.SpriteDirection = function () {
    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y) && this.velocity.x > 0){//Right
        this.currentAni = this.animationSet[1];
    }
    if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y) && this.velocity.x < 0){//Left
        this.currentAni = this.animationSet[3];
    }
    if (Math.abs(this.velocity.x) < Math.abs(this.velocity.y) && this.velocity.y > 0){//Down
        this.currentAni = this.animationSet[2];
    }
    if (Math.abs(this.velocity.x) < Math.abs(this.velocity.y) && this.velocity.y < 0){//Up
        this.currentAni = this.animationSet[0];
    }
    if (this.velocity.y === 0 && this.velocity.x === 0){
        this.currentAni = this.animationSet[4];
        this.downFrames--;
    } else {
        this.downFrames = this.frameCount;
        this.animationSet[4].elapsedTime = 0;
    }
    if (this.downFrames <= 0){
        this.currentAni = this.animationSet[5];
    }
}
}
//Chest
{
function Chest(theGame,theAnimationSet,thePlayer){
    this.x = 100;
    this.y = 100;
    this.diff = 36;
    this.game = theGame;
    this.ctx = theGame.ctx;
    this.animationSet = [theAnimationSet[0], theAnimationSet[1]];
    this.currentAni = theAnimationSet[0];
    this.touch = false;
    this.give = false;
    this.loot = ItemsArr;
    this.player = thePlayer;
}
Chest.prototype.draw = function () {
    this.currentAni.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}
Chest.prototype.update = function () {
    if (this.touch&&!this.give){
        this.player.loot = this.loot[Math.floor(Math.random()*10)];
        this.player.score += 50*100;
        this.give=true;
    }
    if (this.player.x > this.x-this.diff-10
        && this.player.x < this.x+this.diff-10
        && this.player.y > this.y-this.diff-30
        && this.player.y < this.y+this.diff-10 || this.touch){
            this.touch = true;
            this.currentAni = this.animationSet[1];
            this.currentAni.elapsedTime = 1;
    } else {
        this.currentAni = this.animationSet[0];
        this.currentAni.elapsedTime = 0;
    }
}
}
//Water
{
function WaterHole(theGame,theAnimationSet,thePlayer){
    this.x = 550;
    this.y = 30;
    //this.diff = 36;
    this.game = theGame;
    this.ctx = theGame.ctx;
    this.currentAni = theAnimationSet[0];
}
WaterHole.prototype.draw = function () {
    this.currentAni.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}
WaterHole.prototype.update = function () {}
}

//Downloads
{
AM.queueDownload("./img/NPC_22.png");
AM.queueDownload("./img/NPC_22_Flipped.png");
AM.queueDownload("./img/NPC_21.png");
AM.queueDownload("./img/wizard_walk.png");
AM.queueDownload("./img/wizard_walk_flipped.png");
AM.queueDownload("./img/Maleman/sprite_male_walking.png");
AM.queueDownload("./img/Maleman/sprite_male_walking_left.png");
AM.queueDownload("./img/Maleman/sprite_male_walking_down.png");
AM.queueDownload("./img/Maleman/sprite_male_walking_right.png");
AM.queueDownload("./img/Maleman/sprite_male_still_down.png");
AM.queueDownload("./img/Maleman/sprite_male_still_down_still.png");
AM.queueDownload("./img/Wolf/sprite_wofl_left.png");
AM.queueDownload("./img/Wolf/sprite_wofl_right.png");
AM.queueDownload("./img/Wolf/sprite_wolf_down.png");
AM.queueDownload("./img/Wolf/sprite_wolf_up.png");
AM.queueDownload("./img/Wolf/sprite_wolf_still.png");
AM.queueDownload("./img/Wolf/sprite_wolf_still_final.png");
AM.queueDownload("./img/chest2.png");
AM.queueDownload("./img/water_hole.png");
AM.queueDownload("./img/People/red_swim_up.png");
AM.queueDownload("./img/People/red_swim_down.png");
AM.queueDownload("./img/People/red_swim_left.png");
AM.queueDownload("./img/People/red_swim_right.png");
}
AM.downloadAll(function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine));
    // gameEngine.addEntity(new Player(gameEngine, AM.getAsset("./img/wizard_walk_flipped.png"),
    //  AM.getAsset("./img/wizard_walk.png")));
     //gameEngine.addEntity(new Player(gameEngine, AM.getAsset("./img/NPC_22.png"),
    // AM.getAsset("./img/NPC_22_Flipped.png")));
     //gameEngine.addEntity(new Monster1(gameEngine, AM.getAsset("./img/NPC_21.png")));

     gameEngine.addEntity(new WaterHole(gameEngine,[new Animation(AM.getAsset("./img/water_hole.png"),100,100,1,0.1,1,true,1)]));


     let p = new Player(gameEngine, AM.getAsset("./img/NPC_22.png"),  AM.getAsset("./img/NPC_22_Flipped.png"));
     p.x += 200;
     p.y += 200;
     //gameEngine.addEntity(p);
     let ani = []
     ani[0] = new Animation(AM.getAsset("./img/Maleman/sprite_male_walking.png"),64,50,10,0.1,9,true,1);
     ani[1] = new Animation(AM.getAsset("./img/Maleman/sprite_male_walking_right.png"),64,50,10,0.1,9,true,1);
     ani[2] = new Animation(AM.getAsset("./img/Maleman/sprite_male_walking_down.png"),64,50,10,0.1,9,true,1);
     ani[3] = new Animation(AM.getAsset("./img/Maleman/sprite_male_walking_left.png"),64,50,10,0.1,9,true,1);
     ani[4] = new Animation(AM.getAsset("./img/Maleman/sprite_male_still_down.png"),64,64,10,0.4,6,true,1);
     ani[5] = new Animation(AM.getAsset("./img/Maleman/sprite_male_still_down_still.png"),64,64,10,.4,1,true,1);

    let aniU = new AniUnit(gameEngine, ani);
    aniU.x += 200;
    aniU.y += 200;

    let ani0 = []
     ani0[0] = new Animation(AM.getAsset("./img/People/red_swim_up.png"),32,32,3,0.1,3,true,1);
     ani0[1] = new Animation(AM.getAsset("./img/People/red_swim_right.png"),32,32,3,0.1,3,true,1);
     ani0[2] = new Animation(AM.getAsset("./img/People/red_swim_down.png"),32,32,3,0.1,3,true,1);
     ani0[3] = new Animation(AM.getAsset("./img/People/red_swim_left.png"),32,32,3,0.1,3,true,1);
     ani0[4] = new Animation(AM.getAsset("./img/People/red_swim_down.png"),32,32,3,0.2,3,true,1);
     ani0[5] = new Animation(AM.getAsset("./img/People/red_swim_down.png"),32,32,3,.2,3,true,1);

    let aniU0 = new AniUnitSwimRand(gameEngine, ani0);
    gameEngine.addEntity(aniU0);
    aniU0.x+=560;
    aniU0.y-=215;

    

    let ani2 = []
     ani2[0] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_up.png"),32,64,7,0.2,4,true,1);
     ani2[1] = new Animation(AM.getAsset("./img/Wolf/sprite_wofl_right.png"),64,50,7,0.2,5,true,1);
     ani2[2] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_down.png"),32,64,5,0.2,4,true,1);
     ani2[3] = new Animation(AM.getAsset("./img/Wolf/sprite_wofl_left.png"),64,50,7,0.2,5,true,1);
     ani2[4] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_still.png"),32,64,5,0.5,4,true,1);
     ani2[5] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_still_final.png"),32,64,2,.4,1,true,1);

    let aniU2 = new AniUnitRand(gameEngine, ani2,aniU);
    aniU2.x += Math.random()*400;
    aniU2.y += Math.random()*400;
    gameEngine.addEntity(aniU2);
    let ani3 = []
    ani3[0] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_up.png"),32,64,7,0.2,4,true,1);
    ani3[1] = new Animation(AM.getAsset("./img/Wolf/sprite_wofl_right.png"),64,50,7,0.2,5,true,1);
    ani3[2] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_down.png"),32,64,5,0.2,4,true,1);
    ani3[3] = new Animation(AM.getAsset("./img/Wolf/sprite_wofl_left.png"),64,50,7,0.2,5,true,1);
    ani3[4] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_still.png"),32,64,5,0.5,4,true,1);
    ani3[5] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_still_final.png"),32,64,2,.4,1,true,1);

    let aniU3 = new AniUnitRand(gameEngine, ani3,aniU);
    aniU3.x += Math.random()*400;
    aniU3.y += Math.random()*400;
    gameEngine.addEntity(aniU3);
    ani3[0] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_up.png"),32,64,7,0.2,4,true,1);
    ani3[1] = new Animation(AM.getAsset("./img/Wolf/sprite_wofl_right.png"),64,50,7,0.2,5,true,1);
    ani3[2] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_down.png"),32,64,5,0.2,4,true,1);
    ani3[3] = new Animation(AM.getAsset("./img/Wolf/sprite_wofl_left.png"),64,50,7,0.2,5,true,1);
    ani3[4] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_still.png"),32,64,5,0.5,4,true,1);
    ani3[5] = new Animation(AM.getAsset("./img/Wolf/sprite_wolf_still_final.png"),32,64,2,.4,1,true,1);

    aniU3 = new AniUnitRand(gameEngine, ani3,aniU);
    aniU3.x += Math.random()*400;
    aniU3.y += Math.random()*400;
    gameEngine.addEntity(aniU3);
    
    //this.animationRight = new Animation(spritesheetRight, 40, 56, 1, 0.04, 13, true, 1);
    //function Animation(spriteSheet, frameWidth, frameHeight,sheetWidth, frameDuration, frames, loop, scale
    let gah = new Animation(AM.getAsset("./img/chest2.png"),32,32,2,1,2,true,1);
    let gah2 = new Animation(AM.getAsset("./img/chest2.png"),32,32,2,1,2,true,1);
    //console.log(gah + " " + gah2);
    gameEngine.addEntity(new Chest(gameEngine,[gah,gah2],aniU));

    gah = new Animation(AM.getAsset("./img/chest2.png"),32,32,2,1,2,true,1);
    gah2 = new Animation(AM.getAsset("./img/chest2.png"),32,32,2,1,2,true,1);
    let gahs = new Chest(gameEngine,[gah,gah2],aniU);
    gahs.x = 550;
    gahs.y = 600;
    //console.log(gah + " " + gah2);
    gameEngine.addEntity(gahs);
    gameEngine.addEntity(aniU);


});