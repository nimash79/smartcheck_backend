# SmartCheck — Backend API

The Node.js backend for **SmartCheck**, a camera-based monitoring and recognition system. It connects the Python recognition engine with the React web application through API endpoints and WebSocket communication.

## Overview

The backend provides the central application layer for managing SmartCheck resources and processing recognition-related events.

The codebase is organized into controllers, models, routes, middleware, utilities, and supporting infrastructure. It includes API documentation through Swagger, logging, and database-related integrations.

## Features

- **REST API:** Exposes endpoints for application resources.
- **Person management:** Routes and controllers for people-related data.
- **Camera management:** Camera configuration and management endpoints.
- **Department management:** Department-related resources.
- **Gate management:** Gate-related resources.
- **Settings management:** Application settings.
- **Reports and alarms:** Dedicated routes for reports and alarm-related functionality.
- **WebSocket support:** Real-time communication infrastructure.
- **Authentication middleware:** Middleware for API and user-related request handling.
- **API documentation:** Swagger UI and generated API specifications.
- **Logging:** Centralized logging support.
- **Database integration:** Database models and supporting database libraries.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | HTTP API framework |
| Sequelize | Relational database ORM |
| PostgreSQL driver (`pg`) | PostgreSQL connectivity |
| Mongoose | MongoDB object modeling support |
| JSON Web Token | Token-based authentication support |
| bcryptjs | Password hashing |
| Axios | HTTP requests to external services |
| WebSocket (`ws`) | Real-time communication |
| Swagger | API documentation |
| Winston | Logging |
| dotenv | Environment configuration |
| ExcelJS | Spreadsheet/report generation |
| date-fns and moment-jalaali | Date and calendar utilities |

The dependency manifest includes both relational and document-database libraries. Confirm which database configuration is active in the current deployment before provisioning a database.

## Repository Structure

```text
smartcheck_backend/
├── controllers/          # Request handling and application logic
├── middlewares/          # Request and authentication middleware
├── models/               # Database models and configuration
├── routes/               # API route definitions
├── utils/                # Shared utilities and constants
├── app.js                # Express application entry point
├── websocket.js          # WebSocket communication
├── swagger.js            # Swagger configuration
├── logger.js             # Logging configuration
├── .env.example          # Environment-variable template
├── package.json
├── package-lock.json
└── LICENSE
```

## Getting Started

### Prerequisites

- Node.js compatible with the project's dependencies.
- npm.
- Access to the database configured in the application.
- The SmartCheck Python component if recognition integration is required.

### 1. Clone the repository

```bash
git clone https://github.com/nimash79/smartcheck_backend.git
cd smartcheck_backend
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a local `.env` file based on `.env.example`.

The application reads environment configuration through `dotenv`. Set the port and any database credentials, authentication secrets, or service URLs required by the actual model and route configuration.

Example for a local deployment:

```dotenv
PORT=3000
```

This is only an example, not a complete production configuration. Review the model initialization and WebSocket setup to identify all required variables.

Do not commit `.env` files containing secrets.

### 4. Start the server

Development mode:

```bash
npm run dev
```

Standard mode:

```bash
npm start
```

The backend starts through `app.js`. Ensure the configured database is reachable before testing database-backed endpoints.

### 5. Open the API documentation

The application mounts Swagger UI at:

```text
http://localhost:3000/api-docs
```

Replace the port if your local configuration uses a different value.

## Architecture

```text
SmartCheck Frontend
        |
        | HTTP API
        v
Node.js / Express Backend
        |
        +---- Controllers and Routes
        |
        +---- Models and Database
        |
        +---- Authentication Middleware
        |
        +---- Swagger Documentation
        |
        +---- WebSocket Communication
                    ^
                    |
             Python Engine
       (Face / Audio Processing)
```

The backend acts as the integration point between the user-facing interface, application data, and recognition services.

## API Organization

The main application registers route groups for:

| Resource | Responsibility |
|---|---|
| People | Person-related data and operations |
| Cameras | Camera configuration and management |
| Departments | Department-related records |
| Gates | Gate-related records |
| Settings | Application configuration |
| Reports | Reporting operations |
| Alarms | Alarm-related operations |

Consult the route definitions and Swagger specification for endpoint paths, request schemas, authentication requirements, and response formats.

## Frontend and Python Integration

The frontend uses a configurable API URL, while the Python component uses separate HTTP and WebSocket settings.

Ensure that:

- The frontend API URL points to the deployed backend.
- The Python `API_URL` points to the same backend instance.
- The Python `WS_URL` matches the backend's WebSocket configuration.
- CORS allows only the intended frontend origins.
- WebSocket messages follow the event contracts expected by the backend.

The existing code includes CORS configuration that should be reviewed before production deployment.

## Production Deployment

The project includes PM2 scripts:

```bash
npm run serve
```

To stop and remove the PM2 process:

```bash
npm run unserve
```

These scripts use the process name `smartcheck_backend`.

For a production environment, configure process supervision, TLS termination, database backups, structured logging, secure environment variables, and appropriate request and WebSocket authorization.

## Security Considerations

- Keep JWT secrets and database credentials out of source control.
- Hash passwords using the application's configured password-hashing workflow.
- Validate and authorize every sensitive request.
- Restrict CORS to trusted frontend origins.
- Protect WebSocket connections and validate incoming messages.
- Avoid exposing camera, recognition, or personal data to unauthorized users.
- Do not treat the presence of authentication middleware as proof that every route is protected; review route-level enforcement.

## Related Repositories

- [SmartCheck Python](https://github.com/nimash79/smartcheck_python) — computer vision and audio processing.
- [SmartCheck Frontend](https://github.com/nimash79/smartcheck_frontend) — React web interface.

## License

This repository includes an MIT license. Refer to the [`LICENSE`](LICENSE) file for the full terms.

## Author

**Nima Sharifinia** · [GitHub](https://github.com/nimash79)
