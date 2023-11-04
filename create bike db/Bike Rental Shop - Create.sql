DROP TABLE SERVICE_TYPE CASCADE CONSTRAINTS;
DROP TABLE COSTS CASCADE CONSTRAINTS;
DROP TABLE MAINT_RECORDS CASCADE CONSTRAINTS;
DROP TABLE CUSTOMER CASCADE CONSTRAINTS;
DROP TABLE RENTAL_HISTORY CASCADE CONSTRAINTS;
DROP TABLE BIKES CASCADE CONSTRAINTS;
DROP TABLE TRANSACTIONS CASCADE CONSTRAINTS;


CREATE TABLE  BIKES  (
   bikeID  VARCHAR(8),
   yearPurchased  INTEGER,
   Color  VARCHAR(6),
   bStyle  VARCHAR(10) NOT NULL,
   bSize  VARCHAR(1),
   bAvailable  VARCHAR(7) DEFAULT 'No',
   
   PRIMARY KEY ( bikeID ),

   CHECK (YearPurchased >= 2000),   
   CHECK (Color IN ('Blue', 'Silver', 'Red')),
   CHECK (bStyle IN ('Hybrid', 'Mountain','Tandem')),
   CHECK (bSize IN ('S', 'M', 'L')),
   CHECK (bAvailable IN ( 'Yes', 'No', 'Retired'))
);

CREATE TABLE  COSTS  (
   bStyle  VARCHAR(10) NOT NULL UNIQUE,
   Cost  DECIMAL(5,2) NOT NULL,
   Inventory INTEGER,

   CHECK (bStyle IN ('Hybrid', 'Mountain','Tandem'))  
);

CREATE TABLE  TRANSACTIONS  (
   transactionID  INTEGER,
   bikeID VARCHAR(8) NOT NULL,
   customer_id  INTEGER NOT NULL,
   idType VARCHAR(20) NOT NULL,
   ccNum  INTEGER NOT NULL,
   outTime TIMESTAMP,
   inTime TIMESTAMP,
   totalCharge  DECIMAL(6,2),

   PRIMARY KEY ( transactionID ),
   FOREIGN KEY ( bikeID ) REFERENCES BIKES(bikeID),

   CHECK (idType IN ('Driver License', 'Other'))
);

CREATE TABLE  MAINT_RECORDS  (
   maintID  INTEGER,
   bikeID  VARCHAR(8),
   serviceType  INTEGER,
   serviceDate  DATE,
   Comments  VARCHAR(120),

   PRIMARY KEY ( maintID ),
   FOREIGN KEY ( bikeID ) REFERENCES BIKES(bikeID)
);

CREATE TABLE  CUSTOMER  (
   fName  VARCHAR(30) NOT NULL,
   lName  VARCHAR(30) NOT NULL,
   isAdult  VARCHAR(3),
   idType  VARCHAR(20),
   idNumber  INTEGER,

   PRIMARY KEY (idType,idNumber)
);

CREATE TABLE  RENTAL_HISTORY  (
   bikeID  VARCHAR(8),
   transactionID  INTEGER,

   FOREIGN KEY (bikeID) REFERENCES BIKES(bikeID),
   FOREIGN KEY (transactionID) REFERENCES TRANSACTIONS(transactionID)
);

CREATE TABLE  SERVICE_TYPE  (
   sType  INTEGER UNIQUE,
   sDesc  VARCHAR(240)
);