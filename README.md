# Student Life Toolkit

![MERN](https://img.shields.io/badge/Stack-MERN-green?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2018-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS%20%2B%20DaisyUI-38B2AC?logo=tailwindcss)
![TanStack
Query](https://img.shields.io/badge/State%20Mgmt-TanStack%20Query-orange)
![Zod](https://img.shields.io/badge/Validation-Zod-purple)
![Recharts](https://img.shields.io/badge/Charts-Recharts-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

------------------------------------------------------------------------

## 📖 Overview

**Student Life Toolkit** is a modern academic management dashboard built
with the **MERN stack** and designed for **students and institutions**.\
It provides a streamlined, responsive, and user-friendly experience with
**modern UI/UX principles** and advanced academic utilities.

------------------------------------------------------------------------

## ✨ Core Features

-   **Class Schedule Manager** -- Color-coded timetable with flexible
    scheduling\
-   **Budget Tracker** -- Financial analytics with charts & reports\
-   **Exam Q&A Generator** -- Auto-generate multiple question types
    (MCQ, short, essay)\
-   **Study Planner** -- Task management with smart time slots\
-   **Responsive UI** -- Optimized for desktop, tablet, and mobile\
-   **Secure Backend** -- Node.js + Express API with MongoDB persistence

------------------------------------------------------------------------

## 🛠️ Technology Stack

**Frontend** - React 18 - Tailwind CSS + DaisyUI\
- TanStack Query (React Query)\
- React Hook Form + Zod\
- Recharts for data visualization\
- Lucide React icons

**Backend** - Node.js + Express.js\
- MongoDB + Mongoose\
- Axios with secure interceptors

------------------------------------------------------------------------

## 🚀 Installation & Setup

``` bash
# Clone repository
git clone https://github.com/khokan/student-life-toolkit.git
cd student-life-toolkit

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Run backend
npm run dev

# Run frontend
npm run dev
```

------------------------------------------------------------------------

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

``` bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

------------------------------------------------------------------------

## 📡 API Documentation

### **Class Schedule Manager**

-   `GET /api/schedule` -- Fetch schedules\
-   `POST /api/schedule` -- Create schedule\
-   `PUT /api/schedule/:id` -- Update schedule\
-   `DELETE /api/schedule/:id` -- Delete schedule

### **Budget Tracker**

-   `GET /api/budget` -- Fetch transactions\
-   `POST /api/budget` -- Add transaction\
-   `PUT /api/budget/:id` -- Update transaction\
-   `DELETE /api/budget/:id` -- Delete transaction

### **Exam Q&A Generator**

-   `POST /api/exam/generate` -- Generate questions
-   `GET /api/exam` -- Fetch generated questions
-   `DELETE /api/exam/:id` -- Delete generated questions
-   `PUT /api/exam/:id` -- Update generated questions

### **Study Planner**

-   `GET /api/planner` -- Fetch tasks\
-   `POST /api/planner` -- Add task\
-   `PUT /api/planner/:id` -- Update task\
-   `DELETE /api/planner/:id` -- Delete task

------------------------------------------------------------------------

## 📱 Responsive Design Showcase

The dashboard is fully responsive:\
- **Desktop:** Multi-panel view with charts and tables\
- **Tablet:** Condensed layouts with collapsible sidebars\
- **Mobile:** Single-column view with bottom navigation

------------------------------------------------------------------------

## ⚡ Performance Optimizations

-   Code splitting and lazy loading in React\
-   TanStack Query caching for minimal API calls\
-   Optimized MongoDB queries with indexes\
-   Reusable form validation with Zod

------------------------------------------------------------------------

## 🛡️ Error Handling & Validation

-   Centralized error middleware in Express\
-   Zod schema validation for all inputs\
-   Axios interceptors for API error responses\
-   Fallback UI for React error boundaries

------------------------------------------------------------------------

## 🤝 Contributing

1.  Fork the project\
2.  Create your feature branch (`git checkout -b feature/YourFeature`)\
3.  Commit changes (`git commit -m 'Add feature'`)\
4.  Push branch (`git push origin feature/YourFeature`)\
5.  Open a Pull Request

------------------------------------------------------------------------

## 📄 License

This project is licensed under the **MIT License**.\
See the [LICENSE](./LICENSE) file for details.

------------------------------------------------------------------------

## 👨‍💻 Target Audience

-   Students & Institutions for academic management\
-   Developers building dashboards with MERN stack\
-   Contributors exploring **modern web architecture**

------------------------------------------------------------------------

## 🌟 Highlights

✅ **Modern Architecture** -- MERN + TanStack Query\
✅ **Robust Validation** -- Zod schemas\
✅ **Responsive Design** -- TailwindCSS + DaisyUI\
✅ **Optimized State Management** -- Query caching\
✅ **Professional UX** -- Clean, consistent, and scalable
