# InsiderJobs

A freelancing platform connecting university students with real-world paid projects from verified companies and recruiters.

---

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router   |
| Backend  | Express 5, Node.js (ESM), Mongoose, Nodemon     |
| Database | MongoDB Atlas                                   |
| Storage  | Cloudinary (images / files)                     |
| Auth     | JWT (jsonwebtoken), bcrypt                      |
| AI       | Google Gemini via OpenAI-compatible SDK         |
| Email    | Nodemailer (Gmail SMTP)                         |

---

## Prerequisites

Make sure the following are installed on your machine before running setup:

- **Node.js** >= 18  —  https://nodejs.org
- **npm** >= 9
- **Git**
- **Git Bash** or **WSL** (Windows) to run `.sh` scripts

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-org/insider-jobs.git
cd insider-jobs
```

### 2. Make the scripts executable (first time only)

```bash
chmod +x setup.sh start-local.sh
```

### 3. Run the setup wizard

```bash
./setup.sh
```

The script will ask you to enter each required value one by one:

```
=================================
 InsiderJobs  -  Local Dev Setup
=================================

Checking system requirements...
  OK  node /usr/bin/node
  OK  npm  /usr/bin/npm
  OK  git  /usr/bin/git

--- Configure server/.env ---

Enter MONGODB_URI: mongodb+srv://admin:password@cluster0.abc.mongodb.net/insider-jobs
Enter CLOUDINARY_NAME: my_cloud_name
Enter CLOUDINARY_API_KEY: 817198462249534
Enter CLOUDINARY_API_SECRET: bWeqtOP9bTsVi5AMwm5pt3z-2Fs
Enter GEMINI_API_KEY: AIzaSyCFmIXIDc4QcaUawfe0oo6KCzinhytKmAs
Enter SMTP_USER (Gmail address): yourteam@gmail.com
Enter SMTP_PASS (Gmail app password): abcd efgh ijkl mnop

OK  Generated a cryptographically secure JWT_SECRET automatically.
OK  server/.env created.

--- Configure client/.env ---

Enter VITE_REACT_BACKEND_URL [http://localhost:5000]: <press Enter>

OK  client/.env created.

--- Installing dependencies ---

Installing server packages...
Installing client packages...

Setup complete!
```

> **Note:** `JWT_SECRET` is auto-generated as a 128-character cryptographically secure hex string using Node.js's `crypto` module. You never need to set it manually.

### 4. Start both servers

```bash
./start-local.sh
```

| Service  | URL                     |
| -------- | ----------------------- |
| Backend  | http://localhost:5000   |
| Frontend | http://localhost:5173   |

Press **Ctrl+C** to stop both servers at once.

---

## Environment Variables

### `server/.env`

| Variable               | Required | Auto-set | Description                              |
| ---------------------- | -------- | -------- | ---------------------------------------- |
| `PORT`                 | No       | Yes      | Express server port (default 5000)       |
| `PROJECT_NAME`         | No       | Yes      | App display name                         |
| `JWT_SECRET`           | **Yes**  | Yes      | Auto-generated 128-char secret           |
| `MONGODB_URI`          | **Yes**  | No       | MongoDB Atlas connection string          |
| `CLOUDINARY_NAME`      | **Yes**  | No       | Cloudinary cloud name                    |
| `CLOUDINARY_API_KEY`   | **Yes**  | No       | Cloudinary API key                       |
| `CLOUDINARY_API_SECRET`| **Yes**  | No       | Cloudinary API secret                    |
| `GEMINI_API_KEY`       | **Yes**  | No       | Google AI Studio API key                 |
| `GEMINI_BASE_URL`      | No       | Yes      | Gemini endpoint URL                      |
| `GEMINI_MODEL`         | No       | Yes      | Gemini model name                        |
| `SMTP_HOST`            | No       | Yes      | SMTP host (defaults to smtp.gmail.com)   |
| `SMTP_PORT`            | No       | Yes      | SMTP port (defaults to 587)              |
| `SMTP_USER`            | **Yes**  | No       | Gmail address used to send emails        |
| `SMTP_PASS`            | **Yes**  | No       | Gmail App Password                       |

### `client/.env`

| Variable                  | Required | Default                  | Description                    |
| ------------------------- | -------- | ------------------------ | ------------------------------ |
| `VITE_REACT_BACKEND_URL`  | **Yes**  | `http://localhost:5000`  | Full URL of the Express backend |

---

## How to get required credentials

### MongoDB URI

1. Go to https://cloud.mongodb.com and create a free cluster (M0)
2. Under **Database Access** create a user with read/write access
3. Under **Network Access** add `0.0.0.0/0`
4. Click **Connect > Drivers** and copy the URI, replacing `<password>` with your password

```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/?appName=Cluster0
```

### Cloudinary

1. Sign up at https://cloudinary.com (free tier is sufficient)
2. Open the **Dashboard** — your **Cloud name**, **API Key**, and **API Secret** are shown there

### Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key** and copy it

### Gmail App Password (SMTP)

1. Enable **2-Step Verification** on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password for **Mail** and copy the 16-character code

---

## Project Structure

```
insider-jobs/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Shared UI components (Navbar, Footer, ...)
│   │   ├── context/         # React context (AppContext)
│   │   ├── pages/           # Page components
│   │   └── assets/          # Static assets
│   ├── .env                 # Created by setup.sh  (gitignored)
│   └── .env.example         # Variable template
│
├── server/                  # Express backend
│   ├── configs/             # DB, Cloudinary, Mailer, AI config
│   ├── controllers/         # Route handlers
│   ├── middlewares/         # Auth, upload middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routers
│   ├── utils/               # Utility helpers
│   ├── server.js            # Entry point
│   ├── .env                 # Created by setup.sh  (gitignored)
│   └── .env.example         # Variable template
│
├── setup.sh                 # Interactive local setup wizard
├── start-local.sh           # Start both servers with one command
└── README.md
```

---

## Available Scripts

| Script            | Command             | Description                          |
| ----------------- | ------------------- | ------------------------------------ |
| `setup.sh`        | `./setup.sh`        | First-time local setup wizard        |
| `start-local.sh`  | `./start-local.sh`  | Start backend + frontend together    |

---

## Roles & Access

| Role      | Registration path                                    | Dashboard              |
| --------- | ---------------------------------------------------- | ---------------------- |
| Student   | `/auth?type=student&mode=register`                   | `/student-dashboard`  |
| Recruiter | `/auth?type=recruiter&mode=register`                 | `/owner-dashboard`    |
| Admin     | `/admin-login`                                       | `/admin-dashboard`    |

---

## Troubleshooting

**Permission denied on .sh scripts**
```bash
chmod +x setup.sh start-local.sh
```

**MongoDB connection error**
- Verify `MONGODB_URI` is correct
- Ensure your IP is whitelisted in MongoDB Atlas Network Access

**Emails not sending**
- Use a **Gmail App Password**, not your regular Google login password
- 2-Step Verification must be enabled on the Gmail account

**Cannot find module errors**
```bash
npm install --prefix server
npm install --prefix client
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License. See [LICENSE](LICENSE) for details.
