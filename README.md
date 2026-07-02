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

## Quick Start (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/insider-jobs.git
cd insider-jobs
```

### 2. Make the scripts executable (first time only)

```bash
chmod +x setup.sh start-local.sh
```

### 3. Run the interactive setup wizard

```bash
./setup.sh
```

The wizard will:
- Check that Node, npm, and Git are installed
- Ask you to enter all required secret values one by one
- Automatically write `server/.env` and `client/.env`
- Run `npm install` for both server and client

Example session:

```
================================================================
   InsiderJobs  -  Local Development Setup
================================================================

==  Step 1/4 : Checking system requirements
  +  node   /usr/bin/node
  +  npm    /usr/bin/npm
  +  git    /usr/bin/git
  +  Node v20.11.0   npm v10.2.4

==  Step 2/4 : Configuring environment variables

  --- Server credentials (all fields required) ---

  Enter MONGODB_URI                   : mongodb+srv://admin:password@cluster0.abc.mongodb.net/?appName=Cluster0
  Enter JWT_SECRET                    : my_super_secret_jwt_key_123
  Enter CLOUDINARY_NAME               : my_cloudinary_name
  Enter CLOUDINARY_API_KEY            : 817198462249534
  Enter CLOUDINARY_API_SECRET         : bWeqtOP9bTsVi5AMwm5pt3z-2Fs
  Enter GEMINI_API_KEY                : AIzaSyCFmIXIDc4QcaUawfe0oo6KCzinhytKmAs
  Enter SMTP_USER                     : yourteam@gmail.com
  Enter SMTP_PASS                     : abcd efgh ijkl mnop

  --- Client / Frontend (press Enter for local default) ---

  Enter VITE_REACT_BACKEND_URL [http://localhost:5000] : <press Enter>
```

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

| Variable               | Required | Default                                                       | Description                              |
| ---------------------- | -------- | ------------------------------------------------------------- | ---------------------------------------- |
| `PORT`                 | No       | `5000`                                                        | Express server port                      |
| `PROJECT_NAME`         | No       | `Insider Jobs`                                                | App display name                         |
| `JWT_SECRET`           | **Yes**  | —                                                             | Random secret string for signing tokens  |
| `MONGODB_URI`          | **Yes**  | —                                                             | MongoDB Atlas connection string          |
| `CLOUDINARY_NAME`      | **Yes**  | —                                                             | Cloudinary cloud name                    |
| `CLOUDINARY_API_KEY`   | **Yes**  | —                                                             | Cloudinary API key                       |
| `CLOUDINARY_API_SECRET`| **Yes**  | —                                                             | Cloudinary API secret                    |
| `GEMINI_API_KEY`       | **Yes**  | —                                                             | Google AI Studio API key                 |
| `GEMINI_BASE_URL`      | No       | `https://generativelanguage.googleapis.com/v1beta/openai/`   | Gemini endpoint                          |
| `GEMINI_MODEL`         | No       | `gemini-2.5-flash`                                            | Gemini model name                        |
| `SMTP_HOST`            | No       | `smtp.gmail.com`                                              | SMTP host                                |
| `SMTP_PORT`            | No       | `587`                                                         | SMTP port                                |
| `SMTP_USER`            | **Yes**  | —                                                             | Gmail address used to send emails        |
| `SMTP_PASS`            | **Yes**  | —                                                             | Gmail App Password (not your login pass) |

### `client/.env`

| Variable                  | Required | Default                  | Description                              |
| ------------------------- | -------- | ------------------------ | ---------------------------------------- |
| `VITE_REACT_BACKEND_URL`  | **Yes**  | `http://localhost:5000`  | Full URL of the Express backend          |

---

## How to get required credentials

### MongoDB URI

1. Go to https://cloud.mongodb.com
2. Create a free cluster (M0)
3. Under **Database Access** create a user with read/write access
4. Under **Network Access** allow `0.0.0.0/0` (or your IP)
5. Click **Connect → Compass / Drivers** and copy the URI
6. Replace `<password>` with your database user password

```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/?appName=Cluster0
```

### Cloudinary

1. Sign up at https://cloudinary.com (free tier is enough)
2. Go to **Dashboard** — you will see your **Cloud name**, **API Key**, and **API Secret**

### Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key

### Gmail App Password (SMTP)

1. Enable 2-Step Verification on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password for **Mail**
4. Copy the 16-character password (spaces are ignored)

---

## Project Structure

```
insider-jobs/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Shared UI components (Navbar, Footer, ...)
│   │   ├── context/         # React context (AppContext)
│   │   ├── pages/           # Page components (Home, Auth, Dashboards, ...)
│   │   └── assets/          # Static assets
│   ├── .env                 # Created by setup.sh  (gitignored)
│   └── .env.example         # Template for client env vars
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
│   └── .env.example         # Template for server env vars
│
├── setup.sh                 # Interactive local setup wizard
├── start-local.sh           # Start both servers with one command
└── README.md                # You are here
```

---

## Available Scripts

| Script            | Location | Command           | Description                          |
| ----------------- | -------- | ----------------- | ------------------------------------ |
| `setup.sh`        | root     | `./setup.sh`      | First-time local setup wizard        |
| `start-local.sh`  | root     | `./start-local.sh`| Start backend + frontend together    |
| `dev`             | client/  | `npm run dev`     | Start Vite dev server only           |
| `start`           | server/  | `npm start`       | Start Express with nodemon only      |

---

## Roles & Access

| Role      | Registration path           | Dashboard               |
| --------- | --------------------------- | ----------------------- |
| Student   | `/auth?type=student&mode=register`   | `/student-dashboard`   |
| Recruiter | `/auth?type=recruiter&mode=register` | `/owner-dashboard`     |
| Admin     | `/admin-login`              | `/admin-dashboard`      |

---

## Troubleshooting

**`./setup.sh: Permission denied`**
```bash
chmod +x setup.sh start-local.sh
```

**`Cannot find module ...`**
```bash
npm install --prefix server
npm install --prefix client
```

**MongoDB connection error**
- Check your `MONGODB_URI` is correct
- Ensure your IP is whitelisted in MongoDB Atlas Network Access

**Emails not sending**
- Make sure you are using a **Gmail App Password** (not your regular Google password)
- 2-Step Verification must be enabled on the Gmail account

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License. See [LICENSE](LICENSE) for details.
