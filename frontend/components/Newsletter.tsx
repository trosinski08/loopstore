import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    
    setStatus('loading');
    
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
      const response = await fetch(`${baseApiUrl}/newsletter/subscribe/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing to our newsletter!');
        setEmail('');
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data.detail || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our newsletter to receive updates on new arrivals, special offers, and sustainable fashion tips.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {status === 'success' && (
            <p className="mt-4 text-green-600">{message}</p>
          )}
          
          {status === 'error' && (
            <p className="mt-4 text-red-600">{message}</p>
          )}
          
          <p className="mt-4 text-sm text-gray-500">
            We respect your privacy. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
