import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="pt-20 min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-light tracking-tight uppercase mb-8 text-center">Sign In</h1>
        
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors"
              required
            />
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-col items-center space-y-4">
          <Link to="#" className="text-sm text-gray-500 hover:text-black hover:underline transition-all underline-offset-4">
            Forgot your password?
          </Link>
          <Link to="#" className="text-sm text-gray-500 hover:text-black hover:underline transition-all underline-offset-4">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
