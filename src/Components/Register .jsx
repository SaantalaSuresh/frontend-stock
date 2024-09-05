import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/auth/register', { name, email, password });
            
            // Show success message and redirect if registration is successful
            if (response.status === 201) {
                toast.success('Registration successful');
                setTimeout(() => {
                    navigate('/login');  // Navigate after a brief delay for better UX
                }, 1500);
            } else {
                // Handle cases where registration was not successful
                toast.warning(response.data.message || 'Unexpected response from server');
            }

        } catch (error) {
            console.error("Register error", error);
            
            // Show appropriate error messages based on the error response
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || 'Registration failed');
            } else {
                toast.error('Registration failed due to network or server error');
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4" style={{ width: '22rem' }}>
                <h3 className="text-center">Register</h3>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label>Name</label>
                        <input 
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                    <button className="btn btn-primary w-100" type="submit">Register</button>
                    <div className="text-center mt-3">or</div>
                    <button className="btn btn-danger w-100 my-2">Register with Google</button>
                    <button className="btn btn-primary w-100">Register with Facebook</button>
                </form>
                <div className="text-center mt-3">
                    Already have an account? <a href="/login">Login</a>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
