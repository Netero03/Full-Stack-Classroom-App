import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'Principal') {
        navigate('/principal-dashboard');
      } else if (user.role === 'Teacher') {
        navigate('/teacher-dashboard');
      } else if (user.role === 'Student') {
        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center text-center gap-5'>
      <h2 className='text-2xl'>Login to Classroom</h2>
      <form onSubmit={handleLogin} className='flex flex-col gap-2'>
        <input type="email" className='rounded p-2' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" className='rounded p-2' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <div>
        <h6>Login Id's</h6>
        <h5>Principal: principal@classroom.com - admin</h5>
        <h5>Teacher: teacher2@classroom.com - admin</h5>
        <h5>Student: student1@classroom.com - Admin</h5>
      </div>
    </div>
  );
};

export default Login;
