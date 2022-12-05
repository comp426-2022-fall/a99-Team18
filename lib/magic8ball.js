export function magic8ball() { //there are no points, it's just a magic 8 ball
    //magic 8 ball responses taken from wikipedia
    const ans = ["It is certain."
        , "It is decidedly so."
        , "Without a doubt."
        , "Yes definitely."
        , "You may rely on it."

        , "As I see it, yes."
        , "Most likely."
        , "Outlook good."
        , "Yes."
        , "Signs point to yes."

        , "Reply hazy, try again."
        , "Ask again later."
        , "Better not tell you now."
        , "Cannot predict now."
        , "Concentrate and ask again."

        , "Don't count on it."
        , "My reply is no."
        , "My sources say no."
        , "Outlook not so good."
        , "Very doubtful."];
        var _results = Math.random * 19; //gen a random number 0-19
        return ans[_results];
}//end function