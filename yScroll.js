
(function(){
	var animated,startCoordinates,_self;
	var yScroll = function(ele,height,scale){
		_self = this;
		_self.ele = ele;
		_self.animateE = _self.ele.children[0];
		_self.scaleNum  = scale || getFloat(/scale\((\d\.\d+|\d*)/,_self.ele.style["transform"]) || 1;
		_self.animateEH  = height||parseInt((parseInt(getComputedStyle(_self.animateE,null).height.replace(/px/,function(){
			return "";
		})))-document.body.clientHeight/_self.scaleNum);


		_self.coordinates = [];
		_self.startCoordinates = {};
		_self.animated = 1;
		_self.startTransform = null;
		_self.startTransformY=0;
		_self.init();
		_self.currentTransformY = 0;
		// console.log(this.animateEH);
		return _self;
	}

	yScroll.prototype.destroy = function(){
		// var _self = this;
		_self.ele.removeEventListener('touchstart',onTouchStart,false);
		_self.ele.removeEventListener('touchmove',onTouchMove,false);
		_self.ele.removeEventListener('touchend',onTouchEnd,false);
	}

	yScroll.prototype.scrollTo = function(){
		// var _self = this;
		var currentTransform = getComputedStyle(_self.animateE,null).webkitTransform;
		var reg = /matrix\((\d+,\s){5}(-?\d*(.\d*)?)\)$/;
		_self.currentTransformY = getMartix(reg,currentTransform)||0;
		_self.animateE.style.cssText = "-webkit-transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);-webkit-transition-duration:200ms;  -webkit-transform: translateX(0px) translateY(0) translateZ(0px);"

	}
	

	yScroll.prototype.init = function(){
		// var _self = this;

		_self.ele.addEventListener('touchstart',onTouchStart,false);
		_self.ele.addEventListener('touchmove',onTouchMove,false);
		_self.ele.addEventListener('touchend',onTouchEnd,false);
		
	}

	function onTouchStart(event){
			event.stopPropagation();
			// event.preventDefault();
			_self.startTransform = getComputedStyle(_self.animateE,null).webkitTransform;
			var reg = /matrix\((\d+,\s){5}(-?\d*(.\d*)?)\)$/;
			_self.startTransformY = getMartix(reg,_self.startTransform)||0;

			_self.animateE.style.cssText = "-webkit-transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); -webkit-transition-duration: 0ms; -webkit-transform: translateX(0px) translateY("+_self.startTransformY+"px) translateZ(0px);"
			var startY = event.touches[0].clientY;
			var startX = event.touches[0].clientX;

			startCoordinates = {
				x:startX,
				y:startY
			};
			animated = 0;
		}

		function onTouchMove(event){
			event.stopPropagation();
			event.preventDefault();
			if(animated!=0) return;
			var currentY = event.touches[0].clientY;
			var currentX = event.touches[0].clientX;

			var moveY = startCoordinates.y - currentY;
			var moveX = currentX - startCoordinates.x;
			var lengthX = Math.abs(moveX);
			var lengthY = Math.abs(moveY);
			var nextTransformY = _self.startTransformY-moveY;		
			if(lengthY/lengthX > 1){
				if(animated == 0){
					_self.animateE.style.cssText = "-webkit-transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);  -webkit-transform: translateX(0px) translateY("+nextTransformY+"px) translateZ(0px);"
							
				}
			}
			_self.coordinates.push({
				x:currentX,
				y:currentY,
				currentTransformY:nextTransformY
			});
		}

		function onTouchEnd(event){
			event.stopPropagation();
			// event.preventDefault();
			var coordinates = _self.coordinates;
			if(coordinates.length==0||animated!=0) return;

			var currentPoint =  coordinates[coordinates.length-1];
			var prevPoint = coordinates[coordinates.length-2]||startCoordinates;
			var moveY = -(currentPoint.y -prevPoint.y);
			var movex = currentPoint.x -prevPoint.x;

			var lengthX = Math.abs(movex);
			var lengthY = Math.abs(moveY);
			if(lengthY/lengthX > 1){
				var currentTransformY = currentPoint.currentTransformY;
				var nextTransformY =Math.min(Math.max(currentTransformY-moveY*50,-_self.animateEH),0);

				setTimeout(function(){
					_self.animateE.style.cssText = "-webkit-transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); -webkit-transition-duration: "+80*lengthY+"ms; -webkit-transform: translateX(0px) translateY("+nextTransformY+"px) translateZ(0px);"
				});
			}
			_self.animated = 1;
			_self.coordinates = [];
		}
			

	function getNum(reg,str){
		var result = str.match(reg);
		if(result)  {
			return parseInt(result[1]);
		}else{
			return 0;
		}
	}
	function getFloat(reg,str){
		var result = str.match(reg);
		if(result)  {
			return parseFloat(result[1]);
		}else{
			return 0;
		}
	}

	function getMartix(reg,str){
		var result = str.match(reg);
		if(result)  {
			return parseFloat(result[2]);
		}else{
			return 0;
		}
	}

	window.yScroll = yScroll;
	if(typeof exports!=="undefined") {
		module.exports = yScroll;
	}
})();
