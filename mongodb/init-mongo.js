db = db.getSiblingDB('demo');
db.users.insertMany([
  {
    "username": "saeed",
    "email": "saeedhei@gmail.com",
    "password": "$2a$10$9eVdvoEuPm8xCGEPn0OZjOSZ62e1IlvQzQq9XNte2AjJeOSueuYgS", // Hashed password for "password123"
    "createdAt": new Date("2022-03-01T12:00:00Z")
  },
  {
    "username": "user2",
    "email": "user2@example.com",
    "password": "$2a$10$9eVdvoEuPm8xCGEPn0OZjOSZ62e1IlvQzQq9XNte2AjJeOSueuYgS", // Hashed password for "password123"
    "createdAt": new Date("2022-03-02T12:00:00Z")
  }
]);
