var context;
var shape;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var time_elapsed_prev;
var total_time_to_play;
var interval;
var start;
var diraction = 3;
var monsters_counter;
var monsters;
var width;
var height;
var timerLevel = 6;
var speedLevel = 3;
var life=3;
var game;
var food_remain;
var moveableFood;
var heart;
var isFormButoonsInit = false;

function afterLogin() {
	context = canvas.getContext("2d");
	shape = new Object();
    canvas.width = 1320;
    canvas.height = 720;
    $(canvasDiv).width(canvas.width + 10);
    $(canvasDiv).height(canvas.height + 10);
    width = 22;
    height = 12;
    food_remain = new Object();
    food_remain.all = 50;
    monsters_counter = 3;
    heart = new Object();
    formInitButton($("#formSpeedPlus"),$("#formSpeedMinus"),$("#formSpeed"),1,5, 1,3,!isFormButoonsInit);
    formInitButton($("#formBallsPlus"),$("#formBallsMinus"),$("#formBalls"),50,90, 5,70,!isFormButoonsInit);
    formInitButton($("#formTimePlus"),$("#formTimeMinus"),$("#formTime"),60, Number.POSITIVE_INFINITY, 10,70,!isFormButoonsInit);
    formInitButton($("#formMonstersPlus"),$("#formMonstersMinus"),$("#formMonsters"),1,3, 1,2,!isFormButoonsInit);
    isFormButoonsInit= true; 

}

function formStart(){
    speedLevel = parseInt($("#formSpeed").val());
    timerLevel= 6-speedLevel;
    food_remain.all = parseInt($("#formBalls").val());
    total_time_to_play = parseInt($("#formTime").val());
    monsters_counter= parseInt($("#formMonsters").val());
    $('#pacman_form').hide();
    $('#game_pac').show();
    document.getElementById('game_pac').style.visibility = 'visible';
    StartGame();
}

function initHarts(){
    console.log("life: "+ life);
    if (life < 1){
        $("#heart1").hide();
        $("#heart2").hide();
        $("#heart3").hide();
        $("#heart4").hide();
    }else if (life < 2){
        $("#heart1").show();
        $("#heart2").hide();
        $("#heart3").hide();
        $("#heart4").hide();
    }else if (life < 3){
        $("#heart1").show();
        $("#heart2").show();
        $("#heart3").hide();
        $("#heart4").hide();
    }else if (life < 4){
        $("#heart1").show();
        $("#heart2").show();
        $("#heart3").show();
        $("#heart4").hide();
    }else{
        $("#heart1").show();
        $("#heart2").show();
        $("#heart3").show();
        $("#heart4").show();
    }
}

