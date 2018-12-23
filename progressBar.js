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
	width :null,
	height:null,
	type  :[
		'pureColorAnnular'
	],
	init: function(type, percent){
		//检测类型
		if (this.type.indexOf(type) == -1) {
			throwError.init("type", "进度条类型不存在");return;
		}
		//检测传入百分比
		if (Math.abs(parseInt(percent)) != percent) {
			throwError.init("percent", "进度条宽度百分比必须为正整数");return;
		}
	}
}

progressBar.init('pureColorAnnular', -30);