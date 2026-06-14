'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEARNING_PATHS } from './lib/paths';
import { AWS_STEPS, AZURE_STEPS, AWS_PHASES, AZURE_PHASES, type CloudPath } from './lib/steps';

type Status = 'pending' | 'validating' | 'passed' | 'failed';
type AuthInfo = { authenticated: boolean; accountName?: string };
type Screen = 'paths' | 'provider' | 'pipeline';
type OS = 'mac' | 'windows' | 'linux';

function detectOS(): OS {
  if (typeof navigator === 'undefined') return 'mac';
  const p = navigator.platform.toLowerCase();
  if (p.includes('mac')) return 'mac';
  if (p.includes('win')) return 'windows';
  return 'linux';
}

function getInstructions(instructions: string[] | { mac: string[]; windows: string[]; linux: string[] }, os: OS): string[] {
  if (Array.isArray(instructions)) return instructions;
  return instructions[os];
}

// ─── Loading Screen ───
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex items-center gap-2 text-blue-500">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <span className="text-sm font-medium">Loading...</span>
      </motion.div>
    </div>
  );
}

// ─── Learning Paths Home ───
function PathsScreen({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring' }} className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Learning Paths</h1>
          <p className="text-gray-500 mb-12 text-lg">Hands-on guided labs with real cloud validation checkpoints</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LEARNING_PATHS.map((path, i) => (
            <motion.button key={path.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06, type: 'spring', stiffness: 100 }} whileHover={path.available ? { y: -4, boxShadow: '0 12px 24px -8px rgba(59,130,246,0.15)' } : {}} whileTap={path.available ? { scale: 0.98 } : {}} disabled={!path.available} onClick={() => onSelect(path.id)} className={`text-left p-6 rounded-2xl border transition-all ${path.available ? 'border-blue-100 bg-white hover:border-blue-300 cursor-pointer shadow-sm' : 'border-gray-100 bg-gray-50/80 opacity-50 cursor-not-allowed'}`}>
              <div className="flex items-start gap-4">
                <motion.span initial={{ rotate: -10 }} animate={{ rotate: 0 }} transition={{ delay: 0.3 + i * 0.06 }} className="text-3xl">{path.icon}</motion.span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${path.available ? 'text-gray-900' : 'text-gray-500'}`}>{path.title}</h3>
                    {path.available && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-semibold">Active</span>}
                    {!path.available && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 font-medium">Coming Soon</span>}
                  </div>
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{path.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Provider Selection ───
function ProviderScreen({ onSelect, onBack }: { onSelect: (p: CloudPath) => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex flex-col items-center justify-center px-6 relative">
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onBack} className="absolute top-6 left-6 text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 transition font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        All Paths
      </motion.button>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 80 }} className="text-center">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-3xl font-bold text-gray-900 mb-2">Hyperscaler Data Pipelines</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-500 mb-12">Choose your cloud provider to begin</motion.p>
        <div className="flex gap-6">
          {[
            { id: 'aws' as CloudPath, label: 'AWS', sub: 'Kinesis · S3 · Glue · Athena', emoji: '🟠', gradient: 'from-orange-50 to-white hover:from-orange-100', border: 'border-orange-200 hover:border-orange-400' },
            { id: 'azure' as CloudPath, label: 'Azure', sub: 'Event Hubs · ADLS · Synapse', emoji: '🔵', gradient: 'from-blue-50 to-white hover:from-blue-100', border: 'border-blue-200 hover:border-blue-400' },
          ].map((p, i) => (
            <motion.button key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1, type: 'spring' }} whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.95 }} onClick={() => onSelect(p.id)} className={`w-56 p-8 rounded-2xl border-2 ${p.border} bg-gradient-to-b ${p.gradient} transition-all`}>
              <motion.span className="text-4xl block mb-3" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}>{p.emoji}</motion.span>
              <div className="text-xl font-bold text-gray-900 mb-1">{p.label}</div>
              <div className="text-xs text-gray-500">{p.sub}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main App ───
export default function Home() {
  const [screen, setScreen] = useState<Screen>('paths');
  const [provider, setProvider] = useState<CloudPath | null>(null);
  const [authInfo, setAuthInfo] = useState<AuthInfo>({ authenticated: false });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<Record<string, Status>>({});
  const [validationMessages, setValidationMessages] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [os, setOs] = useState<OS>('mac');

  useEffect(() => { setOs(detectOS()); }, []);

  // Load state from file DB on mount
  useEffect(() => {
    fetch('/api/state').then(r => r.json()).then(s => {
      if (s.screen) setScreen(s.screen);
      if (s.provider) setProvider(s.provider);
      if (s.currentStepIndex != null) setCurrentStepIndex(s.currentStepIndex);
      if (s.stepStatuses) setStepStatuses(s.stepStatuses);
      if (s.validationMessages) setValidationMessages(s.validationMessages);
      if (s.inputs) setInputs(s.inputs);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  // Save state to file DB on changes
  useEffect(() => {
    if (!loaded) return;
    fetch('/api/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ screen, provider, currentStepIndex, stepStatuses, validationMessages, inputs }) });
  }, [loaded, screen, provider, currentStepIndex, stepStatuses, validationMessages, inputs]);

  const steps = provider === 'aws' ? AWS_STEPS : AZURE_STEPS;
  const phases = provider === 'aws' ? AWS_PHASES : AZURE_PHASES;
  const step = steps[currentStepIndex] || steps[0];
  const passedCount = Object.values(stepStatuses).filter((s) => s === 'passed').length;
  const progress = steps.length ? (passedCount / steps.length) * 100 : 0;
  const status = (id: string): Status => stepStatuses[id] || 'pending';

  const checkAuth = useCallback(async () => {
    if (!provider) return;
    try {
      const res = await fetch(`/api/auth-status?provider=${provider}`);
      const data = await res.json();
      setAuthInfo(data);
    } catch { setAuthInfo({ authenticated: false }); }
  }, [provider]);

  useEffect(() => { checkAuth(); const t = setInterval(checkAuth, 30000); return () => clearInterval(t); }, [checkAuth]);

  async function handleValidate() {
    const value = inputs[step.id] || '';
    if (!value.trim() && step.resourceLabel) return;
    setStepStatuses((s) => ({ ...s, [step.id]: 'validating' }));
    setValidationMessages((m) => ({ ...m, [step.id]: '' }));
    try {
      const res = await fetch(step.validateEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resourceName: value, region: provider === 'aws' ? 'us-east-1' : 'eastus2' }) });
      const data = await res.json();
      setStepStatuses((s) => ({ ...s, [step.id]: data.success ? 'passed' : 'failed' }));
      setValidationMessages((m) => ({ ...m, [step.id]: data.message }));
      if (data.success) checkAuth();
    } catch (e: any) {
      setStepStatuses((s) => ({ ...s, [step.id]: 'failed' }));
      setValidationMessages((m) => ({ ...m, [step.id]: e.message || 'Error' }));
    }
  }

  // Show loading while fetching saved state
  if (!loaded) return <LoadingScreen />;

  // Routing
  if (screen === 'paths') return <PathsScreen onSelect={() => setScreen('provider')} />;
  if (screen === 'provider') return <ProviderScreen onSelect={(p) => { if (p !== provider) { setStepStatuses({}); setInputs({}); setValidationMessages({}); setCurrentStepIndex(0); } setProvider(p); setScreen('pipeline'); }} onBack={() => setScreen('paths')} />;

  // ─── Pipeline Flow ───
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Header */}
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center px-5 py-3 bg-white border-b border-gray-100 shadow-sm">
        <button onClick={() => { setProvider(null); setScreen('provider'); }} className="text-blue-500 hover:text-blue-700 mr-3 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${provider === 'aws' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{provider}</span>
        <span className="ml-2 text-sm font-medium text-gray-700">Hyperscaler Pipelines</span>

        <div className="ml-auto flex items-center gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
            <motion.span animate={authInfo.authenticated ? { scale: [1, 1.3, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }} className={`w-2.5 h-2.5 rounded-full ${authInfo.authenticated ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-red-400'}`} />
            <span className="text-xs">{authInfo.authenticated ? <span className="text-gray-700 font-medium">{authInfo.accountName}</span> : <span className="text-gray-400">Not connected</span>}</span>
          </motion.div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div className="h-full rounded-full bg-blue-500" animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 60 }} />
            </div>
            <span className="text-[11px] text-gray-400 font-medium">{passedCount}/{steps.length}</span>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="w-60 bg-white border-r border-gray-100 overflow-y-auto p-4 space-y-4">
          {phases.map((phase) => (
            <div key={phase.number}>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1.5 px-2">{phase.title}</div>
              {steps.filter((s) => s.phase === phase.number).map((s) => {
                const isActive = s.id === step.id;
                const st = status(s.id);
                return (
                  <motion.button key={s.id} whileHover={{ x: 2 }} onClick={() => setCurrentStepIndex(steps.indexOf(s))} className={`w-full text-left px-3 py-2 rounded-lg text-[13px] flex items-center gap-2 transition mb-0.5 ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${st === 'passed' ? 'bg-emerald-100 text-emerald-600' : st === 'failed' ? 'bg-red-100 text-red-500' : isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                      {st === 'passed' ? '✓' : steps.indexOf(s) + 1}
                    </span>
                    <span className="truncate">{s.title}</span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="max-w-2xl mx-auto px-8 py-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 font-medium">Step {currentStepIndex + 1}</span>
                {status(step.id) === 'passed' && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">✓ Verified</motion.span>}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{step.title}</h2>
              <p className="text-sm text-gray-500 mb-6">{step.description}</p>

              {/* Instructions */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
                {!Array.isArray(step.instructions) && (
                  <div className="flex gap-1 mb-4 p-1 bg-gray-50 rounded-lg w-fit">
                    {([['mac', '🍎 Mac'], ['windows', '🪟 Windows'], ['linux', '🐧 Linux']] as [OS, string][]).map(([key, label]) => (
                      <button key={key} onClick={() => setOs(key)} className={`px-3 py-1 rounded-md text-xs font-medium transition ${os === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{label}</button>
                    ))}
                  </div>
                )}
                <ol className="space-y-3">
                  {getInstructions(step.instructions, os).map((inst, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex gap-3 text-sm text-gray-700">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px] text-blue-500 font-bold">{i + 1}</span>
                      <span className="leading-relaxed">{inst}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Validate */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                {step.resourceLabel && (
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wider">{step.resourceLabel}</label>
                    <input className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition" placeholder={`Enter ${step.resourceLabel.toLowerCase()}...`} value={inputs[step.id] || ''} onChange={(e) => setInputs((v) => ({ ...v, [step.id]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && handleValidate()} />
                  </div>
                )}

                <motion.button onClick={handleValidate} disabled={status(step.id) === 'validating'} whileTap={{ scale: 0.98 }} className="w-full py-2.5 rounded-lg font-medium text-sm text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition shadow-sm shadow-blue-200">
                  {status(step.id) === 'validating' ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                      Checking...
                    </span>
                  ) : 'Validate'}
                </motion.button>

                <AnimatePresence>
                  {validationMessages[step.id] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className={`mt-3 p-3 rounded-lg text-sm ${status(step.id) === 'passed' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                        {validationMessages[step.id]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between mt-5 pt-4 border-t border-gray-100">
                  <button onClick={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))} disabled={currentStepIndex === 0} className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-30 transition">← Previous</button>
                  <motion.button onClick={() => setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1))} disabled={status(step.id) !== 'passed'} whileHover={status(step.id) === 'passed' ? { scale: 1.02 } : {}} className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition">Next →</motion.button>
                </div>
              </motion.div>

              {/* Completion */}
              {passedCount === steps.length && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }} className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100 text-center">
                  <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-4xl inline-block">🎉</motion.span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">Pipeline Complete!</h3>
                  <p className="text-sm text-gray-500 mt-1">All steps verified. Your hyperscale data pipeline is live.</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
