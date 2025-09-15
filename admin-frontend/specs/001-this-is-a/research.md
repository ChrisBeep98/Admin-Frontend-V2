# Research

## Testing Framework

* **Decision**: Vitest
* **Rationale**: Native integration with Vite, fast, and provides a Jest-compatible API.
* **Alternatives considered**: Jest

## Performance Goals

* **Decision**: Page load times (p95) should be under 200ms.
* **Rationale**: Provides a good user experience.
* **Alternatives considered**: None

## Logging Strategy

* **Decision**: Use a simple console logger for development and a remote logging service for production.
* **Rationale**: Easy to implement and provides necessary visibility.
* **Alternatives considered**: None

## Error Handling Strategy

* **Decision**: Use a global error boundary component to catch and display errors to the user.
* **Rationale**: Prevents the application from crashing and provides a better user experience.
* **Alternatives considered**: None

## SUPERADMIN_TOKEN

* **Decision**: The token will be provided in the `Authorization` header as a Bearer token.
* **Rationale**: Standard practice for API authentication.
* **Alternatives considered**: Cookie, query parameter.
