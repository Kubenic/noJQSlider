'use strict';

var noJqSlider = function(container,params){
	var launcher = new njs(container,params);
	launcher.launch();
	return launcher;	
}


function njs(container, params){
	this.container = document.querySelector(container);
	if(this.container.tagName === "UL" || this.container.tagName === "OL"){
		this.transitionBlock  = document.createElement("li");
	}else{
		this.transitionBlock = document.createElement("div");
	}

	this.transitionBlock.classList.add("noJqS-transitionBlock");

	this.params = typeof(params) !== "undefined" ? params : {};
	this.speed = typeof(this.params.speed) !== "undefined" ? params.speed : 1000;
	this.duration = typeof(this.params.duration) !== "undefined" ? params.duration : 10000;
	this.pauseOnHover = typeof(this.params.pauseOnHover) !== "undefined" ? params.pauseOnHover : false;
	this.pagination = typeof(this.params.pagination ) !== "undefined" ? params.pagination : false;
	this.containerHeight = this.container.clientHeight;
	this.containerWidth = this.container.clientWidth;
	this.totalChildren = 0;
	this.slideNumberActivate = 0;
}

njs.prototype.launch = function(){
	this.container.style.width = this.containerWidth+"px";
	this.container.style.height = this.containerHeight+"px";
	this.container.style.display = "block";
	this.container.style.overflow = "hidden";

	while(this.container.children.length !== 0){
		this.assignElementToGrid(this.container.children[0]);
	}
	this.container.appendChild(this.transitionBlock);
	this.adjustTransitionBlock();
	this.adjustChildren();
	this.addPagination();
	if(this.pauseOnHover){
		this.enableMouseHover();
	};
	this.startAnimation();
}

njs.prototype.assignElementToGrid = function(children){

	if(typeof(children) !== "undefined"){
		this.totalChildren += 1;
		children.classList.add("noJqS-inset");
		children.style.width = this.containerWidth+"px";
		children.style.height = this.containerHeight+"px";
		children.style.overflow = "hidden";
		this.transitionBlock.appendChild(children);
	}
}

njs.prototype.adjustTransitionBlock = function(){
	this.transitionBlock.style.width= (this.container.clientWidth * this.transitionBlock.children.length) + "px";
	this.transitionBlock.style.height= this.container.clientHeight + "px";
	this.transitionBlock.style.transition = "all ease "+(this.speed / 1000)+"s";
	this.transitionBlock.style.marginLeft = "0px";
}

njs.prototype.adjustChildren = function(){
	for(var i = 0 ; i < this.transitionBlock.children.length; i+=1){
		this.transitionBlock.children[i].style.display="inline-block";
		this.transitionBlock.children[i].style.position="relative";
	}
}

njs.prototype.addPagination = function(){

	if(typeof(this.pagination) === "string"){
		var paginationContainer = this.pagination;
		this.pagination = {};
		this.pagination.container = paginationContainer;
	}

	this.pagination.container = document.querySelector(this.pagination.container);

	if(typeof(this.pagination.classID) === "undefined"){
		this.pagination.classID = "current";
	}
	this.pagination.classTag = "."+this.pagination.classID;

	if(typeof(this.pagination.pattern) === "undefined"){
		this.pagination.pattern = '<li><a href="javascript:void(0)">'+nr+'</a></li>';
	}
	for (var nr = 1 ; nr <= this.totalChildren; nr +=1 ){
		this.pagination.container.innerHTML += this.pagination.pattern.replace("undefined", nr);
	}
	this.enablePagination();
}

njs.prototype.enablePagination = function(){

	for(var i = 0 ; i < this.pagination.container.children.length; i+=1){
		this.pagination.container.children[i].dataset.slideNumber = i+1;
		this.pagination.container.children[i].addEventListener('click',
			function(e){
				var target = e.target;

				while(typeof(target.dataset.slideNumber) === "undefined"){
					target = target.parentElement;
				}
				console.log(this.pagination.classID);
				this.removeCurrentPagination();
				target.classList.add(this.pagination.classID);
				this.goToSlide(target.dataset.slideNumber);
			}.bind(this),false);
	}
	this.pagination.container.children[0].classList.add(this.pagination.classID);	
}

njs.prototype.removeCurrentPagination = function(){
	if(this.pagination.container.querySelector(this.pagination.classTag)){
		this.pagination.container.querySelector(this.pagination.classTag).classList.remove(this.pagination.classID);
	}
}

njs.prototype.goToSlide = function(slideNumber){
	window.clearInterval(this.interval);
	this.transitionBlock.style.marginLeft = (((Number(slideNumber) - 1) * this.containerWidth) *-1) +"px";
	this.slideNumberActivate = Number(slideNumber) - 1;
	this.startAnimation();
}

njs.prototype.enableMouseHover = function(){
	this.container.addEventListener("mouseenter",function(){
		window.clearInterval(this.interval);
	}.bind(this),false);
	this.container.addEventListener("mouseout",function(){
		this.startAnimation();
	}.bind(this),false);
}

njs.prototype.startAnimation = function(){
	this.interval = window.setInterval( 
		function(){
			this.slideNumberActivate +=1;

			if(this.pagination){
				this.removeCurrentPagination();
			}

			if( this.slideNumberActivate < this.totalChildren){
				this.transitionBlock.style.marginLeft = ( parseFloat(this.transitionBlock.style.marginLeft) - this.containerWidth ) + "px";
				
			}else{
				this.transitionBlock.style.marginLeft = "0px";
				this.slideNumberActivate = 0;
				
			}

			if(this.pagination){
					this.pagination.container.children[this.slideNumberActivate].classList.add(this.pagination.classID);
			}
		}.bind(this), (this.speed + this.duration) );
}