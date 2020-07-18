# nutrition-journal

## Documentation
Check the `docs` folder for a presentation and the documentation of this project

## Running the project
Requirements: 
- npm 
- Docker 

To start the application simply run `./start.sh`

To stop the application run `./stop.sh`

## Project Structure

1. ### Backend
    * api - Accepts REST requests from frontend sent by users
    * app - Manages user requests and communicates with DB through services
2. ### Frontend
    * src/app - Split into separate modules, which are split into separate components which display their views and manage their data and models by sending requests to the backend