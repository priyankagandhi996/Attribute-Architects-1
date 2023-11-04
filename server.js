/*
server.js

Sets all of the routes in your application to be able to navigate
between pages and send data back and forth.

For examples shown here, data is retrieved from Oracle and stored
in a Json file. From there, it is loaded into the HTML files.

Resources:
- ExpressJS Routing: https://expressjs.com/en/guide/routing.html 
*/

var http = require('http');
var fs = require('fs');
var express = require('express');
const app = express();
const path = require('path');
var connection = require('./connectToDB.js'); // connect to DB
var bodyParser = require('body-parser'); // middleware

const PORT = process.env.PORT || 8080; //Sets UI to http://localhost:8080/

// USED TO COLLECT INFORMATION FROM PAGE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// RENDER ALL OF THE PROJECT'S CSS FILES
app.use(express.static(path.join(__dirname, 'public')));

// ESTABLISHES CONNECTION FIRST BEFORE ROUTING
connection.then(connection => {

	// SET ALL THE ROUTES TO APP PAGES
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '/homepage.html'));     // This is the page that will be rendered by default each time app is opened
	});
	app.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname, '/homepage.html'));
	});
	app.get('/connectToDB', function(req, res) {
		res.sendFile(path.join(__dirname, '/connectToDB.js'));
	});
    app.get('/showResults', function(req, res) {
		res.sendFile(path.join(__dirname, '/showResults.html'));
	});

	// GET PATHS TO JSON FILES & CREATIVE FILES
	app.get('/bikesdatajson', function(req, res) {
		res.sendFile(path.join(__dirname, '/json/bikesdata.json'));
	});

    // SET ROUTES TO GET/UPDATE/INSERT DATA
	app.post('/getbikes', function(request, response) {
	    // Capture the input fields
	    let color = request.body.color;
	    let bstyle = request.body.bstyle;

	    // Log what the user has entered
	    console.log("Color Entered:", color, ", Style Entered:", bstyle);

	    if (color && bstyle){

            retrieveMatchingBikes();

            async function retrieveMatchingBikes(){

                const result = await connection.execute(
                    'SELECT * FROM BIKES WHERE color = :1 AND bstyle = :2',
                    [color, bstyle]
                );
                
                if (result.rows.length > 0) {
                    fs.writeFileSync('./json/bikesdata.json', JSON.stringify(result.rows)); // puts the result in the json
                    // console.log("Results: ", result.rows);
                    // console.log("Length: ", result.rows.length);
                    response.redirect('/showResults');
                }
                else {
                    response.send("No results found. Please try again. Ensure first letter of color and style are capital.")
                }

                // based on the result, you could redirect the user to a different page:
                // response.redirect('/home');	// Redirect to home page

            }
        }
    });

	app.post('/updateavailability', function(request, response) {
	    // Capture the input fields
	    let bikeid = request.body.bikeid;
	    let bavailable = request.body.bavailable;

	    // Log what the user has entered
	    console.log("ID Entered:", bikeid, ", Availability Entered:", bavailable);

	    if (bikeid && bavailable){

            updateMatchingBike();

            async function updateMatchingBike(){

				try {
					const updateBike = await connection.execute(
						`UPDATE BIKES
						 SET bavailable = :1
						 WHERE bikeid = :2`,
						[bavailable, bikeid]
					);

					if (updateBike.rowsAffected === 1) { // confirms that only one row was affected, as expected
						await connection.commit(); // commits the changes to the remote DB
	
						const updateJson = await connection.execute( // select query to confirm the change was made and update the json
							'SELECT * FROM BIKES'
						);
		
						fs.writeFileSync('./json/bikesdata.json', JSON.stringify(updateJson.rows)); // puts the result in the json
						response.redirect('/showResults');
					} else {
						response.send("An error occurred. Please try again.")
					}
				} catch { // error message if the update did not work
					response.send("Bike update was unsuccessful. Check that the values are in the correct range and try again.");
				}
            }
        }
    });

	/* 
	   Along with SELECT and UPDATE statements, you can also use insert statements to add more rows.
	   Example: 

	   const result = await connection.execute(
			`INSERT INTO <TABLE NAME> VALUES (:1, :2, :3)`,
			[value1, value2, value3]
		);
	*/
	
});

app.listen(PORT);
console.log('Server started at http://localhost:' + PORT);