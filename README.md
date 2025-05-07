# Live Chat Application

A real-time chat application built with React, TypeScript, Socket.IO, and Tailwind CSS.

## Features

- Real-time messaging
- User join/leave notifications
- Modern and responsive UI
- Username-based identification
- Message timestamps

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository
2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

## Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the client:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Development

- The client runs on port 5173
- The server runs on port 3000
- The application uses Socket.IO for real-time communication
- Tailwind CSS is used for styling

## Building for Production

1. Build the server:
```bash
cd server
npm run build
```

2. Build the client:
```bash
cd client
npm run build
```

## License

MIT 