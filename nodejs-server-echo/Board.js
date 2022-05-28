import Spot from "./Spot.js";
class Board{
    constructor(){
        this.board = [];
        this.player1 = null;
        this.player2 = null;
        this.rows = 9;
        this.cols = 9;
        this.home = null;
        this.target = null;
        this.path = [];
        this.turn = null;

    }//end-constructor

    SetBoard = () => {
        for(let i = 0; i < this.rows; ++i){
            let row = [];
            for(let j = 0; j < this.cols; ++j){
                let spot = new Spot();
                spot.I = i;
                spot.J = j;

                row.push(spot);
            }
            this.board.push(row);
        }
        this.SetNeighbors();
    }//end-func

    ShowBoard = () => {
        for(let i = 0; i < this.rows; ++i){
            for(let j = 0; j < this.cols; ++j){
                if(this.board[i][j].isFilled == false){
                    process.stdout.write("[ ]");
                    continue;
                }
                if(this.board[i][j].ShapeType == 0){
                    process.stdout.write("[0]");
                }
                if(this.board[i][j].ShapeType == 1){
                    process.stdout.write("[1]");
                }
                if(this.board[i][j].ShapeType == 2){
                    process.stdout.write("[2]");
                }
                
            }
            process.stdout.write("\n");
        }
    }//end-func
    
    Judge = () => {
        return 3;
    }//end-func
    ClearSpotsAfterSuccess = (n, m, type) => {
        if(type == 0)
        {
            for(let i = m; i < m+5; ++i)
            {
                this.board[n][i].isFilled = false;
                this.board[n][i].ShapeType = null;
            }
        }
        else
        {
            for(let i = n; i < n + 5; ++i)
            {
                this.board[i][m].isFilled = false;
                this.board[i][m].ShapeType = null;
            }
        }
    }
    SendClearRequest = (dtc) => {
        var data = JSON.stringify(dtc);
        this.player1.send(data);
        this.player2.send(data);
        
    }
    CheckForPoints = (dtc) => {
        var point = this.Judge();
        for(let i = 0; i < this.rows; ++i)
        {
            for(let j = 0; j < this.cols; j++){
                if(this.RoWise(i, j))
                {
                    console.log(`${this.turn.Username} earned points!! Row Wise`);
                    console.log(`turn was: ${this.turn.Username}`);
                    if(this.turn.Username == this.player1.Username){
                        this.player1.Score += point;
                    }
                    else{
                        this.player2.Score += point;
                    }
                    console.log(`${this.player1.Username}: ${this.player1.Score}`);
                    console.log(`${this.player2.Username}: ${this.player2.Score}`);

                    dtc.Type = "clear-spots-request";
                    dtc.ClearSpotsData = [i, j, 0]
                    this.SendClearRequest(dtc);
                    
                    this.ClearSpotsAfterSuccess(i, j, 0);
                }
                if(this.CoWise(i, j))
                {
                    console.log(`${this.turn.Username} earned points!! Col Wise`);
                    
                    if(this.turn.Username == this.player1.Username){
                        this.player1.Score += point;
                    }
                    else{
                        this.player2.Score += point;
                    }
                    console.log(`${this.player1.Username}: ${this.player2.Score}`);
                    console.log(`${this.player2.Username}: ${this.player2.Score}`);

                    dtc.Type = "clear-spots-request";

                    dtc.ClearSpotsData = [i, j, 1]
                    this.SendClearRequest(dtc);

                    this.ClearSpotsAfterSuccess(i, j, 1);
                }
            }
        }
    }//end-func

    SpecifyShapeLocation = () => {
        while(true){
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            var alreadyExists = this.board[row][col].isFilled;
            if(alreadyExists) continue;
            return [row, col];
        }
    }//end-func

    SpecifyShape = () => {
        let shapeType = Math.floor(Math.random() * 3);
        return shapeType;
    }

    SetCellShape = () => {
        let coordinates = this.SpecifyShapeLocation();
        let n = coordinates[0];
        let m = coordinates[1];
        this.board[n][m].isFilled = true;
        this.board[n][m].ShapeType = this.SpecifyShape();
        return coordinates;
    }//end-func


    PlaceShapes = () => {
        let coordinates = [];
        for(let i = 0; i < 3; ++i){
            coordinates.push(this.SetCellShape());
        }
        return coordinates;
    }//end-func

    SwapSpots = (a, b) => {
        //Spot a, Spot b
        b.ShapeType = a.ShapeType;
        a.ShapeType = null;
    }//end-func

    CoWise = (n, m) => {
        var array = this.board.map(row => row[m]);
        var toUp = 0;
        var toDown = 0;
        //TO UP
        var border = Math.min(n + 5, array.length);
        for(let i = n + 1; i < border; ++i){
            if(array[i].ShapeType != null && array[i].ShapeType == array[n].ShapeType){
                toUp += 1;
                if(toUp == 4) return true;
            } else break;
        }

        //TO DOWN
        border = Math.max(n - 5, 0);
        for(let i = n - 1; i > border - 1; --i){
            if(array[i].ShapeType != null && array[i].ShapeType == array[n].ShapeType){
                toDown += 1;
                if((toUp + toDown) == 4) return true;
            } else break;
        }
        return false;

    }//end-func

