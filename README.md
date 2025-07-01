# 🚀 Job Tracking System

<div align="center">

![Job Tracking System](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet)
![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A modern, full-stack job tracking application built with .NET 8 Web API and Angular 18**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-api-endpoints) • [🛠️ Tech Stack](#️-tech-stack)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 **Authentication & Security**
- 🎫 **JWT Token Authentication** with configurable expiration
- 🔒 **BCrypt Password Hashing** for secure credential storage
- 🛡️ **Route Guards** protecting sensitive endpoints
- 🔄 **Automatic Token Refresh** and session management
- ✅ **Input Validation** on both client and server

</td>
<td width="50%">

### 💼 **Job Management**
- ✏️ **Create & Edit** job postings with rich descriptions
- 🔄 **Activate/Deactivate** job listings
- 🏢 **Company Information** and detailed requirements
- 📊 **Personal Dashboard** for managing postings

</td>
</tr>
<tr>
<td width="50%">

### 📋 **Application System**
- 📄 **Apply for Jobs** with optional resume upload (PDF)
- 📈 **Track Application Status** (Submitted, Interview, Rejected)
- 📥 **Manage Received Applications** for your postings
- ⬇️ **Download Resumes** from applicants
- 🔄 **Status Updates** for application workflow

</td>
<td width="50%">

### 🎨 **User Experience**
- 📱 **Responsive Design** for desktop and mobile
- ⚡ **Real-time Validation** with helpful error messages
- 🎭 **Loading States** and smooth animations
- 🎯 **Clean, Modern UI** with intuitive navigation

</td>
</tr>
</table>

---

## 🏗️ Architecture

### **Backend Structure (.NET 8 Web API)**
```
API/
├── 🌐 JobTracking.API/          # Web API Controllers & Configuration
│   ├── Controllers/             # REST API Endpoints
│   ├── Configuration/           # App Settings & JWT Config
│   └── Program.cs              # Application Entry Point
├── 🧠 JobTracking.Application/  # Business Logic & Services
│   └── Services/               # Core Business Services
├── 🗄️ JobTracking.DataAccess/   # Data Layer & Entity Framework
│   ├── Data/                   # DbContext & Entity Models
│   └── Migrations/             # Database Migrations
└── 📦 JobTracking.Domain/       # Domain Models & DTOs
    ├── DTOs/                   # Data Transfer Objects
    ├── Enums/                  # Application Enums
    └── Models/                 # Domain Models
```

### **Frontend Structure (Angular 18)**
```
WEB/
├── src/app/
│   ├── 🧩 components/          # Reusable UI Components
│   │   ├── auth/               # Authentication Components
│   │   ├── jobs/               # Job Management Components
│   │   └── shared/             # Shared Components
│   ├── 🔗 services/            # HTTP Services & Business Logic
│   ├── 📋 models/              # TypeScript Interfaces
│   ├── 🛡️ guards/              # Route Protection Guards
│   ├── 🔄 interceptors/        # HTTP Request/Response Interceptors
│   └── 🎨 styles/              # Global Styles & Themes
└── 📁 environments/            # Environment Configuration
```

---

## 🚀 Quick Start

### **Prerequisites**
- ✅ .NET 8 SDK (https://dotnet.microsoft.com/download/dotnet/8.0)
- ✅ Node.js 18+ (https://nodejs.org/)
- ✅ Git (https://git-scm.com/)

### **1. Clone & Setup**
```bash
# Clone the repository
git clone https://github.com/codingburgas/job-tracking-VDVichev21.git
cd job-tracking-system
```

### **2. Backend Setup**
```bash
# Navigate to API directory
cd API

# Restore dependencies
dotnet restore

# Start the API server
dotnet run --project JobTracking.API
```

**🌐 API Server:** `http://localhost:5000`  
**📚 Swagger Documentation:** `http://localhost:5000/swagger`

### **3. Frontend Setup**
```bash
# Navigate to Web directory (new terminal)
cd WEB

# Install dependencies
npm install

# Start development server
npm start
```

**🖥️ Web Application:** `http://localhost:4200`

### **4. First Steps**
1. 🌐 Open `http://localhost:4200` in your browser
2. 📝 Click **"Register"** to create your account
3. 🎯 Start posting jobs or applying for positions!

---

## 📱 Application Screenshots

<div align="center">

### **🏠 Job Listings Dashboard**
*Browse available opportunities with detailed information and easy application*

### **✏️ Job Creation Form**
*Post new opportunities with rich descriptions and company details*

### **📊 Application Management**
*Track applications and manage received applications*

</div>

---

## ⚙️ Configuration

### **🔧 API Configuration** (`appsettings.json`)
- Connection strings for database
- JWT authentication settings
- CORS configuration
- API base URLs and allowed origins

### **🌐 Angular Environment** (`src/environments/environment.ts`)
- API endpoint configuration
- Application settings
- Feature flags
- Authentication token management

---

## 🔧 Development Commands

### **🔥 Hot Reload Development**
```bash
# Backend with hot reload
cd API
dotnet watch run --project JobTracking.API

# Frontend with hot reload
cd WEB
npm start
```

### **🧪 Testing**
```bash
# Run backend tests
cd API
dotnet test

# Run frontend tests
cd WEB
npm test
```

### **🏗️ Build for Production**
```bash
# Backend production build
cd API
dotnet publish -c Release -o ./publish

# Frontend production build
cd WEB
npm run build --prod
```

---

## 📡 API Endpoints

### **🔐 Authentication Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | User authentication | ❌ |

### **💼 Job Management Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/jobpostings` | Get all active job postings | ❌ |
| `GET` | `/api/jobpostings/my` | Get current user's job postings | ✅ |
| `GET` | `/api/jobpostings/{id}` | Get specific job posting | ❌ |
| `POST` | `/api/jobpostings` | Create new job posting | ✅ |
| `PUT` | `/api/jobpostings/{id}` | Update job posting | ✅ |
| `PUT` | `/api/jobpostings/{id}/status` | Update job status | ✅ |
| `DELETE` | `/api/jobpostings/{id}` | Delete job posting | ✅ |

### **📋 Application Management Endpoints**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/applications/my` | Get user's job applications | ✅ |
| `GET` | `/api/applications/received` | Get received applications | ✅ |
| `POST` | `/api/jobpostings/{id}/apply` | Apply for specific job | ✅ |
| `PUT` | `/api/applications/{id}/status` | Update application status | ✅ |
| `GET` | `/api/jobpostings/applications/{id}/resume` | Download applicant resume | ✅ |

---

## 🛠️ Tech Stack

<div align="center">

### **🔙 Backend Technologies**
![.NET](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Entity Framework](https://img.shields.io/badge/Entity_Framework-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

### **🔚 Frontend Technologies**
![Angular](https://img.shields.io/badge/Angular_18-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)

</div>

### **📋 Detailed Technology Breakdown**

#### **Backend Stack**
- **🏗️ .NET 8** - Latest Microsoft web framework with improved performance
- **🗄️ Entity Framework Core** - Modern ORM for database operations
- **💾 SQLite** - Lightweight, serverless database engine
- **🔐 JWT (JSON Web Tokens)** - Secure, stateless authentication
- **🔒 BCrypt** - Industry-standard password hashing
- **📖 Swagger/OpenAPI** - Interactive API documentation
- **🔄 CORS** - Cross-Origin Resource Sharing configuration

#### **Frontend Stack**
- **⚡ Angular 18** - Latest Angular with standalone components
- **📝 TypeScript** - Type-safe JavaScript with enhanced tooling
- **🎨 SCSS** - Enhanced CSS with variables and mixins
- **📡 RxJS** - Reactive programming for async operations
- **🛡️ Angular Guards** - Route protection and navigation control
- **🔄 HTTP Interceptors** - Request/response transformation
- **📱 Responsive Design** - Mobile-first approach

---

## 🚀 Deployment Options

### **🐳 Docker Deployment**
- Containerized application deployment
- Multi-stage build process
- Production-ready configuration

### **☁️ Cloud Deployment**
- **Azure App Service** - Easy deployment with CI/CD
- **AWS Elastic Beanstalk** - Scalable web application hosting
- **Google Cloud Run** - Containerized application deployment
- **Netlify/Vercel** - Frontend static hosting

---

## 🔒 Security Features

<div align="center">

| Feature | Implementation | Status |
|---------|---------------|--------|
| **🔐 Authentication** | JWT with configurable expiration | ✅ |
| **🔒 Password Security** | BCrypt hashing with salt | ✅ |
| **🛡️ CORS Protection** | Configurable allowed origins | ✅ |
| **🚪 Route Guards** | Protected Angular routes | ✅ |
| **⏰ Session Management** | Automatic token refresh | ✅ |
| **✅ Input Validation** | Client & server-side validation | ✅ |
| **🔍 SQL Injection** | Entity Framework protection | ✅ |
| **🌐 HTTPS Ready** | SSL/TLS configuration | ✅ |

</div>

---

## 📊 Database Schema

The application uses SQLite with Entity Framework Core for data persistence. The database includes three main tables:

- **Users** - User account information and authentication
- **JobPostings** - Job listing details and metadata
- **Applications** - Job application tracking and resume storage

---

## 🙏 Acknowledgments

<div align="center">

**Built with ❤️ using modern web technologies**

Special thanks to:
- 🏢 **Microsoft** for .NET 8 and excellent documentation
- 🅰️ **Angular Team** for the powerful framework
- 🌍 **Open Source Community** for inspiration and feedback

</div>

---

<div align="center">

### **⭐ Star this repository if you find it helpful!**


</div>
