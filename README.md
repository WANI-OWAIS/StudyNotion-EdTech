<div align="center">

# StudyNotion — EdTech Platform

**A full-stack online education marketplace built with the MERN stack**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://study-notion-ed-tech-livid.vercel.app/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://github.com/WANI-OWAIS/StudyNotion-EdTech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

![Main Page](images/mainpage.png)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

---

## About

**StudyNotion** is a fully functional EdTech platform where instructors can create, manage, and sell courses while students can browse, purchase, and consume educational content. The platform handles authentication, payments, media uploads, course progress tracking, and ratings — all within a responsive, modern UI.

Built by a team of 4 as a capstone project, it demonstrates production-grade patterns including JWT auth with OTP verification, Razorpay payment integration, Cloudinary media management, and a Redux-powered React frontend.

---

## Features

### Students

- Browse and search the course catalog by category
- Add courses to cart and purchase via Razorpay
- Stream video lectures with progress tracking
- Rate and review completed courses
- Manage profile, password, and display picture

### Instructors

- Create courses with sections, sub-sections, and video uploads
- Edit, publish, and delete courses
- View analytics dashboard — enrollments, revenue, course ratings
- Manage profile and account settings

### Platform

- OTP-based email verification on signup
- JWT authentication with role-based access (Student / Instructor / Admin)
- Forgot-password flow with secure reset tokens
- Admin-only category management
- Responsive design — works across desktop, tablet, and mobile

---

## Tech Stack

| Layer         | Technologies                                                                    |
| ------------- | ------------------------------------------------------------------------------- |
| **Frontend**  | React 18, Redux Toolkit, React Router v6, Tailwind CSS, Swiper, Chart.js, Axios |
| **Backend**   | Node.js, Express.js, Mongoose (MongoDB), JWT, Bcrypt                            |
| **Database**  | MongoDB Atlas                                                                   |
| **Payments**  | Razorpay                                                                        |
| **Media**     | Cloudinary                                                                      |
| **Email**     | Nodemailer (Gmail SMTP)                                                         |
| **Dev Tools** | Concurrently, Nodemon                                                           |

---

## Architecture

StudyNotion follows a standard **client-server** architecture:

```
┌─────────────┐       REST API        ┌──────────────┐       ODM         ┌──────────────┐
│   React.js  │  ◄────────────────►   │  Express.js  │  ◄─────────────►  │  MongoDB     │
│  (Frontend) │    JSON / HTTP         │  (Backend)   │    Mongoose       │  Atlas       │
└─────────────┘                        └──────┬───────┘                   └──────────────┘
                                              │
                                    ┌─────────┼─────────┐
                                    │         │         │
                              Cloudinary  Razorpay  Nodemailer
                              (Media)     (Payments) (Email)
```

![Architecture Diagram](images/architecture.png)

### Database Schema

The data layer is built on 9 Mongoose models:

| Model               | Purpose                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| **User**            | Stores credentials, account type, and references to Profile and Courses |
| **Profile**         | Extended user info — bio, DOB, gender, contact                          |
| **Course**          | Course metadata, instructor ref, sections, ratings, enrolled students   |
| **Section**         | Groups of sub-sections within a course                                  |
| **SubSection**      | Individual video lectures with title, description, video URL, duration  |
| **Category**        | Course categories for catalog browsing                                  |
| **RatingAndReview** | Student ratings (1-5) and text reviews per course                       |
| **CourseProgress**  | Tracks completed sub-sections per student per course                    |
| **OTP**             | Time-limited OTP records for email verification                         |

![Database Schema](images/schema.png)

---

## Getting Started

### Prerequisites

- **Node.js** v16+ and **npm**
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account (free tier works)
- **Razorpay** account (test mode)
- **Gmail App Password** for email

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/WANI-OWAIS/StudyNotion-EdTech.git
cd StudyNotion-EdTech

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install
cd ..
```

### Running Locally

```bash
# Option 1: Start both frontend and backend concurrently
npm run dev

# Option 2: Start separately
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
npm start
```

| Service     | URL                          |
| ----------- | ---------------------------- |
| Frontend    | http://localhost:3000        |
| Backend API | http://localhost:4000/api/v1 |

### Production Build

```bash
npm run build        # Generates optimized frontend in /build
cd server && npm start  # Starts production server
```

---

## Environment Variables

### Server (`server/.env`)

```env
# MongoDB
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
FOLDER_NAME=StudyNotion