    RoWise = (n, m) => {
        var array = this.board[n];
        var toRight = 0;
        var toLeft = 0;

        //TO RIGHT
        var border = Math.min(m + 5, array.length);
        for(let i = m + 1; i < border; ++i){
            if(array[i].ShapeType != null && array[i].ShapeType == array[m].ShapeType){
                toRight += 1;
                if(toRight == 4) return true;
            } else break;
        }

        //TO RIGHT
        border = Math.max(m - 5, 0);
        for(let i = m - 1; i > border - 1; --i){
            if(array[i].ShapeType != null && array[i].ShapeType == array[m].ShapeType){
                toLeft += 1;
                if((toRight + toLeft) == 4) return true;
            } else break;
        }
        return false;
    }//end-func

    CalculateEmptySpotCount = () => {
        let count = 0;
        this.board.map(row => {
            row.forEach(spot => {
                if(!spot.isFilled) count++;
            });
        });
        return count;
    }//end-func

    IsGameEnd = () => this.CalculateEmptySpotCount() < (4); //end-func

    SendGameEndInfo = (dtc) => {
        console.log(this.CalculateEmptySpotCount());
        dtc.Type = "game-end-info";
        console.log(`Player1 Score: ${this.player1.Score}`);
        console.log(`Player2 Score: ${this.player2.Score}`);

        if(this.player1.Score > this.player2.Score){
            dtc.GameEndInfo = `${this.player1.Username} WON!`;
            var data = JSON.stringify(dtc);
            this.player1.send(data);

            dtc.GameEndInfo = `${this.player2.Username} LOST`;
            var data = JSON.stringify(dtc);
            this.player2.send(data);
        } 
        else if(this.player2.Score > this.player1.Score)
        {
            dtc.GameEndInfo = `${this.player2.Username} WON!`;
            var data = JSON.stringify(dtc);
            this.player2.send(data);

            dtc.GameEndInfo = `${this.player1.Username} LOST`;
            var data = JSON.stringify(dtc);
            this.player1.send(data);
        } 
        else {
            dtc.GameEndInfo = "DRAW!!";
            var data = JSON.stringify(dtc);
            this.player1.send(data);
            this.player2.send(data);
        }
    }//end-func
    Heuristic = (a, b) => {
        //Spot a, Spot b
        var distance = Math.abs(a.I - b.I) + Math.abs(a.J - b.J);
        return distance;
    }//end-func

    ResetPrevious = (rows, cols) => {
        for (let i = 0; i < rows; i++)
        {
            for (let j = 0; j < cols; j++)
            {
                this.board[i][j].Previous = null;
            }
        }
    }//end-func

    SetNeighbors = () => {
        for(let i = 0; i < this.rows; ++i){
            for(let j = 0; j < this.cols; ++j){
                this.board[i][j].AddNeighbors(this.board, this.rows, this.cols);
            }
        }
    }//end-func

    PathFinder = (start, end) => {
        //Spot start, Spot end
        var openSet = [];
        var closedSet = [];
        var path = [];
        openSet.push(start);

        while(true)
        {
            
            if(openSet.length > 0)
            {
                var winner = 0;
                for(let i = 0; i < openSet.length; ++i)
                {
                    if(openSet[i].F < openSet[winner].F)
                    {
                        winner = i;
                    }
                }//end-for

                var current = openSet[winner];
                if(current == end)
                {
                    var temp = current;
                    path.push(temp);
                    while(temp.Previous != null)
                    {
                        path.push(temp.Previous);
                        temp = temp.Previous;
                    }//end-while
                    console.log("DONE!!");
                    break;
                }//end-if
                openSet = openSet.filter(item => item != current);
                closedSet.push(current);
                console.log(current.Neighbors);
                var neighbors = current.Neighbors;
                neighbors.forEach(neighbor => {
                    if(!closedSet.includes(neighbor) && !neighbor.isFilled)
                    {
                        var tempG = current.G + 1;
                        if(openSet.includes(neighbor))
                        {
                            if(tempG < neighbor.G)
                            {
                                neighbor.G = tempG;
                            }
                        } 
                        else 
                        {
                            neighbor.G = tempG;
                            openSet.push(neighbor);
                        }
                        neighbor.H = this.Heuristic(neighbor, end);
                        neighbor.F = neighbor.G + neighbor.H;
                        neighbor.Previous = current;
                    }
                }); //end-foreach

            }//end-if
            else {
                return null;
            }//end-else
        }//end-while
        this.ResetPrevious(this.rows, this.cols);
        this.path = path;
        return path;
    }//end-func

    PathAsIndices = () => {
        let pth = [];
        this.path.forEach(spot => {
            pth.push([spot.I, spot.J]);
        });
        return pth;
    }//end-func

    MoveShape = (home, target) => {
        //Spot home, Spot target
        var path = this.path;
        path.reverse();
        var prevSpot = path[0];
        path = path.slice(1, path.length);

        path.forEach(spot => {
            this.SwapSpots(prevSpot, spot);
            prevSpot = spot;
        });
        this.home = null;
        this.target = null;
        home.isFilled = false;
        target.isFilled = true;
    }//end-func

    IsHomeSettable = (i, j) => {
        let spot = this.board[i][j];
        if(spot.isFilled == false) return false;
        this.home = spot;
        return true;
    }//end-func

    IsTargetSettable = (i, j) => {
        if(this.home == null) return false;
        let spot = this.board[i][j];
        if(spot.isFilled == true) return false;
        var path = this.PathFinder(this.home, spot);
        if(path == null) return false;
        this.target = spot;
        this.MoveShape(this.home, this.target);
        return true;
    }//end-func


}////end-class
export default Board;