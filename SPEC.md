# AI Mystery Room

## 1. Project Overview

### 1.1 Project Description

AI Mystery Room is an AI-powered mystery investigation web application.

Users can enter a short story or scenario, and the AI generates a fictional mystery case based on it. The case includes a storyline, suspects, a hidden culprit, and different types of evidence.

Users investigate the case by examining the evidence, discovering clues, and requesting hints. Finally, they select the person they believe is responsible.

The application reveals the actual culprit along with the explanation of the mystery.

### 1.2 Project Objective

The main objective is to create an interactive mystery-solving experience where users can investigate AI-generated cases and identify the culprit using the available evidence.

### 1.3 Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js and Express.js
- **Database:** MongoDB
- **AI Integration:** Google Gemini API
- **Architecture:** MERN Stack
## 2. Core Features

### 2.1 Mystery Creation

- Users can enter a short story or scenario.
- Users can select a difficulty level: Easy, Medium, or Hard.
- The AI generates a fictional mystery case based on the user's input.
- Each mystery includes a storyline, suspects, clues, and a hidden culprit.

### 2.2 AI-Generated Evidence

The application generates evidence related to the mystery, including:

- WhatsApp-style messages and conversations.
- Images related to the investigation.
- CCTV-style recordings or visual evidence.
- Other relevant clues that help users investigate the case.

### 2.3 Investigation

- Users can read the mystery story.
- Users can explore the suspects and their details.
- Users can examine the available evidence.
- Users can discover clues and connect information to understand the case.

### 2.4 Hint System

- Users can request hints when they need help.
- Hints guide users without directly revealing the culprit.
- The number of available hints depends on the difficulty level.

### 2.5 Culprit Selection

- Users can select the suspect they believe is responsible.
- Users can submit their final accusation.
- The backend checks whether the selected suspect is correct.

### 2.6 Results and Scoring

- The application displays whether the accusation is correct.
- The actual culprit and mystery explanation are revealed.
- Users receive a score based on their performance.
- Users can start a new mystery.
## 3. User Flow

The application follows this sequence:

### Step 1: Open Website
- The user opens the AI Mystery Room website.
- The home page displays the project introduction and a Start Mystery button.

### Step 2: Create Mystery
- The user enters a short story or scenario.
- The user selects a difficulty level: Easy, Medium, or Hard.
- The user clicks Generate Mystery.

### Step 3: AI Generates Mystery
- The backend sends the user's scenario to the Gemini API.
- Gemini generates a fictional investigation.
- The generated case includes the story, suspects, clues, evidence, and hidden culprit.
- The application displays the generated mystery.

### Step 4: Investigate the Case
- The user enters the Investigation Room.
- The user explores the suspects and their details.
- The user examines the available evidence, including messages, images, and CCTV-style content.
- The user discovers clues and connects the evidence.

### Step 5: Request Hints
- The user can request hints if needed.
- The application provides hints without directly revealing the culprit.

### Step 6: Submit Accusation
- The user selects the suspect they believe is responsible.
- The user submits their final accusation.

### Step 7: Display Results
- The application checks the accusation.
- The actual culprit is revealed.
- The application displays the explanation and final score.

### Step 8: Start Another Mystery
- The user can start a new mystery with another scenario.
## 4. Application Pages

The application will contain the following main pages:

### 4.1 Home Page

- Display the application name: AI Mystery Room.
- Show a short introduction about the game.
- Include a Start Mystery button.
- Provide a simple and attractive interface.

### 4.2 Create Mystery Page

- Provide a text area for entering a story or scenario.
- Allow users to select the difficulty level: Easy, Medium, or Hard.
- Include a Generate Mystery button.
- Display a loading indicator while the AI generates the case.

### 4.3 Investigation Room

- Display the generated mystery title and storyline.
- Show all suspects with their names and descriptions.
- Display the available evidence, including messages, images, and CCTV-style content.
- Allow users to discover clues.
- Include an option to request hints.
- Show investigation progress.