function formInitButton(buttonPlus, buttonMinus, input, minValue , maxValue, valueInterval,initvalue, isOnClick){
    input.val(initvalue);
    if (initvalue==minValue){
        buttonMinus.hide();
    }else buttonMinus.show();
    if (initvalue<maxValue){
        buttonPlus.show();
    }else buttonPlus.hide();
    if (isOnClick){
        buttonMinus.click(function(){
            if(input.val()>minValue){
                var i = parseInt(input.val()) - valueInterval;
                input.val(i);
            }
            if (input.val()==minValue){
                buttonMinus.hide();
            }
            if (input.val()<maxValue){
                buttonPlus.show();
            }
        });
        buttonPlus.click(function(){
            if(input.val()<maxValue){
                var i = parseInt(input.val()) + valueInterval;
                input.val(i);
            }
            if (input.val()==maxValue){
               buttonPlus.hide();
           }
           if (input.val()>minValue){
            buttonMinus.show();
        }
    });
    }
}
function resetGame(){
    game.isStart=false;
    Draw(false);
    if (interval.monsters) {
        window.clearInterval(interval.monsters);
    }
    if (interval.pacman) {
        window.clearInterval(interval.pacman);
    }
    document.getElementById("soundtrack").pause();
	document.getElementById("soundtrack5").pause();
    formInitButton($("#formSpeedPlus"),$("#formSpeedMinus"),$("#formSpeed"),1,5, 1,3,false);
    formInitButton($("#formBallsPlus"),$("#formBallsMinus"),$("#formBalls"),50,90, 5,70,false);
    formInitButton($("#formTimePlus"),$("#formTimeMinus"),$("#formTime"),60, Number.POSITIVE_INFINITY, 10,70,false);
    formInitButton($("#formMonstersPlus"),$("#formMonstersMinus"),$("#formMonsters"),1,3, 1,2,false);
    $('#pacman_form').show();
    $('#game_pac').hide();
}
function StartGame() {
    // console.log("game start");
    $('#startlbl').show();
    game = new Object();
    game.isStart = false;
    // game.isStop = false;
    game.resson = "";
    interval = new Object();
    board = new Array();
    score = 0;
    life=3;
    time_elapsed=0;
    time_elapsed_prev=0;
    pac_color = "#ffdb54";
    food_remain.fivePoints = food_remain.all*0.6;
    food_remain.fifteenPoints = food_remain.all*0.3;
    food_remain.tweentefivePoints = food_remain.all-food_remain.fivePoints-food_remain.fifteenPoints;
    InitMonsters();
    console.log(food_remain);
    moveableFood= new Object();
    moveableFood.i = 0 ;
    moveableFood.j =11;
    moveableFood.lasti = -1;
    moveableFood.lastj = -1;
    moveableFood.eated=false;
    
    // sprite.src= "pic\\paclmenbackground.png";
    for (var i = 0; i < width; i++) {
        board = new Array();
    }
    InitObstacles();
    // console.log(board);
    InitFoodPos();
    console.log(food_remain);
    InitPackmanPos();
    initHarts();
    var emptyCell = findRandomEmptyCell(board);
    board[emptyCell[0]][emptyCell[1]] = 3;
    emptyCell = findRandomEmptyCell(board);
    board[emptyCell[0]][emptyCell[1]] = 6;
    keysDown = {};
    console.log("$('#game_pac').visible()= "+$('#game_pac').is(":visible") );
    addEventListener("keydown", function (e) {
        if(life>0 &&  $('#game_pac').is(":visible")){
           keysDown[e.keyCode] = true;
           if (!game.isStart && (keysDown[37] || keysDown[38] || keysDown[39] || keysDown[40]) ) {
            game.isStart = true;
            start_time = new Date();
            $('#startlbl').hide();
			if(speedLevel==5)
				document.getElementById("soundtrack5").play();
            else
				document.getElementById("soundtrack").play();

            console.log("game.isStart = true" + keysDown[37] + keysDown[38] + keysDown[39] + keysDown[40]);
            if (!interval.monsters) {
                window.clearInterval(interval.monsters);
                interval.monsters = setInterval(UpdateMonsterSPosition, (timerLevel + 1) * 100);
            }
            if (!interval.pacman) {
                window.clearInterval(interval.pacman);
                interval.pacman = setInterval(UpdatePosition, timerLevel * 100);
            }
        }
        if (keysDown[38]) {
            diraction = 1;

        }
        if (keysDown[40]) {
            diraction = 2;
        }
        if (keysDown[37]) {
            diraction = 3;
        }
        if (keysDown[39]) {
            diraction = 4;
        } 
    }
}, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    DrawByMonstersupdate();
}
function StartNewLevel() {
    // console.log("game start");
    $('#startlbl').show();
    game.isStart = false;
    // game.isStop = false;
    game.resson = "";
    InitMonsters();
    time_elapsed_prev= time_elapsed;
    interval = new Object();
    
    // sprite.src= "pic\\paclmenbackground.png";
    board[shape.i][shape.j] = 0;
    InitPackmanPos();
    keysDown = {};
    addEventListener("keydown", function (e) {
        if(life > 0 ){
            keysDown[e.keyCode] = true;
            if (!game.isStart && (keysDown[37] || keysDown[38] || keysDown[39] || keysDown[40]) ) {
                game.isStart = true;
                start_time = new Date();
                $('#startlbl').hide();
                if(speedLevel==5)
					document.getElementById("soundtrack5").play();
				else
					document.getElementById("soundtrack").play();
                console.log("game.isStart = true" + keysDown[37] + keysDown[38] + keysDown[39] + keysDown[40]);
                if (!interval.monsters) {
                    window.clearInterval(interval.monsters);
                    interval.monsters = setInterval(UpdateMonsterSPosition, (timerLevel + 1) * 100);
                }
                if (!interval.pacman) {
                    window.clearInterval(interval.pacman);
                    interval.pacman = setInterval(UpdatePosition, timerLevel * 100);
                }
            }
            if (keysDown[38]) {
                diraction = 1;

            }
            if (keysDown[40]) {
                diraction = 2;
            }
            if (keysDown[37]) {
                diraction = 3;
            }
            if (keysDown[39]) {
                diraction = 4;
            }
        // console.log("diraction=" + diraction);
    }



}, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    DrawByMonstersupdate();
}
function InitFoodPos()
{

    for (var j = 0; j < height; j++) {
     for (var i = 0; i < width; i++) {
        if (board[i][j] != 4) {
            var randomNum = Math.random();
            if (randomNum <= 0.2 && food_remain.all > 0) {

             randomNum = Math.random();
             if(randomNum<0.6 && food_remain.fivePoints > 0){
              food_remain.fivePoints--;
              food_remain.all--;
              board[i][j] = 5;
          }else if(randomNum<0.9 && food_remain.fifteenPoints > 0){
              food_remain.fifteenPoints--;
              food_remain.all--;
              board[i][j] = 15;
          }else if( food_remain.tweentefivePoints > 0){
              food_remain.tweentefivePoints--;
              food_remain.all--;
              board[i][j] = 25;

          }

      }  else {
        board[i][j] = 0;
    }
}
}
}
while (food_remain.all > 0) {
    var emptyCell = findRandomEmptyCell(board);
    if(food_remain.fivePoints > 0){
       food_remain.fivePoints--;
       food_remain.all--;
       board[emptyCell[0]][emptyCell[1]] = 5;
   }else if(food_remain.fifteenPoints > 0){
    food_remain.fifteenPoints--;
    food_remain.all--;
    board[emptyCell[0]][emptyCell[1]] = 15;
}else if( food_remain.tweentefivePoints > 0){
    food_remain.tweentefivePoints--;
    food_remain.all--;
    board[emptyCell[0]][emptyCell[1]] = 25;			
}
}
food_remain.all= parseInt($("#formBalls").val());
}
function InitPackmanPos()
{
    var pacman_remain = 1;
    while (pacman_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        var x = emptyCell[0];
        var y = emptyCell[1];
        if (x> 1 && x< width-2 && y> 1 && y< height-2){
           board[x][y] = 2;
           shape.i = x;
           shape.j = y;
           pacman_remain--;
       }

   }
	// else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
					// console.log("random 2: "+(1.0 * (pacman_remain + food_remain) / cnt));
                    // shape.i = i;
                    // shape.j = j;
                    // pacman_remain--;
                    // board[i][j] = 2;
                // }
            }

            function InitMonsters() {
                monsters = new Array();
                monsters[0] = new Array();
                monsters[0][0] = 0;
                monsters[0][1] = 0;
                monsters[0][2] = 2;
                monsters[0][3] = -1;
                monsters[0][4] = -1;
                monsters[0][5] = "red";
                monsters[1] = new Array();
                monsters[1][0] = 21;
                monsters[1][1] = 0;
                monsters[1][2] = 3;
                monsters[1][3] = -1;
                monsters[1][4] = -1;
                monsters[1][5] = "green";
                monsters[2] = new Array();
                monsters[2][0] = 21;
                monsters[2][1] = 11;
                monsters[2][2] = 3;
                monsters[2][3] = -1;
                monsters[2][4] = -1;
                monsters[2][5] = "blue";
            }
            function InitObstacles() {
                board = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 4, 4, 0, 4, 4, 4, 4, 0, 4, 4, 0],
                [0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 4, 0],
                [0, 4, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0],
                [0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 4, 0],
                [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0],
                [0, 4, 4, 4, 0, 4, 4, 0, 4, 0, 4, 0],
                [0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0],
                [0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
                [0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4],
                [0, 4, 4, 0, 4, 4, 0, 4, 0, 4, 0, 4],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
                [0, 4, 4, 0, 4, 4, 4, 4, 0, 4, 0, 4],
                [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
                [0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
                [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
                [0, 0, 0, 4, 4, 0, 4, 4, 0, 4, 0, 4],
                [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 4, 4, 4, 0, 4, 4, 0, 4, 4, 4, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 4, 4, 4, 0, 4, 4, 0, 4, 0, 4, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ];
            }
            function findRandomEmptyCell(board) {
                var i = Math.floor((Math.random() * (width - 1)) + 1);
                var j = Math.floor((Math.random() * (height - 1)) + 1);
                while (board[i][j] != 0) {
                    i = Math.floor((Math.random() * (width - 1)) + 1);
                    j = Math.floor((Math.random() * (height - 1)) + 1);
                }
                return [i, j];
            }

            function GetKeyPressed() {
                if (keysDown[38]) {
                    return 1;
                }
                if (keysDown[40]) {
                    return 2;
                }
                if (keysDown[37]) {
                    return 3;
                }
                if (keysDown[39]) {
                    return 4;
                }
            }

            function DrawPackmen(center) {
                context.beginPath();
                if (diraction == 4) {
        context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
    }

    if (diraction == 3) {
        context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle

    }

    if (diraction == 1) {
        context.arc(center.x, center.y, 30, 0, 2 * Math.PI); // half circle

    }
    if (diraction == 2) {
        context.arc(center.x, center.y, 30, 0, 2 * Math.PI); // half circle

    }
    context.lineTo(center.x, center.y);
    var my_gradient=context.createLinearGradient(center.x-30,center.y-30,center.x+30,center.y+30);
    my_gradient.addColorStop(0.7,pac_color);
    my_gradient.addColorStop(1,"black");
    context.fillStyle=my_gradient;
    //context.fillStyle = pac_color; //color 
    context.fill();

    if (diraction == 4 || diraction == 3) {
        context.beginPath();

        if (diraction == 4) {
            context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
        }

        if (diraction == 3) {
            context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle

        }

        context.fillStyle = "black"; //color 
        context.fill();
    }
    if (diraction == 2) {
        context.beginPath();
        context.arc(center.x + 10, center.y + 15, 5, 0, 2 * Math.PI); // circle
        context.fillStyle = "black"; //color 
        context.fill();
        context.beginPath();
        context.arc(center.x - 10, center.y + 15, 5, 0, 2 * Math.PI); // circle
        context.fillStyle = "black"; //color 
        context.fill();
    }
}

function DrawMoveableFood(i, j){
    var center = new Object();
    center.x = i * 60;
    center.y = j * 60;

    var img=document.getElementById("cherry");
    context.drawImage(img,center.x,center.y, 60,60);
}

function DrawMonster(i, j, monster_diraction, monster_color) {
    var center = new Object();
    center.x = i * 60 + 30;
    center.y = j * 60 + 30;

    context.beginPath();
    context.arc(center.x, center.y, 30, 1.9 * Math.PI, 1.1 * Math.PI); // circle
    var my_gradient=context.createLinearGradient(center.x-30,center.y-30,center.x+30,center.y+30);
    my_gradient.addColorStop(0.5,monster_color);
    my_gradient.addColorStop(1,"black");
    context.fillStyle=my_gradient;
    context.fill();
    context.beginPath();
    context.moveTo(center.x + 30, center.y - 7);
    context.lineTo(center.x + 20, center.y - 30);
    context.lineTo(center.x + 10, center.y - 7);
    context.lineTo(center.x, center.y - 30);
    context.lineTo(center.x - 10, center.y - 7);
    context.lineTo(center.x - 20, center.y - 30);
    context.lineTo(center.x - 30, center.y - 7);
    context.fillStyle = my_gradient; //color 
    context.fill();


    if (monster_diraction == 4)//right
    {
        context.beginPath();
        context.arc(center.x + 5, center.y + 3, 5, 0, 2 * Math.PI);
        context.fillStyle = "black"; //color 
        context.fill();
        context.beginPath();
        context.beginPath();
        context.moveTo(center.x, center.y + 17);
        context.lineTo(center.x + 20, center.y + 17);
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.stroke();
    }

    if (monster_diraction == 3)//left
    {

        context.beginPath();
        context.arc(center.x - 5, center.y + 3, 5, 0, 2 * Math.PI);
        context.fillStyle = "black"; //color 
        context.fill();
        context.beginPath();

        context.beginPath();
        context.moveTo(center.x - 20, center.y + 17);
        context.lineTo(center.x, center.y + 17);
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.stroke();
    }

    if (monster_diraction == 1)//up
    {

    }
    if (monster_diraction == 2)//down
    {
        context.beginPath();
        context.arc(center.x - 10, center.y + 5, 5, 0, 2 * Math.PI);
        context.fillStyle = "black"; //color 
        context.fill();

        context.beginPath();
        context.arc(center.x + 10, center.y + 5, 5, 0, 2 * Math.PI);
        context.fillStyle = "black"; //color 
        context.fill();
        context.beginPath();

        context.beginPath();
        context.moveTo(center.x - 17, center.y + 17);
        context.lineTo(center.x + 17, center.y + 17);
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.stroke();
    }


}
function DrawObstacles(center, i, j) {

    drawMyRect(center, -30, -30, 60, 60, 4, 4);
    if ((i == 0 || board[i - 1][j] != 4) && (j == 0 || board[i][j - 1] != 4) && (j + 1 == height || board[i][j + 1] != 4) && (i + 1 == width || board[i + 1][j] != 4)) {
        context.clearRect(center.x - 30, center.y - 30, 15, 15);
        drawMyArc(center, -15, -15, 15, 1 * Math.PI, 1.5 * Math.PI, 4);
        context.clearRect(center.x + 15, center.y - 30, 15, 15);
        drawMyArc(center, +15, -15, 15, 1.5 * Math.PI, 0, 4);
        context.clearRect(center.x - 30, center.y + 15, 15, 15);
        drawMyArc(center, -15, +15, 15, 0.5 * Math.PI, Math.PI, 4);
        context.clearRect(center.x + 15, center.y + 15, 15, 15);
        drawMyArc(center, +15, +15, 15, 0, 0.5 * Math.PI, 4);
    } else {
        if (board[i - 1][j] != 4 && board[i][j - 1] != 4 && board[i][j + 1] != 4) // Don't have obstacles on the left
        {
            context.clearRect(center.x - 30, center.y - 30, 20, 60);
            drawMyElipse(center, -10, 0, 30, 20, 90 * Math.PI / 180, 0, Math.PI);
        }

        if (board[i + 1][j] != 4 && board[i][j - 1] != 4 && board[i][j + 1] != 4) // Don't have obstacles on the right
        {
            context.clearRect(center.x + 10, center.y - 30, 20, 60);
            drawMyElipse(center, 10, 0, 30, 20, 90 * Math.PI / 180, Math.PI, 0);
        }

        if (board[i][j - 1] != 4 && board[i - 1][j] != 4 && board[i + 1][j] != 4) // Don't have obstacles up
        {
            context.clearRect(center.x - 30, center.y - 30, 60, 20);
            drawMyElipse(center, 0, -10, 20, 30, 90 * Math.PI / 180, 0.5 * Math.PI, 1.5 * Math.PI);
        }

        if (board[i][j + 1] != 4 && board[i - 1][j] != 4 && board[i + 1][j] != 4) // Don't have obstacles down
        {
            context.clearRect(center.x - 30, center.y + 10, 60, 20);
            drawMyElipse(center, 0, 10, 20, 30, 90 * Math.PI / 180, 1.5 * Math.PI, 0.5 * Math.PI);

        }
        if (board[i - 1][j] == 4) {//left
            context.clearRect(center.x - 30, center.y - 30, 20, 60);
            drawMyRect(center, -30, -30, 20, 60, 0, 4);
        }
        if (board[i + 1][j] == 4) {//right
            context.clearRect(center.x + 10, center.y - 30, 20, 60);
            drawMyRect(center, 10, -30, 20, 60, 0, 4);
        }
        if (board[i][j - 1] == 4) {//up
            context.clearRect(center.x - 30, center.y - 30, 60, 20);
            drawMyRect(center, -30, -30, 60, 20, 4, 0);
        }

        if (board[i][j + 1] == 4) {//down
            context.clearRect(center.x - 30, center.y + 10, 60, 20);
            drawMyRect(center, -30, 10, 60, 20, 4, 0);
        }
    }


}

function drawMyArc(center, x, y, radius, startAngle, endAngle, margin) {
    context.beginPath();
    context.arc(center.x + x, center.y + y, radius, startAngle, endAngle);
    context.lineTo(center.x + x, center.y + y);
    context.fillStyle = "#46128e"; //color 
    context.fill();
    context.beginPath();
    context.arc(center.x + x, center.y + y, radius - margin, startAngle, endAngle);
    context.lineTo(center.x + x, center.y + y);
    context.fillStyle = "black"; //color 
    context.fill();
}
function drawMyRect(center, x, y, width, height, w, h) {
    context.beginPath();
    context.rect(center.x + x, center.y + y, width, height);
    context.fillStyle = "#46128e"; //color 
    context.fill();
    context.beginPath();
    context.rect(center.x + x + w, center.y + y + h, width - 2 * w, height - 2 * h);
    context.fillStyle = "black"; //color 
    context.fill();
}

function drawMyElipse(center, x, y, radiusX, radiusY, rotation, startAngle, endAngle) {
    context.beginPath();
    context.ellipse(center.x + x, center.y + y, radiusX, radiusY, rotation, startAngle, endAngle);
    context.fillStyle = "#46128e"; //color 
    context.fill();
    context.beginPath();
    context.ellipse(center.x + x, center.y + y, radiusX - 4, radiusY - 4, rotation, startAngle, endAngle);
    context.fillStyle = "black"; //color 
    context.fill();
}

function DrawBoard() {
    // context.beginPath();
    // context.rect(0, 0, width*60, height*60);
    // context.fillStyle = "blue"; //color 
    // context.fill();
    // context.clearRect(4, 4, width*60-8, height*60-8);


}
function DrawByMonstersupdate() {
    Draw(true);
}
function Draw(alertable) {
    // console.log(board);
    canvas.width = canvas.width; //clean board
    DrawBoard();
    // console.log(sprite);
    $(lblScore).val(score);
    if(Math.floor(total_time_to_play-time_elapsed) >= 0 ){
        $(lblTime).val(Math.floor(total_time_to_play-time_elapsed));
    }
    else{
        $(lblTime).val(0);
        life=0;
            // game.isStop = true;
            //draw(false);
            if(alertable){
                if(score < 150)
                    endLevel("You can do better!");
                else
                    endLevel("We have a Winner!!!");
            }

        }
    // context.drawImage(sprite,0,0,canvas.width,canvas.height);
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] == 2) {
                DrawPackmen(center);
            } else if (board[i][j] == 5 || board[i][j] == 15 || board[i][j] == 25 ) {
                var foodType =board[i][j];
                DrawFood(center,foodType);
            }
            else if (board[i][j] == 4) {
                // console.log("DrawObstacles : "+i+","+j);
                DrawObstacles(center, i, j)
            }else if (board[i][j] == 3){
                DrawHeart(center);
            }else if (board[i][j] == 6){
                DrawClock(center);
            }
        }
    }
    if (!moveableFood.eated)
        DrawMoveableFood(moveableFood.i,moveableFood.j);
    for (var i = 0; i < monsters_counter; i++) {
        var positionX = monsters[i][0];
        var positionY = monsters[i][1];
        var monster_diraction = monsters[i][2];
        var monster_color = monsters[i][5];
        DrawMonster(positionX, positionY, monster_diraction, monster_color);
        if (positionX - shape.i == 0 && positionY - shape.j == 0) {
			// game.isStop = true;
            if(alertable){
                document.getElementById("deathAudio").play();;
                endLevel("You Lost!");
    			// window.clearInterval(interval);
    			// window.alert("basted");
    			console.log("monster "+ monster_color +"catch you")
            }
        }
    }
    // initHarts();
}

function endLevel(msg) {
    life--;
    initHarts();
    window.clearInterval(interval.monsters);
    window.clearInterval(interval.pacman);

    console.log(msg);
        // game.isStop = false;
        
        if(life > 0){
            // game.resson = "";
            StartNewLevel();
        }else{
            // game.isStart=false;
            document.getElementById("soundtrack").load();
			document.getElementById("soundtrack5").load();
            document.getElementById("soundtrack").pause();
			document.getElementById("soundtrack5").pause();
            Draw(false);
            window.alert(msg);
            game.isStart=false;

        }
    }
    function DrawFood(center,foodType){
     context.beginPath();
     if (foodType == 5){
        var my_gradient=context.createLinearGradient(center.x-15,center.y-15,center.x+15,center.y+15);
        my_gradient.addColorStop(0.5,"#a03f35");
        my_gradient.addColorStop(1,"white");
        context.fillStyle=my_gradient;
        context.arc(center.x, center.y, 15, 0, 2 * Math.PI); 
        context.fill();
        context.font = '22px myFont';
        context.textAlign = 'center';
        context. textBaseline = 'middle';
        context.fillStyle = 'black';
        context.fillText('5', center.x, center.y); 
    }else if (foodType == 15){
        var my_gradient=context.createLinearGradient(center.x-20,center.y-20,center.x+20,center.y+20);
        my_gradient.addColorStop(0.5,"#37a868");
        my_gradient.addColorStop(1,"white");
        context.fillStyle=my_gradient;
        context.arc(center.x, center.y, 20, 0, 2 * Math.PI); 
        context.fill();		
        context.font = '22px myFont';
        context.textAlign = 'center';
        context. textBaseline = 'middle';
        context.fillStyle = 'black'; 
        context.fillText('15', center.x, center.y);
    }else if (foodType == 25){
      var my_gradient=context.createLinearGradient(center.x-25,center.y-25,center.x+25,center.y+25);
      my_gradient.addColorStop(0.5,"#298e9b");
      my_gradient.addColorStop(1,"white");
      context.fillStyle=my_gradient;
      context.arc(center.x, center.y, 25, 0, 2 * Math.PI); 
      context.fill();     
      context.font = '22px myFont';
      context.textAlign = 'center';
      context. textBaseline = 'middle';
      context.fillStyle = 'black'; 
      context.fillText('25', center.x, center.y);
  }

    //context.fill();
}

function UpdatePosition() {
    if (game.isStart) {
        // console.log("move" + diraction);
        board[shape.i][shape.j] = 0;
        //var x = GetKeyPressed();
        var x = diraction;

        if (x == 1)//up
        {
            if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
                shape.j--;
            }
        }

        if (x == 2)//down
        {
            if (shape.j < height - 1 && board[shape.i][shape.j + 1] != 4) {
                shape.j++;
            }
        }

        if (x == 3)//left
        {
            if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
                shape.i--;
            }
        }
        if (x == 4)//right
        {
            if (shape.i < width - 1 && board[shape.i + 1][shape.j] != 4) {
                shape.i++;
            }
        }
        if (board[shape.i][shape.j] == 5 || board[shape.i][shape.j] == 15 || board[shape.i][shape.j] == 25) {
            score+=board[shape.i][shape.j];
            food_remain.all--;
            document.getElementById("eatAudio").pause();
            document.getElementById("eatAudio").load();
            document.getElementById("eatAudio").play();
        }
        if (!moveableFood.eated && shape.i == moveableFood.i && shape.j==moveableFood.j){
            score+=50;
            moveableFood.eated=true;
            document.getElementById("eatfruitAudio").play();
        }
        if (board[shape.i][shape.j] == 3 ) {
            life++;
            initHarts();
            document.getElementById("eatheartAudio").play();
        }
        if (board[shape.i][shape.j] == 6 ) {
            total_time_to_play+=10;
            document.getElementById("eatclockAudio").play();
            var emptyCell = findRandomEmptyCell(board);
            board[emptyCell[0]][emptyCell[1]] = 6;
        }
        board[shape.i][shape.j] = 2;
        var currentTime = new Date();
        time_elapsed = (currentTime - start_time) / 1000 + time_elapsed_prev;
        // if (score >= 20 && time_elapsed <= 10) {
        //     pac_color = "green";
        // }

    }
    Draw(true);
    if (game.isStart) {
        if ( food_remain.all == 0) {
            // game.isStop = true;
            life=0;
            Draw(false);
            endLevel("We have a Winner!!!");
            // window.clearInterval(interval);
            // window.alert("Game completed");
        }
        // if (total_time_to_play-time_elapsed < 1) {
        //     $(lblTime).val(0);
        //     life=0;
        //     // game.isStop = true;
        //     if(score < 150)
        //         endLevel("You can do better!");
        //     else
        //         endLevel("We have a Winner!!!");
        // }
    }

}

