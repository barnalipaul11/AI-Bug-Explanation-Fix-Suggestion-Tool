````markdown
# 🐞 AI Bug Explanation Dashboard

A full-stack tool that helps developers understand complex error logs and GitHub issues.  
The system fetches real issues directly from GitHub and uses **Google Gemini AI** to generate:

- Clear explanations
- Error summaries
- Severity levels
- Actionable fixes
- Helpful documentation links

---

## 🚀 Features

- 🔗 **GitHub Issue Fetching** — Enter Owner, Repo, Issue Number
- 🤖 **AI Bug Analysis** using Google Gemini API
- 📌 **Severity, Summary & Fix Suggestions**
- 📚 **Auto Documentation Links**
- 💡 **Copy Code Snippets**
- 🎨 **Modern Dark UI** using Tailwind CSS

---

# 📋 Prerequisites

Make sure you have the following installed:

### ✔ System Requirements
- **Java 17+**
- **Node.js v16+**
- **npm**
- **Maven** (or use included Maven Wrapper)

### ✔ API Keys Required
You must create:

1. **Google Gemini API Key** [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. **GitHub Personal Access Token** [https://github.com/settings/tokens](https://github.com/settings/tokens)  
   (You only need *Read access → Public Repositories*)

---

# ⚙️ Backend Setup (Spring Boot)

### 1️⃣ Navigate to backend folder
```sh
cd backend
````

### 2️⃣ Add API credentials

Create or edit:

`src/main/resources/application.properties`

Add:

```properties
spring.application.name=bug-ai-backend
server.port=8080

# Google Gemini
gemini.api.key=YOUR_GEMINI_API_KEY
gemini.model=models/gemini-pro-latest

# GitHub API token
github.token=YOUR_GITHUB_TOKEN
```

### 3️⃣ Run backend

```sh
./mvnw spring-boot:run
```

If successful, backend runs on:
👉 [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)

-----

# 🎨 Frontend Setup (React + Tailwind)

### 1️⃣ Navigate to frontend folder

```sh
cd frontend
```

### 2️⃣ Install dependencies

```sh
npm install
```

### 3️⃣ Start frontend server

```sh
npm run dev
```

Frontend runs on:
👉 [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)

-----

# 🖥️ Using the Application

### ✔ 1. Open the dashboard

Visit:
[http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)

### ✔ 2. Fetch a GitHub Issue

Enter:

  - Owner → `facebook`
  - Repo → `react`
  - Issue \# → `1`

Click **Fetch Issue**.

### ✔ 3. Analyze with AI

  - Click **Analyze with AI →**
  - Review the bug text
  - Click **Analyze Bug**

You will get:

  - Summary
  - Severity Badge
  - Explanation
  - Keywords
  - Fix Recommendations
  - Documentation Links

-----

# 🔧 Troubleshooting

### ❌ Backend returns 500

  - Check Gemini API key
  - Ensure model name is correct (Example: `gemini-2.5-flash`)
  - Print backend logs to see actual error

### ❌ Frontend can't call backend

  - Is backend running on 8080?
  - Check CORS (`@CrossOrigin("*")` should fix)

### ❌ GitHub issues not loading

  - Ensure token has **Read Public Repository** permission only

<!-- end list -->

```
