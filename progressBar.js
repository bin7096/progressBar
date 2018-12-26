var utils = {
	getWindowSize: function() {
        return {
            width: this.getWindowWidth(),
            height: this.getWindowHeight()
        };
    },
    getWindowWidth: function() {
        //浏览器的兼容
        return window.innerWidth || document.documentElement.clientWidth;
    },
    getWindowHeight: function() {
        //浏览器的兼容
        return window.innerHeight || document.documentElement.clientHeight;
    }
}

var throwError = {
	content:"ProgressBar.js Arguments '%arg%' Error:%detail%",
	init:function(arg, detail){
		throw this.content.replace("%arg%", arg).replace("%detail%", detail);return;
	}
}

var progressBar = {
	pi 			:Math.PI / 180,
	obj         :null,
	ctx         :null,
	width       :null,
	height      :null,
	center      :null,
	excricle    :null,
	incricle    :null,
	bgcolor		:null,
	barcolor	:null,
	canvas_id   :null,
	canvas_width:null,
	timeOut_id  :null,
	type  :[
		'pureColorAnnular'
	],
	init: function(type, width, percent, bgcolor, barcolor, canvas_id){
		//检测类型
		if (this.type.indexOf(type) == -1) {
			throwError.init("type", "进度条类型不存在");return;
		}
		//检测宽度百分比
		if (Math.abs(parseInt(width)) != width) {
			throwError.init("width", "进度条宽度百分比必须为正整数");return;
		}
		//检测传入百分比
		if (Math.abs(parseInt(percent)) != percent) {
			throwError.init("percent", "进度条百分比必须为正整数");return;
		}
		var bodyWidth  = utils.getWindowWidth();
		this.canvas_id = canvas_id;
		this.bgcolor   = bgcolor;
		this.barcolor  = barcolor;
		this.obj = this.canvasStyle(bodyWidth);
		switch(type){
			case "pureColorAnnular":
				this.cricleStyle(width, percent);
				break;
		}
	},
	canvasStyle: function(bodyWidth){
		var obj = document.getElementById(this.canvas_id);
		obj.width = this.canvas_width = bodyWidth;
		return obj;
	},
	cricleStyle: function(width, percent){
		this.excricle = Math.floor(this.canvas_width * (width / 100) / 2);
		this.incricle = Math.floor(this.excricle * 0.9);
		this.center   = this.excricle;
		this.obj.width  = this.obj.height = this.excricle * 2;
		this.annularStart(percent);
	},
	annularStart: function(percent){

		var radiu = Math.ceil(360 * percent / 100 / 20);

		this.ctx = this.obj.getContext("2d");
		
		this.ctx.translate(0.5, 0.5);
		this.ctx.beginPath();
		this.ctx.fillStyle = '#CCC';
		this.ctx.arc(this.center, this.center, this.excricle, 0, this.pi * 360, true);
		this.ctx.fill();

		var countByPB = 0;
		this.timeOut_id = setInterval(function() {
			progressBar.pureCricle(radiu, countByPB);
			countByPB ++;
		}, 100);
	},
	pureCricle: function(radiu, countByPB){
		if (countByPB >= 20) {
			clearInterval(this.timeOut_id);return;
		}

		this.ctx.fillStyle = this.barcolor;
	},
	annularXY: function(percent){
		var num = Math.floor(percent / 25);
		var angle = percent % 25;
		switch (num) {
			case 0:
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				break;
		}
	}
}

progressBar.init('pureColorAnnular', 30, 60, 'rgb(255, 255, 255)', '#3366FF', 'progressBar');

window.onresize = function(){
	progressBar.init('pureColorAnnular', 30, 60, 'rgb(255, 255, 255)', '#3366FF', 'progressBar');
}