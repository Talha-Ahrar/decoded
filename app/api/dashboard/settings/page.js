'use client';

import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function AccountSettings() {
  const [mode, setMode] = useState('password'); // 'password' or 'email'
  const [step, setStep] = useState(1); // 1: verify old password, 2: update
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    newEmail: '',
  });
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
    };
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password: formData.oldPassword }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStep(2);
        toast.success('Password verified');
      } else {
        toast.error(data.error || 'Invalid password');
      }
    } catch (error) {
      toast.error('Failed to verify password');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (mode === 'password') {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const { isValid, requirements } = validatePassword(formData.newPassword);
      if (!isValid) {
        toast.error('Password does not meet requirements');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === 'password' ? '/api/auth/change-password' : '/api/auth/change-email';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(mode === 'password' ? {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        } : {
          oldPassword: formData.oldPassword,
          newEmail: formData.newEmail,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`${mode === 'password' ? 'Password' : 'Email'} updated successfully`);
        setStep(1);
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
          newEmail: '',
        });
      } else {
        toast.error(data.error || `Failed to update ${mode}`);
      }
    } catch (error) {
      toast.error(`Failed to update ${mode}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => { setMode('password'); setStep(1); }}
              className={`flex-1 py-2 px-4 rounded ${
                mode === 'password' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => { setMode('email'); setStep(1); }}
              className={`flex-1 py-2 px-4 rounded ${
                mode === 'email' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Change Email
            </button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={formData.oldPassword}
                  onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Verifying...' : 'Verify Password'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              {mode === 'password' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Password must contain:
                    <ul className="list-disc pl-5 mt-1">
                      <li>At least 8 characters</li>
                      <li>One uppercase letter</li>
                      <li>One lowercase letter</li>
                      <li>One number</li>
                      <li>One special character</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Email
                  </label>
                  <input
                    type="email"
                    value={formData.newEmail}
                    onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}