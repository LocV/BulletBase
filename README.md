# BulletBase AI

A modern React application with Firebase authentication and data management.

## Features

- User Authentication (Sign up, Login, Logout)
- Protected Routes
- Firebase Integration
- Modern React with Hooks
- Responsive Design

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LocV/BulletBase.git
cd BulletBase
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase configuration:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Copy your Firebase config to `src/firebase/config.js`

4. Start the development server:
```bash
npm start
```

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard
│   ├── Login.js         # Login form
│   ├── SignUp.js        # Registration form
│   └── ProtectedRoute.js # Route protection
├── contexts/            # React contexts
│   └── AuthContext.js   # Authentication context
├── firebase/            # Firebase configuration
│   └── config.js        # Firebase setup
└── App.js              # Main application component
```

## Firebase Setup

This application uses Firebase for:
- Authentication
- Firestore Database
- Cloud Functions (optional)
- Data Connect (optional)

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