### 4.4 Accusation Page

- Display the list of suspects.
- Allow users to select one suspect as the culprit.
- Include a Submit Accusation button.

### 4.5 Results Page

- Display whether the user's accusation was correct or incorrect.
- Reveal the actual culprit.
- Show the explanation of the mystery.
- Display the final score.
- Include a Play Again button.

### 4.6 General UI Requirements

- The website must be responsive on desktop, tablet, and mobile.
- Include loading indicators during AI generation.
- Display clear error messages when something goes wrong.
- Provide easy navigation between the pages.
## 5. Technology Stack

### 5.1 Frontend

- React.js – Build the user interface.
- Vite – Frontend development and build tool.
- Tailwind CSS – Style the application.
- React Router DOM – Handle page navigation.
- Axios – Communicate with the backend APIs.

### 5.2 Backend

- Node.js – Backend JavaScript runtime.
- Express.js – Create backend APIs and handle application requests.

### 5.3 Database

- MongoDB – Store mystery cases and investigation data.
- Mongoose – Manage database models and operations.

### 5.4 AI Integration

- Google Gemini API – Generate mystery stories, suspects, clues, hints, and evidence content.
- Google GenAI SDK – Connect the backend with Gemini.

### 5.5 Validation and Configuration

- Zod – Validate AI-generated data and API inputs.
- dotenv – Manage environment variables.
- CORS – Allow communication between frontend and backend.

### 5.6 Development Tools

- Visual Studio Code – Code editor.
- Git and GitHub – Version control and project repository.
- Codex – AI coding assistant for implementing the specification.
## 6. Backend API Structure

The backend will provide REST API endpoints to manage mystery cases and investigation activities.

### 6.1 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/cases | Generate a new mystery case |
| GET | /api/cases/:id | Retrieve a mystery case |
| POST | /api/cases/:id/clues/:clueId/discover | Mark a clue as discovered |
| POST | /api/cases/:id/hints | Request a hint |
| POST | /api/cases/:id/accuse | Submit the user's accusation |
| GET | /api/cases/:id/result | Retrieve the final result |

### 6.2 API Responsibilities

- Validate user input before generating a mystery.
- Send the scenario and difficulty to Gemini.
- Validate the AI-generated mystery before saving it.
- Store mystery data in MongoDB.
- Retrieve case information for the investigation room.
- Track discovered clues and used hints.
- Check the submitted accusation.
- Calculate the final score on the backend.
- Return the result to the frontend.

### 6.3 Security Requirements

- Keep the Gemini API key on the backend.
- Never expose the actual culprit or final solution before the accusation.
- Validate all incoming API requests.
- Do not allow users to modify their scores directly.
## 7. Database Design

The application will use MongoDB to store mystery cases and investigation progress.

### 7.1 Mystery Case

Each mystery case should contain:

- Case ID
- Mystery title
- Original user-provided scenario
- Mystery description
- Difficulty level
- List of suspects
- List of evidence
- List of clues
- Creation date
- Case status

### 7.2 Suspect Information

Each suspect should contain:

- Suspect ID
- Name
- Age
- Description
- Background information
- Relationship to the mystery

### 7.3 Evidence Information

Each evidence item should contain:

- Evidence ID
- Evidence title
- Evidence type
- Evidence description or content
- Related suspect, if applicable
- Related clues
- Media URL, if applicable

Evidence types include:
- WhatsApp-style conversations
- Images
- CCTV-style recordings or visual evidence
- Other investigation documents

### 7.4 Clue Information

Each clue should contain:

- Clue ID
- Clue title
- Clue description
- Related evidence ID
- Discovery status

### 7.5 Investigation Progress

The application should track:

- Discovered clues
- Used hints
- Submitted accusation
- Final score
- Investigation status

### 7.6 Private Solution

The actual culprit and complete mystery solution must be stored securely on the backend.

