# This is a template for the scrape_mars.py file needed for the flask app.py
# to call as a route when someone clicks the 'Get Data' button on the dashboard 

from bs4 import BeautifulSoup as bs
from splinter import Browser
import pandas as pd

def init_browser():
	executable_path = {'executable_path': 'chromedriver.exe'}
	return Browser('chrome', **executable_path, headless=False)

def mars_scraper():

	# ... (Initialize the browser for scraping) ...)
	browwer = init_browser()


	# ... (Your code for scraping the sites here) ...


	# ... (Which includes at the end a dictionary returning all of the
	#     scraped data.) ...

	example_dict = {

		'keys': 'values'

	}

	# ... (Close the browser) ...
	browser.quit()

	# ... (Return the all your data to execute the mars_scraper() function)...
	return example_dict
	



