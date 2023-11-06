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
        const img = document.createElement('img');
        img.src = "img/horse.svg";
        
        grid.forEach(g =>{
            if (g.dataset.row == row && g.dataset.col == col){
                g.classList.toggle('active-start');
                // g.innerText = 'H';
                g.appendChild(img);
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

    function moveKnight(row, col){
        const grid = document.querySelectorAll('.col');
        const active = document.querySelector('.active-start');

        
        active.classList.toggle('active-start');
        active.innerText = '';
        const img = document.createElement('img');
        img.src = "img/horse.svg";

        grid.forEach(g =>{
            if (g.dataset.row == row && g.dataset.col == col){
                g.classList.toggle('active-start');
                g.innerText = '';
                g.appendChild(img);
            }
        })   
    }

    const getKnightPos = () =>{return [knightRow, knightCol]};
    const getEndPos = () => {return [endRow, endCol]};
    const getRow = () => {return row};
    const getCol = () => {return col};

    return {initializeGameboard, knightStartingPoint, knightEndPoint, 
        getRow, getCol, getKnightPos, getEndPos, moveKnight};
})();

const pathFinder = (()=>{
    let moveDelta = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, - 2],
        [-1, 2],
        [-1, -2]
    ];

    function inBounds(row, col){
        return (0 <= row && row < gameBoard.getRow() && 0 <= col && col < gameBoard.getCol());
    }
    
    function findPath(startRow, startCol, endPoint){
        let visitedGrid = [];
    
        for (let i = 0; i < 8; i++){
            visitedGrid.push([]);
            for(let j = 0; j < 8; j++){
                visitedGrid[i].push(0);
            }
        }
    
        let queue = [
            [[startRow, startCol]]
        ];
    
    
        while(queue.length > 0){
            // console.log("Queue: ", queue);
    
            let top = queue.shift();
    
    
            for (let i = 0; i < top.length; i++) {
                let pos = top[i];
                let moves = [];
    
                // console.log("POS: \t", pos);
                for (let j = 0; j < moveDelta.length; j++){
                    let delta = moveDelta[j];
                    let newRow = pos[0] + delta[0];
                    let newCol = pos[1] + delta[1];
                    
                    if (!inBounds(newRow, newCol) || visitedGrid[newRow][newCol] != 0) {
                        // console.log("OUT OF BOUNDS");
                        continue;
                    };
    
                    visitedGrid[newRow][newCol] = [pos[0],pos[1]];
                    if (newRow == endPoint[0] && newCol == endPoint[1]){
                        let currPoint = [newRow, newCol];
                        let path =[];
                        while(currPoint[0] != startRow || currPoint[1] != startCol){
                            path.push([currPoint[0], currPoint[1]]);
                            let prev = visitedGrid[currPoint[0]][currPoint[1]];
                            currPoint[0] = prev[0];
                            currPoint[1] = prev[1];
                        }
                        path.push(currPoint);
                        path.reverse();
                        // console.log("PATH: \t", path);
    
                        // console.log("FOUND SOLUTION");
                        // console.log(pos[0], pos[1]);
                        // console.log(newRow, newCol);
                        // console.log(visitedGrid);
                        return path;
                    }
                    moves.push([newRow, newCol]);
                    // console.log("Starting Pos: ", pos[0], pos[1]);
                    // console.log("Update Pos: ", newRow, newCol)
                }
    
                // console.log("MOVES\t", moves);
                // console.log("QUEUE: \t", queue);
                if (moves.length > 0) queue.push(moves);
            }
        }
    }
    
    return {findPath}
})();


function main(){
    gameBoard.initializeGameboard(8,8);
    gameBoard.knightStartingPoint(0,0);
    gameBoard.knightEndPoint(7,4);

    const path = pathFinder.findPath(gameBoard.getKnightPos()[0], gameBoard.getKnightPos()[1], gameBoard.getEndPos());
    console.log(JSON.stringify(path));
    
    let count = 1;
    path.forEach(p=>{
        console.log(p);
        setTimeout(()=>{gameBoard.moveKnight(p[0], p[1])}, 1000*count);
        count++;
    });
}


main();

