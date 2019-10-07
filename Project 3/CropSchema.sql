DROP TABLE crops;

CREATE TABLE crops
(
   id SERIAL PRIMARY KEY,
   Area_Code integer,
   Area VARCHAR,
   Item_Code integer,
   Item VARCHAR,
   Element_Code integer,
   Element VARCHAR,
   Year_Code integer,
   Year integer,
   Unit VARCHAR, 
   Value integer,
   Flag VARCHAR

)