# Project Title - Renting Application

Rentify is a web application designed to simplify the process of renting properties for both landlords (sellers) and tenants (buyers). With features tailored to meet the needs of users on both sides of the rental market, Rentify aims to streamline property listing, viewing, and application processes.

# Live Links
1. https://rentify.jayworks.tech - FRONTEND
2. https://rentapi.jayworks.tech - BACKEND

# Github Repo Link 
https://github.com/swap775599/Presidio_Hiring_Challenge_Rentify

## Technologies Used
1. Node js - Backend , React js - Frontend
2. Database: MONGO DB
3. Authentication: JWT TOKEN
4. Email Service: Nodemailer - Gmail

## Deployment
1. An active AWS account is needed.
2. AWS EC2 with elastic public IP.
3. Domain name configured to point to the EC2 instance's public IP address.
4. Unbuntu server configuration 
5. Nginx install and config proxy routing
6. CertBot install and config for SSL certificate

### Features
1. User registration and authentication by email
2. Property listing and management for sellers
    1. Add property
    2. Update property
    3. Delete property
    4. Find interested buyers
    5. likes, dislikes
3. Property browsing and interaction for buyers
    1. Interested items dashboard
    2. likes, dislikes
4. Email notifications for buyer-seller interactions if buyer shown interest
    1. Email triggered to buyer with seller and property data
    2. Email triggered to seller with interested buyer data
5. Pagination and form validation for enhanced user experience
6. User feedback through like and dislike feature

### Installation

### Frontend Setup 
1. Clone the repository.
2. Navigate to the frontend directory.
3. Install dependencies using npm install.
4. Update backend API endpoint in configuration files.
5. Run the frontend using npm start.

### Backend Setup
1. Clone the repository.
2. Navigate to the backend directory.
3. Install dependencies using npm install.
4. Set up the database according to schema provided.
5. Configure environment variables for database connection, email service, and authentication.
     1. MONGO DB ATLAS
     2. EMAIL DELIVERY CREDENTIALS
6. Run the server using npm start.