function UpdateMonsterSPosition() {
    if (game.isStart ) {
        for (var i = 0; i < monsters_counter; i++) {
           if (game.isStart ) {
            UpdateMonsterPosition(i);
        }
    }
}
MoveMoveableFood();
DrawByMonstersupdate();
}
function UpdateMonsterPosition(MonsterIndex) {
    var positionX = monsters[MonsterIndex][0];
    var positionY = monsters[MonsterIndex][1];
    var monster_diraction = monsters[MonsterIndex][2];
    var monster_lastpositionX = monsters[MonsterIndex][3];
    var monster_lastpositionY = monsters[MonsterIndex][4];
    var monster_color = monsters[MonsterIndex][5];
    var x = positionX - shape.i;
    var y = positionY - shape.j;
    // console.log(positionX + "-" + shape.i + "=" + x + " , " + positionY + "-" + shape.j + "=" + y);
    var wasUpdate = false;
    if (Math.abs(x) > Math.abs(y)) {
        if (x > 0)//left
        {
            if (positionX > 0 && board[positionX - 1][positionY] != 4) {
                var hasMonster = false;
                for (var i = 0; !hasMonster && i < monsters_counter; i++) {
                    if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX - 1 && monsters[i][1] == positionY)
                        hasMonster = true;
                }
                if (!hasMonster && (monster_lastpositionX != positionX-1 || monster_lastpositionY!=positionY)) {
                    monster_lastpositionX= positionX;
                    monster_lastpositionY=positionY;
                    positionX--;
                    monster_diraction = 3;
                    wasUpdate = true;
                }
            }
        }
        else//right
        {
            if (positionX < width - 1 && board[positionX + 1][positionY] != 4) {
                var hasMonster = false;
                for (var i = 0; !hasMonster && i < monsters_counter; i++) {
                    if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX + 1 && monsters[i][1] == positionY)
                        hasMonster = true;
                }
                if (!hasMonster && (monster_lastpositionX != positionX+1 || monster_lastpositionY!=positionY)) {
                    monster_lastpositionX= positionX;
                    monster_lastpositionY=positionY;
                    positionX++;
                    monster_diraction = 4;
                    wasUpdate = true;
                }
            }
        }
    }

    if ( !wasUpdate) {
        if (y > 0 && positionY > 0 && board[positionX][positionY - 1] != 4)//up
        {
            var hasMonster = false;
            for (var i = 0; !hasMonster && i < monsters_counter; i++) {
                if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX && monsters[i][1] == positionY - 1)
                    hasMonster = true;
            }
            if (!hasMonster && (monster_lastpositionX != positionX || monster_lastpositionY!=positionY-1)) {
                monster_lastpositionX= positionX;
                monster_lastpositionY=positionY;
                positionY--;
                monster_diraction = 1;
                wasUpdate = true;
            }
        }

        if ( !wasUpdate) {
            if (positionY < height - 1 && board[positionX][positionY + 1] != 4) {
                var hasMonster = false;
                for (var i = 0; !hasMonster && i < monsters_counter; i++) {
                    if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX && monsters[i][1] == positionY + 1)
                        hasMonster = true;
                }
                if (!hasMonster && (monster_lastpositionX != positionX || monster_lastpositionY!=positionY+1)) {
                    monster_lastpositionX= positionX;
                    monster_lastpositionY=positionY;
                    positionY++;
                    monster_diraction = 2;
                    wasUpdate = true;
                }
                
            }
        }
    }
    
    if (!wasUpdate) {
        if (x > 0 && positionX > 0 && board[positionX - 1][positionY] != 4)//left
        {
            var hasMonster = false;
            for (var i = 0; !hasMonster && i < monsters_counter; i++) {
                if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX - 1 && monsters[i][1] == positionY)
                    hasMonster = true;
            }
            if (!hasMonster && (monster_lastpositionX != positionX-1 || monster_lastpositionY!=positionY)) {
                monster_lastpositionX= positionX;
                monster_lastpositionY=positionY;
                positionX--;
                monster_diraction = 3;
                wasUpdate = true;
            }
        }
        if (!wasUpdate)//right
        {
            if (positionX < width - 1 && board[positionX + 1][positionY] != 4) {
                var hasMonster = false;
                for (var i = 0; !hasMonster && i < monsters_counter; i++) {
                    if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX + 1 && monsters[i][1] == positionY)
                        hasMonster = true;
                }
                if (!hasMonster && (monster_lastpositionX != positionX+1 || monster_lastpositionY!=positionY)) {
                    monster_lastpositionX= positionX;
                    monster_lastpositionY=positionY;
                    positionX++;
                    monster_diraction = 4;
                    wasUpdate = true;
                }
            }
        }
    }
    if (!wasUpdate){
        justMoveMonster(MonsterIndex);
    }else{
        monsters[MonsterIndex][2] = monster_diraction;
        monsters[MonsterIndex][3] = monster_lastpositionX;
        monsters[MonsterIndex][4] =  monster_lastpositionY;
        monsters[MonsterIndex][0] = positionX;
        monsters[MonsterIndex][1] = positionY;
    }
    // if (!wasUpdate) console.log("the monster_diraction not update")

    // if (positionX - shape.i == 0 && positionY - shape.j == 0) {
        // game.isStop = true;
        // game.resson = "basted";
        // // window.clearInterval(interval);
        // // window.alert("basted");
        // console.log("monster "+ monster_color +"catch you")
    // }
    DrawByMonstersupdate();
}

