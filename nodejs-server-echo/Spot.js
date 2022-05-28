class Spot{
    constructor(){
        this.I = 0;
        this.J = 0;
        this.F = 0;
        this.G = 0;
        this.H = 0;
        this.Neighbors = [];
        this.Previous = null;
        this.isFilled = false;
        this.ShapeType = null;
    }
    AddNeighbors = (grid, rows, cols) => {
        if(this.I < cols -1){this.Neighbors.push(grid[this.I + 1][this.J])};
        if(this.I > 0){this.Neighbors.push(grid[this.I - 1][this.J])};
        if(this.J < rows - 1){this.Neighbors.push(grid[this.I][this.J + 1])};
        if(this.J > 0){this.Neighbors.push(grid[this.I][this.J - 1])};
    }
}
export default Spot;