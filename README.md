# Designer Monk Backend

## Setup Instructions

### 1. Install MongoDB
```bash
# Download and install MongoDB Community Server from:
# https://www.mongodb.com/try/download/community

# Or using chocolatey (Windows):
choco install mongodb

# Or using homebrew (Mac):
brew tap mongodb/brew
brew install mongodb-community
```

### 2. Start MongoDB
```bash
# Windows (run as administrator):
net start MongoDB

# Mac/Linux:
brew services start mongodb/brew/mongodb-community
# or
sudo systemctl start mongod
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Environment Setup
Update `.env` file with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/designer-monk
```

### 5. Run Backend
```bash
# Development mode with auto-restart:
npm run dev

# Production mode:
npm start
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project with image upload
- `DELETE /api/projects/:id` - Delete project

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead status

### Auth
- `POST /api/auth/login` - Admin login

## Image Compression
- Automatically compresses uploaded images from MB to KB
- Resizes to max 1920x1080 while maintaining aspect ratio
- Converts to JPEG with 80% quality
- Tracks original vs compressed file sizes

## Testing
Server runs on: http://localhost:5000
Upload endpoint: http://localhost:5000/api/projects