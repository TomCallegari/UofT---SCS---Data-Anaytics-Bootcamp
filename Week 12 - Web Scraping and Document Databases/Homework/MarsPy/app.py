from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import scrape_mars

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")

# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Find one record of data from the mongo database
    mars_data = mongo.db.collection.find_one()

    # Return template and data
    return render_template(
        "index.html", 
        date=mars_data['date'],
        title=mars_data['title'], 
        teaser=mars_data['teaser'],
        image_jpg=mars_data['image_jpg'],
        image_title=mars_data['image_title'],
        weather_text=mars_data['weather_text'],
        mars_facts=mars_data['mars_facts'],
        hemisphere_1=mars_data['hemisphere_1'],
        hemisphere_2=mars_data['hemisphere_2'],
        hemisphere_3=mars_data['hemisphere_3'],
        hemisphere_4=mars_data['hemisphere_4']
        )

# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():

    # Run the scrape function
    mars_data = scrape_mars.mars_scrape()

    # Update the Mongo database using update and upsert=True
    mongo.db.collection.update({}, mars_data, upsert=True)

    # Redirect back to home page
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
