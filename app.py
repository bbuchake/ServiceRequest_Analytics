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
from sqlalchemy import func
#from flask_sqlalchemy import SQLAlchemy
import numpy as np
import pandas as pd
from datetime import datetime

#Define classes
Base = automap_base()

class Priority(Base):
    __tablename__ = 'Priority'

    ID = Column(Integer, primary_key=True)
    ticket_num = Column(String(15), nullable=False)
    req_priority = Column(Integer)
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

#For connecting to SQL Server

#Connect to SQL Server
import urllib
params = urllib.parse.quote_plus("DRIVER={SQL Server Native Client 10.0};SERVER=localhost\SQLEXPRESS;DATABASE=ServiceRequests;TRUSTED_CONNECTION=yes;MARS_Connection=Yes")
engine = create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)

#For connecting to MySQL
#engine = create_engine('mysql+pymysql://root:Wonder303@localhost:3306/ServiceReqAnalytics')

Base.prepare(engine, reflect=True)
session = Session(engine)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Query the database and send the jsonified results
@app.route("/priority/<ticket_no>")
def get_ticket_no(ticket_no=None):
    if request.method == "GET":
        #Get data from Ticket and Priority tables. A Left Outer join will help get ticket data whether Priority data exists or doesn't
        priority_query = session.query(Ticket.ticket_num, Ticket.cat_item, Ticket.ticket_state, Ticket.assignment_group, Ticket.request_requested_for, Ticket.due_date).join(Priority, Ticket.ticket_num == Priority.ticket_num, isouter=True).add_columns(Priority.req_priority, Priority.purpose_priority, Priority.hours_priority, Priority.assigned_to, Priority.completed, Priority.completed_date, Priority.total_priority).filter(Ticket.ticket_num==ticket_no).all()

        #Added this line to be able to check None prior to javascript
        req_priority = priority_query[0][6] if priority_query[0][6] != None else 0

        if priority_query:
            priority_data = {"ticket_num":priority_query[0][0],
                             "cat_item":priority_query[0][1],
                             "ticket_state":priority_query[0][2],
                             "assignment_group":priority_query[0][3],
                             "requested_for":priority_query[0][4],
                             "due_date":priority_query[0][5],
                             "req_priority": req_priority,
                             "purpose_priority": priority_query[0][7],
                             "hours_priority": priority_query[0][8],
                             "assigned_to":priority_query[0][9],
                             "completed":priority_query[0][10],
                             "completed_date":priority_query[0][11],
                             "total_priority":priority_query[0][12]
                            }
            return render_template("edit.html", priority_data=priority_data)
        else:
            return render_template("error.html")
    
@app.route("/priority", methods=["GET","POST"])
def add_priority():
    if request.method == "POST":
        
        #Get data from Ticket and Priority tables. A Left Outer join will help get ticket data whether Priority data exists or doesn't
        ticket_query = session.query(Ticket.ticket_num, Ticket.cat_item, Ticket.ticket_state, Ticket.assignment_group, Ticket.request_requested_for, Ticket.due_date).join(Priority, Ticket.ticket_num == Priority.ticket_num, isouter=True).add_columns(Priority.req_priority, Priority.purpose_priority, Priority.hours_priority, Priority.assigned_to, Priority.completed, Priority.completed_date, Priority.total_priority).filter(Ticket.ticket_num==request.form["itemNumber"]).all()
        
        #Calculate Total weight
        total_weight = interp(int(request.form["requestorRadios"]) + int(request.form["purposeRadios"]) + int(request.form["hoursRadios"]), [1,19], [1,5])
        
        markCompleted = 0
        if(request.form["markCompleted"] == 'on'):
            markCompleted = 1
        
        #Build priority data object
        priority_data = {"ticket_num":request.form["itemNumber"],
                         "cat_item":ticket_query[0][1],
                         "ticket_state":ticket_query[0][2],
                         "assignment_group":ticket_query[0][3],
                         "requested_for":ticket_query[0][4],
                         "due_date":ticket_query[0][5],
                         "req_priority": request.form["requestorRadios"],
                         "purpose_priority": request.form["purposeRadios"],
                         "hours_priority": request.form["hoursRadios"],
                         "assigned_to":request.form["assignedTo"],
                         "completed":markCompleted,
                         "completed_date":datetime.now(),
                         "total_priority":total_weight
                        }

       
        #Insert/Update into database
        #Check whether ticket number exists in the DB
        existing_ticket = session.query(Priority.ID).filter(Priority.ticket_num==request.form["itemNumber"]).all()
#        
#        if(existing_ticket):
#            session.query().filter(Priority.ID==existing_ticket).update({"ticket_num":request.form["itemNumber"],
#                                                                         "req_priority": request.form["requestorRadios"],
#                                                                         "purpose_priority": request.form["purposeRadios"],
#                                                                         "hours_priority": request.form["hoursRadios"],
#                                                                         "assigned_to":request.form["assignedTo"],
#                                                                         "completed":request.form["markCompleted"],
#                                                                         "completed_date":datetime.now(),
#                                                                         "total_priority":total_weight
#                                                                        })
#            session.commit()
#        else:
#            #Create priority object
#            priority1 = Priority(ticket_num=request.form["itemNumber"], req_priority=request.form["requestorRadios"], purpose_priority=request.form["purposeRadios"], hours_priority=request.form["hoursRadios"], assigned_to=request.form["assignedTo"], completed=request.form["markCompleted"], completed_date=datetime.now(), total_priority=total_weight)
#            session.add(priority1)
#            session.commit()
#
#        return render_template("edit.html", priority_data=priority_data)
        return render_template("error.html", total_weight=markCompleted)

@app.route("/all_tickets")
def all_tickets():
   results = session.query(Ticket.ticket_num, Ticket.cat_item, Ticket.ticket_state, Ticket.assignment_group, Ticket.request_requested_for, Ticket.due_date).all()
   return render_template('requests.html', resultSet=results)


# @app.route('/testdb')
# def testdb():
#     try:
#         db.session.query("1").from_statement("SELECT 1").all()
#         return '<h1>It works.</h1>'
#     except:
#         return '<h1>Something is broken.</h1>'

#returns the list of all departments 
@app.route("/departmentlist")
def departments():
    department_names = session.query(Ticket.assignment_group).distinct().all()
    dep = list(np.ravel(department_names))
    return jsonify(dep)


 #returns the count of each status for each department
@app.route('/history/<department>')
def team_performance(department):
    results = session.query(Ticket.stage, func.count(Ticket.ticket_num)).group_by(Ticket.stage).filter(Ticket.assignment_group==department).all()
    perf = list(np.ravel(results))
    dep_df = {'status':[], 'count':[]}
    for i in range(len(perf)):
        if i%2==0:
            dep_df['status'].append(perf[i])
        else:
            dep_df['count'].append(perf[i])
    return jsonify(dep_df)


 #returns the count of different priorities 
@app.route('/priority_plot/<department>')
def priority_dep(department):
    results =  session.query(Ticket.priority, func.count(Ticket.ticket_num)).group_by(Ticket.priority).filter(Ticket.assignment_group==department).all()
    prior = list(np.ravel(results))
    dep_df = {'priority':[], 'count':[]}
    for i in range(len(prior)):
        if i%2==0:
            dep_df['priority'].append(prior[i])
        else:
            dep_df['count'].append(prior[i])
    return jsonify(dep_df)


if __name__ == "__main__":
    app.run()
