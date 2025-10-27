# Quick Start Guide

Get the ATS Resume Scorer & Job Matcher running on your local machine in 5 minutes!

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher) installed
- MongoDB installed and running (or use MongoDB Atlas)
- A code editor (VS Code recommended)
- Terminal/Command Prompt

## Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Shivasaini2006/ATS-Resume-Scorer-Auto-Job-Applier-.git
cd ATS-Resume-Scorer-Auto-Job-Applier-

# Install all dependencies
npm run install-all
```

### 2. Configure Environment

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ats-resume-scorer
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JSEARCH_API_KEY=your-api-key-or-leave-for-mock-data
JSEARCH_API_HOST=jsearch.p.rapidapi.com
```

**Note**: The app works without a JSearch API key - it will use mock job data.

### 3. Start MongoDB

If using local MongoDB:
```bash
# On macOS/Linux
sudo service mongodb start

# On Windows
net start MongoDB
```

Or use MongoDB Atlas (cloud) - see [DEPLOYMENT.md](DEPLOYMENT.md) for setup.

### 4. Run the Application

From the root directory:

```bash
# Option 1: Run both client and server together
npm run dev

# Option 2: Run separately
# Terminal 1
npm run server

# Terminal 2
npm run client
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## First Steps

1. **Register**: Create a new account at http://localhost:3000/register
2. **Upload Resume**: Go to Dashboard and upload your resume (PDF or DOCX)
3. **View Score**: See your ATS score and analysis
4. **Find Jobs**: Search for matching jobs
5. **Apply**: Apply to jobs manually or enable auto-apply

## Testing

Run the ATS scorer test:
```bash
cd server
node tests/test-ats-scorer.js
```

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongo --version
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change the PORT in `server/.env` or stop the other process
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies
```bash
npm run install-all
```

## Project Structure

```
ATS-Resume-Scorer-Auto-Job-Applier-/
├── client/              # React frontend (Port 3000)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── context/     # Context providers
│   └── public/
├── server/              # Node.js backend (Port 5000)
│   ├── models/          # Database models
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── uploads/         # Resume uploads
└── docs/                # Documentation
```

## Available Scripts

### Root Directory
- `npm run install-all` - Install all dependencies
- `npm run dev` - Run both client and server
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm run build` - Build client for production

### Server Directory
- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-reload)

### Client Directory
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Features Demo

### 1. Resume Upload & Analysis
- Upload PDF or DOCX resume
- Instant ATS score (0-100)
- Keyword analysis
- Improvement suggestions

### 2. Job Search
- Search by keywords and location
- Get personalized recommendations
- See match scores
- View job details

### 3. Application Tracking
- Track all applications
- View application status
- See match scores
- Filter by status

### 4. Notifications
- Job match alerts
- Application updates
- Resume improvement tips

## Next Steps

1. **Customize**: Modify the ATS keywords in `server/utils/atsScorer.js`
2. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. **API**: Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
4. **Contribute**: Submit issues or pull requests on GitHub

## Support

- **Issues**: https://github.com/Shivasaini2006/ATS-Resume-Scorer-Auto-Job-Applier-/issues
- **Documentation**: Check README.md, DEPLOYMENT.md, and API_DOCUMENTATION.md
- **Community**: Star the repo and share feedback!

## Tips for Best Results

1. **Resume Format**: Use clear section headers (Experience, Education, Skills)
2. **Keywords**: Include relevant technical and soft skills
3. **Quantify**: Add numbers and percentages to achievements
4. **Contact Info**: Include email and phone number
5. **Length**: Aim for 300-800 words

## Development Tips

### Hot Reload
Both client and server support hot reload during development.

### Debugging
- Backend: Check `server/` console logs
- Frontend: Open browser DevTools (F12)
- API: Use Postman or curl to test endpoints

### Database
- View data: Use MongoDB Compass
- Reset DB: Delete the database and restart

## What's Next?

- ✅ Set up the application locally
- ✅ Upload your first resume
- ✅ Get your ATS score
- ✅ Search for jobs
- ✅ Apply to opportunities
- 🚀 Deploy to production!

Happy job hunting! 🎯
