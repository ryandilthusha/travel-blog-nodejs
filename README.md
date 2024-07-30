# TODO Website Runs on Local Machine 🚀

## Overview 💁🏻‍♂️

This project is part of the Web Programming course, aimed at implementing a full-fledged blog site. The blog site is built using JavaScript, Node.js, Express, and PostgreSQL, incorporating features like displaying posts, commenting, liking, user registration and login, editing and deleting posts or comments, search functionality, and a feedback form among others.

The development adheres to the Scrum agile method, with work divided into one-week sprints with total of 7 sprints, leading to a final presentation and evaluation based on both self and peer assessment, and coach's assessment.

This project created prior to host on a website. This can be run on your local machine by following steps as instructed.



## Getting Started 🏁

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites 📋

Before you begin, ensure you have the following installed:
- Node.js
- npm (Node.js package manager)
- PostgreSQL

### Installing 🔧

A step-by-step series of examples that tell you how to get a development environment running:

1. **Clone the Repository**

    First, clone this repository to your local machine using Git:

    ```sh
    git clone https://github.com/ryandilthusha/travel-blog-nodejs.git
    ```

2. **Open the Project in Visual Studio Code**

    Open the cloned repository folder in Visual Studio Code (VS Code). You can do this from the command line. Right click on the cloned folder -> Click on Open with Terminal -> Then type:

    ```sh
    code .
    ```

3. **Navigate to the Server Folder**

    Use the terminal in VS Code to navigate into the server directory:

    ```sh
    cd ./server
    ```

4. **Install Dependencies**

    Before running the application, you need to install its dependencies. Make sure you are in the server directory, then run:

    ```sh
    npm install
    ```

5. **Start the Development Server**

    To start the development server, run:

    ```sh
    npm run devStart
    ```

    This command will start the backend server, typically available at `http://localhost:3000` (the port might be different based on your setup).



## Database Setup 🗄️

To run this application locally, you'll need to set up a PostgreSQL database. Follow these steps to create a local database, the necessary table, and configure the application to connect to it.

### Prerequisites for Database Setup

- PostgreSQL installed on your local machine.
- pgAdmin4 (or another PostgreSQL management tool) installed for database management.

### Creating the Database

1. **Open pgAdmin4:** Launch pgAdmin4 and enter your master password.

2. **Create a New Database:**
   - Right-click on 'Databases' in the browser menu, then select 'Create' > 'Database'.
   - Name your database (e.g., `travelBlog`) and click 'Save'.

### Setting Up the Database Table

1. **Create the Database Tables:**
   - Open the query tool within the newly created database in pgAdmin4.
   - Copy and Pase and Execute the "db updated.sql" file entire code. This file is located in Server Folder (Backend):

### Configure Application to Use Local Database

- Navigate to the `.env` file in your project directory (Server Folder). If it doesn't exist, create one using the content provided below. Adjust any values to match your local setup, especially `DB_PASSWORD`:

    ```
    # .env file content
    PORT=3001
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=travelBlog
    DB_PASSWORD=*****
    DB_PORT=5432
    ```

- Ensure that your application's code references these environment variables for database connections.


## Running the Application 🚀

Now from VS Code application right click on "index.html" file and click on Open with Live Server