# Razorpay
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Email (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Server
PORT=4000
```

### Frontend (`.env` in root)

```env
REACT_APP_BASE_URL=http://localhost:4000/api/v1
```

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication — `/api/v1/auth`

| Method | Endpoint                | Auth | Description                 |
| ------ | ----------------------- | ---- | --------------------------- |
| POST   | `/signup`               | —    | Register a new user         |
| POST   | `/login`                | —    | Login and receive JWT       |
| POST   | `/sendotp`              | —    | Send OTP to email           |
| POST   | `/changepassword`       | JWT  | Change password             |
| POST   | `/reset-password-token` | —    | Request password reset link |
| POST   | `/reset-password`       | —    | Reset password with token   |

### Courses — `/api/v1/course`

| Method | Endpoint                | Auth       | Description                        |
| ------ | ----------------------- | ---------- | ---------------------------------- |
| GET    | `/getAllCourses`        | —          | List all courses                   |
| POST   | `/getCourseDetails`     | —          | Get public course details          |
| POST   | `/getFullCourseDetails` | JWT        | Get full course details (enrolled) |
| POST   | `/createCourse`         | Instructor | Create a new course                |
| POST   | `/editCourse`           | Instructor | Update course details              |
| DELETE | `/deleteCourse`         | —          | Delete a course                    |
| GET    | `/getInstructorCourses` | Instructor | Get instructor's courses           |
| POST   | `/addSection`           | Instructor | Add section to course              |
| POST   | `/updateSection`        | Instructor | Update section                     |
| POST   | `/deleteSection`        | Instructor | Delete section                     |
| POST   | `/addSubSection`        | Instructor | Add sub-section                    |
| POST   | `/updateSubSection`     | Instructor | Update sub-section                 |
| POST   | `/deleteSubSection`     | Instructor | Delete sub-section                 |
| POST   | `/updateCourseProgress` | Student    | Mark sub-section complete          |
| POST   | `/createRating`         | Student    | Submit rating & review             |
| GET    | `/getAverageRating`     | —          | Get average rating for a course    |
| GET    | `/getReviews`           | —          | Get all reviews                    |

### Categories — `/api/v1/course`

| Method | Endpoint                  | Auth  | Description               |
| ------ | ------------------------- | ----- | ------------------------- |
| POST   | `/createCategory`         | Admin | Create category           |
| GET    | `/showAllCategories`      | —     | List all categories       |
| POST   | `/getCategoryPageDetails` | —     | Get category with courses |

### Payments — `/api/v1/payment`

| Method | Endpoint                   | Auth    | Description               |
| ------ | -------------------------- | ------- | ------------------------- |
| POST   | `/capturePayment`          | Student | Initiate payment          |
| POST   | `/verifyPayment`           | Student | Verify Razorpay signature |
| POST   | `/sendPaymentSuccessEmail` | Student | Send confirmation email   |

### Profile — `/api/v1/profile`

| Method | Endpoint                | Auth       | Description             |
| ------ | ----------------------- | ---------- | ----------------------- |
| GET    | `/getUserDetails`       | JWT        | Get user details        |
| PUT    | `/updateProfile`        | JWT        | Update profile info     |
| PUT    | `/updateDisplayPicture` | JWT        | Upload profile picture  |
| DELETE | `/deleteProfile`        | JWT        | Delete account          |
| GET    | `/getEnrolledCourses`   | JWT        | Get enrolled courses    |
| GET    | `/instructorDashboard`  | Instructor | Get dashboard analytics |

### Contact — `/api/v1/reach`

| Method | Endpoint   | Auth | Description         |
| ------ | ---------- | ---- | ------------------- |
| POST   | `/contact` | —    | Submit contact form |

---

## Project Structure

```
StudyNotion-EdTech/
├── public/                     # Static HTML entry point
├── images/                     # README screenshots
├── server/                     # ── Backend ──
│   ├── index.js                # Express app setup & server start
│   ├── config/                 # DB, Cloudinary, Razorpay config
│   ├── controllers/            # Route handlers
│   │   ├── Auth.js             # Signup, login, OTP, password
│   │   ├── Course.js           # Course CRUD
│   │   ├── Category.js         # Category CRUD & catalog
│   │   ├── Section.js          # Section management
│   │   ├── Subsection.js       # Sub-section management
│   │   ├── Payments.js         # Razorpay capture & verify
│   │   ├── Profile.js          # Profile & dashboard
│   │   ├── RatingAndReview.js  # Ratings & reviews
│   │   ├── ResetPassword.js    # Password reset flow
│   │   ├── ContactUs.js        # Contact form handler
│   │   └── courseProgress.js   # Progress tracking
│   ├── models/                 # Mongoose schemas (9 models)
│   ├── routes/                 # Express route definitions
│   ├── middlewares/auth.js     # JWT verification & role guards
│   ├── mail/templates/         # Email HTML templates
│   └── utils/                  # Helpers (mailer, uploader, etc.)
├── src/                        # ── Frontend ──
│   ├── App.js                  # Root component & routes
│   ├── index.js                # React entry point
│   ├── components/
│   │   ├── common/             # Navbar, Footer, ReviewSlider, etc.
│   │   ├── core/               # Feature components (Auth, Dashboard, Course, etc.)
│   │   └── ContactPage/        # Contact form components
│   ├── pages/                  # Route-level page components
│   ├── slices/                 # Redux Toolkit slices
│   ├── services/               # API connector & operation functions
│   ├── hooks/                  # Custom React hooks
│   ├── data/                   # Static data (nav links, footer links, etc.)
│   ├── assets/                 # Images & logos
│   └── utils/                  # Constants & formatters
├── package.json                # Frontend dependencies & scripts
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md
```

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch — `git checkout -b feature/your-feature`
3. **Commit** your changes — `git commit -m "Add your feature"`
4. **Push** to the branch — `git push origin feature/your-feature`
5. **Open** a Pull Request

Please ensure your code follows the existing patterns and includes meaningful commit messages.

---

## Team

Developed by **Team J&K** — a group of 4 members.

- GitHub: [@WANI-OWAIS](https://github.com/WANI-OWAIS)
- Live Demo: [studynotion-edtech.vercel.app](https://study-notion-ed-tech-livid.vercel.app/)

For questions or support, [open an issue](https://github.com/WANI-OWAIS/StudyNotion-EdTech/issues).

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**If you found this project useful, consider giving it a star!**

Made with care by Team J&K &copy; 2025

</div>
