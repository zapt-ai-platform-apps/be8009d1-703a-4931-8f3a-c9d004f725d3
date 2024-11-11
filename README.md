# New App

## Overview

New App is an educational web application designed to enhance reading fluency and comprehension for students. It provides an interactive platform where teachers can upload texts via their camera, and students can access, read, and listen to these texts in an engaging, audio-assisted format.

## Features

### For Teachers:

1. **Secure Authentication:**
   - Sign in using email/password or social providers like Google, Facebook, and Apple.

2. **Upload Text via Camera:**
   - Capture images of text using the device camera.
   - Utilize OCR processing to convert images into editable text.
   - Preview and edit the processed text before saving.

3. **Manage Texts:**
   - Store and organize texts for student access.
   - Edit or delete existing texts.

### For Students:

1. **Secure Authentication:**
   - Sign in using email/password or social providers.

2. **Access Assigned Texts:**
   - View a list of texts uploaded by their teacher.
   - Select texts to read.

3. **Interactive Reading Experience:**
   - Read texts with synchronized text-to-speech (TTS) playback.
   - Highlight phrases or sentences as they are read aloud.
   - Tap on individual phrases to hear them.

## User Journeys

### Teacher Workflow:

1. **Sign In:**
   - Navigate to the login page.
   - Enter email and password or use a social login provider.
   - Upon successful login, access the Teacher Dashboard.

2. **Upload Text:**
   - Click on "Upload Text" in the dashboard.
   - Use the camera to capture an image of the text.
     - Allow camera permissions if prompted.
   - The app processes the image using OCR.
   - Preview and edit the extracted text.
   - Save the text, making it accessible to assigned students.

3. **Manage Texts:**
   - View a list of uploaded texts.
   - Edit or delete texts as needed.

### Student Workflow:

1. **Sign In:**
   - Navigate to the login page.
   - Enter email and password or use a social login provider.
   - Upon successful login, access the Student Dashboard.

2. **Read and Listen to Texts:**
   - View a list of available texts from their teacher.
   - Select a text to read.
   - Use the interactive reader to read the text.
     - Play/pause TTS playback of the entire text.
     - Tap on individual phrases to hear them.
     - See phrases highlighted as they are read aloud.

## External APIs and Services

- **Supabase:**
  - Used for user authentication and real-time data management.

- **ZAPT AI Backend via `createEvent`:**
  - **OCR Processing (`event_type: "ocr_request"`):**
    - Converts uploaded images to text.
  - **Text-to-Speech (`event_type: "text_to_speech"`):**
    - Generates audio from text for TTS playback.

## Environment Variables

The following environment variables are required:

- `VITE_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `VITE_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anonymous key.
- `VITE_PUBLIC_APP_ID`: Application ID for ZAPT services.
- `VITE_PUBLIC_SENTRY_DSN`: Sentry DSN for error logging.
- `VITE_PUBLIC_APP_ENV`: Application environment (e.g., production, development).

## Getting Started

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Run Development Server:**

   ```bash
   npm run dev
   ```

3. **Build for Production:**

   ```bash
   npm run build
   ```

## Additional Notes

- The app utilizes responsive design principles to ensure usability across desktops, tablets, and mobile devices.
- Error logging is integrated using Sentry for both frontend and backend.
- Ensure that all environment variables are properly set before running the application.
