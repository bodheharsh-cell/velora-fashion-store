import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="pt-24 min-h-screen px-4 max-w-7xl mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-light tracking-widest uppercase mb-8 border-b border-gray-100 pb-4">My Profile</h1>
        
        <div className="bg-gray-50 p-8 rounded-sm mb-8">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</p>
              <p className="text-base">{user?.email}</p>
            </div>
            {/* The role will be populated here later once we fetch the profile data */}
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="bg-black text-white px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
