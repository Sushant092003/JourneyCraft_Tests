## ⚠️ IMPORTANT: Run Backend At Least Once Before Frontend

> The backend **must be started at least once** before running the frontend or admin dashboard.

### Why?

- The database tables (`users`, `guide`, `restaurant`, `streetLocations`, etc.) are **auto-created by Hibernate**.
- If you run the frontend first, the APIs will fail because the tables **do not exist yet**.

# 🗄️ JourneyCraft – SQL & Backend Configuration Guide

This guide explains how to set up the MySQL database and configure the backend before running the JourneyCraft Spring Boot application.

> ⚠️ You must complete this setup before starting the backend server.

---

## 📌 Prerequisites

- MySQL Server installed
- Java 17+
- Maven installed
- MySQL running on `localhost:3306`

---

## ️ Step 1: Start MySQL

Make sure MySQL is running. You can verify by logging in:

```bash
mysql -u root -p
```

## ️ Step 2: Run MySQL

Login to MySQL and run:

```bash
CREATE DATABASE journeycraft_db;
```

Select the database:

```bash
USE journeycraft_db;
```

## Step 3: Configure application.properties

Go to:

```bash
cd /src/main/resources/application.properties
```

Update or add:

```bash
spring.datasource.url=jdbc:mysql://localhost:3306/journeycraft_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

> Replace: <br>
> YOUR_USERNAME (usually root) <br>
> YOUR_MYSQL_PASSWORD with your MySQL password

## Backend

To run the backend go to /src/main/java/gmail.bsssushant2003.JourneyCraft

```bash
Run: JourneyCraftApplication
```

## Mocked Backend

To run the Mocked Backend cd to /specmatic/stub

```bash
Run: specmatic stub journeycraft.yaml
```

## Frontend
cd to frontend and 

`Run: npm run dev`

## 🔧 How to Change Backend / Stub URL

The React Frontend uses a **centralized config file** to manage the backend API base URL.

This allows you to easily switch between:

- ✅ Real Backend
- ✅ Stub Backend
- ✅ Different Local Port
- ✅ Deployed Server

---

## 📁 Config File Location

Go to: `frontend/src/config`

---

## 🧱 Current Configuration

Inside `config.js` you will see:

```js
export const API_BASE_URL = "http://127.0.0.1:8080";
```

To change the backend or stub server, just modify this one line:

`BASE_URL: export const API_BASE_URL = "http://127.0.0.1:<YOUR_PORT>";

## Admin Dashboard

The Admin Dashboard is a web-based interface used to manage:

- Guides approval / rejection
- Restaurants approval / rejection
- View platform statistics

---

## ⚠️ Prerequisite

> Make sure the **backend server is running** before opening the Admin Dashboard.

Example:
---

http://localhost:8080

(or your configured backend port)

---

Go to the Admin Dashboard folder and open:

```bash
html/index.html
```

You can open it directly in the browser by:<br>
Double clicking index.html<br>
OR using VS Code Live Server<br>
OR using:
```bash
open html/index.html
```
## 🔧 How to Change Backend / Stub URL

The Admin Dashboard uses a **centralized config file** to manage the backend API base URL.

This allows you to easily switch between:

- ✅ Real Backend
- ✅ Stub Backend
- ✅ Different Local Port
- ✅ Deployed Server

---

## 📁 Config File Location

Go to: `Admin Dashboard/js/config.js`

---

## 🧱 Current Configuration

Inside `config.js` you will see:

```js
const CONFIG = {
  BASE_URL: "http://localhost:8080"
};
```

To change the backend or stub server, just modify this one line:

`BASE_URL: "http://localhost:<YOUR_PORT>"`


## SQL Dummy data for Starter 

For SQL Dummy data refer to DATABASE_SEED.md
