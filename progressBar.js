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
	width       :null,
	height      :null,
	center      :null,
	excricle    :null,
	incricle    :null,
	canvas_id   :null,
	canvas_width:null,
	type  :[
		'pureColorAnnular'
	],
	init: function(type, width, percent, canvas_id){
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
		var bodyWidth = utils.getWindowWidth();
		this.center   = Math.floor(bodyWidth / 2);
		this.cricleStyle(width, percent);
	},
	canvasStyle: function(bodyWidth){
		var obj = document.getElementById(this.canvas_id);
		obj.style.width = this.canvas_width = bodyWidth;return;
	},
	cricleStyle: function(width, percent){
		this.excricle = Math.floor(this.canvas_width * (width / 100) / 2);
		this.incricle = Math.floor(this.excricle * 0.3);
		console.log(this.excricle);
		console.log(this.incricle);
		console.log(this.center);
	},
	start: function(){

	}
}

progressBar.init('pureColorAnnular', 30, 20, 'progressBar');