
//****** GAME LOOP ********//

let time = new Date();
let deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    
    document.addEventListener("click", Init); 

}

function Init() {
    time = new Date();

    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

let sueloY = 22;
let velY = 0;
let impulso = 900;
let gravedad = 2500;

let santaPosX = 42;
let santaPosY = sueloY; 

let sueloX = 0;
let velEscenario = 1280/3;
let gameVel = 1;
let score = 0;

let parado = false;
let saltando = false;

let tiempoHastaObstaculo = 2;
let tiempoObstaculoMin = 0.7;
let tiempoObstaculoMax = 1.8;
let obstaculoPosY = 16;
let obstaculos = [];

let contenedor;
let santa;
let textoScore;
let suelo;
let gameOver;
let bg;
let btn;

function Start() {
    gameOver = document.querySelector(".game-over");
    btn = document.querySelector(".restart");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    santa = document.querySelector(".santa");
    bg = document.querySelector(".bg");
    document.addEventListener("keydown", HandleKeyDown);
    document.addEventListener("click", Saltar());
    santa.classList.add("santa-corriendo");

}

// document.querySelector(".restart").addEventListener("click", ()=>{
//     console.log('click');
//     Init();
// });

function Update() {
    if(parado) return;
    
    MoverSanta();
    MoverSuelo();
    MoverBG();
    DecidirCrearObstaculos();
    MoverObstaculos();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        Saltar();
    }
}


function Saltar(){
    if(santaPosY === sueloY){
        saltando = true;
        velY = impulso;
        santa.classList.remove("santa-corriendo");
    }
}

function MoverSanta() {
    santaPosY += velY * deltaTime;
    if(santaPosY < sueloY){
        
        TocarSuelo();
    }
    santa.style.bottom = santaPosY+"px";
}

function TocarSuelo() {
    santaPosY = sueloY;
    velY = 0;
    if(saltando){
        santa.classList.add("santa-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}
function MoverBG(){
    sueloX +=1;
    bg.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    santa.classList.remove("santa-corriendo");
   santa.classList.add("santa-estrellado");
    parado = true;
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("snowman");
    if(Math.random() > 0.5) obstaculo.classList.add("stone");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
}


function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if(score == 5){
        gameVel = 1;
    }else if(score == 10) {
        gameVel = 1.2;

    } else if(score == 20) {
        gameVel = 1.5;
     
    }
    suelo.style.animationDuration = (2/gameVel)+"s";
}

function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
    btn.style.display="block";

}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > santaPosX + santa.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(santa, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}


