# AVS Bank - Banking Management System

A full-stack banking management system built with Flask (Backend) and React (Frontend), providing comprehensive banking operations with role-based access control for users and administrators.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Admin Credentials](#admin-credentials)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- **Account Management**
  - User registration with KYC details (Aadhaar, PAN)
  - Secure login using phone number
  - Profile management and update requests
  - Unique account number generation (AVS format)
  
- **Banking Operations**
  - Deposit funds
  - Withdraw funds
  - Transfer funds to other accounts
  - View transaction history
  
- **KYC Management**
  - Submit KYC documents
  - Update KYC information
  - Track KYC request status

### Admin Features
- **User Management**
  - View all registered users
  - Create new user accounts
  - Update user information
  - Delete user accounts
  - View user transaction history
  
- **Request Management**
  - Review and approve/reject KYC requests
  - Process profile update requests
  
- **Dashboard**
  - Overview of system statistics
  - Monitor banking operations

### Security Features
- JWT-based authentication
- Password hashing with Werkzeug
- Role-based access control (User/Admin)
- Protected routes on frontend and backend
- CORS enabled for API security

## 🛠️ Tech Stack

### Backend
- **Framework:** Flask
- **Database:** SQLite with SQLAlchemy ORM
- **Authentication:** Flask-JWT-Extended
- **API:** Flask-RESTful
- **Security:** Flask-CORS, Werkzeug
- **Migration:** Flask-Migrate

### Frontend
- **Library:** React 19.2.0
- **Routing:** React Router DOM 7.9.4
- **HTTP Client:** Axios 1.12.2
- **Testing:** Jest, React Testing Library
- **Build Tool:** React Scripts 5.0.1

## 📁 Project Structure

```
AVS_Bank/
├── backend/
│   ├── app/
│   │   ├── __init__.py              # Flask app initialization
│   │   ├── controllers/             # Business logic
│   │   │   ├── admin_controller.py  # Admin operations
│   │   │   └── user_controller.py   # User operations
│   │   ├── model/                   # Database models
│   │   │   ├── adminmodel.py        # Admin model
│   │   │   ├── models.py            # User model
│   │   │   ├── transactionmodel.py  # Transaction model
│   │   │   ├── kyc_request_model.py # KYC requests
│   │   │   └── update_request_model.py # Update requests
│   │   ├── routes/
│   │   │   └── routes.py            # API route definitions
│   │   ├── utils/
│   │   │   └── decorators.py        # Custom decorators
│   │   └── uploads/
│   │       └── kyc/                 # KYC document storage
│   ├── scripts/
│   │   └── create_admins.py         # Admin creation script
│   ├── config.py                    # App configuration
│   ├── run.py                       # Application entry point
│   └── requirements.txt             # Python dependencies
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   ├── manifest.json
    │   └── robots.txt
    ├── src/
    │   ├── components/
    │   │   ├── Notification.js      # Notification component
    │   │   └── ProtectedRoute.js    # Route guards
    │   ├── pages/
    │   │   ├── Home.js              # Landing page
    │   │   ├── Create_Account.js    # User registration
    │   │   ├── User_Login.js        # User login
    │   │   ├── UserDashboard.js     # User dashboard
    │   │   ├── KYC.js               # KYC submission
    │   │   ├── UpdateProfile.js     # Profile update
    │   │   ├── Admin_Login.js       # Admin login
    │   │   └── AdminDashboard.js    # Admin dashboard
    │   ├── services/
    │   │   └── api.js               # API service layer
    │   ├── App.js                   # Main app component
    │   └── index.js                 # React entry point
    └── package.json                 # Node dependencies
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### For Local Development
- **Python 3.8+**
- **Node.js 14+** and **npm**
- **Git**

### For Docker Deployment
- **Docker** (20.10+)
- **Docker Compose** (1.29+)

## 🚀 Installation

### Option 1: Docker Installation (Recommended)

The easiest way to run the application is using Docker:

```bash
# Clone the repository
git clone https://github.com/vikaskumar168/AVS_Bank.git
cd AVS_Bank

# Build and start containers
docker-compose up --build

# To run in detached mode
docker-compose up -d --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

To stop the containers:
```bash
docker-compose down
```

To view logs:
```bash
docker-compose logs -f
```

### Option 2: Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vikaskumar168/AVS_Bank.git
cd AVS_Bank
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python run.py

# Create admin accounts (in a new terminal, with venv activated)
python scripts/create_admins.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

### Backend Configuration

Edit `backend/config.py` to configure your application:

```python
class Config:
    SECRET_KEY = 'your-secret-key'  # Change in production
    SQLALCHEMY_DATABASE_URI = 'sqlite:///bank.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'your-jwt-secret'  # Change in production
```

**Important:** Change the secret keys in production environment!

### Frontend Configuration

The frontend is configured to proxy API requests to `http://localhost:5000` (defined in `frontend/package.json`).

If you need to change the backend URL, update the proxy setting:

```json
"proxy": "http://localhost:5000"
```

## 🎯 Usage

### Starting the Application

#### Using Docker (Recommended)

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

#### Using Local Setup

##### 1. Start Backend Server

```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python run.py
```

The backend server will start at `http://localhost:5000`

##### 2. Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will start at `http://localhost:3000`

### Accessing the Application

- **Homepage:** http://localhost:3000
- **User Login:** http://localhost:3000/login
- **User Registration:** http://localhost:3000/create_account
- **Admin Login:** http://localhost:3000/admin-login

## 🔌 API Endpoints

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login (phone-based) | No |
| GET | `/profile` | Get user profile | Yes |
| POST | `/deposit` | Deposit funds | Yes |
| POST | `/withdraw` | Withdraw funds | Yes |
| POST | `/transfer` | Transfer funds | Yes |
| POST | `/request-update` | Request profile update | Yes |
| POST | `/request-kyc-update` | Submit KYC update | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/login` | Admin login (username-based) | No |
| GET | `/admin/dashboard` | Get dashboard stats | Yes (Admin) |
| GET | `/admin/users` | List all users | Yes (Admin) |
| POST | `/admin/create-user` | Create new user | Yes (Admin) |
| PUT | `/admin/users/<id>` | Update user | Yes (Admin) |
| DELETE | `/admin/users/<id>` | Delete user | Yes (Admin) |
| GET | `/admin/users/<id>/transactions` | Get user transactions | Yes (Admin) |
| GET | `/admin/kyc-requests` | List KYC requests | Yes (Admin) |
| POST | `/admin/kyc-requests/<id>` | Process KYC request | Yes (Admin) |
| GET | `/admin/update-requests` | List update requests | Yes (Admin) |
| POST | `/admin/update-requests/<id>` | Process update request | Yes (Admin) |

## 👤 Admin Credentials

Default admin accounts created by `scripts/create_admins.py`:

### Admin 1
- **Username:** `admin1`
- **Password:** `adminpass1`

### Admin 2
- **Username:** `admin2`
- **Password:** `adminpass2`

**Note:** Change these credentials in production!

## 🗃️ Database Schema

### User Model
- Account details (name, email, phone, gender, DOB)
- KYC information (Aadhaar, PAN)
- Account type and balance
- Auto-generated account number (AVS format)

### Transaction Model
- User transactions (credit/debit)
- Amount and description
- Timestamp tracking

### Admin Model
- Admin credentials
- Role-based access

### Request Models
- KYC update requests
- Profile update requests
- Approval workflow

## 🧪 Testing

### Backend Testing

```bash
cd backend
python -m pytest  # If tests are configured
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 🔒 Security Considerations

- All passwords are hashed using Werkzeug's `generate_password_hash`
- JWT tokens are used for authentication
- Protected routes on both frontend and backend
- CORS is configured for API security
- Input validation on all forms

## � Docker

### Docker Files

The project includes Dockerfiles for both backend and frontend:

- **Backend Dockerfile** (`backend/Dockerfile`): Uses Python 3.11-slim image
- **Frontend Dockerfile** (`frontend/Dockerfile`): Multi-stage build with Node.js and Nginx
- **Docker Compose** (`docker-compose.yml`): Orchestrates both services

### Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild and restart
docker-compose up --build

# Remove volumes
docker-compose down -v

# Execute commands in containers
docker-compose exec backend python scripts/create_admins.py
docker-compose exec backend flask shell
```

### Environment Variables

You can create a `.env` file in the root directory to configure environment variables:

```env
# Backend
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

## �🐛 Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Change ports in docker-compose.yml or stop conflicting services
docker-compose down
lsof -ti:5000 | xargs kill -9  # Kill process on port 5000
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
```

**Permission denied errors:**
```bash
sudo chmod -R 755 backend/app/uploads
```

**Database not persisting:**
Make sure volumes are properly configured in docker-compose.yml

### Backend Issues

**Database not created:**
```bash
cd backend
python
>>> from app import create_app, db
>>> app = create_app()
>>> with app.app_context():
>>>     db.create_all()
>>> exit()
```

**Admin creation fails:**
Make sure the database is created first by running `python run.py` before executing the admin creation script.

### Frontend Issues

**Port already in use:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development

### Adding New Features

1. Create feature branch from `main`
2. Implement backend API in controllers
3. Add routes in `routes.py`
4. Create frontend components/pages
5. Update API service in `services/api.js`
6. Test thoroughly
7. Create pull request

### Database Migrations

```bash
cd backend
flask db init
flask db migrate -m "Description of changes"
flask db upgrade
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Vikas Kumar** - [vikaskumar168](https://github.com/vikaskumar168)

## 🙏 Acknowledgments

- Flask documentation
- React documentation
- SQLAlchemy documentation
- All contributors and supporters

## 📞 Contact

For any queries or support, please contact:
- GitHub: [@vikaskumar168](https://github.com/vikaskumar168)

---

**Design Reference:** https://www.canva.com/design/DAG13JGPauY/qSUU3W4SYY90OeQeESc0aA/edit?ui=e30

**Note:** This is a demo project for educational purposes. For production use, implement additional security measures, proper error handling, logging, and follow best practices for deployment.