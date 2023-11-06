const gameBoard = (() =>{
    let knightRow;
    let knightCol;
    let row;
    let col;
    let endRow;
    let endCol;


    const main = document.getElementById('main-content');

    function initializeGameboard(m,n){
        row = m;
        col = n;

        main.innerText = '';
        let count = 0;
        for (let i = 0; i < m; i++){
            const row = document.createElement('div');
            row.classList.add('row');
            for(let j = 0; j < n; j++){
                const col = document.createElement('div');
                col.classList.add('col');
                col.dataset.row = i;
                col.dataset.col = j;
                if (count % 2 == 0) col.style.backgroundColor = 'white';

                row.appendChild(col);
                count ++;
            }
            count ++;
            main.appendChild(row);
        }

    }

    function knightStartingPoint(row, col){
        knightRow = row;
        knightCol = col;

        const grid = document.querySelectorAll('.col');
        
        grid.forEach(g =>{
            if (g.dataset.row == row && g.dataset.col == col){
                g.classList.toggle('active-start');
                g.innerText = 'H';
            }
        })
    }

    function knightEndPoint(row, col){
        endRow = row;
        endCol = col;
        const grid = document.querySelectorAll('.col');

        grid.forEach(g =>{
            if (g.dataset.row == row && g.dataset.col == col){
                g.classList.toggle('active-end');
                g.innerText = 'E';
            }
        })
    }


    const getKnightPos = () =>{return [knightRow, knightCol]};
    const getEndPos = () => {return [endRow, endCol]};
    const getRow = () => {return row};
    const getCol = () => {return col};

    return {initializeGameboard, knightStartingPoint, knightEndPoint, 
        getRow, getCol, getKnightPos, getEndPos};
})();

gameBoard.initializeGameboard(8,8);
gameBoard.knightStartingPoint(0,1);
gameBoard.knightEndPoint(1,1);


function inBounds(row, col){
    return (0 <= row && row < gameBoard.getRow() && 0 <= col && col < gameBoard.getCol());
}

let possiblePaths = [];
let visitedGrid = [];

for (let i = 0; i < gameBoard.getRow(); i++){
    visitedGrid.push([]);
    for(let j = 0; j < gameBoard.getCol(); j++){
        visitedGrid[i].push(0);
    }
}

function getPossibleMoves(startRow, startCol, endPoint, path, visited){
    if (possiblePaths.length > 0 && possiblePaths[0].length < path) return;
    if (!inBounds(startRow, startCol) || visited[startRow][startCol] === 1){
        return;
    }
    if (startRow === endPoint[0] && startCol === endPoint[1]){
        possiblePaths.push(path);
        alert("TEST");
        console.log(JSON.stringify(possiblePaths));
        alert("onetwo");
        return;
    }

    console.log(startRow, startCol);
    path.push([startRow, startCol]);
    visited[startRow][startCol] = 1;
    console.log(JSON.stringify(path));
    // console.log("PATH: \t", path);
    // console.log(visited);
    

    getPossibleMoves(startRow + 2, startCol + 1, endPoint, path, visited);
    getPossibleMoves(startRow + 2, startCol - 1, endPoint, path, visited);
    getPossibleMoves(startRow - 2, startCol + 1, endPoint, path, visited);
    getPossibleMoves(startRow - 2, startCol - 1, endPoint, path, visited);

    getPossibleMoves(startRow + 1, startCol + 2, endPoint, path, visited);
    // getPossibleMoves(startRow + 1, startCol - 2, endPoint, path, visited);
    // getPossibleMoves(startRow - 1, startCol + 2, endPoint, path, visited);
    // getPossibleMoves(startRow - 1, startCol - 2, endPoint, path, visited);

    visited[startRow][startCol] = 0;
    path.pop();

    return;
}

let path = [];

console.log(visitedGrid);
getPossibleMoves(gameBoard.getKnightPos()[0] , gameBoard.getKnightPos()[1], [gameBoard.getEndPos()[0], gameBoard.getEndPos()[1]], path, visitedGrid);
// console.log(possiblePaths);

// TODO BFS?