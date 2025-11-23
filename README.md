EmotionCapture

A real-time face emotion detection web application built with MERN Stack, Vite, Tailwind CSS, and face-api.js.
EmotionCapture uses the user’s webcam to detect emotions live and provides personalized music and exercise/wellness suggestions based on the detected emotion.

📌 Table of Contents

Overview

Features

Tech Stack

Folder Structure

Setup Instructions

Running the Project

API Endpoints

How EmotionCapture Works

Supported Emotions

Screenshots

Future Enhancements

License

🚀 Overview

EmotionCapture is a modern, interactive, full-stack facial emotion recognition system.
Using a browser-based ML model, the application identifies user emotions in real-time and instantly provides wellness-based suggestions like relaxing music or quick exercises.

The project focuses on:

Fast performance (Vite + face-api.js)

Clean UI (Tailwind CSS)

Scalable backend (Express + MongoDB)

Real-time camera-based emotion Recognization

🌟 Features
Real-Time Emotion Detection

Detects emotions using face-api.js in the browser

Emotions: happy, sad, angry, fearful, surprised, neutral

Draws bounding box around detected face

Displays confidence percentage

Smart Recommendation System

Suggests YouTube/Spotify music

Suggests exercise/wellness routines

Emotion-based rule mapping

Modern UI

Responsive interface using Tailwind CSS

Live camera feed

Clean cards and layout

Smooth experience powered by Vite

Backend Integration

Logs emotions to MongoDB

Provides music & exercise suggestions

REST API built with Express.js

🛠 Tech Stack
Frontend

React (Vite)

Tailwind CSS

face-api.js

Axios

Backend

Node.js

Express.js

MongoDB + Mongoose

dotenv

CORS

📁 Folder Structure
EmotionCapture/
├── client/
│   ├── public/
│   │   └── models/        # face-api.js model files
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── server/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── server.js
    ├── .env
    └── package.json

🔧 Setup Instructions
Step 1 — Clone the repository
git clone <YOUR_REPO_URL>
cd EmotionCapture

Step 2 — Install dependencies
Client
cd client
npm install

Server
cd server
npm install

🧩 Environment Variables

Inside server/.env, add:

MONGO_URI=mongodb://localhost:27017/emotioncapture
PORT=5000

🤖 Download face-api.js Models

Create this folder:

client/public/models/


Download the following models from the official face-api.js GitHub repository:

tiny_face_detector_model-weights_manifest.json

face_expression_model-weights_manifest.json

Binary files associated with them

Place them inside client/public/models/.

▶️ Running the Project
Start Backend
cd server
npm run dev


Runs at:

http://localhost:5000

Start Frontend
cd client
npm run dev


Runs at:

http://localhost:5173


Allow camera access when prompted.

📡 API Endpoints
Emotion Logging
POST /api/emotion/add
Body: { emotion: "", score: 0, timestamp: "" }

Music Suggestions
GET /api/suggestions/music/:emotion

Exercise Suggestions
GET /api/suggestions/exercise/:emotion

🔍 How EmotionCapture Works
Frontend Workflow

User opens the application

Camera feed activates

face-api.js detects the face

Expression model identifies the dominant emotion

UI displays the results

Emotion is logged to backend

Application shows music & exercise suggestions

Backend Workflow

Receives emotion logs

Stores them in MongoDB

Returns customized suggestions

😀 Supported Emotions

Happy

Sad

Angry

Neutral

Fearful

Surprised

Disgusted

🖼 Screenshots (Replace with real assets)
/assets/EmotionCapture_Logo.png  
/assets/EmotionCapture_Banner.png  
/assets/UI_Screenshot_1.png  
/assets/UI_Screenshot_2.png  

🔮 Future Enhancements

Spotify API integration

Advanced ML model for higher accuracy

User authentication system

Emotion history graphs

Mobile app version

AI chatbot for emotional support

📄 License

This project is released under the MIT License.
Feel free to use, modify, and distribute.
