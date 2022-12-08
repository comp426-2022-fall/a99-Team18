# API Endpoints 

## app.get('/')
Redirects to app.get('/homePage') - App directs to get homepage upon launch

## app.get('/app')
Redirects to app.get('/homePage') - App directs to get homepage upon launch

## app.get('/homePage')
Renders the ../views/homePage - Displays the main homepage

## app.post('/homePage')
Renders the ../views/homePage - Used for returning to the homepage after launch

## app.post('/gameMenu')
Renders the ../views/gameMenu - Used for proceeding and returning to the menu page

## app.post('/roshambo')
Renders the ../views/roshambo - Used for proceeding to the rock paper scissors page

## app.post('/morra')
Renders the ../views/morra and passes in game arguments - Used for proceeding to morra page and running game logic

## app.post('/tictactoe')
Renders the ../views/tictactoe and passes in game arguments - Used for proceeding to tic tac toe page and running game logic

## app.post('/magic8ball')
Renders the ../views/magic8ball - Used for proceeding to magic 8 ball page

## app.post('/login')
Renders the ../views/gameMenu or ../views/invalidLogin checking whether user is in database - Used for proceeding to game menu or invalid login

## app.post('/newlogin')
Renders the ../views/newAccount and adds login arguments to database - Used for creating a new user in database

## app.post('/roshamboWin')
Renders the ../views/roshambo and updates database - Used for checking if rock paper scissors is won and playing again

## app.post('/morraWin')
Renders the ../views/morra page, updates database and passes in game arguements - Used for checking if morra is won and playing again

## app.post('/magic8ballwin')
Renders the ../views/magic8ball page and updates database - Used for checking if magic 8 ball is won and playing again

## app.post('/tictactoewin')
Renders the ../views/tictactoe page and updates database - Used for checking if tic tac toe is won and playing again

## app.post('/databaseDisplay')
Renders the ../views/databaseDisplay page - Used for proceeding to the database display

## app.get('/database')
Uses SQL Query to access and update login database

## app.get('/database2')
Uses SQL Query to access and update game points database

## app.get('/database3')
Uses SQL Query to access and update access log database


