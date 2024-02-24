
function showCurrentPlayer(currentplayer){
    let player = currentplayer.textContent;
    currentplayer.classList.add('playerChoice')
    turnText.innerHTML = 'turn';
    currentTurn.innerHTML = player.charAt(0);
}

function generateComputerMove(compChoice){
    
    let player = (compChoice=='X') ? 'O' : 'X';


    // check for winning move 

    // for(let i=0;i<winningCombinations.length;i++){
    //     let [a,b,c] = winningCombinations[i];
    //     if(gameBoardArray[a[0]][a[1]].innerHTML == compChoice && gameBoardArray[b[0]][b[1]].innerHTML == compChoice
    //     && gameBoardArray[c[0]][c[1]].innerHTML == ''){
    //         console.log('Winning')
    //         return c;
    //     }
    // }


    // check for opponent block
    // for(let i=0;i<winningCombinations.length;i++){
    //     let [a,b,c] = winningCombinations[i];
    //     if(gameBoardArray[a[0]][a[1]].innerHTML != '' && gameBoardArray[b[0]][b[1]].innerHTML != '' && gameBoardArray[c[0]][c[1]].innerHTML == '' &&
    //     gameBoardArray[a[0]][a[1]].innerHTML != compChoice && gameBoardArray[b[0]][b[1]].innerHTML != compChoice){
    //         console.log("Oponent Block")
    //         return c;
    //     }
    // }
    for(let i=0;i<winningCombinations.length;i++){
        let [a,b,c] = winningCombinations[i];
        let cells = [gameBoardArray[a[0]][a[1]],gameBoardArray[b[0]][b[1]],gameBoardArray[c[0]][c[1]]];
        let playerCount = cells.filter(cell => cell.innerHTML == player).length;
        let compCount = cells.filter(cell => cell.innerHTML == compChoice).length;
        let emptyCellCount = cells.filter(cell => cell.innerHTML == '').length;
        let emptyCell = cells.find( cell => cell.innerHTML == '');
        let emptyCellIndex = [];
        for(let i=0;i<gameBoardArray.length;i++){
            for(let j=0;j<gameBoardArray[i].length;j++){
                if(gameBoardArray[i][j]==emptyCell){
                    emptyCellIndex.push(i);
                    emptyCellIndex.push(j);
                }
            }
        }
        if(playerCount == 2 && emptyCellCount == 1){
            return emptyCellIndex;
        }else if(compCount === 2 && emptyCellCount == 1){
            return emptyCellIndex;
        }
    }

    //  Try Center if available

    if(gameBoardArray[1][1].innerHTML == ''){
        return [1,1];
    }


    //  Try to take the corners

    const corners = [[0,0],[0,2],[2,0],[2,2]];
    for(let i=0;i<corners.length;i++){
        let [row,column] = corners[i];
        if(gameBoardArray[row][column].innerHTML == ''){
            return [row,column];
        }
    }


    // Take any available edges

    const edges = [[1,0],[2,1],[1,2],[0,1]];
    for(let i=0;i<edges.length;i++){
        let [row,column] = edges[i];
        if(gameBoardArray[row][column].innerHTML == ''){
            return [row,column];
        }
    }


    // look for all empty cells

    let emptyCells = [];
    for(let i=0;i<gameBoardArray.length;i++){
        for(let j=0;j<gameBoardArray[i].length;j++){
            if(gameBoardArray[i][j].innerHTML == ''){
                emptyCells.push([i,j]);
            }
        }
    }


    // randomly pick any empty cell

    for(let i=0;i<emptyCells.length;i++){
        console.log("Random Cell")
        return emptyCells[Math.floor(Math.random()*emptyCells.length)]
    }


}

function checkResult(choice){
    totalTurns++;
    let count = 0;
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(gameBoardArray[i][j].textContent==choice) count++;
        }
        if(count==3) return choice;
        else count=0;
    }
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(gameBoardArray[j][i].textContent==choice) count++;
        }
        if(count==3) return choice;
        else count=0;
    }
    if((gameBoardArray[0][0].textContent==choice && gameBoardArray[1][1].textContent==choice && gameBoardArray[2][2].textContent==choice) || (gameBoardArray[0][2].textContent==choice && gameBoardArray[1][1].textContent==choice && gameBoardArray[2][0].textContent==choice)){
        return choice;
    }
    if(totalTurns>=9) return'draw';
    return 'none';
}

