--Procedures---
--Payroll Summary Procedure--
create or replace PROCEDURE Calc_PayrollSummary(
    p_PayPeriod DATE,
    p_EmployeeCount OUT NUMBER,
    p_GrossPaySum OUT NUMBER,
    p_DeductionsSum OUT NUMBER,
    p_NetPaySum OUT NUMBER
)
IS
BEGIN
    SELECT COUNT(DISTINCT t.EmployeeID),
           SUM(ps.GrossPay),
           SUM(ps.Deductions),
           SUM(ps.NetPay)
    INTO p_EmployeeCount, p_GrossPaySum, p_DeductionsSum, p_NetPaySum
    FROM TIMESHEET t
    INNER JOIN PAYSTUB ps ON t.TimeSheetID = ps.TimeSheetID
    WHERE t.PayPeriod = p_PayPeriod;

    DBMS_OUTPUT.PUT_LINE('Number of Employees with Paystubs: ' || p_EmployeeCount);
    DBMS_OUTPUT.PUT_LINE('Total Gross Pay: ' || p_GrossPaySum);
    DBMS_OUTPUT.PUT_LINE('Total Deductions: ' || p_DeductionsSum);
    DBMS_OUTPUT.PUT_LINE('Total Net Pay: ' || p_NetPaySum);

END Calc_PayrollSummary;
\
---Calculate Paystub Procedure---

CREATE OR REPLACE PROCEDURE Calc_PayStub(
    p_TimesheetID IN INTEGER
)
IS
p_EmployeeID INT;
p_StubID INT;
p_Wage Float;
p_HoursWorked Float;
p_OTHoursWorked Float;
p_GrossPay FLOAT;
p_Deductions FLOAT;
p_NetPay FLOAT;

BEGIN

SELECT EmployeeID INTO p_EmployeeID FROM Timesheet WHERE TimeSheetID=p_TimeSheetID;
SELECT HoursWorked INTO p_HoursWorked FROM Timesheet WHERE TimeSheetID=p_TimeSheetID;
SELECT Wage INTO p_Wage FROM EMPLOYEEP WHERE EmployeeID=p_EmployeeID;

IF p_HoursWorked > 160 THEN
p_OTHoursWorked := p_HoursWorked-160;
ELSE
p_OTHoursWorked :=0;
END IF;

p_GrossPay := (p_HoursWorked*p_Wage)+(p_OTHoursWorked*(1.5*p_Wage));

p_Deductions := p_GrossPay*0.1;

p_NetPay := p_GrossPay-p_Deductions;

p_StubID := p_TimeSheetID+1000;

INSERT INTO PayStub (stubID, TimeSheetID, OTHoursWorked, GrossPay, Deductions, NetPay)
VALUES (p_StubID, p_TimeSheetID, p_OTHoursWorked, p_GrossPay, p_Deductions, p_NetPay); 

DBMS_OUTPUT.PUT_LINE('Pay Stub Record Added.');

END;
\
--Check if Employee is a Manager--
create or replace PROCEDURE is_employee_manager(
    p_employee_id IN EMPLOYEEP.EmployeeID%TYPE,
    p_result OUT NUMBER
)
IS
BEGIN
    -- Check if the employee is a manager for anyone
    SELECT COUNT(*)
    INTO p_result
    FROM EMPLOYEEP
    WHERE ManagerID = p_employee_id AND EmployeeStatus = 'A';
    DBMS_OUTPUT.PUT_LINE(p_result);
    -- Set the result based on the count
END is_employee_manager;
\
--Triggers---
--Trigger to prevent adding an employee with a Terminated manager---
CREATE OR REPLACE TRIGGER prevent_terminated_manager
BEFORE INSERT ON EMPLOYEEP
FOR EACH ROW
DECLARE
    manager_status CHAR(1);
BEGIN
    -- Retrieve the status of the manager
    IF :NEW.ManagerID IS NOT NULL THEN
    SELECT EmployeeStatus INTO manager_status
    FROM EMPLOYEEP
    WHERE EmployeeID = :NEW.ManagerID;
    END if;
    
    -- Check if the manager is terminated
    IF manager_status = 'T' THEN
        raise_application_error(-20001, 'Cannot assign a manager with EmployeeStatus = ''T''');
    END IF;
