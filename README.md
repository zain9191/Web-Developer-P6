# Hot Takes API

This project is a secure backend API for **"Hot Takes,"** an application designed for users to share and review their favorite spicy sauces. Developed for **Piiquante**, a brand specializing in hot condiments, this API serves as the backbone for their web application, allowing users to upload, like, and dislike various hot sauces.

---

## Features

### User Authentication

- **Signup:**  
  Users can create an account with a unique email and a securely hashed password.

- **Login:**  
  Authenticated users receive a JSON Web Token (JWT) for secure access.

### Sauce Management

- **Create Sauce:**  
  Users can add new sauces with details and an image.

- **Read Sauces:**  
  Retrieve all sauces or a specific sauce by ID.

- **Update Sauce:**  
  Modify existing sauces, including updating images.

- **Delete Sauce:**  
  Remove sauces from the database.

### Like/Dislike Functionality

- Users can like, dislike, or neutralize their preference on sauces.
- Ensures each user can only have one preference per sauce.

### Security

- Passwords are hashed using bcrypt.
- JWT-based authentication with middleware protection.
- Input validation and error handling in line with OWASP guidelines.
- MongoDB setup ensures data integrity and security.

---

## Technologies Used

### Backend

- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose ODM

### Authentication

- **JSON Web Tokens (JWT)**
- **bcrypt** for password hashing

### File Handling

- **Multer** for image uploads

### Others

- **dotenv** for environment variable management
- **npm** for package management

---

## Security Measures

### Password Hashing

- User passwords are hashed using bcrypt before storage to ensure they are not stored in plain text.

### Authentication

- JSON Web Tokens (JWT) are used for authenticating users.
- Tokens are required for accessing protected routes.

### Authorization

- Middleware ensures that only the owner of a sauce can modify or delete it, returning a `403 Unauthorized` error otherwise.

### Input Validation

- All inputs are validated to prevent injection attacks and ensure data integrity.

### Error Handling

- The API returns appropriate HTTP status codes and error messages without exposing sensitive information.

### Database Security

- MongoDB connection strings and credentials are stored securely using environment variables.
- Unique indexes on user emails prevent duplicate registrations.

### Data Privacy

- Complies with GDPR by ensuring user data is stored securely and can be managed or deleted upon request.
