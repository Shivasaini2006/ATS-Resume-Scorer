# API Documentation

Base URL: `http://localhost:5000/api` (Development)  
Production URL: `https://your-api-url.onrender.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User
```http
GET /auth/me
```
🔒 **Protected Route**

**Response (200):**
```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Resumes

#### Upload Resume
```http
POST /resumes/upload
```
🔒 **Protected Route**

**Content-Type:** `multipart/form-data`

**Form Data:**
- `resume`: File (PDF or DOCX, max 5MB)

**Response (201):**
```json
{
  "message": "Resume uploaded and analyzed successfully",
  "resume": {
    "id": "64abc456...",
    "filename": "john_doe_resume.pdf",
    "atsScore": 75,
    "keywords": {
      "matched": ["javascript", "react", "node.js", "mongodb", ...],
      "missing": ["kubernetes", "docker", "aws", ...]
    },
    "analysis": {
      "totalWords": 450,
      "skills": ["javascript", "react", "node.js"],
      "sections": [],
      "experience": [],
      "education": []
    },
    "improvements": [
      "Add more relevant keywords from your industry",
      "Include quantifiable achievements with numbers",
      ...
    ],
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Get All Resumes
```http
GET /resumes
```
🔒 **Protected Route**

**Response (200):**
```json
[
  {
    "_id": "64abc456...",
    "originalName": "john_doe_resume.pdf",
    "atsScore": 75,
    "keywords": {
      "matched": ["javascript", "react", ...],
      "missing": ["docker", "aws", ...]
    },
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
]
```

#### Get Resume by ID
```http
GET /resumes/:id
```
🔒 **Protected Route**

**Response (200):**
```json
{
  "_id": "64abc456...",
  "filename": "resume-123456.pdf",
  "originalName": "john_doe_resume.pdf",
  "atsScore": 75,
  "keywords": {
    "matched": ["javascript", "react", ...],
    "missing": ["docker", "aws", ...]
  },
  "analysis": {
    "totalWords": 450,
    "skills": ["javascript", "react"]
  },
  "improvements": [...],
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

#### Delete Resume
```http
DELETE /resumes/:id
```
🔒 **Protected Route**

**Response (200):**
```json
{
  "message": "Resume deleted successfully"
}
```

#### Re-analyze Resume
```http
POST /resumes/:id/reanalyze
```
🔒 **Protected Route**

**Response (200):**
```json
{
  "message": "Resume re-analyzed successfully",
  "resume": {
    "id": "64abc456...",
    "atsScore": 78,
    "keywords": {...},
    "analysis": {...},
    "improvements": [...]
  }
}
```

---

### Jobs

#### Search Jobs
```http
GET /jobs/search?resumeId=64abc456&query=software%20engineer&location=New%20York
```
🔒 **Protected Route**

**Query Parameters:**
- `resumeId` (required): ID of the resume to match against
- `query` (optional): Job title or keywords
- `location` (optional): Job location

**Response (200):**
```json
{
  "totalJobs": 3,
  "jobs": [
    {
      "id": "job_123",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "New York, NY, US",
      "description": "We are seeking a talented...",
      "employmentType": "FULLTIME",
      "applyLink": "https://example.com/apply",
      "postedAt": "2024-01-15T10:00:00.000Z",
      "salary": "$80000 - $120000",
      "matchScore": 85,
      "keywords": ["JavaScript", "React", "Node.js"]
    }
  ]
}
```

#### Get Recommended Jobs
```http
GET /jobs/recommended?resumeId=64abc456
```
🔒 **Protected Route**

**Query Parameters:**
- `resumeId` (required): ID of the resume

**Response (200):**
```json
{
  "totalJobs": 5,
  "jobs": [...]
}
```

#### Apply for Job
```http
POST /jobs/apply
```
🔒 **Protected Route**

**Request Body:**
```json
{
  "jobId": "64def789...",
  "resumeId": "64abc456...",
  "autoApply": false
}
```

**Response (201):**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": "64ghi012...",
    "jobTitle": "Software Engineer",
    "company": "Tech Corp",
    "matchScore": 85,
    "status": "applied",
    "appliedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

#### Get Applications
```http
GET /jobs/applications
```
🔒 **Protected Route**

**Response (200):**
```json
[
  {
    "id": "64ghi012...",
    "job": {
      "id": "64def789...",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "New York, NY"
    },
    "resume": {
      "id": "64abc456...",
      "name": "john_doe_resume.pdf",
      "atsScore": 75
    },
    "matchScore": 85,
    "status": "applied",
    "autoApplied": false,
    "appliedAt": "2024-01-15T12:00:00.000Z"
  }
]
```

---

### Notifications

#### Get All Notifications
```http
GET /notifications
```
🔒 **Protected Route**

**Response (200):**
```json
[
  {
    "_id": "64jkl345...",
    "type": "job_match",
    "title": "New Job Match",
    "message": "We found 5 new jobs matching your resume!",
    "jobId": "64def789...",
    "read": false,
    "createdAt": "2024-01-15T13:00:00.000Z"
  }
]
```

#### Mark Notification as Read
```http
PATCH /notifications/:id/read
```
🔒 **Protected Route**

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

#### Mark All as Read
```http
PATCH /notifications/read-all
```
🔒 **Protected Route**

**Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

#### Delete Notification
```http
DELETE /notifications/:id
```
🔒 **Protected Route**

**Response (200):**
```json
{
  "message": "Notification deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "No authentication token, access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resume not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error during registration"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding rate limiting middleware.

## Pagination

For endpoints returning lists (resumes, applications, notifications), pagination is not currently implemented. All results are returned in a single response.

## File Upload Limits

- **Max file size**: 5MB
- **Allowed formats**: PDF, DOCX
- **Max files**: 1 per request

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Upload Resume
```bash
curl -X POST http://localhost:5000/api/resumes/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

## Testing with Postman

1. Import the API endpoints
2. Set up environment variables for base URL and token
3. Use the Bearer Token authentication type
4. For file uploads, use form-data with file type

## Notes

- All timestamps are in ISO 8601 format
- The API uses JSON for request and response bodies (except file uploads)
- Authentication tokens expire after 7 days
- File uploads use multipart/form-data
