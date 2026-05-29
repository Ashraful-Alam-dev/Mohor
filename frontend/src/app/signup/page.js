'use client';

import { useState } from 'react';
import { auth } from '@/config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', password: '' });
  const [otpCode, setOtpCode] = useState('');
  
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 
        size: 'invisible' 
      });
      
      const confirmation = await signInWithPhoneNumber(auth, formData.phone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setSuccessMessage('OTP successfully sent to your phone.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send OTP.');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const userCredential = await confirmationResult.confirm(otpCode);
      const firebaseToken = await userCredential.user.getIdToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseToken,
          name: formData.name,
          password: formData.password,
          address: formData.address,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Backend registration rejected.');
      }

      setSuccessMessage('Account registered successfully! You can now log in.');
    } catch (error) {
      setErrorMessage(error.message || 'Invalid verification code or server issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="w-full max-w-md p-8 bg-white border border-neutral-200/80 rounded-2xl shadow-sm">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-emerald-800 font-medium mt-1">Join to Mohor Community</p>
        </div>
        
        {errorMessage && (
          <div className="p-3.5 mb-5 text-sm font-medium text-red-800 bg-red-50 border border-red-100 rounded-xl animate-fade-in">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 mb-5 text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl animate-fade-in">
            {successMessage}
          </div>
        )}

        <div id="recaptcha-container"></div>

        {!confirmationResult ? (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">Full Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full p-3.5 border border-neutral-200 rounded-xl bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-sm" 
                placeholder="Mushfiq Mahin" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                required 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full p-3.5 border border-neutral-200 rounded-xl bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-sm" 
                placeholder="+8801XXXXXXXXX" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">Address</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="w-full p-3.5 border border-neutral-200 rounded-xl bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-sm" 
                placeholder="123 Main Street, Dhaka" 
                rows="2" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full p-3.5 border border-neutral-200 rounded-xl bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-sm" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3.5 px-4 rounded-xl transition duration-150 shadow-sm shadow-emerald-700/10 disabled:opacity-60 cursor-pointer text-sm tracking-wide mt-2"
            >
              {loading ? 'Sending Verification Code...' : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            <p className="text-sm font-medium text-neutral-700 text-center mb-2">
              Enter the 6-digit verification code
            </p>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">6-Digit OTP Code</label>
              <input 
                type="text" 
                required 
                value={otpCode} 
                onChange={(e) => setOtpCode(e.target.value)} 
                className="w-full p-3.5 border text-center tracking-widest text-2xl font-black rounded-xl bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all" 
                placeholder="000000" 
                maxLength="6" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-neutral-950 hover:bg-neutral-900 active:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition duration-150 disabled:opacity-60 cursor-pointer text-sm tracking-wide"
            >
              {loading ? 'Verifying Identity...' : 'Confirm & Complete Registration'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center text-sm font-medium text-neutral-600">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-700 hover:text-emerald-800 font-bold transition">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}