--------------------------------------------------------
--  File created - Friday-November-17-2023  
--------------------------------------------------------
--------------------------------------------------------
--  DML for Table Department
--------------------------------------------------------
INSERT INTO DEPARTMENTP VALUES (1, 'Human Resources');
INSERT INTO DEPARTMENTP VALUES (2, 'IT Department');
INSERT INTO DEPARTMENTP VALUES (3, 'Administration');

--------------------------------------------------------
--  DML for Table Employee
--------------------------------------------------------
INSERT INTO EMPLOYEEP VALUES (1201, 'Priyanka', 'Gandhi', TO_DATE('18-OCT-1998', 'DD-MON-YYYY'), 'Devon, PA', 'p.g@company.com', 2,1221,30, null);
INSERT INTO EMPLOYEEP VALUES (1301, 'SreeRupa', 'Nandamuri', TO_DATE('12-Nov-1996', 'DD-MON-YYYY'), 'Exton, PA', 's.n@company.com', 3,1226,40, null);
INSERT INTO EMPLOYEEP VALUES (1401, 'Olivia', 'Briggs', TO_DATE('07-Jan-1997', 'DD-MON-YYYY'), 'San Jose, CA', 'liv.b@company.com', 1,1220,35, null);
INSERT INTO EMPLOYEEP VALUES (1202, 'Aishwarya', 'James', TO_DATE('03-Mar-1993', 'DD-MON-YYYY'), 'Exton, PA', 'a.j@company.com', 2,1230,25, 1201);
INSERT INTO EMPLOYEEP VALUES (1302, 'Thomas', 'Grey', TO_DATE('11-Nov-1992', 'DD-MON-YYYY'), 'Villanova, PA', 't.g@company.com', 3,1225,35, 1301);
INSERT INTO EMPLOYEEP VALUES (1402, 'John', 'Specter', TO_DATE('30-May-1996', 'DD-MON-YYYY'), 'Devon, PA', 'j.s@company.com', 1,1222,45, 1401);
INSERT INTO EMPLOYEEP VALUES (1203, 'Rachel', 'Paulson', TO_DATE('28-Aug-1988', 'DD-MON-YYYY'), 'Santa Clara, CA', 'r.p@company.com', 2,1228,32, 1201);
INSERT INTO EMPLOYEEP VALUES (1204, 'Monika', 'Geller', TO_DATE('12-Nov-1996', 'DD-MON-YYYY'), 'Norristown, PA', 'm.n@company.com', 2,1221,30, 1202);
INSERT INTO EMPLOYEEP VALUES (1303, 'Katrina', 'Kaif', TO_DATE('29-Sep-1992', 'DD-MON-YYYY'), 'New York, NY', 'k.k@company.com', 3,1225,32, 1302);
INSERT INTO EMPLOYEEP VALUES (1403, 'Katrina', 'Bennet', TO_DATE('20-Sep-1991', 'DD-MON-YYYY'), 'New York, NY', 'k.b@company.com', 1,1275,32, 1402);

--------------------------------------------------------
--  DML for Table Timesheet
--------------------------------------------------------
INSERT INTO TIMESHEET VALUES (1001, 1201, DATE '2023-01-01', 160, 'Y');
INSERT INTO TIMESHEET VALUES (1002, 1201, DATE '2023-02-01', 160, 'N');
INSERT INTO TIMESHEET VALUES (1003, 1302, DATE '2023-03-01', 130, 'N');
INSERT INTO TIMESHEET VALUES (1004, 1303, DATE '2023-04-01', 120, 'Y');
INSERT INTO TIMESHEET VALUES (1005, 1401, DATE '2023-06-01', 90, 'Y');
INSERT INTO TIMESHEET VALUES (1006, 1402, DATE '2023-07-01', 100,'N');
INSERT INTO TIMESHEET VALUES (1007, 1403, DATE '2023-06-01', 110, 'Y');
INSERT INTO TIMESHEET VALUES (1008, 1203, DATE '2023-02-01', 80, 'Y');
INSERT INTO TIMESHEET VALUES (1009, 1301, DATE '2023-03-01', 120, 'N');
INSERT INTO TIMESHEET VALUES (1010, 1301, DATE '2023-01-01', 140, 'Y');

--------------------------------------------------------
--  DML for Table Paystub
--------------------------------------------------------
INSERT INTO PAYSTUB VALUES (2001, 1001, 0, 4800, 10, 4320);
INSERT INTO PAYSTUB VALUES (2002, 1002, 5, 4800, 10, 4320);
INSERT INTO PAYSTUB VALUES (2003, 1003, 3, 4550, 10, 4095);
INSERT INTO PAYSTUB VALUES (2004, 1004, 2, 3904, 10, 3513.6);
INSERT INTO PAYSTUB VALUES (2005, 1005, 5, 3325, 10, 2992.5);
INSERT INTO PAYSTUB VALUES (2006, 1006, 3, 4635, 10, 4171.5);
INSERT INTO PAYSTUB VALUES (2007, 1007, 10, 3840, 10, 3456);
INSERT INTO PAYSTUB VALUES (2008, 1008, 4, 2560, 10, 2304);
INSERT INTO PAYSTUB VALUES (2009, 1009, 0, 4800, 10, 4320);
INSERT INTO PAYSTUB VALUES (2010, 1010, 6, 5600, 10, 5040);
--------------------------------------------------------
--  DML for Table Bankdetails
--------------------------------------------------------
INSERT INTO BANKDETAILS VALUES (101, 1201, 'Check', 3489398341 );
INSERT INTO BANKDETAILS VALUES (102, 1201, 'Direct Deposit', null );
INSERT INTO BANKDETAILS VALUES (103, 1202, 'Direct Deposit', null );
INSERT INTO BANKDETAILS VALUES (104, 1203, 'Check', 4843874838 );
INSERT INTO BANKDETAILS VALUES (105, 1204, 'Check', 8938492010 );
INSERT INTO BANKDETAILS VALUES (106, 1301, 'Direct Deposit', null );
INSERT INTO BANKDETAILS VALUES (107, 1302, 'Check', 1234567890 );
INSERT INTO BANKDETAILS VALUES (108, 1303, 'Direct Deposit', null );
INSERT INTO BANKDETAILS VALUES (109, 1401, 'Check', 4389203012 );
INSERT INTO BANKDETAILS VALUES (110, 1402, 'Check', 8765432190 );
INSERT INTO BANKDETAILS VALUES (111, 1403, 'Check', 9090990903 );
--------------------------------------------------------
--  DML for Table E_Project
--------------------------------------------------------
INSERT INTO E_PROJECT VALUES (1, 'Migration project');
INSERT INTO E_PROJECT VALUES (2, 'Project to change employee salary structure');
INSERT INTO E_PROJECT VALUES (3, 'IT administration changes in company');
INSERT INTO E_PROJECT VALUES (4, 'IT management project');
--------------------------------------------------------
--  DML for Table Workon
--------------------------------------------------------
INSERT INTO WORKSONP VALUES (1, 1201);
INSERT INTO WORKSONP VALUES (1, 1202);
INSERT INTO WORKSONP VALUES (4, 1204);
INSERT INTO WORKSONP VALUES (4, 1202);
INSERT INTO WORKSONP VALUES (1, 1203);
INSERT INTO WORKSONP VALUES (2, 1401);
INSERT INTO WORKSONP VALUES (2, 1402);
INSERT INTO WORKSONP VALUES (2, 1403);
INSERT INTO WORKSONP VALUES (3, 1301);
INSERT INTO WORKSONP VALUES (3, 1302);
INSERT INTO WORKSONP VALUES (3, 1303);
