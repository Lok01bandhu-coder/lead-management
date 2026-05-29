# API Documentation

## Base URL

`http://127.0.0.1:8000`

## Authentication

### `POST /auth/login`

Logs in a user and returns a JWT access token.

Request body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response body:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "admin",
    "is_active": true,
    "created_at": "2026-05-26T10:00:00"
  }
}
```

### `GET /auth/me`

Returns the currently authenticated user.

Required header:

`Authorization: Bearer <token>`

### `POST /auth/register`

Creates a new user account.

Request body:

```json
{
  "username": "newuser",
  "password": "secret123"
}
```

## Lead Endpoints

All lead endpoints require a valid JWT token.

### `POST /leads`

Creates a new lead.

Request body:

```json
{
  "name": "Rahul Sharma",
  "mobile_number": "9876543210",
  "email": "rahul@example.com",
  "source": "Website",
  "status": "New"
}
```

### `GET /leads`

Lists leads with optional search, filter, and pagination.

Supported query params:

- `search`
- `mobile`
- `status`
- `created_from`
- `created_to`
- `page`
- `limit`

Example:

`GET /leads?search=rahul&status=New&created_from=2026-05-01&page=1&limit=10`

### `GET /leads/{id}`

Returns lead details including status history.

### `PUT /leads/{id}`

Updates the lead details.

### `PATCH /leads/{id}/status`

Updates only the lead status and writes a status history record.

Request body:

```json
{
  "status": "Converted"
}
```

### `DELETE /leads/{id}`

Deletes the lead.

## Response Notes

- Lead list responses include `items`, `total`, `page`, and `limit`
- Lead detail responses include `status_history`
- Duplicate `email` or `mobile_number` returns a `409 Conflict`
- Invalid or missing JWT returns a `401 Unauthorized`

## Swagger/OpenAPI

Run the backend and open:

`http://127.0.0.1:8000/docs`
