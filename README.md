# ServiceRequest_Analytics
Service Data Requests Management Portal 
#

#

#

#

#

#

#

UCBEL0130DATA Group Project II
ServiceNow Data Requests Management App
#

#

#

#

#

#

Team

Elham Saboori

Nodira Mamatova

Bilwa Buchake

Prabhakar Muriki

Jayachandran John

Department of Quality (DoQ)

Division of Analytics and Clinical Effectiveness (ACE)

ServiceNow Data Requests Management Application

Introduction

The Division of Analytics and Clinical Effectiveness functions to serve the needs of the Department of Quality and associated Quality & Safety initiatives. DoQ-ACE works with users to provide not just reports, but relevant and actionable analyses for and about quality improvement activities at the Organization.

Purpose

The ServiceNow Data Requests Management Application will serve as a web based portal for viewing, assigning priority and tracking all DoQ-ACE related data requests. This tool will allow the users to perform CRUD operations against the ServiceNow Data Requests dataset.

High Level Workflow



System Components and Technical Requirements

Data Model – MySQL
User Interface – HTML5, CSS3, Bootstrap 3.3, Javascript
Business logic/API – Flask, Python 3
Analysis Reports and Visualizations – Plotly, D3.js
Appendix A: Prioritization Criteria

The Division of Analytics and Clinical Effectiveness (DoQ-ACE) functions to serve the needs of the Department of Quality and associated Quality & Safety initiatives. DoQ-ACE works with users to provide not just reports, but relevant and actionable analyses for and about quality improvement activities at UCSF.
Prioritization Algorithm
Who is asking for or sponsoring the request?
EVP
Department Chair
VP
Executive Director
Director or Manager (DoQ)
Analyst (DoQ) | Quality Champion
Medical Director | 5 |
| Director (non-DoQ) | Division or Service Chief
Administrative Director or equivalent | 3 |
| Manager (non-DoQ) | Attending MD | 2 |
| Analyst (non-DoQ) | Supervised trainee projects | 1 |
| | | | |
| IMPACT | | | |
| What is the purpose/importance? | Joint Commission or CMS Purposes
Corporate or Contractual Compliance
California Department of Public Health
Internal / External Audits
Other Regulatory/Compliance Purposes | 7 |
| True North: Quality & Safety Pillar
a) Improving Clinical Outcomes (Mortality-, External Rankings- or Service-specific clinical outcome-related)
b) Achieving Zero Harm | 5 |
| Vizient Clinical Data Base request | 3 |
| Other Quality Improvement activities | 2 |
| True North: non-Quality & Safety pillar(s) | 1 |
| | | | |
| How long has the requester been waiting? | Approved requests waiting for one month | 1 |
| | | | |
| | | | |
| EFFORT | ** ** | ** ** | |
| Estimated number of hours to complete | < 20 hours | 5 |
| 21 - 40 hours | 4 |
| 40 - 80 hours | 3 |
| 80 - 120 hours | 2 |
| > 120 hours | 1 |
| | | | |

Appendix B: Current Tracking tool/ Decision Tree Template

Categories	Definitions UCSF Health	Points	REQ0138700	REQ0138511	#3
Who is the Requester			Joyce Nacario	David Shimabukuro	** **
Is the requester or sponsor from executive leadership?	President, CEO				
EVP
Dean
Department Chair | 7 | No | No | No |
| Is the requester or sponsor from senior leadership or DoQ staff? | VP
Executive Director
Director or Manager (DoQ)
Analyst (DoQ)
Quality Champion
Medical Director | 5 | Yes | Yes | No |
| Is the requester a Administrative Director or Division/Service Chief? | Director (non-DoQ)
Division or Service Chief
Administrative Director or equivalent | 3 | No | No | No |
| Is this requester a Manager or Clinician? | Manager (non-DoQ)
Attending MD
PharmD | 2 | No | No | No |
| Is the requester a non-DoQ analyst or supervised trainee? | Analyst (non-DoQ)
Supervised trainee projects | 1 | No | No | No |
| Is the request for Regulatory Purposes? | Joint Commission or other CMS Purposes
Corporate or Contractual Compliance
California Department of Public Health
Internal / External Audits
Other Regulatory/Compliance Purposes | 7 | No | No | No |
| Is this request for the TN Quality & Safety pillar? | Improving Clinical Outcomes
Acheiving Zero Harm | 5 | Yes | No | No |
| Is this request related to using data from the Vizient Clinical Data Base? | Inpatient CDB/RM
Non-inpatient CDB/RM
Core Measures | 3 | No | No | No |
| Is this request for other Quality Improvement priorities (not related to Q&S pillar)? | | 2 | No | No | No |
| Is this request for a True North: non-Quality & Safety pillar(s)? | Our People
Patient Experience
Financial Strength
Strategic Growth
Learning Health System | 1 | No | No | No |
| Estimate # of Hours to complete | From ACE team | 1-5 | 0<20hrs | 80-120hrs | >120hrs |
| ** ** | PRIORITIZATION POINTS | | 17 | 9 | 1 |
| | External Status | ** ** | | | |
| | Internal Status | ** ** | Review 4/24 ACE huddle | Review 4/24 ACE huddle | |
| | Approval Date | ** ** | N/A | N/A | N/A |
| Other Action Items | | | | | |
| Notes | | | | | |
