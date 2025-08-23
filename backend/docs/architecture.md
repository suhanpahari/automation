# Architecture Overview

## Project Structure

The project is organized into two main directories: `frontend` and `backend`, along with `docs` for documentation and a root directory for configuration files.

```
project-root/
├── frontend/                      # Chat + landing UI
│   ├── public/                    # Static files
│   ├── src/
│   │   ├── components/            # Reusable UI parts
│   │   ├── pages/                 # Routes
│   │   └── utils/                 # Helper functions
│   └── package.json               # Frontend dependencies and scripts
├── backend/                       # Node.js API server
│   ├── src/
│   │   ├── routes/                # API routes
│   │   ├── controllers/           # Business logic
│   │   ├── models/                # Database schemas
│   │   ├── services/              # External service integrations
│   │   └── utils/                 # Utility functions
│   ├── app.js                     # Express server entry
│   └── package.json               # Backend dependencies and scripts
├── docs/                          # Documentation
│   ├── architecture.md            # Architecture overview
│   └── api-specs.md               # API specifications
├── .env                           # Environment variables
└── README.md                      # Project overview and setup instructions
```

## Frontend

The frontend is built using React and is responsible for the user interface. It consists of:

- **Components**: Reusable UI parts such as `ChatWindow`, `MessageBubble`, `FileUploader`, and `LandingPage`.
- **Pages**: Defines the routes for the application, including the landing page and chat interface.
- **Utils**: Contains helper functions for API calls and authentication.

### Key Components

- **ChatWindow**: The main chat interface where users can interact with the assistant.
- **MessageBubble**: Displays individual messages from users and the assistant.
- **FileUploader**: Allows users to upload files or screenshots.
- **LandingPage**: Serves as the login and dashboard interface.

## Backend

The backend is built using Node.js and Express, providing the API for the frontend. It includes:

- **Routes**: Defines the endpoints for handling chat requests and Google service interactions.
- **Controllers**: Contains the business logic for processing chat messages and executing Google Apps Script.
- **Models**: Defines the database schemas for conversations and messages.
- **Services**: Manages external service integrations, such as LLaMA and Google APIs.
- **Utils**: Provides utility functions for database connections and logging.

### Key Services

- **LLaMA Service**: Handles requests to the LLaMA API for chat processing.
- **Apps Script Service**: Facilitates interactions with Google services.

## Documentation

The `docs` directory contains important documentation for the project, including:

- **architecture.md**: An overview of the project's architecture and structure.
- **api-specs.md**: Detailed specifications of the API endpoints, including request and response formats.

## Environment Variables

The `.env` file contains sensitive information such as API keys and database connection strings, ensuring that these details are not hard-coded into the application.

## Conclusion

This architecture provides a clear separation of concerns between the frontend and backend, allowing for easier maintenance and scalability. The use of React for the frontend and Node.js for the backend ensures a modern and efficient development experience.