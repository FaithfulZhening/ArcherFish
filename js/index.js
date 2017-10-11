/**
 * Created by Zhening on 2017/10/9.
 */
$(document).ready(function(){

    //these are the variable used to control fps
<<<<<<< HEAD
<<<<<<< HEAD
    let stop = false;
    let frameCount = 0;
    let fps = 100, fpsInterval, startTime, now, then, elapsed;
=======
    var stop = false;
    var frameCount = 0;
    var fps = 60, fpsInterval, startTime, now, then, elapsed;
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======
    var stop = false;
    var frameCount = 0;
    var fps = 60, fpsInterval, startTime, now, then, elapsed;
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1

    // initialize the timer variables and start the animation
    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }

<<<<<<< HEAD
<<<<<<< HEAD
    let gravity = 1.5/fps;
=======

>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======

>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
    //this var records fishbowl coordinates
    let fishbowl = {
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

    let fish = {
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

<<<<<<< HEAD
<<<<<<< HEAD
    let bugMeta = {
=======
    var bugMeta = {
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======
    var bugMeta = {
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
        img : new Image(),
        collider : {
            xOffset : 0,
            yOffset : 0
        }
<<<<<<< HEAD
<<<<<<< HEAD
    }

    let dropletMeta = {
        size1 : 4,
        size1Speed : 100/fps,
        size2 : 5,
        size2Speed : 90/fps,
        size3 : 6,
        size3Speed : 85/fps,
        size1Collider:{},
        size2Collider:{},
        size3Collider:{}
    }

    //wind speed will be the speed of bug, its the pixel the bugs move per frame
    let wind = {
        speed : 0
    }

    let bugs = [];
    let bugCnt = 0;
    let droplets = [];
    let dropletsCnt = 0;
    let waterLine;
=======
    }

    //wind speed will be the speed of bug, its the pixel the bugs move per frame
    var wind = {
        speed : 0
    }

=======
    }

    //wind speed will be the speed of bug, its the pixel the bugs move per frame
    var wind = {
        speed : 0
    }

>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
    var bugs = {}
    var bugCnt = 0;

    var waterLine;
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1

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

<<<<<<< HEAD
<<<<<<< HEAD
            let canvas = document.getElementById('canvas');
            let ctx = canvas.getContext("2d");
=======
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext("2d");
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext("2d");
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
            ctx.clearRect(0, 0, 700, 700); // clear canvas
            //draw fishBowl
            drawFishBowl(ctx);
            //draw waterline
            drawWaterLine();
            //if angle > 0, rotate fish
            if (fish.angle != 0){
<<<<<<< HEAD
<<<<<<< HEAD
                //let cache = fish.img;
=======
                var cache = fish.img;
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======
                var cache = fish.img;
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
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
<<<<<<< HEAD
<<<<<<< HEAD
            displayDropletMovement(ctx);
=======
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
        }






    }

    function checkKey(e) {
<<<<<<< HEAD
<<<<<<< HEAD
        e = e || window.event;
=======

        e = e || window.event;

>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======

        e = e || window.event;

>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
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
<<<<<<< HEAD
<<<<<<< HEAD
            let check = detectFishMoveLeft();
=======
            var check = detectFishMoveLeft();
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======
            var check = detectFishMoveLeft();
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
            if (check) {
                fish.xPos -= 2;
            }
        }
        //d
        else if (e.keyCode == '68') {
<<<<<<< HEAD
<<<<<<< HEAD
            let check = detectFishMoveRight();
=======
            var check = detectFishMoveRight();
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======
            var check = detectFishMoveRight();
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
            if (check) {
                fish.xPos += 2;
            }
        }
<<<<<<< HEAD
<<<<<<< HEAD
        //space
        else if (e.keyCode == '32'){
            console.log("space is pressed")
            shootDroplet();
        }

    }
    /**
     * Used to calculate the waterline points
     * codes from http://www.somethinghitme.com/2013/11/11/simple-2d-terrain-with-midpoint-displacement/
     *
     * width and height are the overall width and height we have to work with, displace is
     * the maximum deviation value. This stops the terrain from going out of bounds if we choose
     * */
=======
=======
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1

    }
        /**
         * Used to calculate the waterline points
         * codes from http://www.somethinghitme.com/2013/11/11/simple-2d-terrain-with-midpoint-displacement/
         *
         * width and height are the overall width and height we have to work with, displace is
         * the maximum deviation value. This stops the terrain from going out of bounds if we choose
         * */
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
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
<<<<<<< HEAD
<<<<<<< HEAD
        bugs[bugCnt] = {
            xPos : 0,
            yPos : 200,
            collider : bugMeta.collider
        };
        bugCnt++;
        //console.log(bugs[0].xPos);
