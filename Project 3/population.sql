---- Drop Tables
DROP TABLE population;

----- Create Table
CREATE TABLE population (
	id SERIAL PRIMARY KEY,
	area VARCHAR,
	year INT,
	value NUMERIC
);

SELECT *
FROM population;