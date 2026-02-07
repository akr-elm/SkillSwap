# SkillSwap - Skill Exchange Platform

A full-stack web application that enables users to exchange skills using a credit-based system instead of money. Built with React, Node.js/Express, and PostgreSQL.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## 🌟 Features

### Authentication & Security
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected routes and role-based access control (USER/ADMIN)

### Core Functionality
- **Skills Marketplace**: Browse, search, filter, and sort skills
- **Credit System**: Earn credits by teaching, spend credits to learn
- **Exchange Management**: Create, accept, reject, and complete skill exchanges
- **User Dashboard**: Manage your skills, view exchanges, track credits
- **Admin Panel**: User and skill management for administrators
- **Reviews & Ratings**: Rate and review completed exchanges

### Advanced Features
- Pagination for skill listings and exchange history
- Real-time credit balance updates
- Comprehensive search and filtering
- Responsive design with TailwindCSS

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Modern ORM for PostgreSQL
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **express-validator** - Request validation

### Database
- **PostgreSQL** - Relational database

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd SkillSwap
\`\`\`

### 2. Database Setup

Create a PostgreSQL database:

\`\`\`bash
createdb skillswap
\`\`\`

### 3. Backend Setup

\`\`\`bash
cd server
npm install
\`\`\`

Create a \`.env\` file in the \`server\` directory:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/skillswap?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
INITIAL_CREDITS=10
\`\`\`

Run Prisma migrations and seed the database:

\`\`\`bash
npx prisma migrate dev --name init
npm run seed
\`\`\`

Start the backend server:

\`\`\`bash
npm run dev
\`\`\`

The API will be available at \`http://localhost:5000\`

### 4. Frontend Setup

Open a new terminal:

\`\`\`bash
cd client
npm install
\`\`\`

Start the frontend development server:

\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:5173\`

## 👤 Default Users

After seeding, you can login with these accounts:

**Admin Account:**
- Email: \`admin@skillswap.com\`
- Password: \`password123\`

**Regular Users:**
- Email: \`alice@example.com\` | Password: \`password123\`
- Email: \`bob@example.com\` | Password: \`password123\`
- Email: \`charlie@example.com\` | Password: \`password123\`
```markdown

## 📁 Project Structure

```text
SkillSwap/
├── server/                 # Backend application
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.js        # Seed data
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── routes/        # API routes
│   │   └── server.js      # Express app setup
│   ├── package.json
│   └── .env
│
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```
```

## 🔌 API Endpoints

See [docs/API.md](docs/API.md) for detailed API documentation.

### Quick Reference

- **Auth**: \`POST /api/v1/auth/register\`, \`POST /api/v1/auth/login\`
- **Skills**: \`GET/POST/PUT/DELETE /api/v1/skills\`
- **Exchanges**: \`GET/POST /api/v1/exchanges\`, \`PATCH /api/v1/exchanges/:id/status\`
- **Users**: \`GET /api/v1/users/profile\`, \`GET /api/v1/users/dashboard\`
- **Admin**: \`GET /api/v1/admin/users\`, \`DELETE /api/v1/admin/users/:id\`

## 🎯 Usage Guide

### For Learners

1. **Register** and receive 10 free credits
2. **Browse** the marketplace for skills you want to learn
3. **Request** an exchange by selecting a skill
4. **Wait** for the teacher to accept your request
5. **Complete** the exchange and leave a review

### For Teachers

1. **Create** skills you can teach
2. **Set** your credit price and duration
3. **Accept/Reject** incoming exchange requests
4. **Earn** credits when exchanges are completed
5. **Use** earned credits to learn new skills

### For Admins

1. **Access** the admin dashboard
2. **Manage** users and skills
3. **Delete** inappropriate content or users
4. **Monitor** platform activity

## 🧪 Testing

### Test the API

You can test API endpoints using the seed data:

\`\`\`bash
# Login as Alice
curl -X POST http://localhost:5000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"alice@example.com","password":"password123"}'

# Get all skills
curl http://localhost:5000/api/v1/skills

# Search skills
curl "http://localhost:5000/api/v1/skills?search=react&category=Programming"
\`\`\`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected API routes
- Role-based access control
- Input validation and sanitization
- CORS configuration
- SQL injection prevention (Prisma ORM)

## 🚀 Production Deployment

### Backend

1. Set \`NODE_ENV=production\`
2. Use a strong \`JWT_SECRET\`
3. Configure production database URL
4. Set up SSL/TLS
5. Use a process manager (PM2)

### Frontend

\`\`\`bash
cd client
npm run build
\`\`\`

Deploy the \`dist\` folder to your hosting service.

## 📝 Database Schema

### User
- id, name, email, password, role, creditBalance

### Skill
- id, title, category, level, description, duration, credits, ownerId

### Exchange
- id, teacherId, learnerId, skillId, duration, credits, status

### Review
- id, exchangeId, skillId, rating, comment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🐛 Known Issues

None at the moment. Please report issues on GitHub.

## 📧 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
