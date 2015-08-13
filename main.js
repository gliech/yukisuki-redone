//config
var alwaysOpen = false;
var randomMascots = false;
var mascots = [
	"mascots/jew.png",
	"mascots/cat.png",
	"mascots/dontdoit.jpg"];
//advanced config
var contractedBorder = "0px";
var squareHeightMultiplierExpanded = 2;
var squareHeightMultiplierAlwayOpen = 1.5;


//variables
var bdrTop;
var bdrBtm;
var square;
var visibility = false;


//functions
// keep the squares vertically centred when the window is resized
function fixJitter(container){
	container.style.height = window.innerHeight - 0.5 + "px";
}


// return a random picture from a list
function selectRandomPic(pictures){
	return pictures[Math.floor(Math.random()*pictures.length)];
}


// show or hide the help-popup
function popup(obj){
	if(!visibility){
		obj.style.bottom = "0";
	}else{
		obj.style.bottom = popupHeight;
	}
	visibility = !visibility;
}


// expanding and contracting squares
function expand(){
	this.style.borderTopWidth = bdrTop;
	this.style.borderBottomWidth = bdrBtm;
	this.style.height = 
		squareHeightMultiplierExpanded * squareHeight +
		this.contentHeight +
		"px";
}


function contract(){
	this.style.height = squareHeight + "px";
	this.style.borderTopWidth = contractedBorder;
	this.style.borderBottomWidth = contractedBorder;
}


// string replacement
String.prototype.replaceChars = function(character, replacement){
	var str = this;
	var a;
	var b;
	for(var i=0; i < str.length; i++){
		if(str.charAt(i) == character){
			a = str.substr(0, i) + replacement;
			b = str.substr(i + 1);
			str = a + b;
		}
	}
	return str;
}


function search(query){
	switch(query.substr(0, 2)){
		case "-h":
			popup(popupDiv);
			break;
		case "-g":
			query = query.substr(3);
			window.location = "https://www.google.com/#q=" +
				query.replaceChars(" ", "+");
			break;
		case "-a":
			query = query.substr(3);
			window.location = "https://duckduckgo.com/?q=" +
				query.replaceChars(" ", "+");
			break;
		case "-d":
			query = query.substr(3);
			window.location = "http://danbooru.donmai.us/posts?tags=" +
				query.replaceChars(" ", "+");
			break;
		case "-y":
			query = query.substr(3);
			window.location =
				"https://www.youtube.com/results?search_query=" +
				query.replaceChars(" ", "+");
			break;
		case "-n":
			query = query.substr(3);
			window.location = "http://www.nicovideo.jp/search/" +
				query.replaceChars(" ", "%20");
			break;
		case "-p":
			query = query.substr(3);
			window.location =
				"http://www.pixiv.net/search.php?s_mode=s_tag&word=" +
				query.replaceChars(" ", "%20");
			break;
		default:
			window.location="https://www.google.com/#q=" +
				query.replaceChars(" ", "+");
	}
}


//main
window.onload = function(){
	// load the border width into js and then set it to 0
	square = $(".sqr")
	bdrTop = square.css("border-top-width");
	bdrBtm = square.css("border-bottom-width");
	if(!alwaysOpen){
		square.css("border-top-width", contractedBorder);
		square.css("border-bottom-width", contractedBorder);
	}
	if(square.css("transition-property") == "none"){ //don't ask
		square.css("-moz-transition-property", "all");
		square.css("-webkit-transition-property", "all");
		square.css("-o-transition-property", "all");
		square.css("transition-property", "all");
	}
	
	//load the height of a contracted square into js
	squareHeight = parseInt(square.css("height"), 10);
	
	// select a mascot randomly from the mascots list
	if(randomMascots){
		$("#mascot").css("backgroundImage", "url('" +  selectRandomPic(mascots) + "')");
	}
	
	// fixJitter
	container = document.getElementById("container");
	fixJitter(container);
	
	// popup
	popupDiv = document.getElementById("popup");
	popupHeight = $("#popup").css("bottom");
	popupDiv.addEventListener("click", function(){
		popup(popupDiv);
	});
	
	// search
	searchinput = document.getElementById("searchinput");
	if(!!searchinput){
		searchinput.addEventListener("keypress", function(a){
			var key = a.keyCode;
			if(key == 13){
				var query = this.value;
				search(query);
			}
		});
	}

	// jump to search when tab is pressed
	document.addEventListener("keypress", function(a){
		var key = a.keyCode;
		if(key == 9){
			if(!alwaysOpen){
				expand.call( document.getElementById("search_sqr") );
			}
			document.getElementById("searchinput").focus();
		}
		if([9].indexOf(key) > -1) {
			a.preventDefault();
		}
	});

	// adding event listeners to squares or expanding them onload
	var sqr = document.querySelectorAll(".sqr");
	if(!alwaysOpen){
		for(var i = 0; i < sqr.length; ++i) {
			sqr[i].contentHeight = $( sqr[i].getElementsByClassName("content") ).height();
			sqr[i].addEventListener("mouseover", expand, false);
			sqr[i].addEventListener("mouseout", contract, false);
		}
	}else{
		var maxContentHeight = 0;
		for(var x = 0; x < sqr.length; ++x){
			elementContentHeight = $( sqr[x].getElementsByClassName("content") ).height();
			if(maxContentHeight < elementContentHeight){
				maxContentHeight = elementContentHeight;
			}
		}
		for(var i = 0; i < sqr.length; ++i){
			sqr[i].style.height = 
				squareHeightMultiplierAlwayOpen * squareHeight + 
				maxContentHeight + 
				"px";
		}
	}
}


window.onresize = function(){
	fixJitter(container);
}
