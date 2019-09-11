from bs4 import BeautifulSoup as bs
import time
from splinter import Browser
import pandas as pd

def init_browser():
    executable_path = {'executable_path': 'chromedriver.exe'}
    return Browser('chrome', **executable_path, headless=True)

def mars_scrape():
    
    browser = init_browser()
    
    # Mars news   
    news_url = 'http://mars.nasa.gov/news/'
    browser.visit(news_url)
    news_html = browser.html   
    
    news_soup = bs(news_html, 'html.parser')        
    news_date = news_soup.find('ul', class_='item_list').find('div', class_='list_date').text
    news_title = news_soup.find('ul', class_='item_list').find('div', class_='content_title').text
    news_teaser = news_soup.find('ul', class_='item_list').find('div', class_='article_teaser_body').text
    
    # Featured image
    jpl_url = 'http://www.jpl.nasa.gov'
    image_url = 'http://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(image_url)
    image_html = browser.html
    
    image_soup = bs(image_html, 'html.parser')        
    image_jpg = image_soup.find('ul', class_='articles').find('img', class_='thumb')['src']
    image_title = image_soup.find('ul', class_='articles').find('div', class_='item_tease_overlay').text
    
    # Mars weather
    weather_url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(weather_url)
    weather_html = browser.html
    
    weather_soup = bs(weather_html, 'html.parser')        
    weather_text = weather_soup.find('div', class_='js-tweet-text-container').text.strip()   
    
    # Mars facts
    facts_url = 'https://space-facts.com/mars/'
    mars_tables = pd.read_html(facts_url)    
    mars_facts = mars_tables[1]
    mars_facts = mars_facts.rename(columns={
        0: 'Stat',
        1: 'Value'
    }).set_index('Stat')
    mars_html = mars_facts.to_html(classes='statsTable')
    
    # Hemispheres
    hemi_page = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(hemi_page)

    hemi_html = browser.html
    hemi_soup = bs(browser.html, 'html.parser')
    hemi_list = hemi_soup.find_all('div', {'class': 'item'})

    links = []
    for hemi in hemi_list:
        links.append(hemi.find('a', {'class': 'itemLink product-item'})['href'])
    
    main_page = 'https://astrogeology.usgs.gov/'
    
    jpg_links = []
    for i in range(0, 4):
        browser.visit(main_page + links[i])
        hemi_html = browser.html
        hemi_soup = bs(hemi_html, 'html.parser')
        jpg_links.append(hemi_soup.find('a', {'target': '_blank'})['href'])
    
    # Main dict to return    
    mars_dict = {
        'date': news_date,
        'title': news_title,
        'teaser': news_teaser,
        'image_jpg': jpl_url + image_jpg,
        'image_title': image_title,
        'weather_text': weather_text,
        'mars_facts': mars_html,
        'hemisphere_1': jpg_links[0],
        'hemisphere_2': jpg_links[1],
        'hemisphere_3': jpg_links[2],
        'hemisphere_4': jpg_links[3]
    }
    
    browser.quit()
    
    return mars_dict
