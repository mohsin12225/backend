import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { token, user } = useApp();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [usageData, setUsageData] = useState(null);

  useEffect(() => {
    // Fetch usage to populate custom key if exists
    fetch('http://localhost:5000/api/ai-teacher/usage', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => {
        setUsageData(data);
        if (data && data.hasCustomKey) {
          // It's a security best practice not to return the full key, 
          // but we'll show a placeholder indicating it's set
          setApiKey('************************************');
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSaving(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ customGroqApiKey: apiKey.trim() === '************************************' ? undefined : apiKey.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('Settings saved successfully!');
      
      // Update usage data ONLY on success
      setUsageData(prev => ({
        ...prev,
        hasCustomKey: true,
        customTokenLimit: 100000 // Explicitly set the 100k daily tokens for valid key
      }));

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your account preferences and API integrations.</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <i className="fas fa-key text-indigo-400"></i> Bring Your Own Key (BYOK)
        </h2>
        
        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
          Unlock higher usage limits by providing your own Groq API key. 
          Standard free users are limited to 15 messages per day. With your own key, 
          you get a budget of <strong className="text-indigo-400">100,000 tokens</strong> per day 
          (roughly 200 message points!).
        </p>

        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Groq API Key
            </label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-gray-900 border border-gray-700 focus:border-indigo-500 rounded-lg px-4 py-3 text-white text-sm focus:outline-none transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSaving || !apiKey.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
            Save Settings
          </button>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
              {message}
            </div>
          )}
        </form>
      </div>

      {usageData && usageData.hasCustomKey && (
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-2">Usage Statistics</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center bg-gray-900 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-400">Daily Token Limit</span>
              <span className="text-sm font-bold text-indigo-400">{usageData.customTokenLimit?.toLocaleString() || 100000}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-900 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-400">Tokens Used Today</span>
              <span className="text-sm font-bold text-white">{usageData.tokensUsed?.toLocaleString() || 0}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500 italic">
              * 100,000 tokens is roughly equivalent to 200 message points.
              Raw tokens are deducted based on exact usage.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
