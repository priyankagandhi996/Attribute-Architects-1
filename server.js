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

	app.get('/employees', async (req, res) => {
		try {
			const result = await connection.execute('SELECT * FROM EMPLOYEEP');
			res.json(result.rows);
		} catch (error) {
			console.error('Error fetching data:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	});

    // SET ROUTES TO GET/UPDATE/INSERT DATA

	app.post('/deleteEmployee', async (req, res) => {
		const { employeeID } = req.body;
	
		try {
			const result = await connection.execute(
				'DELETE FROM EMPLOYEEP WHERE EmployeeID = :1',
				[employeeID]
			);
	
			if (result.rowsAffected === 1) {
				res.json({ success: true, message: 'Employee deleted successfully.' });
			} else {
				res.json({ success: false, message: 'Employee not found or deletion unsuccessful.' });
			}
		} catch (error) {
			console.error('Error deleting employee:', error);
			res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
		}
	});

	app.post('/insertEmployee', async (req, res) => {
		try {
			// Capture the input fields from the request body
			const {
				EmployeeID,
				F_Name,
				L_Name,
				B_Date,
				Address,
				Email,
				DepartmentID,
				Position_1,
				Wage,
				ManagerID
			} = req.body;
	
			// Validate required fields
			if (!EmployeeID || !F_Name || !L_Name || !Address || !Position_1 || !Wage) {
				return res.status(400).json({ error: 'Missing required fields.' });
			}
	
			// You may want to validate other fields and handle date formatting
	
			// Create the INSERT statement
			const insertQuery = `
				INSERT INTO EMPLOYEEP (
					EmployeeID,
					F_Name,
					L_Name,
					B_Date,
					Address,
					Email,
					DepartmentID,
					Position_1,
					Wage,
					ManagerID
				) VALUES (
					:EmployeeID,
					:F_Name,
					:L_Name,
					TO_DATE(:B_Date, 'YYYY-MM-DD'),
					:Address,
					:Email,
					:DepartmentID,
					:Position_1,
					:Wage,
					:ManagerID
				)`;
	
			// Execute the INSERT statement
			const result = await connection.execute(insertQuery, {
				EmployeeID,
				F_Name,
				L_Name,
				B_Date,
				Address,
				Email,
				DepartmentID,
				Position_1,
				Wage,
				ManagerID
			}, { autoCommit: true }); // autoCommit: true to commit the transaction immediately
	
			// Check if the insert was successful
			if (result.rowsAffected === 1) {
				return res.json({ success: true, message: 'Employee inserted successfully.' });
			} else {
				return res.json({ success: false, message: 'Employee insertion unsuccessful.' });
			}
		} catch (error) {
			console.error('Error inserting employee:', error);
			return res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
		}
	});

	// Add an endpoint for updating an employee
	app.post('/updateEmployee', async (req, res) => {
		const { employeeID, F_Name, L_Name, B_Date, Address, Email, DepartmentID, Position, Wage, ManagerID } = req.body;
		
		try {
			// Check if the employeeID exists in the database
			const checkResult = await connection.execute('SELECT * FROM EMPLOYEEP WHERE employeeID = :1', [employeeID]);

			if (checkResult.rows.length === 0) {
				// If the employeeID doesn't exist, insert a new record
				const insertResult = await connection.execute(
					'INSERT INTO EMPLOYEEP VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10)',
					[employeeID, F_Name, L_Name, B_Date, Address, Email, DepartmentID, Position, Wage, ManagerID]
				);
				await connection.commit();
				res.json({ message: 'Employee inserted successfully.' });
			} else {
				// If the employeeID exists, update the existing record
				const updateResult = await connection.execute(
					'UPDATE EMPLOYEEP SET F_Name = :2, L_Name = :3, B_Date = :4, Address = :5, Email = :6, DepartmentID = :7, Position = :8, Wage = :9, ManagerID = :10 WHERE employeeID = :1',
					[employeeID, F_Name, L_Name, B_Date, Address, Email, DepartmentID, Position, Wage, ManagerID]
				);
				await connection.commit();
				res.json({ message: 'Employee updated successfully.' });
			}
		} catch (error) {
			console.error('Error modifying employee:', error);
			res.status(500).json({ error: 'Internal Server Error' });
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