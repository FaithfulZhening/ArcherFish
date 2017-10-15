/**
 * Created by Zhening on 2017/10/9.
 */
$(document).ready(function(){

    //these are the variable used to control fps
    let stop = false;
    let frameCount = 0;
    let fps = 60, fpsInterval, startTime, now, then, elapsed;

    // initialize the timer variables and start the animation
    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }

    let gravity = 1/fps;
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
        xPos : 300,
        yPos : 460,
        angle : 0,
        //the fish collider will be a circle with one of the point
        collider:{
            xOffset: 0,
            yOffset : 50
        }
    }

    //bug's collider is a circle with radius 15
    let bugMeta = {
        img : new Image(),
        collider : {
            xOffset : 18,
            yOffset : 18,
            radius : 9
        }
    }

    let dropletMeta = {
        size1 : 4,
        size1Speed : 200/fps,
        size2 : 5,
        size2Speed : 180/fps,
        size3 : 6,
        size3Speed : 160 /fps,
        size1Collider:{
            radius : 4
        },
        size2Collider:{
            radius : 5
        },
        size3Collider:{
            radius : 6
        }
    }

    //wind speed will be the speed of bug, its the pixel the bugs move per frame
    let wind = {
        speed : 0
    }

    //let bugs = [];
    let bugs = {}

    let bugCnt = 0;
    let droplets = [];
    let dropletsCnt = 0;
    let waterLine;
    let leap = 0;
    //fire indicates if the player can shoot bubbles
    let fire = true;

    let fishBowlInter = {};
    let fishBowlExter = {};
    function init(){
        var canvas = document.getElementById('canvas');
        canvas.height = 700;
        canvas.width = 700;
        fish.img.src = './css/fish.png';
        bugMeta.img.src = './css/bug.png';
        waterLine = calWaterLine(500,950,35,0.6);
        calculateFishBowlBound();
        generateBugs();
        generateWind();

        startAnimating(fps);
    }

    //draw fishbowl in canvas
    function drawFishBowl(ctx){
        ctx.beginPath();
        ctx.lineWidth=10;
        ctx.moveTo(520,280);
        ctx.arc(350, 400, 200, 1.8*Math.PI, 0.25 * Math.PI);
        ctx.arc(350, 400, 200, 0.75*Math.PI, 1.2 * Math.PI);
        ctx.lineTo(180,280);
        ctx.stroke();

    }


    //calculate the bound of fish bowl
    function calculateFishBowlBound(){
        let y =0;
        //calculate the coordinates of fhishbowl inner bound using the circle equation
        // store them in object called fishBowlInter
        for (let x = 150; x < 209; x ++){
            //if (x < 189){
                y = [Math.sqrt( 40000 - Math.pow(x-350,2)) + 400, -Math.sqrt(40000 - Math.pow(x-350,2)) + 400];
           // }
            //else{
               // y = Math.sqrt( 40000 - Math.pow(x-350,2)) + 400;
            //}

            fishBowlInter[x] = y;
        }

        for (let x = 490; x < 551; x ++){
            //if (x > 511){
                y = [Math.sqrt( 40000 - Math.pow(x-350,2)) + 400, -Math.sqrt(40000 - Math.pow(x-350,2)) + 400];
            //}
            //else{
            //    y = Math.sqrt( 40000 - Math.pow(x-350,2)) + 400;
            //}


            fishBowlInter[x] = y;
            //console.log(x + " " + fishBowlInter[x]);
        }
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

            let canvas = document.getElementById('canvas');
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, 1000, 1000); // clear canvas
            //draw fishBowl
            drawFishBowl(ctx);
            //draw waterline
            drawWaterLine();
            //if angle > 0, rotate fish
            fish.yPos = waterLine[Math.round(fish.xPos) - 160] *0.95;
            if (fish.angle != 0){
                //let cache = fish.img;
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

            leap ++;
            if (leap > 40){
                leap = 1;
                fire = true;
            }
            document.onkeydown = checkKey;
            displayBugMovement(ctx);
            displayDropletMovement(ctx);
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
            let check = detectFishMoveLeft();
            if (check) {
                fish.xPos -= 5;
            }
        }
        //d
        else if (e.keyCode == '68') {
            let check = detectFishMoveRight();
            if (check) {
                fish.xPos += 5;
            }
        }
        //space
        else if (e.keyCode == '32'){
            if (fire == true){
                shootDroplet();
                fire = false;
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
        },time)

    }

    //create a bug and store it in an array called bugs
    function createBug(){
        bugs[bugCnt] = {
            xPos : 0,
            yPos : 230,
            xSpeed : 0,
            ySpeed : 0,
            radius : 15,
            size : 15,
            collider : bugMeta.collider,
            alive : true
        };
        bugCnt++;
    }

    //generate windSpeed, the speed of wind is the speed of bug
    function generateWind(){
        time = Math.random() * 1000 + 1000;
        //the range would result in a bug taking 2s to 10s to cross the screen
        //the game area has length 700, so the speed should between 70 and 350 per second
        //so the wind spped will be (70 ~ 350) / frame per second
        wind.speed = (Math.random() * 280 + 70)/fps;
        //test
<<<<<<< HEAD
        //wind.speed = 120/fps;
=======
        //wind.speed = 0/fps;
>>>>>>> 4e1215dd992c669c55bc715aa7f800b02f262260
        //console.log(wind.speed);
        setTimeout(function(){
            generateWind();
            $("#speed").text("Wind Speed:" +　wind.speed);
            //console.log(wind.speed);
        },time);
    }

    //calculate and display bug movement
    function displayBugMovement(ctx){
        for (var index in bugs){
            if (detectBugWithWater(bugs[index])){
                delete bugs[index];
                continue;
            }
            detectDropletWithFishBowl(bugs[index]);
            if (bugs[index].yPos < 282){
                bugs[index].xSpeed = wind.speed;
            }
            bugs[index].xPos += bugs[index].xSpeed;
            if (bugs[index].alive != true){
                //to make the impact of gravity more obvious, time the gravity coefficient by 50
                bugs[index].yPos += gravity * 50;

            }
            ctx.drawImage(bugMeta.img,bugs[index].xPos,bugs[index].yPos,30,30*bugMeta.img.height/bugMeta.img.width);
            //test purpose, draw bug collide
            /*
            ctx.beginPath();
            ctx.arc(bugs[index].xPos + 18,bugs[index].yPos+18,9,0,Math.PI*2);
            ctx.stroke();*/
            //delete bug if is out of screen
            if (bugs[index].xPos > 700){
                delete bugs[index];
            }
        }
        /*
        for (let x = 0; x < bugs.length; x++){
            bugs[x].xPos += wind.speed;
            ctx.drawImage(bugMeta.img,bugs[x].xPos,bugs[x].yPos,30,30*bugMeta.img.height/bugMeta.img.width);
        }*/
    }

    function shootDroplet(){
        droplets[dropletsCnt] = new Droplet(dropletMeta.size1,dropletMeta.size1Collider,fish.xPos + 50,fish.yPos - 25,dropletMeta.size1Speed);
        droplets[dropletsCnt + 1] = new Droplet(dropletMeta.size2,dropletMeta.size2Collider,fish.xPos + 45,fish.yPos - 15,dropletMeta.size2Speed);
        droplets[dropletsCnt + 2] = new Droplet(dropletMeta.size3,dropletMeta.size3Collider,fish.xPos + 55,fish.yPos - 5,dropletMeta.size3Speed);
        dropletsCnt += 3;
    }

    //calculate and display all droplets
    function displayDropletMovement(ctx){
        for (let i in droplets){
            if (detectDropletWithWater(droplets[i])){
                delete droplets[i];
                continue;
            }
            //console.log(droplets[i].xPos);
            /*test purpose
            if (detectDropletWithFishBowl(droplets[i])){
                delete droplets[i];
                continue;
            }*/
            detectDropletWithFishBowl(droplets[i]);
            for (let j in bugs){
                var result = detectDropletBugCollision(bugs[j],droplets[i]);
            }
            //if the droplet collide with a bug, delete it
            if (result === true){
                delete droplets[i];
                //console.log("No exist");
                continue;
            }
            //draw the position of droplet
            ctx.beginPath();
            ctx.arc(droplets[i].xPos,droplets[i].yPos,droplets[i].size,0,2*Math.PI);
            ctx.stroke();
            //calculate the position in next frame
            droplets[i].ySpeed -= gravity;
            droplets[i].yPos -= droplets[i].ySpeed;
            //if the wind speed changed, renew status
            if (droplets[i].windSpeed != wind.speed){
                droplets[i].impacted = false;
            }
            //Droplet motion must also be affected by wind, once above the top of the bowl.
            if ( (droplets[i].yPos < 282.44) && (droplets[i].impacted == false)) {
                droplets[i].xSpeed = droplets[i].xSpeed - droplets[i].windSpeed + wind.speed;
                droplets[i].windSpeed = wind.speed;
                droplets[i].impacted = true;
            }

           // droplets[i].xPos += droplets[i].windSpeed;
            droplets[i].xPos += droplets[i].xSpeed;
            //delete droplet if out of screen
            if ((droplets[i].xPos > 700) || (droplets[i].xPos < 0) || (droplets[i].yPos) < 0 || (droplets[i].yPos) > 700){
                //console.log("deleted droplet" + i);
                delete droplets[i];
            }
        }
    }

    /**
     * function used to detect the collision between bug and droplet
     * @bug the bug object
     * @droplet the droplet
     * @return true if there is collision, false otherwise
    * */
    function detectDropletBugCollision(bug,droplet){
        let x = droplet.xPos - (bug.xPos + bugMeta.collider.xOffset);
        let y = droplet.yPos - (bug.yPos + bugMeta.collider.yOffset);
        let distance = Math.sqrt( x*x + y*y);
        if ((distance <= bugMeta.collider.radius + droplet.size) && (bug.alive == true)){
            //interesting, this part does not work as expected
            /*
            droplet.collided = true;
            bug.alive = false;
            console.log(droplet.collided);
             */
            //console.log("Collision with bug detected!");
            bug.alive = false;
            return true;
        }
        return false;
    }

    function detectBugWithWater(bug){
        if ( (bug.xPos > 160)  && (bug.xPos < 540)
            && (bug.yPos > waterLine[Math.round(bug.xPos - 160)] - 15) ) {
            return true;
        }
        else
            return false;
    }

    function detectDropletWithWater(droplet){
        if ( (droplet.xPos > 160)  && (droplet.xPos < 540)
            && (droplet.yPos > waterLine[Math.round(droplet.xPos - 160)]) ) {
            return true;
        }
        else
            return false;
    }

    class Droplet{
        constructor(size,collider,xPos,yPos,speed){
            this.size = size;
            this.collider = collider;
            this.angle = fish.angle;
            this.collided = false;
            this.windSpeed = 0;
            this.xSpeed = speed*Math.sin(this.angle);
            this.impacted = false;
            //reduce the angle's impact on vertical speed
            this.ySpeed = speed*Math.cos(this.angle);
            if (this.angle >= 0){
                this.xPos = xPos + 35 * Math.sin(this.angle);
            }else{
                this.xPos = xPos + 35 * Math.sin(this.angle);
            }

            this.yPos = yPos - 30 * Math.cos(this.angle) + 35;
        }
    }

    function detectBugWithFishBowl(bug){
<<<<<<< HEAD
        let xPos = bug.xPos + 15;
        let yPos = bug.yPos + 15;
=======
        let xPos = bug.xPos;
        let yPos = bug.yPos;
>>>>>>> 4e1215dd992c669c55bc715aa7f800b02f262260
        //left bound detection and bounce
        if ( (xPos >=  150) && ( xPos + bug.size<= 189) && (yPos >282.44 )){
            if ( Math.sqrt( Math.pow( xPos - fishbowl.centerX,2) + Math.pow( yPos - fishbowl.centerY,2)) > ( fishbowl.radius - bug.size)){
                let beta = Math.asin((yPos - 400)/200);
                let alpha = Math.atan(bug.xSpeed/bug.ySpeed);
                let Velocity =  Math.sqrt( Math.pow(bug.xSpeed,2) + Math.pow(bug.ySpeed,2));
                if (bug.ySpeed < 0){
                    bug.xSpeed  = -0.2* Velocity * Math.sin(2*Math.PI -alpha - 2*beta);
                    bug.ySpeed  = 0.2*Velocity * Math.cos(2*Math.PI -alpha - 2*beta);
                }
                else{
                    bug.xSpeed  = 0.2* Velocity * Math.sin(2*Math.PI -alpha - 2*beta);
                    bug.ySpeed  = 0.2*Velocity * Math.cos(2*Math.PI -alpha - 2*beta);
                }

                return true;
            }
        }
        //right bound detection and bounce
        else if ( (xPos > 512) && ( xPos < 550) && (yPos >282.44 )){
            if ( Math.sqrt( Math.pow( xPos - fishbowl.centerX,2) + Math.pow( yPos - fishbowl.centerY,2)) > ( fishbowl.radius - bug.size)){
                let beta = Math.asin((yPos - 400)/200);
                let alpha = Math.atan(bug.xSpeed/bug.ySpeed);
                let Velocity = Math.sqrt( Math.pow(bug.xSpeed,2) + Math.pow(bug.ySpeed,2));
                if (bug.ySpeed < 0){
                    bug.xSpeed = -0.2*Velocity * Math.sin(-alpha + 2*beta);
                    bug.ySpeed = -0.2* Velocity * Math.cos(-alpha + 2*beta);
                }
                else{
                    bug.xSpeed = 0.2*Velocity * Math.sin(-alpha + 2*beta);
                    bug.ySpeed = 0.2* Velocity * Math.cos(-alpha + 2*beta);
                }

                return true;
            }
        }
        else return false;
    }
    function detectDropletWithFishBowl(Droplet){
        let xPos = Droplet.xPos;
        let yPos = Droplet.yPos;
        //left bound detection and bounce
        if ( (xPos >=  150) && ( xPos + Droplet.size<= 189) && (yPos >282.44 )){

            //et y1 = fishBowlInter[Math.round(xPos)][0];
            //let y2 = fishBowlInter[Math.round(xPos)][1];
            //if ( ((yPos > y1 - 10) && (yPos < y1 + 10)) || ((yPos > y2 -10) && (yPos < y2 +10 ) ))
            if ( Math.sqrt( Math.pow( xPos - fishbowl.centerX,2) + Math.pow( yPos - fishbowl.centerY,2)) > ( fishbowl.radius - Droplet.size)){
                let beta = Math.asin((yPos - 400)/200);
                let alpha = Math.atan(Droplet.xSpeed/Droplet.ySpeed);
                let Velocity =  Math.sqrt( Math.pow(Droplet.xSpeed,2) + Math.pow(Droplet.ySpeed,2));
<<<<<<< HEAD
                if (Droplet.ySpeed <= 0){
=======
                if (Droplet.ySpeed < 0){
>>>>>>> 4e1215dd992c669c55bc715aa7f800b02f262260
                    Droplet.xSpeed  = -0.95* Velocity * Math.sin(2*Math.PI -alpha - 2*beta);
                    Droplet.ySpeed  = 0.95*Velocity * Math.cos(2*Math.PI -alpha - 2*beta);
                }
                else{
                    Droplet.xSpeed  = 0.95* Velocity * Math.sin(2*Math.PI -alpha - 2*beta);
                    Droplet.ySpeed  = 0.95*Velocity * Math.cos(2*Math.PI -alpha - 2*beta);
                }

                /*
                if (yPos >= 400){
                    Droplet.xSpeed = Velocity * Math.sin(2*Math.PI -alpha - 2*beta);
                    Droplet.ySpeed = Velocity * Math.cos(-alpha + 2*beta);
                }
                else if (yPos < 400){
                    Droplet.xSpeed = -Velocity * Math.sin(-alpha + 2*beta);
                    Droplet.ySpeed = Velocity * Math.cos(-alpha + 2*beta);
                }*/

                return true;
            }
        }
        //right bound detection and bounce

        else if ( (xPos > 512) && ( xPos < 550) && (yPos >282.44 )){
            if ( Math.sqrt( Math.pow( xPos - fishbowl.centerX,2) + Math.pow( yPos - fishbowl.centerY,2)) > ( fishbowl.radius - Droplet.size)){
                let beta = Math.asin((yPos - 400)/200);
                let alpha = Math.atan(Droplet.xSpeed/Droplet.ySpeed);
                let Velocity = Math.sqrt( Math.pow(Droplet.xSpeed,2) + Math.pow(Droplet.ySpeed,2));
<<<<<<< HEAD
                if (Droplet.ySpeed <= 0){
                    let xSpeedAbs = Math.abs(0.95*Velocity * Math.sin(-alpha + 2*beta));
                    if (Droplet.xSpeed >= 0){
                        Droplet.xSpeed = -xSpeedAbs;
                    }
                    else {
                        Droplet.xSpeed = xSpeedAbs;
                    }
                   // Droplet.xSpeed = -0.95*Velocity * Math.sin(-alpha + 2*beta);
                    Droplet.ySpeed = -0.95* Velocity * Math.cos(-alpha + 2*beta);
                }
                else{
                    let xSpeedAbs = Math.abs(0.95*Velocity * Math.sin(-alpha + 2*beta));
                    if (Droplet.xSpeed >= 0){
                        Droplet.xSpeed = -xSpeedAbs;
                    }
                    else {
                        Droplet.xSpeed = xSpeedAbs;
                    }
                    //Droplet.xSpeed = 0.95*Velocity * Math.sin(-alpha + 2*beta);
=======
                if (Droplet.ySpeed < 0){
                    Droplet.xSpeed = -0.95*Velocity * Math.sin(-alpha + 2*beta);
                    Droplet.ySpeed = -0.95* Velocity * Math.cos(-alpha + 2*beta);
                }
                else{
                    Droplet.xSpeed = 0.95*Velocity * Math.sin(-alpha + 2*beta);
>>>>>>> 4e1215dd992c669c55bc715aa7f800b02f262260
                    Droplet.ySpeed = 0.95* Velocity * Math.cos(-alpha + 2*beta);
                }

                return true;
            }
        }
        else return false;
    }
    //test function

    init();
});
