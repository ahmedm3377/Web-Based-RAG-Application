# Web-Based RAG Application

## Overview

This project is a **Web-Based Retrieval-Augmented Generation (RAG) Application** built using modern technologies. The backend is powered by **LLAMA**, **Node.js**, **Express**, **MongoDB**, and **ChromaDB**, while the frontend leverages the power of **Angular** and **Tailwind CSS** to deliver an interactive and user-friendly interface.

## Features

- **Retrieval-Augmented Generation**: Combines retrieval mechanisms with generative AI for efficient and accurate responses.
- **Scalable Backend**: Built with Node.js, Express, and MongoDB for scalability and reliability.
- **Modern Frontend**: Utilizes Angular and Tailwind CSS for dynamic and responsive UI.
- **Efficient Storage**: Chroma integration for managing embeddings and metadata.

## Tech Stack

### Backend

- **LLAMA**: Large Language Model for natural language understanding and generation.
- **Node.js**: JavaScript runtime for server-side execution.
- **Express**: Web framework for handling API requests.
- **MongoDB**: NoSQL database for data storage.
- **Chroma**: For managing embeddings and vector-based searches.

### Frontend

- **Angular**: Framework for building a dynamic and responsive web interface.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Installation

### Prerequisites

Ensure the following are installed on your system:

- **Node.js**
- **MongoDB**
- **Angular CLI**
- **Docker** with **ChromaDB** image

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmedm3377/Web-Based-RAG-Application.git
   cd rag-web-app
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Start MongoDB server.

5. Start ChromaDB server using docker.

6. Install Ollama

7. Set up environment variables:

   - Create a `.env` file in the `backend` directory.
   - Add the following variables:

     ```env
     PORT=3000
     MONGO_URI=mongodb://localhost:27017/rag-app

     ```

8. Start the backend:

   ```bash
   cd backend
   npx tsx watch src/app.ts
   ```

9. Start the frontend:

   ```bash
   cd frontend
   ng serve
   ```

10. Open the application in your browser at `http://localhost:4200`.

## Project Structure

```
final-project-MWA
├
├─ backend
│  ├─ .env
│  ├─ docker-compose.yml
│  ├─ Makefile
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  ├─ app.ts
│  │  ├─ common
│  │  │  ├─ common.ts
│  │  │  └─ errors.ts
│  │  ├─ controllers
│  │  │  ├─ chatController.ts
│  │  │  ├─ docController.ts
│  │  │  ├─ helpers
│  │  │  │  └─ docHelper.ts
│  │  │  └─ userController.ts
│  │  ├─ db
│  │  │  └─ mongo.ts
│  │  ├─ models
│  │  │  ├─ document.ts
│  │  │  ├─ history.ts
│  │  │  └─ user.ts
│  │  ├─ README.md
│  │  ├─ routes
│  │  │  ├─ documents.ts
│  │  │  └─ users.ts
│  │  ├─ test
│  │  │  ├─ updoads.test.http
│  │  │  └─ users.test.http
│  │  └─ utils
│  │     └─ auth.ts
│  ├─ tsconfig.json
│  └─ types
│     └─ express
│        └─ index.d.ts
├─ Frontend
│  ├─ .editorconfig
│  ├─ .gitignore
│  ├─ .vscode
│  │  ├─ extensions.json
│  │  ├─ launch.json
│  │  └─ tasks.json
│  ├─ angular.json
│  ├─ environments
│  │  └─ environment.development.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ favicon.ico
│  ├─ README.md
│  ├─ src
│  │  ├─ app
│  │  │  ├─ add-token.interceptor.ts
│  │  │  ├─ app.component.ts
│  │  │  ├─ app.config.ts
│  │  │  ├─ auth-guard.service.ts
│  │  │  ├─ chatting
│  │  │  │  ├─ chat.component.ts
│  │  │  │  ├─ chat.service.ts
│  │  │  │  ├─ prompt.component.ts
│  │  │  │  └─ upload.component.ts
│  │  │  ├─ home.component.ts
│  │  │  └─ Users
│  │  │     ├─ signin.component.ts
│  │  │     ├─ signup.component.ts
│  │  │     ├─ user.service.ts
│  │  │     └─ userType.ts
│  │  ├─ index.html
│  │  ├─ main.ts
│  │  └─ styles.css
│  ├─ tailwind.config.js
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  └─ tsconfig.spec.json
└─ README.md

```
