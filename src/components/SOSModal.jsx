import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, PhoneCall, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SOSModal = () => {
  const { isSOSTriggered, cancelSOS, contacts } = useApp();
  const [countdown, setCountdown] = useState(5);
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    let timer;
    if (isSOSTriggered && !sosSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !sosSent) {
      setSosSent(true);
    }
    return () => clearTimeout(timer);
  }, [isSOSTriggered, countdown, sosSent]);

  useEffect(() => {
    if (!isSOSTriggered) {
      // Reset state when modal is closed
      setTimeout(() => {
        setCountdown(5);
        setSosSent(false);
      }, 500);
    }
  }, [isSOSTriggered]);

  const activeContacts = contacts.filter(c => c.isTracking);

  return (
    <AnimatePresence>
      {isSOSTriggered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
          >
            {/* Header Background */}
            <div className={`h-32 transition-colors duration-500 flex items-center justify-center ${sosSent ? 'bg-primary' : 'bg-danger'} relative overflow-hidden`}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-white/20 rounded-full blur-3xl opacity-50"
              />
              {sosSent ? (
                <ShieldAlert size={64} className="text-white relative z-10" />
              ) : (
                <PhoneCall size={64} className="text-white relative z-10 animate-pulse" />
              )}
            </div>

            <div className="p-6 text-center">
              {!sosSent ? (
                <>
                  <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
                    Emergency SOS
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Alerting emergency contacts and local authorities in...
                  </p>
                  <div className="text-7xl font-bold text-danger mb-8 font-display">
                    {countdown}
                  </div>
                  
                  <button
                    onClick={cancelSOS}
                    className="w-full py-4 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel (False Alarm)
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
                    Help is on the way
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Your location has been shared securely. Stay calm.
                  </p>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-left mb-6">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Notified Contacts ({activeContacts.length})
                    </h3>
                    <div className="space-y-3">
                      {activeContacts.map(c => (
                        <div key={c.id} className="flex items-center text-sm">
                          <CheckCircle2 size={16} className="text-primary mr-2" />
                          <span className="text-slate-700 dark:text-slate-300">{c.name}</span>
                        </div>
                      ))}
                      <div className="flex items-center text-sm pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                        <CheckCircle2 size={16} className="text-primary mr-2" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Local Police Response Team</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={cancelSOS}
                    className="w-full py-4 rounded-xl font-semibold bg-danger/10 text-danger hover:bg-danger/20 transition-colors flex items-center justify-center"
                  >
                    <X size={20} className="mr-2" />
                    Close SOS Mode
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
