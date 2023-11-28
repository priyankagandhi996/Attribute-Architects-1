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

	app.get('/timesheets/:managerID', async (req, res) => {
		const managerID = req.params.managerID;
	  
		try {
		  const result = await connection.execute(
			'SELECT \
			  E.EmployeeID, \
			  E.F_Name AS "First Name", \
			  E.L_Name AS "Last Name", \
			  T.PayPeriod, \
			  T.HoursWorked \
			FROM TIMESHEET T \
			JOIN EMPLOYEEP E ON T.EmployeeID = E.EmployeeID \
			WHERE E.ManagerID = :managerID AND T.M_Approval = \'N\'',
			[managerID]
		  );
	  
		  const timesheetData = result.rows.map(row => ({
			EmployeeID: row[0],
			FirstName: row[1],
			LastName: row[2],
			PayPeriod: row[3],
			HoursWorked: row[4]
		  }));
	  
		  res.json(timesheetData);
		} catch (error) {
		  console.error('Error fetching data:', error);
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  });	  
	  
	app.get('/timesheetsForEmployees/:employeeID', async (req, res) => {
		const employeeID = req.params.employeeID;
	  
		try {
		  const result = await connection.execute(
			'SELECT * FROM TIMESHEET WHERE EmployeeID = :employeeID',
			[employeeID]
		  );
	  
		  // Convert the result rows to an array of objects
		  const timesheetData = result.rows.map(row => ({
			TimeSheetID: row[0],
			EmployeeID: row[1],
			PayPeriod: row[2],
			HoursWorked: row[3],
			M_Approval: row[4]
		  }));
	  
		  res.json(timesheetData);
		} catch (error) {
		  console.error('Error fetching data:', error);
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  });

	app.get('/timesheets', async (req, res) => {
		try {
			const result = await connection.execute('SELECT * FROM TIMESHEET');
			res.json(result.rows);
		} catch (error) {
			console.error('Error fetching data:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	});

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

	app.post('/approveTimesheet', async (req, res) => {
		const employeeID = req.body.employeeID;
		const payPeriod = req.body.payPeriod;
	  
		try {
		  // Log the formatted date before executing the SQL statement
		  const formattedPayPeriod = new Date(payPeriod).toLocaleDateString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		  });
		  console.log('Formatted Pay Period:', formattedPayPeriod);
	  
		  // Log the SQL statement
		  const sqlStatement = 'UPDATE TIMESHEET SET M_Approval = \'Y\' WHERE EmployeeID = :employeeID AND PayPeriod = TO_DATE(:payPeriod, \'MM/DD/YYYY\')';
		  console.log('Executing SQL:', sqlStatement);
	  
		  const result = await connection.execute(
			sqlStatement,
			[employeeID, formattedPayPeriod]
		  );
	  
		  console.log(result);
	  
		  // Check if any rows were updated
		  if (result.rowsAffected && result.rowsAffected[0] > 0) {
			res.json({ success: true, message: 'Approval updated successfully.' });
		  } else {
			res.json({ success: false, message: 'No rows updated. Check your conditions.' });
		  }
		} catch (error) {
		  console.error('Error updating approval:', error);
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  });	  

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

	app.post('/insertTimesheet', async (req, res) => {
		try {
		  const {
			TimeSheetID,
			EmployeeID,
			PayPeriod,
			HoursWorked,
			M_Approval
		  } = req.body;
	  
		  // Check for missing required fields
		  if (!TimeSheetID || !EmployeeID || !PayPeriod || !HoursWorked || !M_Approval) {
			return res.status(400).json({ error: 'Missing required fields.' });
		  }
	  
		  const insertQuery = `
			INSERT INTO TIMESHEET (
			  TimesheetID,
			  EmployeeID,
			  PayPeriod,
			  HoursWorked,
			  M_Approval
			) VALUES (
			  :TimeSheetID,
			  :EmployeeID,
			  TO_DATE(:PayPeriod, 'YYYY-MM-DD'),  -- Assuming PayPeriod is a date
			  :HoursWorked,
			  :M_Approval
			)`;
	  
		  // Execute the INSERT statement
		  const result = await connection.execute(insertQuery, {
			TimeSheetID,
			EmployeeID,
			PayPeriod,
			HoursWorked,
			M_Approval
		  }, { autoCommit: true });
	  
		  if (result.rowsAffected === 1) {
			return res.json({ success: true, message: 'Timesheet inserted successfully.' });
		  } else {
			return res.json({ success: false, message: 'Timesheet insertion unsuccessful.' });
		  }
		} catch (error) {
		  console.error('Error inserting timesheet:', error);
		  return res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
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

	app.post('/modifyEmployee', async (req, res) => {
		try {
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
			if (!EmployeeID) {
				return res.status(400).json({ error: 'EmployeeID is required.' });
			}
	
			// Check if the employeeID exists in the database
			const checkResult = await connection.execute('SELECT * FROM EMPLOYEEP WHERE EmployeeID = :1', [EmployeeID]);
	
			if (checkResult.rows.length === 0) {
				return res.json({ success: false, message: 'Employee not found.' });
			}
	
			// If the employeeID exists, it's an update
			// Build the update query dynamically based on provided fields
			const updateFields = [];
			const updateValues = {};
	
			if (F_Name !== undefined && F_Name.trim() !== '') {
				updateFields.push('F_Name = :F_Name');
				updateValues.F_Name = F_Name;
			}
	
			if (L_Name !== undefined && L_Name.trim() !== '') {
				updateFields.push('L_Name = :L_Name');
				updateValues.L_Name = L_Name;
			}
	
			if (B_Date !== undefined && B_Date.trim() !== '') {
				updateFields.push('B_Date = B_Date');
				updateValues.B_Date = B_Date;
			}

			if (Address !== undefined && Address.trim() !== '') {
				updateFields.push('Address = :Address');
				updateValues.Address = Address;
			}

			if (Email !== undefined && Email.trim() !== '') {
				updateFields.push('Email = :Email');
				updateValues.Email = Email;
			}

			if (DepartmentID !== undefined && DepartmentID.trim() !== '') {
				updateFields.push('DepartmentID = :DepartmentID');
				updateValues.DepartmentID = DepartmentID;
			}

			if (Position_1 !== undefined && Position_1.trim() !== '') {
				updateFields.push('Position_1 = :Position_1');
				updateValues.Position_1 = Position_1;
			}

			if (Wage !== undefined & Wage.trim() !== '') {
				updateFields.push('Wage = :Wage');
				updateValues.Wage = Wage;
			}

			if (ManagerID !== undefined && ManagerID.trim() !== '') {
				updateFields.push('ManagerID = :ManagerID');
				updateValues.ManagerID = ManagerID;
			}


			// Check if any fields are provided for update
			if (updateFields.length === 0) {
				return res.json({ success: false, message: 'No fields provided for update.' });
			}
	
			const updateQuery = `
				UPDATE EMPLOYEEP SET
					${updateFields.join(', ')}
				WHERE EmployeeID = :EmployeeID`;
	
			console.log('Update Query:', updateQuery);
			console.log('Bind Variables:', { EmployeeID, ...updateValues });

			// Execute the UPDATE statement
			const updateResult = await connection.execute(updateQuery, {
				EmployeeID,
				...updateValues
			}, { autoCommit: true });
	
			// Check if the update was successful
			if (updateResult.rowsAffected === 1) {
				return res.json({ success: true, message: 'Employee updated successfully.' });
			} else {
				return res.json({ success: false, message: 'Employee update unsuccessful.' });
			}
		} catch (error) {
			console.error('Error modifying employee:', error);
			return res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
		}

	
	app.post('/insertBankDetails', async (req, res) => {
		try {
		  const {
			BankID,
			EmployeeID,
			PaymentType,
			BANKACCTNO
		  } = req.body;
	  
		  // Check for missing required fields
		  if (!BankID || !EmployeeID || !PaymentType || !BANKACCTNO) {
			return res.status(400).json({ error: 'Missing required fields.' });
		  }
	  
		  const insertQuery = `
			INSERT INTO BANKDETAILS (
			  BankID,
			EmployeeID,
			PaymentType,
			BANKACCTNO
			) VALUES (
			  :bankID,
			  :EmployeeID,
			  :Paymenttype,
			  :bankAcctNo
			)`;
	  
		  // Execute the INSERT statement
		  const result = await connection.execute(insertQuery, {
			BankID,
			EmployeeID,
			PaymentType,
			BANKACCTNO
		  }, { autoCommit: true });
	  
		  if (result.rowsAffected === 1) {
			return res.json({ success: true, message: 'BankDetails inserted successfully.' });
		  } else {
			return res.json({ success: false, message: 'BankDetails insertion unsuccessful.' });
		  }
		} catch (error) {
		  console.error('Error inserting BankDetails:', error);
		  return res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
		}
	  });



	app.get('/bankDetailsForEmployee/:employeeID', async (req, res) => {
		const employeeID = req.params.employeeID;
		try {
		  const result = await connection.execute(
			'SELECT  EmployeeID, bankAcctNo, bankid FROM BankDetails WHERE EmployeeID = :employeeID',
			[employeeID]
		  );
	  
		  // Convert the result rows to an array of objects
		  const bankDetails = result.rows.map(row => ({
			EmployeeID: row[0],
			bankAcctNo: row[1],
			bankid: row[2]
		  }));
	  
		  res.json(bankDetails);
		} catch (error) {
		  console.error('Error fetching data:', error);
		  res.status(500).json({ error: 'Internal Server Error' });
		}
	  });

	app.post('/deletebankDetail', async (req, res) => {
		const { bankid } = req.body;
	
		try {
			const result = await connection.execute(
				'DELETE FROM bankdetails WHERE bankid = :1',
				[bankid]
			);
	
			if (result.rowsAffected === 1) {
				res.json({ success: true, message: 'Bank Detail deleted successfully.' });
			} else {
				res.json({ success: false, message: 'Bank Detail not found or deletion unsuccessful.' });
			}
		} catch (error) {
			console.error('Error deleting employee:', error);
			res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
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