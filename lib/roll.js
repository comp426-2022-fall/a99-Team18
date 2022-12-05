export class rollObj {
    constructor(numSides, numDice, numRolled) {
        this.sides = numSides;
        this.dice = numDice;
        this.rolls = numRolled;
        this.results = [];
    }
}//end creating the object
export function roll(numSides, numDice, numRolled) {
    var o = new rollObj(numSides, numDice, numRolled);
    o.sides = numSides;
    o.dice = numDice;
    o.rolls =numRolled;
    var _results = [];
    for (let i=0; i<numRolled; i++) {
        _results[i] = Math.floor(Math.random() * o.sides) + 1;
        if (numDice>1) {
            for (let j=0; j<numDice; j++) {
                _results[i] += Math.floor(Math.random() * o.sides) + 1;
            }//adds the results of the other dice
        }//...if the other dice exist
    }//fills the results array with the results
    o.results = _results;
    return o;
}//end roll function