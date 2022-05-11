
type Cell = {
    id:string;
    x:number;
    y:number;
    isOccupied:boolean;
    standingCharacter: Character | undefined;
}

class MapInfo{
    grid:Cell[][] = [];
    minX: number = 0;
    maxX: number = 20;
    minY: number = 0;
    maxY: number = 20;
    constructor()
    {
        for(let y=this.minY;y < this.maxY;y++)
        {
            let xArray:Cell[] = []
            for(let x=this.minX;x< this.maxX;x++)
            {
                xArray.push({id:`${x.toString()}${y.toString()}`,x:x,y:y,isOccupied:false,standingCharacter:undefined});   
            }
            this.grid.push(xArray)
        }
    }
    getCellByXY(x:number,y:number) : Cell | undefined
    {
        if(x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) return undefined;
        return this.grid[x][y];
    }
}
