# Job Application Tracker

A clean, minimal dashboard to track your job applications.

## Features
- Add, edit, and delete job applications
- Filter by status and job type
- Search by company or position
- Summary stats at the top
- Data saves automatically in your browser (localStorage)

## How to deploy

### Step 1 — Push to GitHub
1. Go to [github.com](https://github.com) and create a new repository called `job-tracker`
2. Download this project folder to your computer
3. Open your terminal and run:

```bash
cd job-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/job-tracker.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Select your `job-tracker` repository
4. Click "Deploy" — no settings needed
5. Your site will be live at `https://job-tracker-xxx.vercel.app`

## Local development
Just open `index.html` in your browser. No build step needed.