END;
/
--Trigger deletes projects records in WORKSONP if an employee is terminated---
CREATE OR REPLACE TRIGGER Delete_Worksonp_Record
BEFORE UPDATE ON EMPLOYEEP
FOR EACH ROW
BEGIN
    IF :OLD.EmployeeStatus <> 'T' AND :NEW.EmployeeStatus = 'T' THEN
        -- Delete records in WORKSONP for the employee
        DELETE FROM WORKSONP
        WHERE EmployeeID = :NEW.EmployeeID;
    END IF;
END;
/
--Trigger to ensure you submit valid pay period---

CREATE or REPLACE TRIGGER Valid_PayPeriod
BEFORE INSERT ON TIMESHEET
FOR EACH ROW
DECLARE
    pday NUMBER;
BEGIN
    -- Extract the day of the month from the PayPeriod
    pday := EXTRACT(DAY FROM :NEW.PayPeriod);

    -- Check if the day is not the 1st
    IF pday <> 1 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Invalid PayPeriod. It must be the 1st of the month.');
    END IF;
END;
/
--Trigger to ensure only one timesheet for one employee per payperiod--

CREATE OR REPLACE TRIGGER One_Timesheet_Per_PayPeriod
BEFORE INSERT ON TIMESHEET
FOR EACH ROW
DECLARE
    p_existing_timesheet_count NUMBER;
BEGIN
    -- Check if there is already a timesheet for the employee and pay period
    SELECT COUNT(*)
    INTO p_existing_timesheet_count
    FROM TIMESHEET
    WHERE EmployeeID = :NEW.EmployeeID
      AND PayPeriod = :NEW.PayPeriod;

    -- If there is an existing timesheet, raise an error
    IF p_existing_timesheet_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Only one timesheet per employee per pay period is allowed.');
    END IF;
END;
/
---Trigger Checks if TimeSheet is approved before creating PayStub record---
CREATE OR REPLACE TRIGGER Manager_Approval
BEFORE INSERT ON PayStub
FOR EACH ROW
DECLARE p_M_Approval VARCHAR(1);
BEGIN

    SELECT M_Approval INTO p_M_Approval
    FROM TIMESHEET
    WHERE TimeSheetID= :new.TimeSheetID;
    
    IF p_M_Approval = 'N'
    THEN RAISE_APPLICATION_ERROR(-20001, 'The timesheet has not been approved.');
    END IF;
END;
/
---Trigger does not Allow us to Update Timesheet record if already approved---

CREATE OR REPLACE TRIGGER Manager_Approval_Update
BEFORE UPDATE ON TimeSheet
FOR EACH ROW
BEGIN
    
    IF :OLD.M_Approval = 'Y'
    THEN RAISE_APPLICATION_ERROR(-20001, 'The timesheet has already been approved.');
    END IF;
END;
/
---Trigger does not Allow us to insert employee record if Department or Manager does not exist---
CREATE OR REPLACE TRIGGER BeforeInsertEmployee
BEFORE INSERT ON EMPLOYEEP
FOR EACH ROW
DECLARE
    department_count NUMBER;
    manager_count NUMBER;
BEGIN
    -- Check if DepartmentID exists in DEPARTMENTP
    SELECT COUNT(*) INTO department_count
    FROM DEPARTMENTP
    WHERE DepartmentID = :NEW.DepartmentID;

    -- Check if ManagerID exists in EMPLOYEEP
    IF :NEW.ManagerID IS NOT NULL THEN
    SELECT COUNT(*) INTO manager_count
    FROM EMPLOYEEP
    WHERE EmployeeID = :NEW.ManagerID;
    End IF;

    -- If DepartmentID or ManagerID does not exist, prevent the INSERT
    IF department_count = 0 THEN
        raise_application_error(-20001, 'DepartmentID does not exist');
    END IF;

    IF manager_count = 0 THEN
        raise_application_error(-20001, 'ManagerID does not exist');
    END IF;
END;
\
--Functions--
create or replace FUNCTION employee_name (fname varchar, lname varchar)
RETURN varchar
IS
BEGIN
   return(concat(fname,concat(' ', lname)));
end;
\
