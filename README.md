# Playwright Test Automation for OrangeHRM

# Project Description
This repo contains tests for the OrangeHRM appliction using Playwright. 
The tests cover login functionality, candidiate search, and filtering applications by date.



# Test Structure
The tests are structured as follows:

* beforeAll: Extracts login credentials from the login page.

* beforeEach: Logs in before executing each test.

* Search for Candidate Test: Searches for a candidate and verifies toast notifications.

* Filter by Date Test: Filters applications by date and verifies results.