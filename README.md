# Ryde API Documentation

Welcome to the Ryde backend API documentation. This document describes all available endpoints for both user and captain (driver) operations, including authentication, registration, and profile management.

---

## Table of Contents

- [User Routes](#user-routes)
  - [Register](#endpoint-apiv1userregister)
  - [Login](#endpoint-apiv1userlogin)
  - [Logout](#endpoint-apiv1userlogout)
  - [Profile](#endpoint-apiv1userprofile)
- [Captain Routes](#captain-routes)
  - [Register](#endpoint-apiv1captainregister)
  - [Login](#endpoint-apiv1captainlogin)
  - [Logout](#endpoint-apiv1captainlogout)
  - [Profile](#endpoint-apiv1captainprofile)

---

## ===================== USER ROUTES =====================

---

## Endpoint: `/api/v1/user/register`

### Description

Registers a new user in the system.

### Method

`POST`

### Request Body

The endpoint expects a JSON object with the following fields:

```json
{
  "fullname": {
    "firstname": "John", // required, min 3 characters
    "lastname": "Doe" // optional, min 3 characters if provided
  },
  "email": "john@example.com", // required, valid email address
  "password": "securePassword123" // required, minimum 6 characters
}
```

### Example Request

```http
POST /api/v1/user/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Responses

| Status Code | Description                      |
| ----------- | -------------------------------- |
| 201         | User registered successfully     |
| 400         | Missing or invalid input data    |
| 409         | Username or email already exists |
| 500         | Internal server error            |

### Example Success Response

```json
{
  "message": "User registered successfully"
}
```

### Example Error Response (400)

```json
{
  "error": "Email is required"
}
```

---

## Endpoint: `/api/v1/user/login`

### Description

Authenticates a user and returns a JWT token.

### Method

`POST`

### Request Body

The endpoint expects a JSON object with the following fields:

```json
{
  "email": "john@example.com", // required, valid email address
  "password": "securePassword123" // required, minimum 6 characters
}
```

### Example Request

```http
POST /api/v1/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Responses

| Status Code | Description                   |
| ----------- | ----------------------------- |
| 200         | Login successful, returns JWT |
| 400         | Missing or invalid input data |
| 401         | Invalid email or password     |
| 500         | Internal server error         |

### Example Success Response

```json
{
  "token": "jwt_token_here",
  "existingUser": {
    "_id": "user_id_here",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
    // ...other user fields...
  }
}
```

### Example Error Response (401)

```json
{
  "message": "Invalid email or password"
}
```

---

## Endpoint: `/api/v1/user/logout`

### Description

Logs out the authenticated user by blacklisting the JWT token.

### Method

`GET`

### Authentication

Requires a valid JWT token in the `Authorization` header or `token` cookie.

### Example Request

```http
GET /api/v1/user/logout
Authorization: Bearer jwt_token_here
```

### Responses

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Logout successful     |
| 401         | Unauthorized          |
| 500         | Internal server error |

### Example Success Response

```json
{
  "message": "Logout successfully"
}
```

### Example Error Response (401)

```json
{
  "message": "Unauthorized"
}
```

---

## Endpoint: `/api/v1/user/profile`

### Description

Returns the profile of the authenticated user.

### Method

`POST`

### Authentication

Requires a valid JWT token in the `Authorization` header or `token` cookie.

### Example Request

```http
POST /api/v1/user/profile
Authorization: Bearer jwt_token_here
```

### Responses

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Returns user profile  |
| 401         | Unauthorized          |
| 500         | Internal server error |

### Example Success Response

```json
{
  "user": {
    "_id": "user_id_here",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
    // ...other user fields...
  }
}
```

### Example Error Response (401)

```json
{
  "message": "Unauthorized"
}
```

---

# ======== CAPTAIN ROUTES ========

---

## Endpoint: `/api/v1/captain/register`

### Description

Registers a new captain (driver) in the system.

### Method

`POST`

### Request Body

The endpoint expects a JSON object with the following fields:

```json
{
  "fullname": {
    "firstname": "Jane", // required, min 3 characters
    "lastname": "Smith" // optional, min 3 characters if provided
  },
  "email": "jane@example.com", // required, valid email address
  "password": "securePassword123", // required, minimum 6 characters
  "vehicle": {
    "color": "Red", // required, min 3 characters
    "plate": "ABC123", // required, min 3 characters
    "capacity": 4, // required, number
    "vehicleType": "car" // required, one of: car, motorcycle, auto
  }
}
```

### Example Request

```http
POST /api/v1/captain/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane@example.com",
  "password": "securePassword123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses

| Status Code | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| 200         | Captain registered successfully, returns token and captain object |
| 400         | Missing or invalid input data                                     |
| 409         | Email already exists                                              |
| 500         | Internal server error                                             |

### Example Success Response

```json
{
  "token": "jwt_token_here",
  "newCaptain": {
    "_id": "captain_id_here",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
    // ...other captain fields...
  }
}
```

### Example Error Response (409)

```json
{
  "message": "User with this email already exists"
}
```

### Example Error Response (400)

```json
{
  "errors": [
    {
      "msg": "Vehicle color must be at least 3 characters long",
      "param": "vehicle.color",
      "location": "body"
    }
    // ...other validation errors...
  ]
}
```

---

## Endpoint: `/api/v1/captain/login`

### Description

Authenticates a captain and returns a JWT token.

### Method

`POST`

### Request Body

The endpoint expects a JSON object with the following fields:

```json
{
  "email": "jane@example.com", // required, valid email address
  "password": "securePassword123" // required, minimum 6 characters
}
```

### Example Request

```http
POST /api/v1/captain/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

### Responses

| Status Code | Description                   |
| ----------- | ----------------------------- |
| 200         | Login successful, returns JWT |
| 400         | Missing or invalid input data |
| 401         | Invalid email or password     |
| 500         | Internal server error         |

### Example Success Response

```json
{
  "token": "jwt_token_here",
  "existingCaptain": {
    "_id": "captain_id_here",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
    // ...other captain fields...
  }
}
```

### Example Error Response (401)

```json
{
  "message": "Invalid email or password"
}
```

---

## Endpoint: `/api/v1/captain/logout`

### Description

Logs out the authenticated captain by blacklisting the JWT token.

### Method

`GET`

### Authentication

Requires a valid JWT token in the `Authorization` header or `token` cookie.

### Example Request

```http
GET /api/v1/captain/logout
Authorization: Bearer jwt_token_here
```

### Responses

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Logout successful     |
| 401         | Unauthorized          |
| 500         | Internal server error |

### Example Success Response

```json
{
  "message": "Logout successfully"
}
```

### Example Error Response (401)

```json
{
  "message": "Unauthorized"
}
```

---

## Endpoint: `/api/v1/captain/profile`

### Description

Returns the profile of the authenticated captain.

### Method

`POST`

### Authentication

Requires a valid JWT token in the `Authorization` header or `token` cookie.

### Example Request

```http
POST /api/v1/captain/profile
Authorization: Bearer jwt_token_here
```

### Responses

| Status Code | Description             |
| ----------- | ----------------------- |
| 200         | Returns captain profile |
| 401         | Unauthorized            |
| 500         | Internal server error   |

### Example Success Response

```json
{
  "captain": {
    "_id": "captain_id_here",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
    // ...other captain fields...
  }
}
```

### Example Error Response (401)

```json
{
  "message": "Unauthorized"
}
```

---
