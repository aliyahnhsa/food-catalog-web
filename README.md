# Food Catalog Web

A food catalog web application built with **React Vite** for the frontend and **Django + Django REST Framework** for the backend.

The application allows users to browse food menus, view menu details, filter by category, search menus, and display menu photos/videos. Admin users can log in and add new menu items through the dashboard.

## Tech Stack

### Frontend

* React
* Vite
* React Router DOM
* Axios
* CSS

### Backend

* Python
* Django
* Django REST Framework
* Django Token Authentication
* SQLite
* Pillow

## Features

* Menu catalog display
* Menu detail page
* Search menu by name, description, or category
* Filter menu by category
* Random featured menus on homepage
* Image and video upload
* Admin login
* Admin-only dashboard for adding new menu items
* Responsive UI
* Single Page Application routing with React Router

## Project Structure

```bash
food-catalog-web/
├── backend/
│   ├── catalog/
│   ├── core/
│   ├── media/
│   ├── db.sqlite3
│   └── manage.py
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.js
```

## Requirements

Before running this project, make sure you have installed:

* Python 3.10 or newer
* Node.js 18 or newer
* npm
* Git

You can check your installed versions with:

```bash
python --version
node --version
npm --version
git --version
```

## How to Run This Project

Clone the repository:

```bash
git clone <repository-url>
cd food-catalog-web
```

Replace `<repository-url>` with the actual GitHub repository URL.

---

# Backend Setup

Open a terminal and go to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment.

For Windows:

```bash
.venv\Scripts\activate
```

For Mac/Linux:

```bash
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install django djangorestframework django-cors-headers pillow
```

Run database migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create an admin user:

```bash
python manage.py createsuperuser
```

Follow the instructions in the terminal to create the username, email, and password.

Start the backend server:

```bash
python manage.py runserver
```

The backend will run at:

```bash
http://127.0.0.1:8000/
```

You can check the API here:

```bash
http://127.0.0.1:8000/api/menus/
```

You can open the Django admin panel here:

```bash
http://127.0.0.1:8000/admin/
```

---

# Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

If Axios or React Router DOM is missing, install them manually:

```bash
npm install axios react-router-dom
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run at:

```bash
http://localhost:5173/
```

---

# Running the App

To run the full application, use two terminals:

## Terminal 1 — Backend

```bash
cd backend
.venv\Scripts\activate
python manage.py runserver
```

For Mac/Linux:

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

## Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Then open:

```bash
http://localhost:5173/
```

---

# Admin Login

To access the admin dashboard in the web app, use the Django superuser account that was created with:

```bash
python manage.py createsuperuser
```

Only admin or staff users can add menu items.

If the dashboard does not appear after login, make sure the user has staff access in Django admin.

---

# Important Notes

## Database

This project uses SQLite by default. After pulling the project, the database may be empty depending on whether `db.sqlite3` is included in the repository.

If the menu list is empty, add menu data through:

```bash
http://127.0.0.1:8000/admin/
```

or through the web app admin dashboard.

## Media Files

Uploaded images and videos are stored in the backend `media/` folder.

If images or videos do not appear after pulling the project, make sure the media files are available locally and the backend server is running.

## CORS

The backend is configured to allow requests from:

```bash
http://localhost:5173
http://127.0.0.1:5173
```

Make sure the frontend is running on port `5173`.

---

# Common Issues

## 1. `python is not recognized`

Try using:

```bash
py --version
py -m venv .venv
py manage.py runserver
```

## 2. Virtual environment cannot activate on Windows

Try:

```bash
.venv\Scripts\activate.bat
```

If PowerShell blocks activation, run PowerShell as administrator and use:

```bash
Set-ExecutionPolicy RemoteSigned
```

Then try activating the virtual environment again.

## 3. Frontend cannot connect to backend

Make sure the backend is running at:

```bash
http://127.0.0.1:8000/
```

Also check that the frontend API base URL points to:

```bash
http://127.0.0.1:8000/api
```

## 4. Login fails

Make sure you already created a superuser:

```bash
python manage.py createsuperuser
```

Also make sure the backend server is running.

## 5. Images do not load

Make sure the backend server is running and the image URL starts with:

```bash
http://127.0.0.1:8000
```

---

# Recommended Git Ignore

Make sure these files/folders are ignored:

```bash
backend/.venv/
backend/__pycache__/
backend/*/__pycache__/
frontend/node_modules/
frontend/dist/
.env
```

Optional, depending on the submission requirement:

```bash
backend/db.sqlite3
backend/media/
```

If the project needs sample data for demo purposes, you may keep `db.sqlite3` and `media/`.
If the project should be clean for development, ignore them and let each user create their own data locally.

---

# Development Commands Summary

Backend:

```bash
cd backend
.venv\Scripts\activate
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm run dev
```

Open app:

```bash
http://localhost:5173/
```
