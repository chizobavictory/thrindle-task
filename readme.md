# Thrindle Payment API Documentation
### Overview
The Thrindle Payment API allows users to signup, get OTP and login and recieve a token. Authorized consumers can make money transfers using the Paystack payment gateway. Additionally, users can retrieve and search their transaction history.

### Stack
- Node.js
- Express
- MongoDB
- Typescript
- Paysack API

### Authentication
All payment endpoints require authentication via JSON Web Token (JWT). Include the JWT token in the Authorization header with the format: Bearer <token>. It is gotten from the login endpoint.

### Postman Documentation
https://documenter.getpostman.com/view/24035086/2s9YeHYq4L

### Postman Collection: 
Every endpoint has the required documentation explained in full on Postman. You can access the documentation via the link below:
https://www.postman.com/telecoms-explorer-27073331/workspace/chizobavictory/collection/24035086-20581051-9d48-42ac-8e39-4ac8e6713067?action=share&creator=24035086&active-environment=24035086-18db1989-d499-4ff5-aaef-9dd8df35dcc9

### Installation
- Clone the repository
- Run npm install to install dependencies
- Create a .env file in the root directory and add the data to match the .env.example file
- Run npm run dev to start the server in development mode
- Set postman environment to THRINDLE to set the base url

### Deployment
The API is deployed on Render. The enpoint is https://thrindle-payment-api.onrender.com
