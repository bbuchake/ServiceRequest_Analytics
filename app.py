# import necessary libraries
import os
from numpy import interp
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db.sqlite"
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')
db = SQLAlchemy(app)

#################################################
# Database Setup
#################################################

# @app.before_first_request
# def setup():
#     # Recreate database each time for demo
#     # db.drop_all()
#     db.create_all()


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        # values 7,5,3,2,1
        requestor_weight = request.form["requestorRadios"]
        purpose_weight = request.form["purposeRadios"]
        hours_weight = request.form["hoursRadios"]

        Total_weight = requestor_weight + purpose_weight + hours_weight

        Ticket_weight_float = interp(Total_weight, [1,19]], [1,5])
        Total_weight_int = int(Ticket_weight_float)
        return redirect("/", code=302)

    return render_template("index.html")

@app.route("/all_tickets")
def get_all_ticket():


    return jsonify()

if __name__ == "__main__":
    app.run()