=======
=======
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
        bugCnt++;
        bugs[bugCnt] = {
            xPos : 0,
            yPos : 50,
            collider : bugMeta.collider
        };
        //console.log(bugCnt);
<<<<<<< HEAD
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
=======
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
    }

    //generate windSpeed, the speed of wind is the speed of bug
    function generateWind(){
        time = Math.random() * 1000 + 1000;
        //the range would result in a bug taking 2s to 10s to cross the screen
        //the game area has length 700, so the speed should between 70 and 350 per second
        //so the wind spped will be (70 ~ 350) / frame per second
        wind.speed = (Math.random() * 280 + 70)/fps;
<<<<<<< HEAD
<<<<<<< HEAD
        //console.log(wind.speed);
        setTimeout(function(){
            generateWind();
            $("#speed").text("Wind Speed:" +　wind.speed);
=======
        console.log(wind.speed);
        setTimeout(function(){
            generateWind();
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
            //console.log(wind.speed);
        },time);
=======
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
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
    }

<<<<<<< HEAD
    //calculate and display bug movement
    function displayBugMovement(ctx){
        for (let x = 0; x < bugs.length; x++){
            bugs[x].xPos += wind.speed;
            ctx.drawImage(bugMeta.img,bugs[x].xPos,bugs[x].yPos,30,30*bugMeta.img.height/bugMeta.img.width);
        }
    }

    function shootDroplet(){
        droplets[dropletsCnt] = new Droplet(dropletMeta.size1,dropletMeta.size1Collider,fish.xPos + 50,fish.yPos - 25,dropletMeta.size1Speed);
        droplets[dropletsCnt + 1] = new Droplet(dropletMeta.size2,dropletMeta.size2Collider,fish.xPos + 45,fish.yPos - 15,dropletMeta.size2Speed);
        droplets[dropletsCnt + 2] = new Droplet(dropletMeta.size3,dropletMeta.size3Collider,fish.xPos + 55,fish.yPos - 5,dropletMeta.size3Speed);
        dropletsCnt += 3;
=======
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
>>>>>>> 6b7f53150aec8b01de284cf07e96fd6d819168e1
    }

    //calculate and display all droplets
    function displayDropletMovement(ctx){
        for (let i = 0; i  < dropletsCnt; i++){
            if (droplets[i].exist === true){
                //draw the position of droplet
                ctx.beginPath();
                ctx.arc(droplets[i].xPos,droplets[i].yPos + 5,droplets[i].size,0,2*Math.PI);
                ctx.stroke();
                console.log(dropletsCnt);
                //calculate the position in next frame
                droplets[i].ySpeed -= gravity;
                droplets[i].yPos -= droplets[i].ySpeed;
                //Droplet motion must also be affected by wind, once above the top of the bowl.
                if ( droplets[i].yPos < 282.44) {
                    droplets[i].xSpeed += wind.speed/30;
                }
                droplets[i].xPos += droplets[i].xSpeed;
            }
        }
    }

    function detectDropletBugCollision(bug){
        
    }

    class Droplet{
        constructor(size,collider,xPos,yPos,speed){
            this.size = size;
            this.collider = collider;
            this.angle = fish.angle;
            this.exist = true;
            this.xSpeed = speed*Math.sin(this.angle);
            //reduce the angle's impact on vertical speed
            this.ySpeed = speed*Math.cos(this.angle) + 200/fps;
            if (this.angle >= 0){
                this.xPos = xPos + 35 * Math.sin(this.angle);
            }else{
                this.xPos = xPos + 60 * Math.sin(this.angle);
            }

            this.yPos = yPos - 30 * Math.cos(this.angle) + 30;
        }
    }

    init();
});