# Sippy-tms
# 📌 Leaderboard Task Management API

A powerful backend API built with **Node.js** and **Express.js** that manages tasks, assignments, and a leaderboard ranking system. It also supports **image uploads to Google Drive**, **JWT authentication**, and **detailed API responses**.

---

## 🚀 Features

- ✅ **User Authentication & Authorization** (JWT-based)
- ✅ **Task Creation, Assignment & Status Management**
- ✅ **Leaderboard Ranking Based on Completed Tasks**
- ✅ **Google Drive Image Uploads for Tasks**
- ✅ **Comprehensive API Response Codes**
- ✅ **Postman API Documentation Available**

---

## 🛠️ Built With

- **Node.js** (Backend Framework)
- **Express.js** (Routing & Middleware)
- **Prisma ORM** (Database Management)
- **PostgreSQL** (Database)
- **Google Drive API** (Image Uploads)
- **JWT (JSON Web Token)** (Authentication)

---

## 📦 Database Schema

```prisma
enum Role {
  user
  admin
}

enum Status {
  to_do
  in_progress
  completed
}

enum Priority {
  low
  medium
  high
}

model user {
  user_id     String            @id @default(uuid())
  first_name  String
  last_name   String
  email       String            @unique
  password    String
  role        Role              @default(user)
  created_at  DateTime          @default(now())
  updated_at  DateTime          @updatedAt
  tasks       task[]
  assignments task_assignment[]
}

model task {
  task_id     Int              @id @default(autoincrement())
  title       String
  description String?
  status      Status           @default(to_do)
  priority    Priority         @default(medium)
  due_date    DateTime?
  image_url   String?
  user_id     String
  created_at  DateTime         @default(now())
  updated_at  DateTime         @updatedAt
  user        user             @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  assignments task_assignment?
}

model task_assignment {
  id          Int      @id @default(autoincrement())
  task_id     Int      @unique
  assigned_to String
  task        task     @relation(fields: [task_id], references: [task_id], onDelete: Cascade)
  user        user     @relation(fields: [assigned_to], references: [user_id], onDelete: Cascade)
  assigned_at DateTime @updatedAt
}
```

---

## 🔐 Authentication

- Uses **JWT** for secure authentication.
- Every protected route requires a token passed in the `Authorization` header.

```
Authorization: Bearer <token>
```

---

## 📁 Google Drive Image Uploads

- Task images are uploaded to **Google Drive**.
- Each uploaded image generates a **preview URL** stored as `image_url` in the task record.

---

## 📑 API Documentation

📌 [Postman Collection](https://documenter.getpostman.com/view/15065406/2sB2cUAhnp)

---

## 📊 Leaderboard Ranking System

Users are ranked based on:
1. **Highest Number of Completed Tasks** ✅
2. **Total Number of Tasks (Lower is Better in Tie Cases)** 📉

---

## 📡 API Response Codes

| Code | Meaning                               |
|------|----------------------------------------|
| `02` | Missing required key fields            |
| `04` | Wrong key field input format           |
| `09` | Generic error                          |
| `10` | Account not found                      |
| `15` | Incorrect / Invalid password           |
| `16` | Access denied                          |
| `17` | Unauthorized                           |

---

## 🛠️ Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Create `env_config.json`
This file must be placed in the root directory and should have the following structure:
```json
{
    "ENV": "test",
    "PORT": 8000,
    "LAST_UPDATE": "5th April 2025",

    "JWT_SECRET_KEY": "",
    "JWT_EXPIRES_IN": 600,
    "BCRYPT_HASH_SALT_VALUE": 15,

    "DATABASE_URL": ""
}
```

### 3️⃣ Create `google_service_key.json`
This file should be placed in the root directory. It contains the **Google Service Account Key** required for Google Drive uploads.

### 4️⃣ Start the Server
```bash
node index.js
```

---

## 📄 License

MIT License

---

## ✍️ Author

**Tuoyo-Clifford Eyimofe**  

