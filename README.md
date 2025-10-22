<<<<<<< HEAD
# Cv-Match-generator-Frontend
=======
# CV Matching Frontend

This is the frontend application for the CV Matching System, a powerful AI-driven application that matches candidates with job offers using advanced natural language processing and machine learning techniques.

## Features

- Candidate management with automatic skill extraction
- Job offer management with intelligent skill requirements analysis
- AI-powered matching between candidates and job offers
- Detailed match results with skill analysis and recommendations
- Statistics and analytics dashboard
- Modern and responsive UI built with React and Material UI

## Technologies Used

- React 18
- TypeScript
- Material UI
- React Router
- Axios for API communication
- Chart.js for data visualization

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Backend API running (see backend repository)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser

### Configuration

The application is configured to connect to the backend API at `http://localhost:8000`. If your backend is running on a different URL, update the `API_URL` constant in `src/services/api.ts`.

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Application pages and views
- `src/services`: API communication services
- `src/types`: TypeScript type definitions
- `src/utils`: Utility functions
- `src/assets`: Static assets like images

## Backend Integration

This frontend application is designed to work with the CV Matching Backend API. Make sure the backend server is running before using this application.

## License

This project is licensed under the MIT License.
>>>>>>> 265ab49 (Initial Commit - Frontend React Cv Match)
