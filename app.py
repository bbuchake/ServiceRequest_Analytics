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

# Dependencies
# ----------------------------------
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy import update

Base = automap_base()

class Priority(Base):
  __tablename__ = 'Priority'

  ID = Column(Integer, primary_key=True)
  ticket_num = Column(String(15), nullable=False)
  requestor_priority = Column(Integer)
  purpose_priority = Column(Integer)
  hours_priority = Column(Integer)
  assigned_to = Column(String(100))
  completed = Column(Boolean)
  completed_date = Column(DateTime)
  total_priority = Column(Integer)

class Ticket(Base):
  __tablename__ = 'Tickets'

  ID = Column(Integer, primary_key=True)
  ticket_num = Column(String(15), nullable=False)
  cat_item = Column(String(250), nullable=False)
  ticket_state = Column(String(50), nullable=False)
  approval = Column(String(15), nullable=False)
  stage = Column(String(100))
  assignment_group = Column(String(100), nullable=False)
  assigned_to = Column(String(100))
  request = Column(String(15), nullable=False)
  request_requested_for = Column(String(100), nullable=False)
  sys_created_on = Column(DateTime, nullable=False)
  contact_type = Column(String(10), nullable=False)
  description = Column(String(250))
  due_date = Column(DateTime, nullable=False)
  priority = Column(String(10), nullable=False)

engine = create_engine('mysql+pymysql://root:Wonder303@localhost:3306/ServiceReqAnalytics')
Base.prepare(engine, reflect=True)
#conn = engine.connect()
session = Session(engine)

priority = session.query(Priority)
ticket = session.query(ticket)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "GET":
        ticket_number = request.form["ticketNumber"]
        #The below code checks if the the ticket_number already exists in priority table
        priority_query = priority.filter_by(ticket_num = ticket_number).first()
        ticket_query = ticket.filter_by(ticket_num = ticket_number).first()
        if priority_query:
            priority_data = {"ticket_num":priority_query.ticket_num,
            "req_priority": priority_query.requestor_priority,
            "purpose_priority": priority_query.purpose_priority,
            "hours_priority": priority_query.hours_priority,
            "assigned":priority_query.assigned_to,
            "completed":priority_query.completed,
            "completed_date":priority_query.completed_date,
            "total_priority":priority_query.total_priority}
            return render_template("index.html", priority_data=priority_data)
        else:
            #return value None when there exists no value for the priority table for a given ticket number
            return None
            
    elif request.method == "POST":
        ticket_number = request.form["ticketNumber"]
        priority_query = priority.filter_by(ticket_num = ticket_number).first()
        ticket_query = ticket.filter_by(ticket_num = ticket_number).first()
        # values 7,5,3,2,1
        requestor_weight = request.form["requestorRadios"]
        purpose_weight = request.form["purposeRadios"]
        hours_weight = request.form["hoursRadios"]
        assigned_employee = request.form[""]
        completed = request.form[""]
        completed_datae = request.form[""]
        #checks if the priority table already exists if so will update the priority table with new values given in the post request
        if priority_query:
            Total_weight = requestor_weight + purpose_weight + hours_weight
            Ticket_weight_float = interp(Total_weight, [1,19], [1,5])
            Total_weight_int = int(Ticket_weight_float)
            priority_query.requestor_priority = requestor_weight
            priority_query.purpose_priority = purpose_weight
            priority_query.hours_priority = hours_weight
            session.commit()
            priority_data = {"ticket_num":priority_query.ticket_num,
            "req_priority": priority_query.requestor_priority,
            "purpose_priority": priority_query.purpose_priority,
            "hours_priority": priority_query.hours_priority,
            "assigned":priority_query.assigned_to,
            "completed":priority_query.completed,
            "completed_date":priority_query.completed_date,
            "total_priority":priority_query.total_priority}
            return render_template("index.html", priority_data=priority_data)

        else:
            Total_weight = requestor_weight + purpose_weight + hours_weight
            Ticket_weight_float = interp(Total_weight, [1,19], [1,5])
            Total_weight_int = int(Ticket_weight_float)
            priority = Priority(ticket_num = ticket_number ,requestor_priority = requestor_weight, purpose_priority = purpose_weight, hours_priority = hours_weight, total_priority=Total_weight_int)
            session.add(priority)
            session.commit()
            priority_data = {"ticket_num":priority_query.ticket_num,
            "req_priority": priority_query.requestor_priority,
            "purpose_priority": priority_query.purpose_priority,
            "hours_priority": priority_query.hours_priority,
            "assigned":priority_query.assigned_to,
            "completed":priority_query.completed,
            "completed_date":priority_query.completed_date,
            "total_priority":priority_query.total_priority}
            return render_template("index.html", priority_data=priority_data)
 
@app.route("/all_tickets")
def get_all_ticket():
    #Code still in works
    return None

if __name__ == "__main__":
    app.run()
