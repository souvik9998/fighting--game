const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.6
c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png',
    scale: 1,
    framesMax: 1
})
const shop = new Sprite({
    position: {
        x: 610,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: { 
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    
    color: 'red',
    imageSrc: './img/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/RUN.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackbox: {
        offset:{
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
});
const enemy = new Fighter({
    position: { 
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue',
    imageSrc: './img/kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/RUN.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackbox: {
        offset:{
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
});
const keys ={
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    }
}

gameTime()

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255,255,255,0.1)';
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    enemy.update();


    //player movement

   

    player.velocity.x = 0;
    if(keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else if(keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -5;
        player.switchSprite('run');
    }
    else{
        player.switchSprite('idle');
    }

    if(player.velocity.y < 0){
        player.switchSprite('jump');
    }
    else if(player.velocity.y > 0){
        player.switchSprite('fall');
    }
    
    //enemy movement

    enemy.velocity.x = 0;
    if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }
    else if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else{
        enemy.switchSprite('idle');
    }

    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    }
    else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall');
    }

    //collision detection

    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking &&
        player.framesCurrent === 4){
            enemy.takeHit();
            player.isAttacking = false;
            
            gsap.to('#enemy-blood',{
                width: enemy.health + '%'
            })
    }

    if(player.isAttacking && player.framesCurrent === 4){
            player.isAttacking = false;
    }
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking && 
        enemy.framesCurrent === 2){
            player.takeHit();
            enemy.isAttacking = false;
            gsap.to('#player-blood',{
                width: player.health + '%'
            })
    }
    if(enemy.isAttacking && enemy.framesCurrent === 2){
            enemy.isAttacking = false;
    }
}
animate();
window.addEventListener('keydown',(event)=>{
    if(!player.dead){
    switch(event.key){
        case "d":
            keys.d.pressed = true;
            player.lastkey = 'd';
            break;
        case "a":
            keys.a.pressed = true;
            player.lastkey = 'a';
            break;
        case "w":
            player.velocity.y = -15;
            break;
        case " ":
            player.attack();
            break;
        }
    }

    if(!enemy.dead){
        switch(event.key){
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastkey = 'ArrowRight';
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = 'ArrowLeft';    
            break;    
        case "ArrowUp":    
            enemy.velocity.y = -15;
            break; 
        case "ArrowDown":
            enemy.attack();
            break;
        }       
    }  
})
window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
    }

    
    switch(event.key){
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
})
