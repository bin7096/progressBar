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

var progressBar = {
	width :null,
	height:null,
	type  :[
		'pureColorAnnular'
	],
	init: function(type, percent){
		//检测类型
		if (this.type.indexOf(type) == -1) {
			throw "ProgressBar.js Arguments 'type' Error:进度条类型不存在";return;
		}
		//检测传入百分比
		if (Math.abs(parseInt(percent)) != percent) {
			throw "ProgressBar.js Arguments 'percent' Error:进度条宽度百分比必须为正整数";return;
		}
	}
}

progressBar.init('pureColorAnnular', -30);