This information must never be included in the public case response before the user submits an accusation.
## 8. AI Mystery Generation

### 8.1 Mystery Generation Process

- The user submits a short story or scenario and selects a difficulty level.
- The backend sends the input to the Google Gemini API.
- Gemini generates a complete fictional mystery investigation.
- The backend validates the generated response before storing it in MongoDB.
- The generated mystery is then displayed in the Investigation Room.

### 8.2 AI-Generated Content

Gemini should generate:

- Mystery title and storyline.
- Investigation background.
- Suspects and their descriptions.
- One actual culprit.
- A logical sequence of events.
- Evidence related to the investigation.
- Clues hidden within the evidence.
- Hints for the player.
- Final explanation of the mystery.

### 8.3 Mystery Consistency

- Each mystery must have exactly one culprit.
- The evidence must support the actual solution.
- Suspect information must remain consistent throughout the case.
- Clues must be logically connected to the storyline.
- The mystery must have a clear and explainable solution.

### 8.4 Structured AI Response

- Gemini should return the generated mystery in structured JSON format.
- The backend must validate the JSON before saving it.
- Invalid or incomplete responses must be handled safely.
- The actual culprit and final solution must remain private on the backend until the accusation is submitted.

### 8.5 Evidence Media Generation

- Gemini will generate the text and content for fictional evidence.
- Images should be generated using a compatible image-generation service.
- CCTV-style evidence can use generated video if a suitable service is available.
- If video generation is unavailable, use AI-generated still images with timestamps to represent CCTV footage.
- All evidence must be fictional and relevant to the mystery.
## 9. Difficulty Levels and Scoring System

### 9.1 Difficulty Levels

The application will provide three difficulty levels.

| Feature | Easy | Medium | Hard |
|---|---:|---:|---:|
| Number of Suspects | 3 | 4 | 5 |
| Number of Clues | 5 | 7 | 9 |
| Available Hints | 2 | 3 | 3 |
| Correct Accusation Points | 100 | 150 | 200 |

### 9.2 Scoring Rules

The player's final score will be calculated using the following rules:

- Correct accusation: Award points based on the selected difficulty.
- Each discovered clue: +5 points.
- Each hint used: -10 points.
- Minimum possible score: 0 points.

### 9.3 Score Calculation

Final Score = Correct Accusation Points + Clue Points - Hint Penalties

If the accusation is incorrect, the player receives no correct accusation points.

The final score must never be below zero.

### 9.4 Scoring Validation

- Calculate scores on the backend.
- Do not allow users to modify their scores.
- Count each discovered clue only once.
- Count each used hint only once.
- Display the final score on the Results Page.
## 10. Error Handling and Validation

### 10.1 User Input Validation

- The scenario field must not be empty.
- The application must reject invalid or excessively long inputs.
- A difficulty level must be selected before generating a mystery.
- Invalid inputs must display clear error messages.

### 10.2 AI Generation Errors

- Handle Gemini API failures.
- Handle empty, incomplete, or invalid AI responses.
- Validate generated mystery data before saving it.
- Display an appropriate message if mystery generation fails.
- Allow the user to try generating the mystery again.

### 10.3 Database Errors

- Handle MongoDB connection failures.
- Display an appropriate error if a mystery cannot be saved or retrieved.
- Handle requests for mystery cases that do not exist.

### 10.4 API Errors

- Validate incoming API requests.
- Return appropriate HTTP status codes.
- Provide clear error messages to the frontend.
- Prevent invalid requests from affecting stored data.

### 10.5 User Experience

- Show loading indicators during mystery generation.
- Disable repeated submissions while a request is processing.
- Display helpful error messages instead of blank screens.
- Ensure the application remains usable when an operation fails.
## 11. Security Requirements

### 11.1 API Key Protection

- Store the Gemini API key in the backend environment variables.
- Never expose API keys in frontend code.
- Do not upload `.env` files or secret credentials to GitHub.

