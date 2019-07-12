#!/usr/bin/env python
# coding: utf-8

# In[1]:


from IPython.display import Image
Image(filename = 'lights_at_night.jpg', width = 2000, height = 2000)


# <h1><center> WeatherPy - Homework 6 - API</center></h1>
# 
# #### 3 Observed Trends
# 
# * Latitude affects temperature: It is common sense that as you get closer to the equator the temperature will rise.  This is clearly shown in the Latitude vs. Temperature graph with the curvlinear relationship demonstrating the change in temperature for cities with high and low latitudes.
# 
# * It appears that Latitude and Cloudiness are independent of each other.  There is no discernable relationship between Latitude and Cloudiness shown in Plot 3, with cities of varying Latitude showing varying values of Cloudiness.
# 
# * Most of the randomly selected 3000+ cities 
# 
# 
# which represent a 1% sample of the 202,000 cities with collectable data available through openweathermap.org,
# 
# 
# #### Environment Setup

# In[2]:


# Dependencies and Setup
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import json
from requests import get
from time import sleep
from pprint import pprint
from config import api_key
from datetime import datetime


# #### Generate 500+ Random City Names

# In[3]:


#
# This code cell was provided as starter code
#

# Incorporated citipy to determine city based on latitude and longitude
from citipy import citipy

# Output File (CSV)
output_data_file = "output_data/cities.csv"

# Range of latitudes and longitudes
lat_range = (-90, 90)
lng_range = (-180, 180)

# List for holding lat_lngs and cities
lat_lngs = []
cities = []

# Create a set of random lat and lng combinations
lats = np.random.uniform(low = -90.000, high = 90.000, size = 1500) # Adjust the size for more cities
lngs = np.random.uniform(low = -180.000, high = 180.000, size = 1500) # Adjust the size for more cities

lat_lngs = zip(lats, lngs)

# Identify nearest city for each lat, lng combination
for lat_lng in lat_lngs:
    
    city = citipy.nearest_city(lat_lng[0], lat_lng[1]).city_name
    
    # If the city is unique, then add it to a our cities list
    if city not in cities:
        cities.append(city)


# #### Initalize needed objects for API calls

# In[4]:


# Setup the cities iterator
city_list = [str(i) for i in cities]

# Initialize needed objects
city_count = 0
city_data = pd.DataFrame()


# #### API Call
# ###### Note: This takes approximately 10 to 15 minutes

# In[5]:


# For loop through the cities iterator, pulling needed data from the JSON request object
for city in city_list:
    
    # Get JSON response file for each city
    response = get('http://api.openweathermap.org/data/2.5/weather?q='
                   + city
                   + '&APPID='
                   + api_key 
                   + '&units=metric').json()
    
    # Pause for 1.175 seconds (70.5 seconds for 60 requests) 
    # to ensure compliance with request rate of 60 calls per minute
    sleep(1.175)
    
    try:
        
        # Test response code of JSON file for cities not found
        if response['cod'] == 200:
            
            # Pull needed data from JSON response object and insert into a dictionary
            city_dict = {
                'city_id': response['id'],
                'name': response['name'],
                'country': response['sys']['country'],
                'longitude': response['coord']['lon'],
                'latitude': response['coord']['lat'],
                'cloudiness': response['clouds']['all'],
                'humidity': response['main']['humidity'],
                'temperature': response['main']['temp'],
                'wind_speed': response['wind']['speed'],
                'time': response['dt']
            }
        
            # Create a temporary single row dataframe with the current cities data
            temp_df = pd.DataFrame(city_dict, index = ['city']).set_index('city_id')  
        
            # Add the temporary dataframe row to the pre-intialized city_data DataFrame
            city_data = pd.concat([city_data, temp_df])
        
            # Add 1 for each city iteration to the city counter
            city_count += 1
        
            # Collect the current cities name
            city_name = city_dict['name']    
            
            # Re-intialise the city dictionary to be empty for the next interation
            city_dict = {}
            
        else:
            
            print('City not found ... skipping.')
    
    # Raise a KeyError if a cities JSON response does not include all of the needed data
    except KeyError as e:
        
        print(f'Skipping city ... : KeyError: {e} not found.') 
    
    print(f'Accessing city # {city_count} | {city_name}')


# #### Clean DataFrame

# In[24]:


city_data = city_data.reset_index()

city = city_data.rename(columns={
    'name': 'City',
    'country': 'Country',
    'longitude': 'Lon',
    'latitude': 'Lat',
    'temperature': 'Temp',
    'wind_speed': 'Wind Speed',
    'humidity': 'Humidity',
    'cloudiness': 'Cloudiness (%)',
    'time': 'Time'
})


city['Time'] = pd.to_datetime(city['Time'], unit = 's')

request_time = city['Time'][0]


# #### Preview DataFrame

# In[25]:


city.head()


# In[26]:


city.info()


# #### Save CSV

# In[23]:


city.to_csv('city_data.csv')


# #### Global parameter for plot font size

# In[27]:


# Set the global plot parameter for font size
plt.rcParams.update({'font.size': 16})

# Place all plot objects in front of plot grids
plt.rcParams['axes.axisbelow'] = True


# <center><h2>Plot 1 - Temperature</h2></center>

# In[28]:


fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    city['Lat'], 
    city['Temp'],
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Temperature')
ax.set_xlabel('Latitude')
ax.set_title(f'City Latitude vs. Temperature ({request_time} GMT)')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.savefig('WeatherPy - Temperature.png')

plt.show()


# <center><h2>Plot 2 - Humidity</h2></center>

# In[29]:


fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    city['Lat'], 
    city['Humidity'], 
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Humidity')
ax.set_xlabel('Latitude')
ax.set_title(f'City Latitude vs. Humidity ({request_time} GMT)')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.savefig('WeatherPy - Humidity.png')

plt.show()


# <center><h2>Plot 3 - Cloudiness</h2></center>

# In[30]:


fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    city['Lat'], 
    city['Cloudiness (%)'], 
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Cloudiness (%)')
ax.set_xlabel('Latitude')
ax.set_title(f'City Latitude vs. Cloudiness ({request_time} GMT)')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.savefig('WeatherPy - Cloudiness.png')

plt.show()


# <center><h2>Plot 4 - Wind Speed</h2></center>

# In[31]:


fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    city['Lat'], 
    city['Wind Speed'], 
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Wind Speed (m/s)')
ax.set_xlabel('Latitude')
ax.set_title(f'City Latitude vs. Wind Speed ({request_time} GMT)')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.savefig('WeatherPy - Wind Speed.png')

plt.show()


# <center><h2>Global City Temperatures</h2></center>

# In[36]:


fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    city['Lon'], 
    city['Lat'], 
    c = city['Temp'], 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 125
)

ax.set_ylabel('Longitude')
ax.set_xlabel('Latitude')
ax.set_title(f'Global Temperatures in ($^\circ$C)')

plt.text(-230, -90, f'Note: \nCity count of 2026 randomly drawn cities on {request_time} GMT from openweathermap.org.')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.tight_layout()

plt.savefig('WeatherPy - Global Temperature.png')

plt.show()


# <center><h2>Histogram of City Temperatures</h2></center>

# In[35]:


temp_bins = int(round(abs(city['Temp'].min()) + city['Temp'].max(), 0))

fig, ax = plt.subplots(1, figsize=[12.5, 7])

ax.hist(
    city['Temp'],
    bins = temp_bins,
    color = '#002147',
    alpha = .9
)
ax.hist(
    city['Temp'], 
    bins = temp_bins, 
    color = '#A3C1AD', 
    histtype = 'step'
)

ax.set_xlabel('Temperature ($^\circ$C)')
ax.set_ylabel('Count')
ax.set_title('Histogram of City Temperatures')

plt.text(-10, -10, f'Note: \n- City count of 3212 randomly drawn cities on {request_time} GMT from openweathermap.org.                     \n- 1 bin per degree celsius for 42 bins.')

plt.grid(
    b = True, 
    which = 'major', 
    color = '#666666', 
    linestyle = '-',
    alpha = 0.75
)

plt.minorticks_on()
plt.grid(
    b = True, 
    which = 'minor', 
    color = '#666666', 
    linestyle = '-', 
    alpha = 0.2
)

plt.tight_layout()

plt.savefig('Histogram of City Temperatures')

plt.show()


# <center><h2>Scatterplot of Northern Hemisphere Cities vs. Temperature</h2></center>

# In[38]:


northern_hemi = city[city['Lat'] >= 0]

fig, ax = plt.subplots(1, figsize = [12.5, 7])

ax.scatter(
    northern_hemi['Lat'], 
    northern_hemi['Temp'], 
    c = '#002147', 
    alpha = 0.5, 
    edgecolors = 'black', 
    linewidths = 1,
    s = 150
)

ax.set_ylabel('Temperature ($^\circ$C)')
ax.set_xlabel('Northern Hemisphere Cities (Lat >= 0)')
ax.set_title(f'Scatterplot of Northern Hemisphere Cities vs. Temperature ({request_time} GMT)')

plt.grid(b = True, which = 'major', color = '#666666', linestyle = '-')
plt.minorticks_on()
plt.grid(b = True, which = 'minor', color = '#666666', linestyle = '-', alpha = 0.2)

plt.tight_layout()
plt.savefig('WeatherPy - Wind Speed ({request_time}).png')

plt.show()


# <center><h2>Histogram of City Latitudes</h2></center>

# In[40]:


fig, ax = plt.subplots(1, figsize=[20, 11])

lat_bins = int(round(abs(city['Lat'].min()) + city['Lat'].max(), 0))

ax.hist(
    city['Lat'],
    bins = lat_bins,
    color = '#002147',
    alpha = .9
)
ax.hist(
    city['Lat'], 
    bins = lat_bins, 
    color = '#A3C1AD', 
    histtype = 'step'
)

ax.set_xlabel('Latitude')
ax.set_ylabel('Count')
ax.set_title('Histogram of City Latitudes')

plt.text(-60, -2,
         f'Note: \n- City count of 536 randomly drawn cities on {request_time} GMT from openweathermap.org. \
         \n- 1 bin per degree of latitude for 133 bins. ')

plt.grid(
    b = True, 
    which = 'major', 
    color = '#666666', 
    linestyle = '-',
    alpha = 0.75
)

plt.minorticks_on()
plt.grid(
    b = True, 
    which = 'minor', 
    color = '#666666', 
    linestyle = '-', 
    alpha = 0.2
)

plt.tight_layout()
plt.savefig('Histogram of City Latitudes.png')

plt.show()

