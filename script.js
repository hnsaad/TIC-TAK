// Sélection de tous les éléments requis
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");

window.onload = ()=>{ // une fois la fenêtre chargée
    for (let i = 0; i < allBox.length; i++) { // ajouter l'attribut onclick à tous les spans disponibles
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=>{
    selectBox.classList.add("hide"); // cacher la boîte de sélection
    playBoard.classList.add("show"); // afficher la section du plateau de jeu
}

selectBtnO.onclick = ()=>{ 
    selectBox.classList.add("hide"); // cacher la boîte de sélection
    playBoard.classList.add("show"); // afficher la section du plateau de jeu
    players.setAttribute("class", "players active player"); // définir l'attribut de classe dans players avec les valeurs players active player
}

let playerXIcon = "fas fa-times"; // nom de classe de l'icône de croix de fontawesome
let playerOIcon = "far fa-circle"; // nom de classe de l'icône de cercle de fontawesome
let playerSign = "X"; // c'est une variable globale car nous avons utilisé cette variable dans plusieurs fonctions
let runBot = true; // c'est aussi une variable globale avec une valeur booléenne.. nous avons utilisé cette variable pour arrêter le bot une fois que quelqu'un a gagné ou que la partie est nulle

// fonction de clic utilisateur
function clickedBox(element){
    if(players.classList.contains("player")){
        playerSign = "O"; // si le joueur choisit (O), alors changer playerSign en O
        element.innerHTML = `<i class="${playerOIcon}"></i>`; // ajouter la balise d'icône de cercle à l'élément/boîte cliqué par l'utilisateur
        players.classList.remove("active"); // ajouter la classe active dans players
        element.setAttribute("id", playerSign); // définir l'attribut id dans le span/boîte avec le signe choisi par le joueur
    }else{
        element.innerHTML = `<i class="${playerXIcon}"></i>`; // ajouter la balise d'icône de croix à l'élément/boîte cliqué par l'utilisateur
        element.setAttribute("id", playerSign); // définir l'attribut id dans le span/boîte avec le signe choisi par le joueur
        players.classList.add("active"); // ajouter la classe active dans players
    }
    selectWinner(); // appeler la fonction selectWinner
    element.style.pointerEvents = "none"; // une fois qu'un utilisateur sélectionne une boîte, cette boîte ne peut plus être cliquée
    playBoard.style.pointerEvents = "none"; // ajouter pointerEvents none au plateau de jeu pour que l'utilisateur ne puisse pas cliquer immédiatement sur une autre boîte jusqu'à ce que le bot sélectionne
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed(); // générer un nombre aléatoire pour que le bot sélectionne une boîte non sélectionnée avec un délai aléatoire
    setTimeout(()=>{
        bot(runBot); // appeler la fonction bot
    }, randomTimeDelay); // passer la valeur de délai aléatoire
}

// fonction de sélection automatique du bot
function bot(){
    let array = []; // créer un tableau vide... nous allons stocker l'index des boîtes non cliquées
    if(runBot){ // si runBot est vrai
        playerSign = "O"; // changer playerSign en O donc si le joueur a choisi X, alors le bot sera O
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){ // si la boîte/span n'a pas d'enfants, c'est-à-dire la balise <i>
                array.push(i); // insérer le numéro/index des boîtes non cliquées dans le tableau
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)]; // obtenir un index aléatoire du tableau pour que le bot sélectionne une boîte non sélectionnée de manière aléatoire
        if(array.length > 0){ // si la longueur du tableau est supérieure à 0
            if(players.classList.contains("player")){ 
                playerSign = "X"; // si le joueur a choisi O, alors le bot sera X
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`; // ajouter la balise d'icône de croix à l'élément sélectionné par le bot
                allBox[randomBox].setAttribute("id", playerSign); // définir l'attribut id dans le span/boîte avec le signe choisi par le joueur
                players.classList.add("active"); // ajouter la classe active dans players
            }else{
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`; // ajouter la balise d'icône de cercle à l'élément sélectionné par le bot
                players.classList.remove("active"); // retirer la classe active dans players
                allBox[randomBox].setAttribute("id", playerSign); // définir l'attribut id dans le span/boîte avec le signe choisi par le joueur
            }
            selectWinner(); // appeler la fonction selectWinner
        }
        allBox[randomBox].style.pointerEvents = "none"; // une fois que le bot sélectionne une boîte, l'utilisateur ne peut plus cliquer sur cette boîte
        playBoard.style.pointerEvents = "auto"; // ajouter pointerEvents auto au plateau de jeu pour que l'utilisateur puisse à nouveau cliquer sur une boîte
        playerSign = "X"; // si le joueur a choisi X, alors le bot sera O, et nous changeons à nouveau le playerSign en X pour que l'utilisateur soit X car nous avons précédemment changé le playerSign en O pour le bot
    }
}

function getIdVal(classname){
    return document.querySelector(".box" + classname).id; // retourner la valeur de l'id
}
function checkIdSign(val1, val2, val3, sign){ // vérifier si toutes les valeurs d'id sont égales au signe (X ou O), si oui, alors retourner vrai
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
}
function selectWinner(){ // si l'une des combinaisons gagnantes suivantes correspond, alors sélectionner le gagnant
    if(checkIdSign(1,2,3,playerSign) || checkIdSign(4,5,6, playerSign) || checkIdSign(7,8,9, playerSign) || checkIdSign(1,4,7, playerSign) || checkIdSign(2,5,8, playerSign) || checkIdSign(3,6,9, playerSign) || checkIdSign(1,5,9, playerSign) || checkIdSign(3,5,7, playerSign)){
        runBot = false; // passer la valeur booléenne false à runBot pour que le bot ne fonctionne plus
        bot(runBot); // appeler la fonction bot
        setTimeout(()=>{ // après qu'un joueur a gagné, cacher le plateau de jeu et afficher la boîte de résultat après 700ms
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700); // 1s = 1000ms
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`; // afficher le texte du gagnant avec le signe du joueur (X ou O)
    }else{ // si toutes les boîtes/éléments ont une valeur d'id et que personne n'a encore gagné, alors la partie est nulle
        if(getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != ""){
            runBot = false; // passer la valeur booléenne false à runBot pour que le bot ne fonctionne plus
            bot(runBot); // appeler la fonction bot
            setTimeout(()=>{ // après que la partie est nulle, cacher le plateau de jeu et afficher la boîte de résultat après 700ms
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700); // 1s = 1000ms
            wonText.textContent = "Match has been drawn!"; // afficher le texte de la partie nulle
        }
    }
}

replayBtn.onclick = ()=>{
    window.location.reload(); // recharger la page actuelle au clic sur le bouton rejouer
}
