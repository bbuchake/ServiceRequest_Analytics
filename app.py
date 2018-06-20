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
from flask_sqlalchemy import SQLAlchemy
import numpy as np
import pandas as pd

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

#engine = create_engine('mysql+pymysql://root:Wonder303@localhost:3306/ServiceReqAnalytics')
engine = create_engine('mssql+pyodbc//MCCGWHWDB001/CDW')

Base.prepare(engine, reflect=True)
#conn = engine.connect()
session = Session(engine)

priority = session.query(Priority)
ticket = session.query(Ticket)
db = SQLAlchemy(app)
Base.metadata.create_all(engine)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Query the database and send the jsonified results
@app.route("/get/<ticket_no>")
def get_ticket_no():
    ticket_number = ticket_no
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

@app.route("/post/<ticket_no>")           
def post_ticket_no():
        ticket_number = ticket_no
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
def all_tickets():
   results = session.query(Ticket.ticket_num, Ticket.cat_item, Ticket.ticket_state, Ticket.assignment_group, Ticket.request_requested_for, Ticket.due_date).all()
   return render_template('requests.html', resultSet=results)

@app.route('/testdb')
def testdb():
    try:
        db.session.query("1").from_statement("SELECT 1").all()
        return '<h1>It works.</h1>'
    except:
        return '<h1>Something is broken.</h1>'

#returns the list of all departments 
@app.route("/departmentlist")
def departments():
  department_names = db.session.query(Ticket.assignment_group).distinct().all()
  dep = list(np.ravel(department_names))
  return jsonify(dep)


#returns the count of each status for each department
@app.route('/history/<department>')
def team_performance(department):
    results = db.session.query(Ticket.stage,func.count(Ticket.ticket_num)).group_by(Ticket.stage).filter(Ticket.assignment_group==department).all()
    perf = list(np.ravel(results))
    dep_df = {'status':[], 'count':[]}
    for i in range(len(perf)):
      if i%2==0:
        dep_df['status'].append(perf[i])
      else:
        dep_df['count'].append(perf[i])
    return jsonify(dep_df)


#returns the count of different priorities 
@app.route('/priority/<department>')
def priority_dep(department):
  results =  db.session.query(Ticket.priority, func.count(Ticket.ticket_num)).group_by(Ticket.priority).filter(Ticket.assignment_group == department).all()
  perf = list(np.ravel(results))
  dep_df = {'priority':[], 'count':[]}
  for i in range(len(perf)):
    if i%2==0:
      dep_df['priority'].append(perf[i])
    else:
      dep_df['count'].append(perf[i])
  return jsonify(dep_df)


if __name__ == "__main__":
    app.run()