### 11.2 Mystery Solution Protection

- Store the actual culprit and final solution securely on the backend.
- Never send the hidden solution to the frontend before the accusation.
- Only reveal the solution after the user submits an accusation.

### 11.3 Data Validation

- Validate user inputs before processing requests.
- Validate AI-generated responses before storing them.
- Prevent unauthorized changes to mystery data and scores.

### 11.4 API Security

- Handle invalid API requests safely.
- Use appropriate CORS configuration.
- Avoid exposing sensitive backend information in error messages.
## 12. Testing Requirements

### 12.1 Mystery Generation Testing

- Test mystery generation using different user-provided scenarios.
- Verify that all three difficulty levels generate the correct number of suspects and clues.
- Ensure every mystery has exactly one culprit.
- Verify that the generated mystery has a logical and consistent storyline.

### 12.2 Investigation Testing

- Check whether all suspects and evidence are displayed correctly.
- Verify that users can examine evidence and discover clues.
- Check whether the hint system works correctly.
- Ensure the available hint limit is respected.

### 12.3 Accusation and Scoring Testing

- Test both correct and incorrect accusations.
- Verify that the actual culprit is revealed only after submission.
- Check whether the scoring rules are applied correctly.
- Ensure clues and hints are not counted more than once.

### 12.4 Backend and Database Testing

- Verify that API endpoints work correctly.
- Check whether mystery cases are saved and retrieved from MongoDB.
- Test invalid inputs and missing case IDs.
- Verify that API errors are handled properly.

### 12.5 Final Application Testing

- Test the complete user journey from creating a mystery to viewing the results.
- Check the application on desktop and mobile screen sizes.
- Verify that loading indicators and error messages work correctly.
## 13. Deployment Requirements

### 13.1 Frontend Deployment

- Deploy the React frontend using Vercel.
- Ensure the deployed website is accessible through a public URL.
- Configure the frontend to communicate with the deployed backend.

### 13.2 Backend Deployment

- Deploy the Node.js and Express.js backend using a suitable hosting platform.
- Configure the required environment variables.
- Ensure the backend APIs are accessible to the frontend.

### 13.3 Database Deployment

- Use MongoDB Atlas for cloud database hosting.
- Configure the database connection securely.
- Verify that mystery cases can be saved and retrieved.

### 13.4 Final Verification

- Test the deployed website.
- Verify Gemini API integration.
- Test the complete mystery creation and investigation process.
- Ensure all major features work correctly after deployment.
## 14. Project Acceptance Criteria

The project will be considered complete when the following requirements are satisfied:

### 14.1 Core Functionality

- Users can enter their own mystery scenario.
- Users can select Easy, Medium, or Hard difficulty.
- Gemini successfully generates a mystery based on the submitted scenario.
- The generated mystery contains suspects, clues, evidence, and one hidden culprit.
- Users can investigate the case and examine the evidence.
- Users can request hints within the allowed limit.
- Users can submit an accusation.
- The application reveals the culprit and final explanation after submission.

### 14.2 Scoring

- Correct accusations receive the appropriate difficulty-based points.
- Discovered clues and used hints affect the final score correctly.
- The minimum score is zero.

### 14.3 Technical Requirements

- React frontend communicates successfully with the Express backend.
- Gemini API integration works correctly.
- MongoDB stores and retrieves mystery cases.
- The hidden solution remains protected until the accusation is submitted.
- Loading states and error handling work correctly.

### 14.4 Final Delivery

- The application runs successfully.
- The complete mystery-solving flow works.
- The website is deployed and accessible through a public URL.
- The source code is available in a GitHub repository.
## 15. Project Structure

The project will follow a standard MERN stack folder structure.

AI-Mystery-Room/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── SPEC.md
└── README.md

### 15.1 Folder Responsibilities

