var resize_num = 0;
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
	pi          :Math.PI / 180,
	obj         :null,
	ctx         :null,
	width       :null,
	height      :null,
	center      :null,
	fontsize    :null,
	excricle    :null,
	incricle    :null,
	bgcolor     :null,
	barcolor    :null,
	canvas_id   :null,
	canvas_width:null,
	timeOut_id  :null,
	type  :[
		'pureColorAnnular'
	],
	init: function(type, width, percent, bgcolor, barcolor, canvas_id, num){
		//清除定时器
		if (this.timeOut_id !== null) {
			clearInterval(this.timeOut_id);
		}
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
				this.cricleStyle(width, percent, num);
				break;
		}
	},
	canvasStyle: function(bodyWidth) {
		var obj   = document.getElementById(this.canvas_id);
		obj.width = this.canvas_width = bodyWidth;
		return obj;
	},
	cricleStyle: function(width, percent, num) {
		this.excricle = Math.floor(this.canvas_width * (width / 100) / 2);
		console.log(this.excricle);
		this.incricle = Math.floor(this.excricle * 0.9);
		this.fontsize = Math.floor(this.excricle * 0.5);
		this.center   = this.excricle;
		this.obj.width  = this.obj.height = this.excricle * 2;
		this.annularStart(percent, num);
	},
	annularStart: function(percent, num){
		this.ctx = this.obj.getContext("2d");
		
		this.ctx.translate(0.5, 0.5);  //解决canvas线条模糊问题
		this.ctx.beginPath();
		this.ctx.fillStyle = '#CCC';
		this.ctx.arc(this.center, this.center, this.excricle, 0, this.pi * 360, true);
		this.ctx.fill();
		this.ctx.closePath();

		var countByPB = 1;
		this.timeOut_id = setInterval(function() {
			progressBar.pureCricle(percent, countByPB, num);
			countByPB ++;
		}, 10);
	},
	pureCricle: function(percent, countByPB, num) {
		if (countByPB > num) {
			clearInterval(this.timeOut_id);return;
		}

		var eqNum = percent / num;

		var xy = this.annularXY(eqNum, countByPB);

		this.ctx.fillStyle = this.ctx.strokeStyle = this.barcolor;
		this.ctx.beginPath();

		this.ctx.globalCompositeOperation = 'source-over';

		this.ctx.moveTo(this.center, this.center);
		this.ctx.lineTo(this.center, 0);
		
		var stopAngle = eqNum * countByPB / 100 * 360;
		if (stopAngle >= 90) {
			stopAngle -= 90;
		}else{
			stopAngle += 270;
		}
		if (stopAngle === 270) {
			this.ctx.arc(this.center, this.center, this.excricle, 0, 360 * this.pi, false);
		}else{
			this.ctx.arc(this.center, this.center, this.excricle, 270 * this.pi, stopAngle * this.pi, false);
		}
		this.ctx.fill();
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.globalCompositeOperation = 'destination-out';
		this.fillStyle = 'black';
		this.ctx.arc(this.center, this.center, this.incricle, 0, this.pi * 360, true);
		this.ctx.fill();

		this.ctx.globalCompositeOperation = 'source-over';
		this.ctx.font 	   	  = this.fontsize + 'px Arial';
		this.ctx.textAlign 	  = 'center';
		this.ctx.textBaseline = 'middle';

		this.ctx.fillText(String(Math.ceil(eqNum * countByPB)) + '%', this.center, this.center);
	},
	annularXY: function(eqNum, countByPB){
		var p = eqNum * countByPB;
		var num = p / 25;
		if (parseInt(num) === num && num != 4) {
			num --;
		}else{
			num = parseInt(num);
		}
		var angle = p / 100 * 360;
		var xy = {x:null,y:null};
		switch (num) {
			case 0://1
				xy.x = this.center + this.excricle * Math.cos((90 - angle) * this.pi);
				xy.y = this.center - this.excricle * Math.sin((90 - angle) * this.pi);
				break;
			case 4://终点
				xy.x = this.center;
				xy.y = 0;
				break;
			default ://2、3、4
				xy.x = this.center + this.excricle * Math.cos((angle - 90) * this.pi);
				xy.y = this.center + this.excricle * Math.sin((angle - 90) * this.pi);
				break;
		}
		return xy;
	}
}

progressBar.init('pureColorAnnular', 60, 50, 'rgb(255, 255, 255)', '#3399FF', 'progressBar', 200);

window.onresize = function(){
	if (resize_num !== 0) {
		return;						//阻止onresize事件多次触发问题
	}
	resize_num ++;
	progressBar.init('pureColorAnnular', 60, 50, 'rgb(255, 255, 255)', '#3399FF', 'progressBar', 200);
	setTimeout(function(){
		resize_num = 0;
	}, 100);
}