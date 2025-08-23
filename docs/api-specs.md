# API Specifications

## Overview
This document outlines the API specifications for the backend server, detailing the available endpoints, request and response formats, and usage examples.

## Base URL
The base URL for the API is: `http://localhost:3000/api`

## Endpoints

### 1. Chat

#### POST /chat/send
- **Description**: Sends a message to the chat and receives a response.
- **Request Body**:
  ```json
  {
    "userId": "string",
    "message": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "response": "string",
      "messageId": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "string"
    }
    ```

#### GET /chat/history
- **Description**: Retrieves the chat history for a specific user.
- **Query Parameters**:
  - `userId`: The ID of the user whose chat history is being requested.
- **Response**:
  - **200 OK**:
    ```json
    {
      "history": [
        {
          "messageId": "string",
          "userId": "string",
          "message": "string",
          "timestamp": "string"
        }
      ]
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Chat history not found"
    }
    ```

### 2. Google Integration

#### POST /google/execute
- **Description**: Executes a JSON request via Google Apps Script.
- **Request Body**:
  ```json
  {
    "scriptId": "string",
    "data": {}
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "result": {}
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "string"
    }
    ```

## Usage Examples

### Sending a Message
```bash
curl -X POST http://localhost:3000/api/chat/send \
-H "Content-Type: application/json" \
-d '{"userId": "12345", "message": "Hello!"}'
```

### Retrieving Chat History
```bash
curl -X GET "http://localhost:3000/api/chat/history?userId=12345"
```

### Executing a Google Script
```bash
curl -X POST http://localhost:3000/api/google/execute \
-H "Content-Type: application/json" \
-d '{"scriptId": "abc123", "data": {"key": "value"}}'
```

## Conclusion
This document serves as a guide for developers to understand and utilize the API effectively. For further information, please refer to the architecture documentation.