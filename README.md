# Focus – Agile Personal Goal & Habit Tracking Suite

> A modern full-stack productivity web application that bridges long-term life vision with day-to-day agile execution through Jira-style sprint tracking, drag-and-drop Kanban workflows, habit consistency heatmaps, and secure JWT authentication.

---

## 🌟 Overview

Most productivity applications isolate daily to-do lists from high-level aspirations. **Focus** applies Agile/Scrum software engineering methodologies to personal life engineering:

$$\text{Life Vision} \longrightarrow \text{Yearly Goals} \longrightarrow \text{Weekly Sprints} \longrightarrow \text{Kanban Tasks}$$

1. **Life Visions:** Macro strategic domains (Career, Health, Wealth, Personal Growth, etc.).
2. **Yearly Goals:** Measurable high-impact milestones tied to specific vision areas.
3. **Weekly Sprints:** Timeboxed execution cycles with start/end dates, backlog management, and sprint reviews.
4. **Actionable Tasks:** Tickets with priority, status, markdown notes, file attachments, and drag-and-drop Kanban state transitions.
5. **Daily Rituals & Habits:** Consistency tracking with streak counters and GitHub-inspired contribution heatmaps.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS & Lucide Icons
- **Drag & Drop:** `@hello-pangea/dnd`
- **Routing:** React Router DOM v6
- **Effects & UI:** `canvas-confetti`, `clsx`, `tailwind-merge`

### Backend
- **Framework:** Java 17, Spring Boot 3.2.5
- **Security:** Spring Security with Stateless JWT Authentication (`jjwt`)
- **Persistence:** Spring Data JPA / Hibernate
- **Database:** MySQL
- **Validation & Tooling:** Spring Starter Validation, Maven

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+** & npm
- **MySQL 8.0+**

---

### Backend Setup

1. **Configure Database Connection:**
   Update `backend/src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/focus_db?createDatabaseIfNotExist=true&useSSL=false
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

2. **Run Backend Service:**
   ```bash
   cd backend
   mvn clean spring-boot:run
   ```
   *The backend will automatically start on `http://localhost:8080` and seed initial demo data.*

   **Default Demo Account:**
   - **Email:** `focus@user.com`
   - **Password:** `focus123`

---

### Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   *Frontend starts on `http://localhost:5173`.*

---

## 📐 Project Structure

```
Goal Tracker/
├── backend/
│   ├── src/main/java/com/focus/
│   │   ├── controller/      # REST API endpoints (Auth, Goals, Tasks, Rituals, Reports)
│   │   ├── dto/             # Request & Response Data Transfer Objects
│   │   ├── model/           # JPA Entities (User, Vision, YearlyGoal, WeeklyGoal, Task, Ritual)
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── security/        # JWT Authentication Filter, Provider & SecurityConfig
│   │   └── service/         # Core business logic and DataSeeder
│   └── pom.xml              # Maven dependencies
├── frontend/
│   ├── src/
│   │   ├── api/             # API client & fetch wrappers
│   │   ├── components/      # Modals, Kanban, Navbar, Sidebar, Badges
│   │   ├── context/         # AuthContext & Session management
│   │   ├── screens/         # Dashboard, Workspace, Sprint, Vision, Rituals, Reports
│   │   ├── App.jsx          # Route configuration & layout
│   │   └── main.jsx         # Application entrypoint
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔒 License
This project is open-source and available under the [MIT License](LICENSE).
