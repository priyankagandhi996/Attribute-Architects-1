--------------------------------------------------------
--  File updated - Saturday-December-02-2023  
--------------------------------------------------------
DROP TABLE WORKSONP;
DROP TABLE E_PROJECT;
DROP TABLE BANKDETAILS;
DROP TABLE PAYSTUB;
DROP TABLE TIMESHEET;
DROP TABLE EMPLOYEEP;
DROP TABLE DEPARTMENTP;
--------------------------------------------------------
--  DDL for Table Department
--------------------------------------------------------
CREATE TABLE DEPARTMENTP
(
    DepartmentID INT NOT NULL,
    DepartmentName VARCHAR(15),
    PRIMARY KEY (DepartmentID)
);

--------------------------------------------------------
--  DDL for Table Employee
--------------------------------------------------------
CREATE TABLE EMPLOYEEP
(
    EmployeeID INT NOT NULL,
    F_Name VARCHAR(15) NOT NULL,
    L_Name VARCHAR(15) NOT NULL,
    B_Date DATE,
    Address VARCHAR(200) NOT NULL,
    Email VARCHAR(25),
    DepartmentID INT,
    Position_1 VARCHAR(25),
    Wage FLOAT NOT NULL,
    ManagerID INT,
    EmployeeStatus VARCHAR(1), CHECK(EmployeeStatus IN ('A', 'T','L')),
    PRIMARY KEY (EmployeeID),
    FOREIGN KEY (DepartmentID) REFERENCES DEPARTMENTP(DepartmentID),
    FOREIGN KEY (ManagerID) REFERENCES EMPLOYEEP(EmployeeID)
);

--------------------------------------------------------
--  DDL for Table Timesheet
--------------------------------------------------------
CREATE TABLE TIMESHEET
(
    TimeSheetID INT NOT NULL,
    EmployeeID INT NOT NULL,
    PayPeriod DATE NOT NULL,
    HoursWorked FLOAT CHECK (HoursWorked <= 744),
    M_Approval VARCHAR(1) CHECK(M_Approval IN ('Y', 'N','P')),
    PRIMARY KEY (TimeSheetID),
    FOREIGN KEY (EmployeeID) REFERENCES EMPLOYEEP(EmployeeID)
);

--------------------------------------------------------
--  DDL for Table Paystub
--------------------------------------------------------
CREATE TABLE PAYSTUB
(
    StubID INT NOT NULL,
    TimeSheetID INT NOT NULL,
    OTHoursWorked FLOAT,
    GrossPay FLOAT,
    Deductions FLOAT,
    NetPay FLOAT,
    PRIMARY KEY (StubID),
    FOREIGN KEY (TimeSheetID) REFERENCES TIMESHEET(TimeSheetID)
);

--------------------------------------------------------
--  DDL for Table Bankdetails
--------------------------------------------------------
CREATE TABLE BANKDETAILS
(
    BankID INT NOT NULL,
    EmployeeID INT NOT NULL,
    PaymentType VARCHAR(15) CHECK (PaymentType IN ('Direct Deposit', 'Check')),
    BankAcctNo VARCHAR(10), -- Changed from NUMBER(10)
    PRIMARY KEY (BankID,EmployeeID),
    FOREIGN KEY (EmployeeID) REFERENCES EMPLOYEEP(EmployeeID) ON DELETE CASCADE
);

--------------------------------------------------------
--  DDL for Table E_Project
--------------------------------------------------------
CREATE TABLE E_PROJECT
(
    ProjectID INT NOT NULL,
    Project_Name VARCHAR(50),
    PRIMARY KEY (ProjectID)
);

--------------------------------------------------------
--  DDL for Table Workon
--------------------------------------------------------
CREATE TABLE WORKSONP
(
    ProjectID INT NOT NULL,
    EmployeeID INT NOT NULL,
    FOREIGN KEY (ProjectID) REFERENCES E_PROJECT(ProjectID) ON DELETE CASCADE,
    FOREIGN KEY (EmployeeID) REFERENCES EMPLOYEEP(EmployeeID) ON DELETE CASCADE
);
