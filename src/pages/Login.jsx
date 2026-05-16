import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Successfully logged in!');
        navigate('/profile');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast.success('Successfully signed up! Please check your email to verify your account if required.');
        setIsLogin(true); // Switch to login view after signup
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-light tracking-tight uppercase mb-8 text-center">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>
        
        <form className="space-y-8" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors"
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors"
              required
            />
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-col items-center space-y-4">
          {isLogin && (
            <button type="button" className="text-sm text-gray-500 hover:text-black hover:underline transition-all underline-offset-4">
              Forgot your password?
            </button>
          )}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-black hover:underline transition-all underline-offset-4"
          >
            {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