- **client:** Contains the React frontend.
- **components:** Reusable UI components.
- **pages:** Application pages.
- **services:** Frontend API communication.
- **server:** Contains the Node.js and Express backend.
- **config:** Database and application configuration.
- **controllers:** Handle API request logic.
- **models:** MongoDB data models.
- **routes:** Define backend API endpoints.
- **services:** Handle Gemini integration and mystery generation.
- **middleware:** Handle validation and error management.

### 15.2 Project Organization

- Keep frontend and backend code separate.
- Use reusable components wherever appropriate.
- Keep API logic separate from UI components.
- Store sensitive configuration in environment variables.
- Maintain readable and organized code.
## 16. Development Guidelines

### 16.1 Follow the Specification

- Read the complete SPEC.md before starting development.
- Treat SPEC.md as the single source of truth.
- Follow the defined features, user flow, technology stack, and requirements.
- Do not introduce unnecessary features or technologies.

### 16.2 Code Quality

- Write clean, readable, and maintainable code.
- Use reusable React components.
- Keep frontend and backend logic separate.
- Follow a consistent folder structure.
- Avoid unnecessary code duplication.

### 16.3 Implementation

- Build the frontend and backend according to the specification.
- Connect the React frontend with the Express backend.
- Integrate the Gemini API through the backend.
- Connect MongoDB for storing mystery cases.
- Implement and test the main features before adding optional improvements.

### 16.4 Error Handling

- Handle API, database, and AI generation errors.
- Display meaningful error messages.
- Prevent application crashes caused by invalid responses.

### 16.5 Final Verification

- Test the complete user journey.
- Verify that all core features work.
- Ensure the hidden solution is protected.
- Fix major bugs before deployment.
## 17. Project Scope and Limitations

### 17.1 Project Scope

The first version of AI Mystery Room will focus on delivering a complete mystery-solving experience.

The main features include:

- Scenario-based mystery generation using Gemini.
- Three difficulty levels.
- AI-generated storylines, suspects, clues, and hints.
- Different types of fictional investigation evidence.
- Evidence examination and clue discovery.
- Culprit selection and accusation.
- Result explanation and scoring.
- MongoDB database integration.

### 17.2 Limitations

- The application will focus on a single-player experience.
- User registration and login are not required for the initial version.
- Actual AI-generated images or videos may require additional media-generation services.
- If video generation is unavailable, CCTV-style evidence can be represented using images and timestamps.
- The application will prioritize the core mystery-solving experience over optional features.

### 17.3 Development Priority

1. Complete the frontend and backend.
2. Integrate Gemini mystery generation.
3. Implement investigation and evidence features.
4. Implement hints, accusations, and scoring.
5. Connect MongoDB.
6. Test and deploy the application.
## 18. Environment Configuration

The backend will use environment variables to manage sensitive information and application settings.

### 18.1 Environment Variables

Create a `.env` file inside the server folder with the following variables:

- PORT=5000
- MONGODB_URI=your_mongodb_connection_string
- GEMINI_API_KEY=your_gemini_api_key
- CLIENT_URL=http://localhost:5173

### 18.2 Configuration Requirements

- Use dotenv to load environment variables.
- Never hardcode API keys or database credentials.
- Keep the `.env` file inside the server folder.
- Add `.env` to `.gitignore`.
- Provide a `.env.example` file containing placeholder values.
- Validate required environment variables when starting the backend.
## 19. Final Deliverables

The completed project must include:

### 19.1 Source Code
- Complete React frontend.
- Complete Node.js and Express backend.
- MongoDB database integration.
- Gemini API integration.
- Organized project folder structure.

### 19.2 Documentation
- Final SPEC.md file.
- README.md containing project description and setup instructions.

### 19.3 Working Application
- Functional mystery creation.
- AI-generated investigation and evidence.
- Working clue discovery and hint system.
- Functional culprit selection.
- Result explanation and scoring.

### 19.4 Submission
- GitHub repository containing the source code.
- Live deployed website URL.
- Successful demonstration of the mystery-solving experience.