function justMoveMonster(MonsterIndex) {
    var positionX = monsters[MonsterIndex][0];
    var positionY = monsters[MonsterIndex][1];
    var monster_diraction = monsters[MonsterIndex][2];
    var monster_lastpositionX = monsters[MonsterIndex][3];
    var monster_lastpositionY = monsters[MonsterIndex][4];
    var wasUpdate = false;
    if (positionX > 0 && board[positionX - 1][positionY] != 4) {
        var hasMonster = false;
        for (var i = 0; !hasMonster && i < monsters_counter; i++) {
            if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX - 1 && monsters[i][1] == positionY)
                hasMonster = true;
        }
        if (!hasMonster && (monster_lastpositionX != positionX-1 || monster_lastpositionY!=positionY)) {
            monster_lastpositionX= positionX;
            monster_lastpositionY=positionY;
            positionX--;
            monster_diraction = 3;
            wasUpdate = true;
        }
    }

    if (!wasUpdate && positionX < width - 1 && board[positionX + 1][positionY] != 4) {
        var hasMonster = false;
        for (var i = 0; !hasMonster && i < monsters_counter; i++) {
            if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX + 1 && monsters[i][1] == positionY)
                hasMonster = true;
        }
        if (!hasMonster && (monster_lastpositionX != positionX+1 || monster_lastpositionY!=positionY)) {
            monster_lastpositionX= positionX;
            monster_lastpositionY=positionY;
            positionX++;
            monster_diraction = 4;
            wasUpdate = true;
        }
    }
       if (!wasUpdate && positionY > 0 && board[positionX][positionY - 1] != 4)//up
       {
        var hasMonster = false;
        for (var i = 0; !hasMonster && i < monsters_counter; i++) {
            if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX && monsters[i][1] == positionY - 1)
                hasMonster = true;
        }
        if (!hasMonster && (monster_lastpositionX != positionX || monster_lastpositionY!=positionY-1)) {
            monster_lastpositionX= positionX;
            monster_last2diraction=positionY;
            positionY--;
            monster_diraction = 1;
            wasUpdate = true;
        }
    }

    if ( !wasUpdate && positionY < height - 1 && board[positionX][positionY + 1] != 4) {
        var hasMonster = false;
        for (var i = 0; !hasMonster && i < monsters_counter; i++) {
            if (MonsterIndex!=i && !hasMonster && monsters[i][0] == positionX && monsters[i][1] == positionY + 1)
                hasMonster = true;
        }
        if (!hasMonster && (monster_lastpositionX != positionX || monster_lastpositionY!=positionY+1)) {
            monster_lastpositionX= positionX;
            monster_lastpositionY=positionY;
            positionY++;
            monster_diraction = 2;
            wasUpdate = true;
        }

    }
    if(!wasUpdate){
        var x = positionX;
        var y = positionY;
        positionX = monster_lastpositionX;
        positionY = monster_lastpositionY;
        monster_lastpositionX = x;
        monster_lastpositionY = y;
        //right
        if (positionX > monster_lastpositionX) monster_diraction= 4 ;
        //left
        if (positionX < monster_lastpositionX) monster_diraction= 3 ;
        //down
        if (positionY > monster_lastpositionY) monster_diraction= 1 ;
        //up
        if (positionY < monster_lastpositionY) monster_diraction= 2 ;
    }
    monsters[MonsterIndex][2] = monster_diraction;
    monsters[MonsterIndex][3] = monster_lastpositionX;
    monsters[MonsterIndex][4] =  monster_lastpositionY;
    monsters[MonsterIndex][0] = positionX;
    monsters[MonsterIndex][1] = positionY;
    
    
}
function MoveMoveableFood() {
    var positionX = moveableFood.i;
    var positionY = moveableFood.j;
    // var monster_diraction = monsters[MonsterIndex][2];
    var lastpositionX = moveableFood.lasti;
    var lastpositionY = moveableFood.lastj;
    var wasUpdate = false;
    // console.log(moveableFood);
    if (positionX > 0 && board[positionX - 1][positionY] != 4 && (lastpositionX!=positionX-1 || lastpositionY!=positionY) ) {
        lastpositionX=positionX;
        lastpositionY=positionY;
        positionX--;
                    // monster_diraction = 3;
                    wasUpdate = true;

                }

                if (!wasUpdate && positionX < width - 1 && board[positionX + 1][positionY] != 4 && (lastpositionX!=positionX+1 || lastpositionY!=positionY)) {
                    lastpositionX=positionX;
                    lastpositionY=positionY;
                    positionX++;
                    // monster_diraction = 4;
                    wasUpdate = true;

                }
       if (!wasUpdate && positionY > 0 && board[positionX][positionY - 1] != 4 && (lastpositionX!=positionX || lastpositionY!=positionY-1))//up
       {
        lastpositionX=positionX;
        lastpositionY=positionY;
        positionY--;
                    // monster_diraction = 1;
                    wasUpdate = true;
                }

                if ( !wasUpdate && positionY < height - 1 && board[positionX][positionY + 1] != 4 && (lastpositionX!=positionX || lastpositionY!=positionY+1)) {
                    lastpositionX=positionX;
                    lastpositionY=positionY;
                    positionY++;
                        // monster_diraction = 2;
                        wasUpdate = true;


                    }

                    moveableFood.i = positionX;
                    moveableFood.j = positionY;
                    moveableFood.lasti = lastpositionX;
                    moveableFood.lastj = lastpositionY;
                    if (!moveableFood.eated && shape.i == moveableFood.i && shape.j==moveableFood.j){
                        score+=50;
                        moveableFood.eated=true;
                        document.getElementById("eatfruitAudio").play();
                    }
        // DrawMoveableFood(positionX,positionY);

    }
