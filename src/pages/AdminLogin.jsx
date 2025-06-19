import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateFields = () => {
    const errors = {};
    if (!form.username.trim()) {
      errors.username = 'Username is required';
    } else if (form.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    setSubmitError('');
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 tracking-tight">
          🔐 Admin Panel Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition ${
                fieldErrors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              autoComplete="off"
            />
            {fieldErrors.username && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition ${
                fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              autoComplete="off"
            />
            {fieldErrors.password && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {submitError && (
            <div className="text-red-500 text-sm text-center font-medium animate-pulse">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition duration-300 shadow-md"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 EventHub Admin Panel. All rights reserved.
        </p>
      </div>
    </div>
  );
}
