import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../Services/Auth.service.js';
import { toast, Toaster } from 'react-hot-toast';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const userData = { fullname: fullName, username, email, password };
    try {
      const status = await registerUser(userData);
      if (status) {
        navigate('/'); 
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Home Navigation Trigger */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700/80 font-semibold font-outfit py-2 px-5 rounded-2xl shadow-md transition duration-300 transform hover:-translate-y-0.5 z-10"
      >
        Home
      </button>

      {/* Split Hero: Left Side Logo */}
      <div className="hidden lg:flex w-1/2 items-center justify-center border-r border-slate-900/60 p-12">
        <div className="relative group">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20 blur-[20px] group-hover:opacity-35 transition duration-700"></div>
          <div className="relative bg-slate-900/40 border border-slate-900/60 p-10 rounded-[36px] shadow-2xl flex items-center justify-center">
            <img 
              src="/dist/logo.png" 
              alt="Logo" 
              className="h-56 w-auto object-contain transform hover:scale-[1.02] transition-all duration-500" 
            />
          </div>
        </div>
      </div>

      {/* Split Form: Right Side Input Portal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 p-10 rounded-3xl shadow-2xl max-w-md w-full flex flex-col my-8">
          
          <h2 className="text-3xl font-extrabold font-outfit text-center bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-slate-400 font-outfit text-sm text-center mb-8 mt-1">Begin your developer journey today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="fullName"
                className="text-[12px] font-bold font-outfit text-slate-500 uppercase tracking-widest"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-900 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/20 text-slate-100 placeholder-slate-600 rounded-2xl focus:outline-none transition-all duration-300 font-medium"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="username"
                className="text-[12px] font-bold font-outfit text-slate-500 uppercase tracking-widest"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-900 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/20 text-slate-100 placeholder-slate-600 rounded-2xl focus:outline-none transition-all duration-300 font-medium"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="email"
                className="text-[12px] font-bold font-outfit text-slate-500 uppercase tracking-widest"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-900 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/20 text-slate-100 placeholder-slate-600 rounded-2xl focus:outline-none transition-all duration-300 font-medium"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="password"
                className="text-[12px] font-bold font-outfit text-slate-500 uppercase tracking-widest"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-900 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/20 text-slate-100 placeholder-slate-600 rounded-2xl focus:outline-none transition-all duration-300 font-medium"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-[12px] font-bold font-outfit text-slate-500 uppercase tracking-widest"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-900 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/20 text-slate-100 placeholder-slate-600 rounded-2xl focus:outline-none transition-all duration-300 font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 font-outfit font-semibold text-[15px] rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg ${
                isLoading
                  ? 'bg-slate-800 text-slate-500 border border-slate-900 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-orange-500/10 hover:shadow-orange-500/20'
              }`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-slate-500 font-outfit text-[14px] mt-6 border-t border-slate-900/60 pt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 font-bold hover:text-orange-300 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
