export class tttboardObj { //a tic tac toe board object
    constructor() {
        this.board = [0,0,0,
                      0,0,0,
                      0,0,0];
    }
    markX(index) {
        this.board[index] = 1;
    }
    markO(index) {
        this.board[index] = -1;
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
            if (this.board[i]!=0) {
                total++;
            }
        }
        return total;
    }
}//end class

export function tictactoe_response(board, userInput) { //generates a tictactoe move
    //board should be a board obj so we can mark the X's and O's to
    //user input should be the index of the position on the board, with topleft = 0 and bottom right = 
    if (board == null) {   //creates a new board if there isn't one
        board = new tttboardObj();
        if (userInput != null) { //if the player goes first mark it
            board.markX(userInput);
        }//end if
    }//end if

    //check for endgame 
    if (board.moves()>=5) {
        board.winCheck();
    }

    //else serve a turn
    var _results =  Math.random() * 8; //should be a random num 0-8
    while (board[_results]!=0) {
        _results =  Math.random() * 8;
    }//rerolls until it generates a blank space

    board.markO(_results);

    return board;
}//end function