// ============================================================
// App.jsx — Root Component
// ============================================================
// Sets up routing and wraps the app in the AuthProvider.
//
// Route structure:
//   /login    — Public  — Login page
//   /signup   — Public  — Signup page
//   /boards   — Private — List of boards
//   /boards/:id — Private — Board detail (scrum board)
//   /         — Redirects to /boards
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BoardsPage from './pages/BoardsPage';
import BoardDetailPage from './pages/BoardDetailPage';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected routes — wrapped in PrivateRoute */}
                    <Route
                        path="/boards"
                        element={
                            <PrivateRoute>
                                <BoardsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/boards/:id"
                        element={
                            <PrivateRoute>
                                <BoardDetailPage />
                            </PrivateRoute>
                        }
                    />

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/boards" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
