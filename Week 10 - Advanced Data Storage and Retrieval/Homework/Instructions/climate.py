
# Dependencies and Packages
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify

# Create SQLite Engine (check_same_thread enables multiple endpoint page changes)
engine = create_engine(
    "sqlite:///Resources/hawaii.sqlite", 
    connect_args = {
        'check_same_thread': False
        }
    )

# Reflect an existing database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Initialize a database session
session = Session(engine)

# Flask Setup
app = Flask(__name__)

# Main Page
@app.route('/')
def MainPage():
    """List all available API routes"""
    
    return(   
        f'<center><h1>Hawaii Weather Data API</h1></center><br/>'
        f'<center><h3>Tom Callegari</h3></center><br/>'
        f'<br/>'
        f'<h3>Available Endpoints:</h3><br/>'
        f'/api/precipitation<br/>'
        f'/api/stations<br/>'
        f'/api/temperatures<br/>'
        f'/api/start_date/end_date'
    )

# Precipitation
@app.route('/api/precipitation')
def precipitation():

    """Return a JSON packet of precipitation data for the last 
    calendar year."""
    
    select = [
        Measurement.date.label('Date'), 
        func.sum(Measurement.prcp.label('Precipitation'))
    ]

    results = session.query(
        *select
    ).filter(
        Measurement.station == Station.station
    ).group_by(
        Measurement.date
    ).filter(
        Measurement.date >= '2016-08-23'
    ).all()

    precipitation_data = []
    for date, prcp in results:
        precip_dict = {}
        precip_dict['Date'] = date
        precip_dict['Precipitation'] = round(prcp, 2)
        precipitation_data.append(precip_dict)

    return jsonify(precipitation_data)

# Stations
@app.route('/api/stations')
def stations():

    """Return a JSON list of weather station data for 
    the last calendar year"""

    select = [
        Measurement.station.label('Station'), 
        func.count(Measurement.station).label('Count'), 
        Station.name.label('Name'), 
        func.avg(Measurement.tobs).label('Temperature'), 
        func.avg(Measurement.prcp).label('Precipitation'), 
        Station.latitude.label('Lat'), 
        Station.longitude.label('Lon')
    ]

    results = session.query(
        *select
    ).filter(
        Measurement.station == Station.station
    ).group_by(
        Measurement.station
    ).order_by(
        'Count'
    ).all()

    station_data = []
    for station, count, name, temp, precip, lat, lon in results:
        station_dict = {}
        station_dict['Station'] = station
        station_dict['Count'] = count
        station_dict['Name'] = name
        station_dict['Temperature'] = round(temp, 2)
        station_dict['Precipitation'] = round(precip, 2)
        station_dict['Lat'] = lat
        station_dict['Lon'] = lon
        station_data.append(station_dict)

    return jsonify(station_data)

# Temperatures
@app.route('/api/temperatures')
def temperatures():

    """Return a JSON list of mean daily temperature 
    data for the last calendar year."""
    
    select = [
        Measurement.date, 
        func.avg(Measurement.tobs.label('Temperature'))
    ]

    results = session.query(
        *select
    ).filter(
        Measurement.station == Station.station
    ).group_by(
        Measurement.date
    ).filter(
        Measurement.date >= '2016-08-23'
    ).all()

    temperature_data = []
    for date, temp in results:
        temp_dict = {}
        temp_dict['Date'] = date
        temp_dict['Temperature'] = round(temp, 2)
        temperature_data.append(temp_dict)

    return jsonify(temperature_data)

@app.route('/api/<start>/')
def daterange(start):

    """Return a JSON list of the Min Temperature, Avgerage Temperature 
    and Max Temperature for dates greater than or equal to specified start date."""

    select = [
        func.min(Measurement.tobs),
        func.avg(Measurement.tobs),
        func.max(Measurement.tobs)
    ]

    results = session.query(
        *select
    ).filter(
        Measurement.date >= start
    ).all()

    daterange_data = []
    for min, avg, max in results:
        range_dict = {}
        range_dict['Min Temperature'] = min
        range_dict['Average Temperature'] = round(avg, 2)
        range_dict['Max Temperature'] = max
        daterange_data.append(range_dict)

    return jsonify(daterange_data)

@app.route('/api/<start>/<end>')
def start_end(start, end):

    """Return a JSON list of the Min Temperature, Avgerage Temperature 
    and Max Temperature for a given start or start-end range."""

    select = [
        func.min(Measurement.tobs),
        func.avg(Measurement.tobs),
        func.max(Measurement.tobs)
    ]

    results = session.query(
        *select
    ).filter(
        Measurement.date >= start
    ).filter(
        Measurement.date <= end
    ).all()

    daterange_data = []
    for min, avg, max in results:
        range_dict = {}
        range_dict['Min Temperature'] = min
        range_dict['Average Temperature'] = round(avg, 2)
        range_dict['Max Temperature'] = max
        daterange_data.append(range_dict)

    return jsonify(daterange_data)

if __name__ == '__main__':
    app.run(debug=True)
