
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

    moveCharacter(character:Character,toX:number,toY:number) : void
    {
        if(character == undefined) return;
        let targetCell = this.getCellByXY(toX,toY);
        if(targetCell == undefined) return;
        if(targetCell.isOccupied == true) return;

        let previouslyStandingCell = this.getCellByXY(character.x,character.y);
        if(previouslyStandingCell) 
        {
            previouslyStandingCell.isOccupied = false;
            previouslyStandingCell.standingCharacter = undefined;
        }

        targetCell.isOccupied = true;
        targetCell.standingCharacter = character;
        character.x = toX;
        character.y = toY;
    }
}

class Character{
    x:number;
    y:number;
    mapInfo : MapInfo;
    constructor(x:number,y:number,mapInfo:MapInfo)
    {
        this.x=x;
        this.y=y;
        this.mapInfo = mapInfo;
        this.tryMove(x,y);
    }

    tryMove(toX:number,toY:number)
    {
        this.mapInfo.moveCharacter(this,toX,toY);
    }
}
