/**
 * Created by Zhening on 2017/10/9.
 */
$(document).ready(function(){

    //these are the variable used to control fps
    var stop = false;
    var frameCount = 0;
    var fps = 60, fpsInterval, startTime, now, then, elapsed;

    // initialize the timer variables and start the animation
    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }


    //this var records fishbowl coordinates
    var fishbowl = {
        centerX: 350,
        centerY: 400,
        radius:200,
        leftDownX:208,
        leftDownY:540,
        rightDownX:491.41,
        rightDownY:540,
        leftUpX:188.196,
        leftUpY:282.44,
        rightUpX:511.804,
        rightUpY:282.44,
        waterLeftX:160,
        waterRightX:540
    };

    var fish = {
        img : new Image(),
        xPos : 180,
        yPos : 450,
        angle : 0,
        //the fish collider will be a circle with one of the point
        collider:{
            xOffset: 0,
            yOffset : 50
        }
    }

    var bugMeta = {
        img : new Image(),
        collider : {
            xOffset : 0,
            yOffset : 0
        }
    }

    //wind speed will be the speed of bug, its the pixel the bugs move per frame
    var wind = {
        speed : 0
    }

    var bugs = {}
    var bugCnt = 0;

    var waterLine;

    function init(){
        var canvas = document.getElementById('canvas');
        canvas.height = 700;
        canvas.width = 700;
        fish.img.src = './css/fish.png';
        bugMeta.img.src = './css/bug.png';
        waterLine = calWaterLine(500,950,50,0.5);

        generateBugs();
        generateWind();

        startAnimating(fps);
    }

    //draw fishbowl in canvas
    function drawFishBowl(ctx){
        ctx.beginPath();
        ctx.lineWidth="9";
        ctx.moveTo(530,280);
        ctx.arc(350, 400, 200, 1.8*Math.PI, 0.25 * Math.PI);
        ctx.arc(350, 400, 200, 0.75*Math.PI, 1.2 * Math.PI);
        ctx.lineTo(170,280);
        ctx.stroke();
    }

    function animate() {

        // request another frame
        requestAnimationFrame(animate);
        // calc elapsed time since last loop
        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);

            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, 700, 700); // clear canvas
            //draw fishBowl
            drawFishBowl(ctx);
            //draw waterline
            drawWaterLine();
            //if angle > 0, rotate fish
            if (fish.angle != 0){
                var cache = fish.img;
                // save the unrotated context of the canvas so we can restore it later
                ctx.save();
                ctx.translate(fish.xPos+50, fish.yPos+50);
                ctx.rotate(fish.angle);
                ctx.drawImage(fish.img,-50,-50, 100, 100 * fish.img.height / fish.img.width);
                ctx.restore();
            }
            else {
                ctx.drawImage(fish.img, fish.xPos,fish.yPos, 100, 100 * fish.img.height / fish.img.width);
            }

            document.onkeydown = checkKey;
            displayBugMovement(ctx);
        }






    }

    function checkKey(e) {

        e = e || window.event;

        //w
        if (e.keyCode == '87') {
            if (fish.angle > -60 * Math.PI / 180){
                fish.angle -= 5 * Math.PI / 180;
            }
        }
        //s
        else if (e.keyCode == '83') {
            if (fish.angle < 60 * Math.PI / 180){
                fish.angle += 5 * Math.PI / 180;
            }
        }
        //a
        else if (e.keyCode == '65') {
            //check if the fish can continue to move
            var check = detectFishMoveLeft();
            if (check) {
                fish.xPos -= 2;
            }
        }
        //d
        else if (e.keyCode == '68') {
            var check = detectFishMoveRight();
            if (check) {
                fish.xPos += 2;
            }
        }

    }
        /**
         * Used to calculate the waterline points
         * codes from http://www.somethinghitme.com/2013/11/11/simple-2d-terrain-with-midpoint-displacement/
         *
         * width and height are the overall width and height we have to work with, displace is
         * the maximum deviation value. This stops the terrain from going out of bounds if we choose
         * */
    function calWaterLine(width, height, displace, roughness) {
        var points = [],
            // Gives us a power of 2 based on our width
            power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

        // Set the initial left point
        points[0] = height / 2 + (Math.random() * displace * 0.2) - displace * 0.2;
        // set the initial right point
        points[power] = height / 2 + (Math.random() * displace * 0.2) - displace * 0.2;
        displace *= roughness;

        // Increase the number of segments
        for (var i = 1; i < power; i *= 2) {
            // Iterate through each segment calculating the center point
            for (var j = (power / i) / 2; j < power; j += power / i) {
                points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2);
                points[j] += (Math.random() * displace * 2) - displace
            }
            // reduce our random range
            displace *= roughness;
        }
        return points;
    }

    function drawWaterLine(){
        var ctx = document.getElementById('canvas').getContext("2d");
        ctx.beginPath();
        ctx.lineWidth="2";
        ctx.moveTo(160,waterLine[0]);
        for (var i = 0; i < 380; i ++){
            ctx.lineTo(160 + i,waterLine[i]);
        }
        ctx.strokeStyle = "rgb(36, 165, 255)";
        ctx.stroke();
    }

    //dectect if fish can move to left
    function detectFishMoveLeft(){
        if (fish.xPos <= fishbowl.waterLeftX )return false;
        return true;
    }

    //detect if fish can move to right
    function detectFishMoveRight(){
        if (fish.xPos + 100 >= fishbowl.waterRightX)return false;
        return true;
    }

    //generate every 3-5 seconds
    function generateBugs() {
        time = Math.random() * 3000 + 2000;
        setTimeout(function () {
            createBug();
            generateBugs();
            //console.log("Bug");
        },time)

    }

    //create a bug and store it in an array called bugs
    function createBug(){
        bugCnt++;
        bugs[bugCnt] = {
            xPos : 0,
            yPos : 50,
            collider : bugMeta.collider
        };
        //console.log(bugCnt);
    }

    //generate windSpeed, the speed of wind is the speed of bug
    function generateWind(){
        time = Math.random() * 1000 + 1000;
        //the range would result in a bug taking 2s to 10s to cross the screen
        //the game area has length 700, so the speed should between 70 and 350 per second
        //so the wind spped will be (70 ~ 350) / frame per second
        wind.speed = (Math.random() * 280 + 70)/fps;
        console.log(wind.speed);
        setTimeout(function(){
            generateWind();
            //console.log(wind.speed);
        },time);
    }

    //calculate and display bug movement,
    function displayBugMovement(ctx){
        for (var x = 0; x < bugs.length; x++){
            bugs[x].xPos += wind.speed;
            console.log(bugs[x].xPos);
            ctx.drawImage(bugMeta.img,bugs[x].xPos,bugsp[x].yPos);
        }

        /**
        for (var fly in bugs){
            if (bugs.hasOwnProperty(fly)) {
                fly.xPos += wind.speed;
                console.log(fly.xPos);
                ctx.drawImage(bugMeta.img,fly.xPos,fly.yPos);
            }
        }
         */
    }
    init();


});