
DROP TABLE departments CASCADE;

CREATE TABLE departments(
	dept_no VARCHAR(4) PRIMARY KEY,
	dept_name VARCHAR(20)
);

-- Import departments.csv <-

SELECT *
FROM departments;

----------------------------------------------

DROP TABLE department_employees CASCADE;

CREATE TABLE department_employees(
	emp_no INT,
	dept_no VARCHAR(4),
	from_date DATE,
	to_date DATE,
	PRIMARY KEY (emp_no, dept_no),
	FOREIGN KEY (dept_no) REFERENCES departments (dept_no),
	UNIQUE (emp_no, dept_no)
);

-- Import department_employees.csv <-

SELECT *
FROM department_employees;

----------------------------------------------

DROP TABLE department_managers CASCADE;

CREATE TABLE department_managers(
	dept_no VARCHAR(4),
	emp_no INT,
	from_date DATE,
	to_date DATE,
	PRIMARY KEY (emp_no, dept_no),
	FOREIGN KEY (dept_no, emp_no) REFERENCES department_employees (dept_no, emp_no)
);

-- Import dept_manager.csv;

SELECT *
FROM department_managers;

----------------------------------------------

DROP TABLE employees CASCADE;

CREATE TABLE employees(
	emp_no INT,
	birth_date DATE,
	first_name VARCHAR(20),
	last_name VARCHAR(20),
	gender VARCHAR(1),
	hire_date DATE,
	PRIMARY KEY (emp_no),
	FOREIGN KEY (emp_no) REFERENCES department_employees (emp_no)
);



emp_no	birth_date	first_name	last_name	gender	hire_date
10001	1953-09-02	Georgi	Facello	M	1986-06-26
10002	1964-06-02	Bezalel	Simmel	F	1985-11-21
10003	1959-12-03	Parto	Bamford	M	1986-08-28
10004	1954-05-01	Chirstian	Koblick	M	1986-12-01
10005	1955-01-21	Kyoichi	Maliniak	M	1989-09-12


