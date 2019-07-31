
# Hellow World Bare Bones App
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return "Index Page: IT'S WORKING!!!!!!"

@app.route('/hello')
def hello():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(debug=True)