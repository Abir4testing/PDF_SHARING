# PDF Sharing Web Application

A Next.js web application that allows administrators to upload PDFs with unique usernames and enables users to search and view PDFs by username.

## Features

- Admin can upload PDFs with unique usernames
- Users can search for PDFs by username
- Modern, responsive UI built with Tailwind CSS
- Secure file handling and storage

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

### Admin Upload
1. Click on "Admin Upload" on the home page
2. Enter a unique username
3. Select a PDF file
4. Click "Upload PDF"

### User Search
1. Click on "User Search" on the home page
2. Enter the username
3. Click "Search"
4. View and download available PDFs

## Project Structure

- `/src/app/page.tsx` - Home page
- `/src/app/upload/page.tsx` - Admin upload page
- `/src/app/search/page.tsx` - User search page
- `/src/app/api/upload/route.ts` - Upload API endpoint
- `/src/app/api/search/route.ts` - Search API endpoint
- `/public/uploads/` - PDF storage directory
