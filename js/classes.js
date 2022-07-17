class Sprite{
    constructor({position, imageSrc ,scale ,framesMax,offset = {x: 0,y: 0} }){
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;
    }

    draw(){
        c.drawImage(this.image,
                    this.framesCurrent * (this.image.width / this.framesMax),
                    0,
                    this.image.width/this.framesMax ,
                    this.image.height,
                    this.position.x-this.offset.x, 
                    this.position.y-this.offset.y, 
                    (this.image.width/this.framesMax)*this.scale, 
                    this.image.height*this.scale);
    }

    animateFrame(){
        this.framesElapsed++;
        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax-1){
                this.framesCurrent++;
            }
            else{
                this.framesCurrent = 0;
            }
        }
    }
    update(){
        this.draw();
        this.animateFrame();
    }
}


class Fighter extends Sprite{
    constructor({position,
        velocity,
        color, 
        imageSrc,
        scale ,
        framesMax,
        offset = {x: 0,y: 0},
        sprites,
        attackbox = {
            offset: {},
            width: undefined,
            height: undefined
        }
    }){
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
            
        })
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastkey;
        this.attackbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackbox.offset,
            width: attackbox.width,
            height: attackbox.height
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.dead = false;

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }
    
    update(){
        this.draw()
        
        if(this.dead == false)this.animateFrame();
        this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
        this.attackbox.position.y = this.position.y + this.attackbox.offset.y;

        // c.fillRect(this.attackbox.position.x,this.attackbox.position.y,this.attackbox.width,this.attackbox.height);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        if(this.position.y + this.height + this.velocity.y >= canvas.height-96){
            this.velocity.y = 0;
            this.position.y = 330;
        }
        else {
            this.velocity.y += gravity;
        }
    }
    attack(){
        this.switchSprite('attack1');
        this.isAttacking = true;

    }
    takeHit(){
        this.health -= 20;
        if(this.health <= 0){
            this.switchSprite('death');
        }
        else this.switchSprite('takeHit');
    }
    switchSprite(sprite){
        if(this.image === this.sprites.death.image){
            if(this.framesCurrent === this.sprites.death.framesMax - 1){
                this.dead = true;
            }
            return;
        }

        // overriding all other animation with the attakc animation
        if(this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax-1){
            return;
        }

        // override when fighter gets hit
        if(this.image == this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax-1){
                return;
            }
        switch(sprite){
            case 'idle':
            if(this.image !== this.sprites.idle.image){
                this.image = this.sprites.idle.image;
                this.framesMax = this.sprites.idle.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'run':
            if(this.image !== this.sprites.run.image){
                this.image = this.sprites.run.image;
                this.framesMax = this.sprites.run.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'jump':
            if(this.image !== this.sprites.jump.image){
                this.image = this.sprites.jump.image;
                this.framesMax = this.sprites.jump.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'fall':
            if(this.image !== this.sprites.fall.image){
                this.image = this.sprites.fall.image;
                this.framesMax = this.sprites.fall.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'attack1':
            if(this.image !== this.sprites.attack1.image){
                this.image = this.sprites.attack1.image;
                this.framesMax = this.sprites.attack1.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'takeHit':
            if(this.image !== this.sprites.takeHit.image){
                this.image = this.sprites.takeHit.image;
                this.framesMax = this.sprites.takeHit.framesMax;
                this.framesCurrent = 0;
                }
                break;
            case 'death':
            if(this.image !== this.sprites.death.image){
                this.image = this.sprites.death.image;
                this.framesMax = this.sprites.death.framesMax;
                this.framesCurrent = 0;
                }
                break;
        }
    }
}