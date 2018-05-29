var canvas, c, keys;
var score = 0;
canvas = document.getElementById("canvas");
c= canvas.getContext("2d");
canvas.height= 300;
canvas.width= window.innerWidth;

var lost = false;
var opponents = [];
var bt = document.getElementById("bt");
var name = document.getElementById("name").value;
var sub = document.getElementById("sub");

function setup() {
  canvas.height= 300;
  canvas.width= window.innerWidth;
  draw();
  p.update();
}

function clear(){
c.fillStyle ="black";
c.fillRect( 0, 0, canvas.width, canvas.height);
}
function draw()
{
  canvas.width= window.innerWidth;
  clear();
  if(!lost)
  {
  c.fillStyle ="lime";
  c.font = "30px Arial";
  c.fillText("Score: "+ score, 50,50);
  p.update();

  for( var j=0; j< opponents.length; j++)
  {
     opponents[j].update();
      opponents[j].hit(p);
      if(opponents[j].getY()== canvas.height + 30){
        opponents.splice(j,1);
      }
 }
}
else{
  clear();
  c.fillStyle ="lime";
  c.font = "50px Arial";
  c.fillText("Game Over", canvas.width/2,canvas.height/2);
  c.font = "30px Arial";
  c.fillText("Score: "+ score, 50,50);
 }
}
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDkgSu1frbmlTWVYPy8c8vMib_xN-X8Y6E",
    authDomain: "project-1-e481f.firebaseapp.com",
    databaseURL: "https://project-1-e481f.firebaseio.com",
    projectId: "project-1-e481f",
    storageBucket: "",
    messagingSenderId: "336253882287"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var ref = database.ref("scores");
ref.on("value",gotData, errData);

function clearData() {
  var elementss = document.getElementById("scores");
  elementss.innerHTML ="";
}
function displayData(name ,score ) {

var element = document.getElementById("scores");
var parent = document.createElement("tr");
var subparaName = document.createElement("td");
var subparaScore = document.createElement("td");
var nodeName = document.createTextNode(name);
var nodeScore = document.createTextNode(score);

subparaName.appendChild(nodeName);
subparaScore.appendChild(nodeScore);
parent.appendChild(subparaName);
parent.appendChild(subparaScore);
element.appendChild(parent);
}

function gotData(data) {
  if(data.val() != null){
    scores = data.val();
    keys = Object.keys(scores);

   clearData();

    for(var i = 0; i< keys.length; i++)
    {
      var k = keys[i];
      var inital = scores[k].name;
      var scoress = scores[k].score;
      displayData(inital,scoress);
    }
  }
}

function errData (err){}

function submit()
{
  var data = {
  name:document.getElementById("name").value,
  score: score
  }
  ref.push(data);
  score = 0;
  draw();
}


function player(){
  this.x = canvas.height/2;
  this.y = canvas.height - 20;
  this.speed = 5;

  this.draw = function (){
  c.fillRect(this.x, this.y, 50, 20);
  }

  this.update = function(){
      this.draw();
  }

  this.move = function (dir){
    if(dir == "right"){
      this.x += 5;
    }
    else if (dir == "left") {
      this.x -=5;
    }
      console.log(event.keyCode);
  }
  this.checkX = function(){
    return this.x;
  }

  this.checkY = function(){
    return this.y;
  }
}


function opponent(){
this.x = Math.random()* canvas.width;
this.y = 0;
this.speed = 5;

this.draw = function(){
  c.fillStyle ="red";
  c.fillRect(this.x, this.y, 20, 20);

  }
  this.update = function(){
    this.fall();
    this.draw();
  }
  this.fall = function(){
    this.y += 5;
  }

  this.hit = function (other){
  var dist = Math.pow(Math.pow(((this.x/2) - other.checkX()/2),2) + Math.pow((this.y/2) - (other.checkY()/2),2),1/2);
  if(dist < 17)
  {
    lost = true;
  }
  }

  this.getY = function(){
    return this.y;
  }
}


var movePlayer = function(event){
  if (event.keyCode == 68){
  p.move("right");
  }
  else if (event.keyCode == 65) {
  p.move("left");
  }
}

var p = new player();

function create() {
  for( var  i=0; i<Math.floor(Math.random()* 10); i++)
  {
  opponents.push(new opponent());
  }

  if(!lost)
  {
  score++;
}
}

function reset(){
  score = 0;
  lost = false;
  opponents.splice(0, opponents.length);
}

window.onload = setup();
window.setInterval(draw,50);
window.setInterval(create,750);
window.addEventListener ("keydown", movePlayer);
bt.addEventListener("click",reset);
sub.addEventListener("click",submit);
