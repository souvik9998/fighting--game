function rectangularCollision({rectangle1,rectangle2}){
    return (
        rectangle1.attackbox.position.x + rectangle1.attackbox.width >= rectangle2.position.x && 
        rectangle1.attackbox.position.x < rectangle2.position.x + rectangle2.width &&
        rectangle1.attackbox.position.y + rectangle1.attackbox.height >= rectangle2.position.y &&
        rectangle1.attackbox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

//game time
let timer = 60
let timerId
function gameTime(){
    if(timer>0){
        timerId = setTimeout(gameTime, 1000)
        timer--;
        document.getElementById('timer').innerHTML = timer;
    }
    if(timer === 0){
        document.getElementById('display-result').style.display = 'flex'
        if(player.health == enemy.health){
            document.getElementById('display-result').innerHTML = 'Tie';  
        }
        else if(player.health > enemy.health){
            document.getElementById('display-result').innerHTML = 'player 1 wins';
        }
        else if(player.health < enemy.health){
            document.getElementById('display-result').innerHTML = 'player 2 wins';
        }
    }
    else if(timer !== 0) {
        document.getElementById('display-result').style.display = 'flex'
        if(player.health <= 0){
            document.getElementById('display-result').innerHTML = 'player 2 wins';
            clearTimeout(timerId);
        }
        else if(enemy.health <= 0){
            document.getElementById('display-result').innerHTML = 'player 1 wins';
            clearTimeout(timerId);
        }
    }
}