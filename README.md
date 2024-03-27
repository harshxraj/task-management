# Task Manager Application
This is a web-based task management application built using the MERN stack (MongoDB, Express.js, React, Node.js). The application allows users to manage tasks by performing CRUD (Create, Read, Update, Delete) operations.

## Features
- **CRUD Operations**: Users can perform Create, Read, Update, and Delete operations on tasks.
- **Filtering by Status**: Users can filter tasks by status (e.g., Pending, In Progress, Completed).
- **Filtering by Priority**: Users can filter tasks by priority (e.g., Low, Medium, High).
- **Pagination**: Tasks are paginated to improve performance and user experience.
- **Validation**: Input data such as task title and description are validated to ensure data integrity.
- **User Authentication**: Users can sign up and log in to access the application. Only authenticated users can perform task management operations.
- **Redux-toolkit Integration**: User data fetched from the database is stored in Redux for efficient state management across the application.
- **Styling**: The application is styled using Tailwind CSS to enhance user experience and make it visually appealing.

## Preview
![photo](https://github.com/harshxraj/task-management/assets/128404446/02ab5d0f-a93a-4f93-904d-70a8b311405c)

## Technologies Used
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js
- **User Authentication**: JSON Web Tokens (JWT)
- **Styling**: Tailwind CSS
- **Deployment**: Render

## Setup Instructions

1. Clone the repository: `https://github.com/harshxraj/task-management.git`
2. Navigate to the backend directory: `cd backend`
3. Install backend dependencies: `npm install`
4. Create a `.env` file in the backend directory and configure environment variables.
5. Start the backend server: `npm start`
6. Navigate to the frontend directory: `cd frontend`
7. Install frontend dependencies: `npm install`
8. Start the frontend development server: `npm run dev`

