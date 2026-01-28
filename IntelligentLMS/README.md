# Intelligent LMS

A comprehensive Learning Management System built with .NET 8 Microservices and Python AI.

## Architecture

- **Gateway**: .NET 8 YARP Reverse Proxy (Port 5000)
- **Auth Service**: .NET 8 (Port 5001)
- **User Service**: .NET 8 (Port 5002)
- **Course Service**: .NET 8 (Port 5003)
- **Progress Service**: .NET 8 (Port 5004)
- **AI Advisor**: Python FastAPI (Port 8000)

## Prerequisites

- .NET 8 SDK
- Docker & Docker Compose
- Python 3.9+ (optional, if running locally without Docker)

## How to Run

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up --build
```

### Option 2: Local Development

1. Start Infrastructure:
   ```bash
   docker-compose up postgres -d
   ```

2. Run Services (in separate terminals):
   ```bash
   cd src/Gateway/IntelligentLMS.Gateway && dotnet run
   cd src/Services/Auth/IntelligentLMS.Auth && dotnet run
   cd src/Services/User/IntelligentLMS.User && dotnet run
   cd src/Services/Course/IntelligentLMS.Course && dotnet run
   cd src/Services/Progress/IntelligentLMS.Progress && dotnet run
   cd src/Services/AI && uvicorn main:app --reload
   ```

## API Endpoints (Sample)

- **Auth**: `POST http://localhost:5000/auth/login`
- **Courses**: `GET http://localhost:5000/courses`
- **Recommendation**: `GET http://localhost:5000/progress/{userId}/recommendation`

## Project Structure

- `src/Gateway`: API Gateway
- `src/Services`: Microservices (Auth, User, Course, Progress, AI)
- `src/Shared`: Shared DTOs and Logic
