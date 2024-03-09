"use strict";

window.onload = function() {
	// add functionality to the button
	document.getElementById("startButton").addEventListener("click", playNow);
	// add style
	addStyle();
}

// button click function
function playNow() {
	// get the value of the input
	var symbols = parseInt(document.getElementById("numSymbols").value);
	// if it's not a number or blank, default to 1
	if (isNaN(symbols) || symbols === "") { symbols = 1; }
	// if it's more than 8, default to 8
	if (symbols > 8) { symbols = 8; }
	// hide the input and button
	document.getElementById("startForm").style.display = "none";
	// run the function to make the game
	createGame(symbols);
}

// create the game board based on user input number
function createGame(symbols) {
	// some math to determine a square board
	var rows = Math.floor(Math.sqrt(symbols*2));
	var cols = Math.floor(Math.sqrt(symbols*2));
	// if not enough cells (row x col), add a column
	while (rows * cols < symbols * 2) {
		cols += 1;
		// if, after adding a column, there are too many cells, take away a row
		if (rows * cols > symbols * 2) { rows -= 1; }
	}
	// set symbol set
	var symbolSet = ["&#9791;",
					"&#9792;",
					"&#9794;",
					"&#9795;",
					"&#9796;",
					"&#9797;",
					"&#9798;",
					"&#9799;"];
	// randomize
	for (var i = symbolSet.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * i);
		var k = symbolSet[i];
		symbolSet[i] = symbolSet[j];
		symbolSet[j] = k;
	}
	// remove extras depending on input amount
	symbolSet.splice(symbols, 8-symbols);
	// duplicate
	for (var i = 0; i < symbols; i++) {
		symbolSet.push(symbolSet[i]);
	}
	// randomize again
	for (var i = symbolSet.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * i);
		var k = symbolSet[i];
		symbolSet[i] = symbolSet[j];
		symbolSet[j] = k;
	}
	// create the counter
	var gameCount = document.createElement("div");
	gameCount.setAttribute("id", "gameCount");
	gameCount.innerHTML = "Guesses: ";
	var countNum = document.createElement("span");
	countNum.setAttribute("id", "countNum");
	countNum.innerHTML = 0;
	gameCount.appendChild(countNum);
	var gameDiv = document.getElementById("game");
	document.body.insertBefore(gameCount, gameDiv);
	// create the table for the board
	var gameTable = document.createElement("table");
	gameTable.setAttribute("id", "gameTable");
	gameDiv.appendChild(gameTable);
	// create the rows and cells
	for (var i = 0; i < rows; i++) {
		var gameRow = document.createElement("tr");
		gameTable.appendChild(gameRow);
		for (var j = 0; j < cols; j++) {
			var gameCell = document.createElement("td");
			gameRow.appendChild(gameCell);
			gameCell.innerHTML = "&#9728;";
			gameCell.setAttribute("class", "back");
			// assign symbol
			gameCell.setAttribute("symbol", symbolSet.pop());
			// add mouseover shadow effect
			gameCell.addEventListener("mouseover", function(e) {
				e.target.style.boxShadow = "black 5px 5px 10px";
			});
			gameCell.addEventListener("mouseout", function(e) {
				e.target.style.boxShadow = "";
			});
			// add click event
			gameCell.addEventListener("click", clickCard);
		}
	}
}

// card click function
function clickCard(e) {
	var revealed = document.querySelectorAll("td.reveal");
	// only "back" cards will be revealed, and only one pair at a time
	if (e.target.getAttribute("class") === "back" && revealed.length < 2) {
		// change class to "reveal" and show the symbol
		e.target.setAttribute("class", "reveal");
		e.target.innerHTML = e.target.getAttribute("symbol");
		revealed = document.querySelectorAll("td.reveal");
		// if this is the second card revealed...
		if (revealed.length === 2) {
			// update the counter
			var guesses = parseInt(document.getElementById("countNum").innerHTML);
			guesses += 1;
			document.getElementById("countNum").innerHTML = guesses;
			// if they match, then change to "done"
			if (revealed[0].getAttribute("symbol") === revealed[1].getAttribute("symbol")) {
				revealed[0].setAttribute("class", "done");
				revealed[1].setAttribute("class", "done");
				revealed[0].removeEventListener("click", clickCard);
				revealed[1].removeEventListener("click", clickCard);
				// if there are no cards left, run the win function
				if (document.querySelectorAll("td.back").length === 0) {
					youWin();
				}
			// if not, wait 1 sec then change back to "back"
			} else {
				setTimeout(function() {
						revealed[0].setAttribute("class", "back");
						revealed[1].setAttribute("class", "back");
						revealed[0].innerHTML = "&#9728;";
						revealed[1].innerHTML = "&#9728;";
					}, 1000);
			}
		}
	}
}

// win functions
function youWin() {
	var rgb1 = 212;
	var rgb2 = 212;
	var rgb3 = 212;
	var timer = setInterval(function() {
			// fade to black
			rgb1 -= 1;
			rgb2 -= 1;
			rgb3 -= 1;
			gameTable.style.backgroundColor = "rgb(" + rgb1 + "," + rgb2 + "," + rgb3 + ")";
			if (rgb1 === 0) {
				// remove game space
				document.body.removeChild(document.getElementById("game"));
				// add win text
				var winDiv = document.createElement("div");
				document.body.appendChild(winDiv);
				winDiv.setAttribute("id", "win");
				winDiv.setAttribute("class", "winB");
				winDiv.innerHTML = "&#9728; &#9791; &#9792; &#9794; &#9795; &#9796; &#9797; &#9798; &#9799;<br /> \
									You win!<br /> \
									&#9728; &#9791; &#9792; &#9794; &#9795; &#9796; &#9797; &#9798; &#9799;";
				colorFlash();
				clearInterval(timer);
			}
		}, 10);
}

function colorFlash() {
	var switchColor = 1;
	setInterval(function() {
			if (switchColor === 1) {
				document.getElementById("win").setAttribute("class", "winW");
				switchColor = 0;
			} else {
				document.getElementById("win").setAttribute("class", "winB");
				switchColor = 1;
			}
		}, 400);
}

// style
function addStyle() {
	var style1 = document.createElement("style");
	document.head.appendChild(style1);
	document.styleSheets[0].insertRule (
		"table { \
			background-color: rgb(211,211,211); \
			border-spacing: 20px; \
			font-size: 30px; \
		}",0);
	document.styleSheets[0].insertRule (
		"td.back { \
			background: linear-gradient(to bottom right, blue 25%, navy); \
			color: gold; \
			border: 5px solid gold; \
			height: 100px; \
			width: 65px; \
			text-align: center; \
		}",1);
	document.styleSheets[0].insertRule (
		"td.reveal, td.done { \
			background: linear-gradient(to bottom right, lightgray, white 50%); \
			color: black; \
			border: 5px solid black; \
			height: 100px; \
			width: 65px; \
			text-align: center; \
		}",2);
	document.styleSheets[0].insertRule (
		"div.winB { \
			background: black; \
			color: white; \
			font-size: 24px; \
			text-align: center; \
			width: 300px \
		}",3);
	document.styleSheets[0].insertRule (
		"div.winW { \
			background: white; \
			color: black; \
			font-size: 24px; \
			text-align: center; \
			width: 300px \
		}",4);
	document.styleSheets[0].insertRule (
		"div#gameCount { \
			background: gold; \
			font-size: 24px; \
			text-align: center; \
			width: 200px \
		}",5);
}