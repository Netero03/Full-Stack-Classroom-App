# Classroom Management System

A full-stack classroom management web application that allows principals, teachers, and students to manage classroom activities seamlessly. The project was developed as part of a Full Stack Development Screening Assignment.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Setup](#setup)
* [License](#license)

## Overview

The Classroom Management System is a web application designed to streamline classroom activities for principals, teachers, and students. The application allows principal to manage classrooms/teachers/students and teachers to manage timetable of the assigned classroom, making it easier to stay organized and focused on learning.

## Features

* User authentication and authorization
* Class management (create, read, update, delete)
* Timetable management (create, read, update, delete)
* User management (create, read, update, delete)
* Role based access.
* User profiles and dashboard

## Technologies Used

* Frontend: React, Vite, Tailwind CSS
* Backend: Node.js, Express.js, MongoDB
* Database: MongoDB

## Setup

To run the application, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/classroom-management-system.git`
2. Install dependencies: `npm install` (or `yarn install`)
3. Start the backend server: `npm start` (or `yarn start`)
4. Start the frontend development server: `npm run dev` (or `yarn dev`)
5. Open the application in your web browser: `http://localhost:3000`

## Usage and Role Based Access

Once the application is running, you can log in as a principal, teacher, or student to access the various features. The application is designed to be user-friendly and intuitive, but here are some basic steps to get you started:

* Principal

1. Create and manage classrooms.
2. Create accounts for teachers and students.
3. Assign teachers to classroom.
4. Assign students to classroom.
5. View and edit the list of teachers and students.

* Teachers

1. Manage students assigned to their classroom.
2. View the details of their classroom and students.
3. View their assigned classroom.
4. View other students in their classroom.
5. Do CURD operations on Timetable in the assigned classroom.

* Students

1. View their assigned classroom.
2. View their assigned teacher.
3. View their assigned timetable (Created by their classroom teacher).
4. View other students in their classroom.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.