function gameOver(player){
    gameBoard.classList.add('game-over');
    gameBoard.classList.remove('game-start');
    playerChoice[0].classList.remove('playerChoice');
    playerChoice[1].classList.remove('playerChoice');
    currentTurn.innerHTML = '';
    turnText.innerHTML = 'Game Over'
    if(player == 'X' && playerXCount!=0){
        playerXScore.innerHTML = playerXCount;
        resultText.innerHTML = 'Winner'
    } else if(player == 'O'&& playerOCount!=0){
        playerOScore.innerHTML = playerOCount;
        resultText.innerHTML = 'Winner'
    }
    if(player!=='draw'){
        playerWon.innerHTML = player;
    }else {
        playerWon.innerHTML = 'XO';
        resultText.innerHTML = 'DRAW'
    }
}

function restartGame(){
    gameBoard.classList.remove('game-over');
    boardCell.forEach(cell =>{
        cell.innerHTML = '';
    });
    currentTurn.innerHTML = '';
    turnText.innerHTML = 'Select Player'
    totalTurns = 0;
}

function updatePlayerTurn(currentPlayer){
    playerChoice.forEach(player =>{
        if(player.innerHTML[0]==currentPlayer){
            player.classList.add('playerChoice')
            currentTurn.innerHTML= player.innerHTML[0];
        } else {
            player.classList.remove('playerChoice')
        }
    })
}

function storeComputerChoice(compChoice){
    cellConatiner.classList.add('computer-turn');
    let compMove = generateComputerMove(compChoice);
    while(gameBoardArray[compMove[0]][compMove[1]].innerHTML.length!=0){
        compMove = generateComputerMove();
    }
    gameBoardArray[compMove[0]][compMove[1]].innerHTML = compChoice;
    let result = checkResult(compChoice)
    if(result==compChoice || result == 'draw'){
        if(result == 'draw'){
            gameOver(result);
        } else{
            (compChoice=='O') ? playerOCount++ : playerXCount++;
            gameOver(compChoice);
        }
        
    }
}



let playerChar;
let cellClickHandler = (cell) =>{
    if(cell.innerHTML.length<1){
        cell.innerHTML = playerChar; 
        let result = checkResult(playerChar)
        if(result==playerChar || result == 'draw'){
            if(result == 'draw'){
                gameOver(result);
            } else{
                (playerChar=='X') ? playerXCount++ : playerOCount++;
                gameOver(playerChar);
            }
            
        } else{
            let compChoice = (playerChar=='X')? 'O' : 'X';
            cellConatiner.classList.add('computer-turn');
            updatePlayerTurn(compChoice);
            setTimeout( ()=> {
                storeComputerChoice(compChoice)
                cellConatiner.classList.remove('computer-turn');
                updatePlayerTurn(playerChar)
            },2000);
            
        }
    }
 }

function startGame(playerPick){
    gameBoard.classList.add('game-start');
    playerChar = playerPick[0];
    boardCell.forEach(cell =>{
        if(!cell.hasAttribute('data-clicked')){
            cell.addEventListener('click',function(){
                cellClickHandler(cell);
            });
            cell.setAttribute('data-clicked',true);
        }
        
    });
}


function updateGameCellArray(){
    const rows = 3;
    const columns = 3;
    let cell = 0;
    for(let i=0;i<rows;i++){
        for(let j=0;j<columns;j++){
            gameBoardArray[i][j] = boardCell[cell];
            cell++;
        }
    }
}

const playerChoice = document.querySelectorAll('.player');
const gameBoard= document.getElementById('game-boardContainer');
const turnText = document.getElementById('turn-text');
const currentTurn = document.getElementById('current-turn');
const boardCell = document.querySelectorAll('.board-cell');
const cellConatiner = document.querySelector('.game-board');
const restartButton = document.getElementById('restartButton');
const playerWon = document.querySelector('.player-won');
const resultText = document.querySelector('.result-text');
const playerXScore = document.querySelector('.playerX-score');
const playerOScore = document.querySelector('.playerO-score');
let playerXCount = 0;
let playerOCount = 0;
let totalTurns = 0;
let gameBoardArray = [
    [],
    [],
    []
];
const winningCombinations = [
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]]
];
playerChoice.forEach(player =>{
    player.addEventListener('click', () =>{
        updateGameCellArray();
        startGame(player.textContent);
        showCurrentPlayer(player);
    })
})

restartButton.addEventListener('click', ()=>{
    restartGame();
});















