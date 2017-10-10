/**
 * Created by Zhening on 2017/10/9.
 */
$(document).ready(function(){

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
        rightUpY:282.44
    };

    var fish = {
        img : new Image(),
        xPos : 180,
        yPos : 450,
        ctrl : "right"
    }

    var waterLine;

    function init(){
        var canvas = document.getElementById('canvas');
        canvas.height = 700;
        canvas.width = 700;
        fish.img.src = './css/fish.png';
        waterLine = calWaterLine(500,950,50,0.5);
        window.requestAnimationFrame(draw);
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

    function draw() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 700, 700); // clear canvas
        //draw fishBowl
        drawFishBowl(ctx);
        //draw waterline
        drawWaterLine();

        // save the unrotated context of the canvas so we can restore it later
        ctx.save();
        fish.img.onload = function () {
            // move to the center of the canvas
            ctx.translate(fish.xPos, fish.yPos);
            if (fish.ctrl == "right"){
                ctx.rotate(ctx.rotate(10 * Math.PI / 180));
                ctx.drawImage(fish.img, -10,-20, 50, 50 * fish.img.height / fish.img.width);
            }
        }

       // ctx.restore();
       // ctx.drawImage(fish.img, fish.xPos, fish.yPos, 50, 50 * fish.img.height / fish.img.width);
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
    init();
});