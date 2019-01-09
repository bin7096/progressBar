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
    pi       : Math.PI / 180,
    rgbReg   : new RegExp('^[rR][gG][Bb][Aa]?[\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?(0\.\d{1,2}|1|0)?[\)]{1}$'),
    colorReg : new RegExp('^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$'),
    type : [
        'pureColorAnnular'
    ],
    init : function (type /*进度条类型*/, widthPercent /*宽度百分比*/, percent /*进度百分比*/, bgcolor /*背景色*/, barcolor /*进度条颜色*/, canvas_id /*画布ID属性*/, num /*等份数*/) {
        //检测类型
        if (this.type.indexOf(type) == -1) {
            throwError.init("type", "进度条类型不存在");return;
        }
        //检测宽度百分比
        if (Math.abs(parseInt(widthPercent)) != widthPercent) {
            throwError.init("width", "进度条宽度百分比必须为正整数");return;
        }
        //检测传入百分比
        if (Math.abs(parseInt(percent)) != percent) {
            throwError.init("percent", "进度百分比必须为正整数");return;
        }
        //验证背景色
        if (!this.rgbReg.test(bgcolor) && !this.colorReg.test(bgcolor)) {
            throwError.init("bgcolor", "背景色的颜色值有误,请使用rgb或16进制颜色值,颜色值勿带空格");return;
        }
        //验证进度条颜色值
        if (!this.rgbReg.test(barcolor) && !this.colorReg.test(barcolor)) {
            throwError.init("barcolor", "进度条颜色值有误,请使用rgb或16进制颜色值,颜色值勿带空格");return;
        }
        //验证等份数
        if (Math.abs(parseInt(num)) != num) {
            throwError.init("num", "等份数必须为正整数");return;
        }
        let bodyWidth  = utils.getWindowWidth();
        //progressBar参数集
        let pbObj = {};
        pbObj['bgcolor']   = bgcolor;       //背景色
        pbObj['barcolor']  = barcolor;      //进度条颜色
        pbObj['canvas_id'] = canvas_id;     //画布ID
        pbObj['width']     = bodyWidth;     //画布宽度
        switch(type){
			case "pureColorAnnular":
				this.cricleStyle(pbObj, widthPercent, percent, num);
				break;
		}
    },
    initCanvas : function (w /*画布宽度*/, h /*画布高度*/, canvas_id /*画布ID属性*/) {
        let canvas = document.getElementById(canvas_id);
        canvas.width  = w;
        canvas.height = h;
        return canvas;
    },
    cricleStyle : function(pbObj /*参数集*/, widthPercent /*宽度百分比*/, percent /*进度百分比*/, num /*等份数*/) {
        pbObj['pi']       = this.pi;
        pbObj['excricle'] = Math.floor(pbObj['width'] * (widthPercent / 100) / 2); //外圆半径
        pbObj['incricle'] = Math.floor(pbObj['excricle'] * 0.9);                   //内圆半径
        pbObj['fontsize'] = Math.floor(pbObj['excricle'] * 0.5);                   //文字大小
        pbObj['center']   = pbObj['excricle'];                                     //圆心位置（相对画布左上角，向右向下偏移多少）
        let canvas= this.initCanvas(pbObj['excricle'] * 2, pbObj['excricle'] * 2, pbObj['canvas_id']);
        this.annularStart(canvas, pbObj, percent, num);
    },
    annularStart: function(canvas /*画布对象*/, pbObj /*参数集*/, percent /*进度百分比*/, num /*等份数*/){
        let ctx = pbObj['ctx'] = canvas.getContext("2d");
        
        ctx.translate(0.5, 0.5);  //解决canvas线条模糊问题

        //圆形底图
        ctx.beginPath();
        ctx.fillStyle = pbObj['bgcolor'];
        ctx.arc(pbObj.center, pbObj.center, pbObj.excricle, 0, this.pi * 360, true);
        ctx.fill();
        ctx.closePath();

        //环形初始动画
        let countByPB = 1;
        let ds = setInterval(function() {
            if (countByPB >= num) {clearInterval(ds);}
            progressBarStart.pureCricle(pbObj, percent, countByPB, num);
            countByPB ++;
        }, 10);
    }
}

var progressBarStart = {
    pureCricle : function (pbObj /*参数集*/, percent /*进度百分比*/, countByPB  /*当前已处理等份数*/, num /*等份数*/) {

        var eqNum = percent / num;

        //百分比扇形
		pbObj.ctx.fillStyle = pbObj.ctx.strokeStyle = pbObj.barcolor;
		pbObj.ctx.beginPath();

		pbObj.ctx.globalCompositeOperation = 'source-over';

		pbObj.ctx.moveTo(pbObj.center, pbObj.center);
		pbObj.ctx.lineTo(pbObj.center, 0);
		
		var stopAngle = eqNum * countByPB / 100 * 360;
		if (stopAngle >= 90) {
			stopAngle -= 90;
		}else{
			stopAngle += 270;
		}
		if (stopAngle === 270) {
			pbObj.ctx.arc(pbObj.center, pbObj.center, pbObj.excricle, 0, 360 * pbObj.pi, false);
		}else{
			pbObj.ctx.arc(pbObj.center, pbObj.center, pbObj.excricle, 270 * pbObj.pi, stopAngle * pbObj.pi, false);
		}
		pbObj.ctx.fill();
		pbObj.ctx.closePath();

        //内圆遮盖层
		pbObj.ctx.beginPath();
		pbObj.ctx.globalCompositeOperation = 'destination-out';
		pbObj.fillStyle = 'black';
		pbObj.ctx.arc(pbObj.center, pbObj.center, pbObj.incricle, 0, pbObj.pi * 360, true);
		pbObj.ctx.fill();

        //百分比文字
		pbObj.ctx.globalCompositeOperation = 'source-over';
		pbObj.ctx.font 	   	   = pbObj.fontsize + 'px Arial';
		pbObj.ctx.textAlign    = 'center';
		pbObj.ctx.textBaseline = 'middle';
        pbObj.ctx.fillText(String(Math.ceil(eqNum * countByPB)) + '%', pbObj.center, pbObj.center);
        
        return;
    }
}