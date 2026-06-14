'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEARNING_PATHS } from './lib/paths';
import { AWS_STEPS, AZURE_STEPS, AWS_PHASES, AZURE_PHASES, GCP_STEPS, GCP_PHASES, AGNOSTIC_STEPS, AGNOSTIC_PHASES, type CloudPath } from './lib/steps';

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
        <div className="grid grid-cols-2 gap-5">
          {[
            { id: 'aws' as CloudPath, label: 'Amazon Web Services', sub: 'Kinesis · S3 · Glue · Athena', gradient: 'from-orange-50 to-white hover:from-orange-100', border: 'border-orange-200 hover:border-orange-400', logo: <svg className="w-12 h-8" viewBox="0 0 64 40" fill="none"><path d="M20.6 24.5c0 .6.1 1 .2 1.3.1.3.3.7.5 1.1.1.1.1.2.1.3 0 .2-.1.3-.3.4l-1 .7c-.1.1-.3.1-.4.1-.2 0-.3-.1-.5-.2-.2-.2-.4-.5-.5-.7-.2-.3-.3-.6-.5-.9-1.2 1.4-2.7 2.1-4.4 2.1-1.3 0-2.3-.4-3.1-1.1-.7-.7-1.1-1.7-1.1-2.9 0-1.3.5-2.3 1.4-3.1.9-.8 2.2-1.2 3.7-1.2.5 0 1.1 0 1.6.1.6.1 1.2.2 1.8.3v-1.1c0-1.2-.2-2-.7-2.4-.5-.5-1.3-.7-2.5-.7-.5 0-1.1.1-1.7.2-.5.1-1.1.3-1.6.5-.2.1-.4.2-.5.2h-.2c-.2 0-.3-.2-.3-.5v-.8c0-.2 0-.4.1-.5.1-.1.2-.3.4-.3.5-.3 1.2-.5 1.9-.7.8-.2 1.5-.3 2.4-.3 1.8 0 3.1.4 4 1.2.8.8 1.2 2.1 1.2 3.7v4.9z" fill="#F90"/><path d="M14.5 26.3c.5 0 1-.1 1.6-.3.5-.2 1-.5 1.4-1 .3-.3.4-.6.5-1 .1-.4.1-.8.1-1.3v-.6c-.5-.1-1-.2-1.4-.2-.5-.1-1-.1-1.5-.1-1 0-1.8.2-2.3.6-.5.4-.7.9-.7 1.7 0 .7.2 1.2.6 1.6.3.4.9.6 1.7.6z" fill="#F90"/><path d="M29.5 28.7c-.2 0-.4 0-.5-.1-.1-.1-.2-.3-.3-.6l-3.5-11.6c-.1-.3-.1-.5-.1-.6 0-.2.1-.4.4-.4h1.5c.3 0 .5 0 .6.2.1.1.2.3.3.6l2.5 9.9 2.3-9.9c.1-.3.2-.5.3-.6.1-.1.3-.2.6-.2h1.2c.3 0 .5.1.6.2.1.1.2.3.3.6l2.4 10 2.6-10c.1-.3.2-.5.3-.6.1-.1.3-.2.6-.2h1.4c.2 0 .4.1.4.4 0 .1 0 .2 0 .3s-.1.2-.1.4l-3.6 11.6c-.1.3-.2.5-.3.6-.1.1-.3.2-.5.1h-1.3c-.3 0-.5-.1-.6-.2-.1-.1-.2-.3-.3-.6L33.3 18l-2.3 9.7c-.1.3-.2.5-.3.6-.1.1-.3.2-.6.2h-1.3z" fill="#F90"/><path d="M48.7 28.9c-.8 0-1.6-.1-2.3-.3-.8-.2-1.4-.4-1.7-.6-.2-.1-.4-.3-.4-.4 0-.1-.1-.3-.1-.4v-.8c0-.3.1-.5.3-.5.1 0 .2 0 .3 0 .1 0 .2.1.4.2.5.2 1.1.4 1.7.5.6.1 1.2.2 1.8.2 1 0 1.7-.2 2.2-.5.5-.3.7-.7.7-1.4 0-.4-.1-.8-.4-1-.3-.3-.8-.5-1.5-.8l-2.2-.7c-1.1-.3-1.9-.9-2.4-1.5-.5-.6-.7-1.3-.7-2.2 0-.6.1-1.2.4-1.7.3-.5.6-.9 1.1-1.2.5-.3 1-.6 1.6-.8.6-.2 1.2-.2 1.9-.2.3 0 .7 0 1 .1.4 0 .7.1 1 .2.3.1.6.1.8.2.3.1.5.2.6.3.2.1.3.2.4.4.1.1.1.3.1.5v.7c0 .3-.1.5-.3.5-.1 0-.3-.1-.5-.2-1-.4-2-.7-3-.7-.9 0-1.5.2-2 .5-.5.3-.7.8-.7 1.3 0 .4.2.8.5 1.1.3.3.9.6 1.7.8l2.1.7c1.1.3 1.9.8 2.3 1.4.5.6.7 1.3.7 2.1 0 .7-.1 1.2-.4 1.7-.3.5-.6.9-1.1 1.2-.5.3-1 .6-1.7.7-.7.2-1.4.3-2.2.3z" fill="#F90"/><path d="M51.1 34.3c-5 3.7-12.3 5.7-18.5 5.7-8.7 0-16.6-3.2-22.5-8.6-.5-.4-.1-1 .5-.7 6.4 3.7 14.3 6 22.5 6 5.5 0 11.6-1.1 17.2-3.5.8-.4 1.5.5.8 1.1z" fill="#F90"/><path d="M53.4 31.7c-.6-.8-4.2-.4-5.8-.2-.5.1-.6-.4-.1-.7 2.9-2 7.5-1.4 8.1-.7.5.7-.1 5.4-2.8 7.6-.4.3-.8.2-.6-.3.6-1.5 2-4.8 1.2-5.7z" fill="#F90"/></svg> },
            { id: 'azure' as CloudPath, label: 'Microsoft Azure', sub: 'Event Hubs · ADLS · Synapse', gradient: 'from-blue-50 to-white hover:from-blue-100', border: 'border-blue-200 hover:border-blue-400', logo: <svg className="w-10 h-10" viewBox="0 0 96 96" fill="none"><path d="M33.3 6.5L2.3 55.8l19.4 33.7h72L64.1 55.5 33.3 6.5z" fill="#0078D4" opacity="0.8"/><path d="M33.3 6.5l22.4 29.7L2.3 55.8l31-49.3z" fill="#0078D4"/><path d="M55.7 36.2L64.1 55.5l29.6 34H21.7l34-53.3z" fill="#0078D4" opacity="0.6"/></svg> },
            { id: 'gcp' as CloudPath, label: 'Google Cloud', sub: 'Pub/Sub · GCS · BigQuery', gradient: 'from-red-50 to-white hover:from-red-100', border: 'border-red-200 hover:border-red-400', logo: <svg className="w-10 h-10" viewBox="0 0 64 64"><path d="M40.8 23.2l4.4-4.4.3-1.9A21.5 21.5 0 0015 28.1l.7-.1 8.8-1.5s.5-.8.7-.7a12.7 12.7 0 0115.6-2.6z" fill="#EA4335"/><path d="M49.2 28.1A21.6 21.6 0 0043 19l-2.2 4.2a12.8 12.8 0 014.7 10.2v1.3a6.4 6.4 0 110 12.8H32.2l-1.3 1.3v7.7l1.3 1.3h13.3a15.2 15.2 0 003.7-29.7z" fill="#4285F4"/><path d="M18.9 56.8h13.3v-8.9H18.9a6.3 6.3 0 01-2.6-.6l-1.8.6-4.5 4.4-.4 1.8a15.1 15.1 0 009.3 2.7z" fill="#34A853"/><path d="M18.9 27.4A15.2 15.2 0 009.6 55l6.7-6.7a6.4 6.4 0 1112.4-3.4 6.4 6.4 0 01-3.4-2.4l6.7-6.7a15.2 15.2 0 00-13.1-8.4z" fill="#FBBC05"/></svg> },
            { id: 'agnostic' as CloudPath, label: 'Cloud Agnostic', sub: 'Kafka · MinIO · PostgreSQL', gradient: 'from-emerald-50 to-white hover:from-emerald-100', border: 'border-emerald-200 hover:border-emerald-400', logo: <svg className="w-10 h-10" viewBox="0 0 64 64" fill="none"><path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4z" fill="#0db7ed" opacity="0.1"/><path d="M52 29c-.7-4-3.8-5.7-7.2-6.2.5-3.8-1.3-6.7-4.6-8.3-3.5-1.7-7.6-.9-10 2.1-2.4-1.5-5.2-1.6-7.7-.1-2.5 1.5-3.7 4-3.3 7-3.8.5-6.2 2.4-7 5.8-.9 3.6.6 7.1 3.7 8.9h2.6V34h4.3v4.2h4.2V34h4.3v4.2h4.2V34h4.3v4.2H44V34h4.3v4.2h2.2c3.3-1.6 5-5.1 4.2-8.7l-2.7-.5z" fill="#0db7ed"/><rect x="22" y="36" width="4" height="8" rx="1" fill="#333"/><rect x="30" y="36" width="4" height="8" rx="1" fill="#333"/><rect x="38" y="36" width="4" height="8" rx="1" fill="#333"/></svg> },
          ].map((p, i) => (
            <motion.button key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1, type: 'spring' }} whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.95 }} onClick={() => onSelect(p.id)} className={`w-56 p-8 rounded-2xl border-2 ${p.border} bg-gradient-to-b ${p.gradient} transition-all`}>
              <div className="flex justify-center mb-3">{p.logo}</div>
              <div className="text-lg font-bold text-gray-900 mb-1">{p.label}</div>
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

  const steps = provider === 'aws' ? AWS_STEPS : provider === 'azure' ? AZURE_STEPS : provider === 'gcp' ? GCP_STEPS : AGNOSTIC_STEPS;
  const phases = provider === 'aws' ? AWS_PHASES : provider === 'azure' ? AZURE_PHASES : provider === 'gcp' ? GCP_PHASES : AGNOSTIC_PHASES;
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
      const res = await fetch(step.validateEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resourceName: value, region: provider === 'aws' ? 'us-east-1' : provider === 'gcp' ? 'us-central1' : 'eastus2' }) });
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
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${provider === 'aws' ? 'bg-orange-100 text-orange-600' : provider === 'gcp' ? 'bg-red-100 text-red-600' : provider === 'agnostic' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>{provider}</span>
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
