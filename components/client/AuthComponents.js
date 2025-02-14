import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import AvatarGallery from './AvatarGallery';
import { Search } from 'lucide-react';
import { countries } from 'countries-list';
// Free avatar options from DiceBear API
const getRandomAvatar = () => {
  const styles = ['adventurer', 'avataaars', 'bottts', 'initials'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${randomStyle}/svg`;
};

export function LoginDialog({ isOpen, onClose }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(getRandomAvatar());
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = '/ClientApi/auth';
      let method = 'POST';
      let body = { email, password };

      if (mode === 'signup') {
        method = 'PUT';
        body = { email, password, name, avatar };
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success(mode === 'login' ? 'Successfully logged in!' : 'Account created successfully!');
      login(data.user);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      
      if (!credentialResponse?.credential) {
        throw new Error('No credential received');
      }
  
      const res = await fetch('/ClientApi/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          credential: credentialResponse.credential 
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Google login failed');
      }
  
      toast.success('Successfully logged in with Google!');
      login(data.user);
      onClose();
      
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
          <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={(error) => {
    console.error('Google login error:', error);
    toast.error('Google login failed');
  }}
  theme="outline"
  shape="rectangular"
  size="large"
  useOneTap={false}
  flow="implicit"
/>
          </div>
        </div>

        <div className="mt-4 text-center text-sm">
          {mode === 'login' ? (
            <div>
              Dont have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-blue-600 hover:text-blue-500"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-500"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




export function ProfileDialog({ isOpen, onClose }) {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [country, setCountry] = useState(user?.country || '');
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);



  const countryList = Object.entries(countries).map(([code, country]) => ({
    code,
    name: country.name,
    native: country.native,
    phone: country.phone,
    continent: country.continent,
    capital: country.capital,
    currency: country.currency,
    languages: country.languages,
    emoji: country.emoji
  })).sort((a, b) => a.name.localeCompare(b.name));

  // Filter countries based on search
  const filteredCountries = countryList.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.native.toLowerCase().includes(countrySearch.toLowerCase())
  );


  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setCountry(user.country || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (showPasswordFields) {
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      if (!user?.isGoogle && !oldPassword) {
        toast.error('Please enter your current password');
        return;
      }
    }

    try {
      setLoading(true);
      
      if (showPasswordFields && newPassword) {
        if (user?.isGoogle) {
          const createPasswordRes = await fetch('/ClientApi/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword }),
          });

          if (!createPasswordRes.ok) {
            const data = await createPasswordRes.json();
            throw new Error(data.message || 'Failed to create password');
          }
        } else {
          const verifyRes = await fetch('/ClientApi/verify-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: oldPassword }),
          });

          if (!verifyRes.ok) {
            throw new Error('Current password is incorrect');
          }
        }
      }

      const updateRes = await fetch('/ClientApi/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          avatar, 
          country,
          newPassword: showPasswordFields ? newPassword : undefined 
        }),
      });

      const data = await updateRes.json();

      if (!updateRes.ok) {
        throw new Error(data.message);
      }

      updateUser(data.user);
      toast.success('Profile updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch('/ClientApi/auth/logout', { method: 'POST' });
      await logout();
      toast.success('Successfully logged out');
      onClose();
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg w-full max-w-md my-8">
          {/* Fixed header for better scrolling */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Profile Settings</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        {/* Content - Improved padding and spacing for mobile */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>







            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="relative">
                  <input
                    type="text"
                    value={country}
                    readOnly
                    onClick={() => setShowCountrySelect(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    placeholder="Select your country"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCountrySelect(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Country Selection Modal */}
              {showCountrySelect && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg w-full max-w-md">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search countries..."
                          className="w-full px-2 py-1 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCountry(c.name);
                            setShowCountrySelect(false);
                            setCountrySearch('');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 flex items-center gap-2"
                        >
                          <span className="text-xl">{c.emoji}</span>
                          <span>{c.name}</span>
                          <span className="text-gray-400 text-sm ml-auto">{c.code}</span>
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div className="px-4 py-2 text-gray-500 text-center">
                          No countries found
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCountrySelect(false);
                          setCountrySearch('');
                        }}
                        className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}








            {/* Avatar Section - Improved layout for small screens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
                  <img src={avatar} alt="Profile avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowAvatarGallery(true)}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors w-full sm:w-auto text-sm sm:text-base"
                  >
                    Choose Avatar
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatar(getRandomAvatar())}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors w-full sm:w-auto text-sm sm:text-base"
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>

            {/* Password Section - More compact on mobile */}
            <div className="space-y-3 sm:space-y-4">
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
              >
                {user?.isGoogle && !showPasswordFields 
                  ? 'Create Password'
                  : showPasswordFields 
                    ? 'Cancel Password Change' 
                    : 'Change Password'}
              </button>

              {showPasswordFields && (
                <div className="space-y-3 sm:space-y-4 border-t pt-3 sm:pt-4">
                  {!user?.isGoogle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {user?.isGoogle ? 'Create Password' : 'New Password'}
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Update Button - Better touch target on mobile */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 sm:py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          {/* Logout Button - Better touch target on mobile */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="mt-4 w-full px-4 py-2.5 sm:py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>

        {/* Avatar Gallery Modal */}
        {showAvatarGallery && (
          <AvatarGallery
            onSelect={setAvatar}
            onClose={() => setShowAvatarGallery(false)}
          />
        )}
      </div>
      </div>
      </div>

  );
}
