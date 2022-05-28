import Spot from "./Spot.js";
class Board{
    constructor(){
        this.board = [];
        this.rows = 9;
        this.cols = 9;
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
                if(this.board[i][j].isFilled == true){
                    process.stdout.write("[1]");
                } else {
                    process.stdout.write("[0]");
                }
            }
            process.stdout.write("\n");
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

    SetCellShape = () => {
        let coordinates = this.SpecifyShapeLocation();
        let n = coordinates[0];
        let m = coordinates[1];
        this.board[n][m].isFilled = true;
        this.board[n][m].ShapeType = 0;
    }//end-func

    PlaceShapes = () => {
        for(let i = 0; i < 3; ++i){
            this.SetCellShape();
        }
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

    IsGameEnd = () => this.CalculateEmptySpotCount() < (this.rows * this.cols - 4);


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
        return path;
    }//end-func


    MoveShape = (home, target) => {
        //Spot home, Spot target
        var path = this.PathFinder(home, target);
        if(path == null)// NO PATH EXISTS
        {
            console.log("NO PATH EXISTS!!");
            return false;
        }
        path.reverse();
        var prevSpot = path[0];
        path = path.slice(1, path.length);

        path.forEach(spot => {
            this.SwapSpots(prevSpot, spot);
            prevSpot = spot;
        });

        home.isFilled = false;
        target.isFilled = true;
        this.PlaceShapes();
        
    }//end-func


}////end-class
export default Board;