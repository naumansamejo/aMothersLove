var Typer = function(element) {
this.element = element;
var delim = element.dataset.delim || ",";
var words = element.dataset.words || "override these,sample typing";
this.words = words.split(delim).filter((v) => v); // non empty words
this.delay = element.dataset.delay || 200;
this.loop = element.dataset.loop || "true";
if (this.loop === "false" ) { this.loop = 1 }
this.deleteDelay = element.dataset.deletedelay || element.dataset.deleteDelay || 800;

this.progress = { word: 0, char: 0, building: true, looped: 0 };
this.typing = true;

var colors = element.dataset.colors || "black";
this.colors = colors.split(",");
this.element.style.color = this.colors[0];
this.colorIndex = 0;

this.doTyping();
};

Typer.prototype.start = function() {
if (!this.typing) {
    this.typing = true;
    this.doTyping();
}
};
Typer.prototype.stop = function() {
this.typing = false;
};
Typer.prototype.doTyping = function() {
var e = this.element;
var p = this.progress;
var w = p.word;
var c = p.char;
var currentDisplay = [...this.words[w]].slice(0, c).join("");
var atWordEnd;
if (this.cursor) {
    this.cursor.element.style.opacity = "1";
    this.cursor.on = true;
    clearInterval(this.cursor.interval);
    this.cursor.interval = setInterval(() => this.cursor.updateBlinkState(), 400);
}

e.innerHTML = currentDisplay;

if (p.building) {
    atWordEnd = p.char === this.words[w].length;
    if (atWordEnd) {
    p.building = false;
    } else {
    p.char += 1;
    }
} else {
    if (p.char === 0) {
    p.building = true;
    p.word = (p.word + 1) % this.words.length;
    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    this.element.style.color = this.colors[this.colorIndex];
    } else {
    p.char -= 1;
    }
}

if (p.word === this.words.length - 1) {
    p.looped += 1;
}

if (!p.building && this.loop <= p.looped){
    this.typing = false;
}

setTimeout(() => {
    if (this.typing) { this.doTyping() };
}, atWordEnd ? this.deleteDelay : this.delay);
};

var Cursor = function(element) {
this.element = element;
this.cursorDisplay = element.dataset.cursordisplay || element.dataset.cursorDisplay || "_";
element.innerHTML = this.cursorDisplay;
this.on = true;
element.style.transition = "all 0.1s";
this.interval = setInterval(() => this.updateBlinkState(), 400);
}
Cursor.prototype.updateBlinkState = function() {
if (this.on) {
    this.element.style.opacity = "0";
    this.on = false;
} else {
    this.element.style.opacity = "1";
    this.on = true;
}
}



var t;
function TyperSetup() {
var typers = {};
for (let e of document.getElementsByClassName("typer")) {
    typers[e.id] = new Typer(e);
}
for (let e of document.getElementsByClassName("typer-stop")) {
    let owner = typers[e.dataset.owner];
    e.onclick = () => owner.stop();
}
for (let e of document.getElementsByClassName("typer-start")) {
    let owner = typers[e.dataset.owner];
    e.onclick = () => owner.start();
}
for (let e of document.getElementsByClassName("cursor")) {
    let t = new Cursor(e);
    t.owner = typers[e.dataset.owner];
    t.owner.cursor = t;
}



t = typers;
}

TyperSetup();





noTyped = true;
document.addEventListener("keyup", function(e){
    
    if(document.getElementById("main-terminal").classList.contains("l-1") && !t.main.typing && noTyped ){
        
        if(e.keyCode == 89){
            // yes
            document.getElementById("send-msg").removeAttribute("data-hidden");
            windowOrder.call(document.getElementById("send-msg"));

        }else if(e.keyCode == 78){
            // no
        }

        document.querySelector("#main-terminal .typer").innerHTML += "<i></i>";
        
        noTyped = false;
    }

});







document.addEventListener("DOMContentLoaded", function(){


    document.getElementById("main-terminal").focus();
    
    var dragging = false,
        mainElem = false, dX, dY, delems = document.querySelectorAll(".terminal-main header");
    



    for(i=0; i<delems.length; i++){

        delems[i].addEventListener("mousedown", function(e){
            dragging = true;
            mainElem = this.parentNode.parentNode;
            

            dX = e.clientX - mainElem.getBoundingClientRect().x;
            dY = e.clientY - mainElem.getBoundingClientRect().y;
        });

    }

    
    
    document.addEventListener("mousemove", function(e){
        
        if(dragging && mainElem){
            
            var theX = e.clientX - dX,
                theY = e.clientY - dY;
            
            mainElem.style.transform = `translate3d(${theX}px,${theY}px,0)`;

        }
    
    });
    document.addEventListener("mouseup", function(){
        dragging = false;

    });



    
    var terminals = document.getElementsByClassName("terminal-main");


    for(i=0; i<terminals.length; i++){
        terminals[i].addEventListener("mousedown", windowOrder );
    }




    setTimeout(function(){

        var mailBox = document.getElementById("mail-box");
        windowOrder.call(mailBox);

        var myInt = setInterval(function(){

            if(mailBox.hasAttribute("data-hidden")){
                mailBox.removeAttribute("data-hidden");
            }else{
                mailBox.setAttribute("data-hidden", "");
            }
            
        }, 600);



        mailBox.addEventListener("click", function(){
            clearInterval(myInt);
        });


    }, 19000);


});




var windowOrder = function(){

    elems = document.getElementsByClassName("terminal-main");



    if(!this.classList.contains("l-1")){
        for(i=0; i<elems.length; i++){
            elem = elems[i];
            
            if(elem.classList.contains("l-1")){
                elem.classList.remove("l-1");
                elem.classList.add("l-2");
                continue;
            }
            
            if(elem.classList.contains("l-2")){
                elem.classList.remove("l-2");
                elem.classList.add("l-3");
                continue;
            }
    
        }
        
        this.classList = "l-1 terminal-main";
        this.focus();

    }
}


