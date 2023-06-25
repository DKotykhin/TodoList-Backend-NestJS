# Todo List Backend

Backend for Todo List application

<p align="center">
  <a href="https://todolist-new20.herokuapp.com" target="blank"><img src="https://i.ibb.co/0XZYszD/icons8-microsoft-to-do-app-240.png" width="200" alt="TodoList Logo" /></a>
</p>

## Technologies

-   Node JS, Nest JS, Typescript, Mongoose, JWT, Bcrypt, Nodemailer, Class Validator, Handlebars, Sharp, Swagger
-   Database: Mongo DB

## Features

-   Full CRUD operations for users and tasks
-   JWT Token for authification
-   Check Auth Guard
-   Body validation
-   File uploads and delete
-   Resize upload images and change format
-   Static folder
-   Restore password via email
-   Task and User Mongoose models
-   Error handler
-   Config service for environment variables
-   Bcrypt for password hash
-   User and task statistic
-   Swagger API Docs


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`MONGO_DB` 
`SECRET_KEY`
`EMAIL_USER`
`EMAIL_PASS`
`FRONT_URL`


## Deploy on Heroku



  [https://todolist-new20.herokuapp.com/](https://todolist-new20.herokuapp.com/)

## Swagger API Docs

[https://todolist-new20.herokuapp.com/api/docs](https://todolist-new20.herokuapp.com/api/docs)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Author

- [@DKotykhin](https://github.com/DKotykhin)
