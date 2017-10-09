/**
 * Created by Zhening on 2017/10/9.
 */
$(document).ready(function(){
    function startGame() {
        gameArea.start();
    }

    var gameArea = {
        canvas : document.createElement("canvas"),
        start : function() {
            this.canvas.width = 480;
            this.canvas.height = 270;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas,document.body.childNodes[0]);
        }
    }
});