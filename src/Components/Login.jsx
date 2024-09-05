import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    // Redirect to home if token exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");  // Redirect to home if already logged in
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
            
            // Store the JWT token in local storage
            localStorage.setItem('token', response.data.token);  

            // Show success message and navigate to home
            toast.success(response.data.message);
            navigate('/');
        } catch (error) {
            console.error("Login error", error);
            
            // Show error message on invalid credentials
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Invalid email or password");
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4" style={{ width: '22rem' }}>
                <h3 className="text-center">Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label>Email</label>
                        <input 
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input 
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-primary w-100" type="submit">Login</button>
                    <div className="text-center mt-3">or</div>
                    <button className="btn btn-danger w-100 my-2">Login with Google</button>
                    <button className="btn btn-primary w-100">Login with Facebook</button>
                </form>
                <div className="text-center mt-3">
                    Don't have an account? <a href="/register">Register</a>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
