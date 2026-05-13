'use client';

import { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';

interface CallControlsProps {
  onCallStarted: () => void;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function CallControls({ onCallStarted }: CallControlsProps) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: Toast['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits ? '+91' + digits : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/bland/create-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, lead_name: name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to start call');
      }

      showToast('success', `Call initiated to ${name}`);
      onCallStarted();
      setPhone('');
      setName('');
    } catch (err) {
      showToast(
        'error',
        err instanceof Error ? err.message : 'Unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-display text-accent-gold mb-1">
        Start Outbound Call
      </h2>
      <p className="text-xs text-slate-500 font-body mb-4">
        Meera will call the lead and qualify them across 4 checkpoints.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-bg-secondary flex-1 focus-within:border-accent-gold/50 transition-colors">
          <span className="px-3 text-slate-500 text-sm font-body select-none border-r border-border">
            +91
          </span>
          <input
            type="tel"
            placeholder="9876543210"
            value={phone.replace(/^\+91/, '')}
            onChange={handlePhoneChange}
            className="bg-transparent flex-1 py-2.5 px-3 text-slate-100 placeholder:text-slate-600 outline-none text-sm font-body"
            required
            maxLength={10}
          />
        </div>

        <input
          type="text"
          placeholder="Lead Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-bg-secondary border border-border rounded-lg px-3 py-2.5 text-slate-100 placeholder:text-slate-600 outline-none text-sm font-body flex-1 focus:border-accent-gold/50 transition-colors"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-accent-gold text-bg-primary font-semibold px-6 py-2.5 rounded-lg hover:bg-accent-warm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Phone size={16} />
          )}
          {loading ? 'Calling…' : 'Start Outbound Call'}
        </button>
      </form>

      {toast && (
        <div
          className={`mt-3 px-4 py-2.5 rounded-lg text-sm font-body ${
            toast.type === 'success'
              ? 'bg-green-900/40 text-green-400 border border-green-800/60'
              : 'bg-red-900/40 text-red-400 border border-red-800/60'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
