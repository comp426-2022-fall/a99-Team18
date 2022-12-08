function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

export class tttboardObj { //a tic tac toe board object
    constructor() {
        this.board = "NNNNNNNNN";
    }
    setBoard(str) {
        this.board = str;
    }
    markX(index) {
        this.board = setCharAt(this.board, index, 'X');
    }
    markO(index) {
        this.board = setCharAt(this.board, index, 'O');
    }
    winCheck() {
        //check columns
        for (let i =0; i<3; i++) {
            if (this.board[i]==this.board[i+3]==this.board[i+3]) {
                return true;
            }
        }
        //check diagonal
        if (this.board[0]==this.board[4]==this.board[8]) {
            return true;
        }

        if (this.board[2]==this.board[4]==this.board[6]) {
            return true;
        }

        //check rows
        for (let i =0; i<7; i+=3) {
            if (this.board[i]==this.board[i+1]==this.board[i+2]) {
                return true;
            }
        }

        return false;
    }
    moves() {
        var total =0;
        for(let i =0; i<9; i++) {
            if (this.board[i]!='N') {
                total++;
            }
        }
        return total;
    }
}//end class

export function tictactoe_response(_board, userInput) { //generates a tictactoe move
    //board is a str
    //user input should be the index of the position on the board, with topleft = 0 and bottom right = 
    var board = new tttboardObj();
    board.setBoard(_board);
    if (userInput!=null) {
        board.markX(userInput);
    } else {
        return board.board;
    }

    //check for endgame 
    if (board.moves()>=5) {
        board.winCheck();
    }

    //else serve a turn
    var _results =  Math.random() * 8; //should be a random num 0-8
    while (board[_results]!='N') {
        _results =  Math.random() * 8;
    }//rerolls until it generates a blank space

    board.markO(_results);

    return board.board;//return the board string
}//end function