////////////////////////////////////////////////////////////////////
var Users;
var Passwords;
$(document).ready(function () {
    Users = ["a", "test2017"];
    Passwords = ["a", "test2017"];
    $("#Login_form").submit(function (e) {
        e.preventDefault();
    });
    $('#Register_form').validate({
      rules: {
        usname: {
            required:true,
            usnamecheck:true
        },
        pasw: {
            required: true,
            pwcheck: true,
            minlength: 8

        },
        fname:{
            required: true,
            namecheck: true
        },
        lname:{
            required: true,
            namecheck: true
        },
        email:"required",
        bday:"required"
    },
    messages: {
     pasw: {
        pwcheck: "- Must contain letters and numbers"
    },
    lname:{
        namecheck: "- Can not include numbers"
    },
    fname:{
        namecheck: "- Can not include numbers"
    },
    usname:{
        usnamecheck: "- This username already exist"
    },
}
});

    $.validator.addMethod("pwcheck", function(value) {
   return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
       && /[a-zA-Z]/.test(value) // has a letter
       && /\d/.test(value) // has a digit
   });
    $.validator.addMethod("namecheck", function(value) {
        if(/[0-9]/.test(value))
            return false;
        else return true;
    });
    $.validator.addMethod("usnamecheck", function(value) {
        if(Users.indexOf(value)>=0)
            return false;
        else return true;
    });
    $(function () {
        $('#Register_form').submit(function () {
            if($(this).valid()) {
                var _Password = $('#pasw').val();
                var _UserName = $('#usname').val();
                Users.push(_UserName);
                Passwords.push(_Password);
                alert('submission completed');
                menu('Login');
            }
        });
    });
});
function about() {
    menu('About');
    document.getElementById('About').style.display = 'block';
}
function menu(nav) {
    $('#m_Register').removeClass('active');
    $('#m_Login').removeClass('active');
    $('#m_About').removeClass('active');
    $('#m_' + nav).addClass('active');
    hide();
    if (nav == 'Welcome') {
        document.getElementById('menu').style.visibility = 'collapse';
        document.getElementById('header').style.visibility = 'collapse';
        document.getElementById('footer').style.visibility = 'collapse';
        $('#Welcome').show();
    }
    else {
        document.getElementById('menu').style.visibility = 'visible';
        document.getElementById('header').style.visibility = 'visible';
        document.getElementById('footer').style.visibility = 'visible';
    }
    $('#' + nav).show();
    document.getElementById(nav).style.visibility = 'visible';
    if(nav=='Register' || nav =='Login'){
        $('#show_name').text('');
    }
}
function hide() {
    if(game) resetGame();
    $('#Welcome').hide();
    $('#Register').hide();
    $('#Login').hide();
    $('#About').hide();
    $('#pacman_form').hide();
    $('#game_pac').hide();
    cleanInputs();
}       
function cleanInputs(){
  $('#Register_form')[0].reset();
  $('#Login_form')[0].reset();
}
function login() {
    var usrename = $(document.getElementsByName('uname')).val();
    var password = $(document.getElementsByName('psw')).val();
    var index = Users.indexOf(usrename);/*if isn't in array -1*/
    if (index >= 0) {
        if(password==Passwords[index]){
            $('#show_name').text('Welcome ' +usrename);
            showGame();
        }else{
            alert('Password not valid');
        }        
    } else {
        alert('Username not found');
    }
}
function showGame() {
    hide(); 
    $('#pacman_form').show();
    document.getElementById('pacman_form').style.visibility = 'visible';
    afterLogin();
}
function DrawHeart(center) { 
    var img=document.getElementById("heartimg");
    context.drawImage(img,center.x-30,center.y-30, 55,55);
}
function DrawClock(center) { 
    var img=document.getElementById("clockimg");
    context.drawImage(img,center.x-30,center.y-30, 55,55);
}
