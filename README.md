# ATS Resume Scorer & Auto Job Applier

An AI-powered web application built with the MERN stack that helps job seekers optimize their resumes and automatically apply to matching jobs.

## 🚀 Features

### Core Features
- **📊 ATS Score Analysis**: Upload your resume (PDF/DOCX) and get a comprehensive ATS score (0-100)
- **🔍 Keyword Matching**: See matched and missing keywords to optimize your resume
- **💼 Job Recommendations**: Get personalized job recommendations via JSearch API
- **🤖 Auto-Apply**: Automatically apply to matching jobs
- **💡 AI-Powered Improvements**: Receive intelligent suggestions to improve your resume
- **🔔 Real-time Notifications**: Get notified about new job matches and application updates
- **👤 User Authentication**: Secure login and registration system
- **📈 Dashboard**: Comprehensive dashboard to manage resumes and track applications

### Technical Features
- Built with MERN Stack (MongoDB, Express.js, React, Node.js)
- RESTful API architecture
- JWT-based authentication
- File upload support (PDF, DOCX)
- Natural Language Processing for resume analysis
- Responsive UI design
- Ready for deployment on Vercel (frontend) and Render (backend)

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- pdf-parse for PDF parsing
- mammoth for DOCX parsing
- natural for NLP
- axios for external API calls

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Context API for state management
- CSS3 for styling

### External APIs
- JSearch API (RapidAPI) for job search

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- JSearch API key from RapidAPI (optional, works with mock data)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Shivasaini2006/ATS-Resume-Scorer-Auto-Job-Applier-.git
cd ATS-Resume-Scorer-Auto-Job-Applier-
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

### 3. Configure environment variables

#### Server (.env file in /server directory)
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ats-resume-scorer
JWT_SECRET=your-secret-key-change-in-production
JSEARCH_API_KEY=your-jsearch-api-key
JSEARCH_API_HOST=jsearch.p.rapidapi.com
```

#### Client
For production, set the API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB
Make sure MongoDB is running on your local machine or use MongoDB Atlas.

### 5. Run the application

#### Development mode (runs both client and server)
```bash
npm run dev
```

#### Or run separately
```bash
# Terminal 1 - Run server
npm run server

# Terminal 2 - Run client
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
ATS-Resume-Scorer-Auto-Job-Applier-/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # React components
│       ├── context/        # Context API
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── App.js
│       └── index.js
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── uploads/          # Resume uploads directory
│   └── server.js         # Entry point
├── package.json          # Root package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Resumes
- `POST /api/resumes/upload` - Upload and analyze resume (protected)
- `GET /api/resumes` - Get all user resumes (protected)
- `GET /api/resumes/:id` - Get single resume (protected)
- `DELETE /api/resumes/:id` - Delete resume (protected)
- `POST /api/resumes/:id/reanalyze` - Re-analyze resume (protected)

### Jobs
- `GET /api/jobs/search` - Search jobs with resume matching (protected)
- `GET /api/jobs/recommended` - Get recommended jobs (protected)
- `POST /api/jobs/apply` - Apply for a job (protected)
- `GET /api/jobs/applications` - Get user applications (protected)

### Notifications
- `GET /api/notifications` - Get all notifications (protected)
- `PATCH /api/notifications/:id/read` - Mark as read (protected)
- `PATCH /api/notifications/read-all` - Mark all as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

## 🚀 Deployment

### Deploy Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure build settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/build`
4. Set environment variables:
   - `REACT_APP_API_URL`: Your backend URL

### Deploy Backend (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
4. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong secret key
   - `JSEARCH_API_KEY`: Your RapidAPI key
   - `JSEARCH_API_HOST`: jsearch.p.rapidapi.com
   - `PORT`: 5000

### MongoDB Atlas Setup

1. Create a free cluster on MongoDB Atlas
2. Set up database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string and add to environment variables

## 🎯 Usage

1. **Register/Login**: Create an account or login
2. **Upload Resume**: Upload your resume in PDF or DOCX format
3. **Get ATS Score**: View your ATS score and analysis
4. **Review Keywords**: See matched and missing keywords
5. **Get Improvements**: Read AI-powered suggestions
6. **Search Jobs**: Find jobs matching your resume
7. **Apply**: Apply to jobs manually or enable auto-apply
8. **Track**: Monitor your applications in the Applications page
9. **Notifications**: Stay updated with job matches and status changes

## 🧪 Testing

Currently, the application uses manual testing. To test:

1. Start the application
2. Register a new user
3. Upload a sample resume
4. Verify ATS score calculation
5. Search for jobs
6. Apply to a job
7. Check notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created by Shivasaini2006

## 🙏 Acknowledgments

- JSearch API for job data
- Natural library for NLP
- MongoDB for database
- React and Node.js communities

## 📧 Support

For support, please open an issue in the GitHub repository.
