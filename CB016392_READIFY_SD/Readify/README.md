# Readify (Assignment 3)

This is a multi-page front-end website built with **HTML + CSS + JavaScript only**.

## Pages
- Home (index.html)
- Book Explorer (explorer.html)
- Reading Progress Tracker (tracker.html)
- Random Book Recommender (recommender.html)
- Reading Flow (flow.html)
- Feedback + FAQ (feedback.html)

## How to run locally
Open `index.html` in a browser. (For the best PWA/service worker behavior, use a simple local server.)

## Host on GitHub Pages
1. Create a new GitHub repo (example: `readify-site`).
2. Upload all files in this folder to the repo root.
3. Repo Settings → Pages → Source: `main` branch, folder: `/ (root)`
4. Save, then open the provided GitHub Pages URL.

## Notes
- Uses localStorage for newsletter, reading list, progress, completed books, feedback.
- Includes manifest + service worker for basic PWA/offline support.