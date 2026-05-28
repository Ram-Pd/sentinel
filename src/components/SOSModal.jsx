import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, PhoneCall, CheckCircle2, X, Video, StopCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SOSModal = () => {
  const { isSOSTriggered, cancelSOS, contacts, recordSosAlert } = useApp();
  const [countdown, setCountdown] = useState(5);
  const [sosSent, setSosSent] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isSOSTriggered && !sosSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !sosSent) {
      // Trigger the actual SOS alert and fetch location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
            recordSosAlert(latitude, longitude, mapLink);
            
            // Generate SMS link for trusted contacts
            const activeContacts = contacts.filter(c => c.is_tracking || c.isTracking);
            if (activeContacts.length > 0) {
              const phoneNumbers = activeContacts.map(c => c.phone).join(',');
              const message = `EMERGENCY (SOS): I need help! Here is my live location: ${mapLink}`;
              // Try to open the native SMS app
              window.location.href = `sms:${phoneNumbers}?body=${encodeURIComponent(message)}`;
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            recordSosAlert(null, null, "Location access denied by user");
          }
        );
      } else {
        recordSosAlert(null, null, "Geolocation not supported by browser");
      }
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

  // Clean up media tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'sos_evidence_recording.webm';
        a.click();
        window.URL.revokeObjectURL(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices.", error);
      alert("Could not access camera/microphone for recording.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

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

                  {isRecording ? (
                    <div className="mb-6 flex flex-col items-center">
                      <div className="relative w-full h-40 bg-black rounded-2xl overflow-hidden mb-4 border-2 border-danger shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-danger text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-ping" />
                          REC
                        </div>
                      </div>
                      <button
                        onClick={stopRecording}
                        className="w-full py-4 rounded-xl font-semibold bg-danger text-white hover:bg-danger/90 transition-colors flex items-center justify-center shadow-lg shadow-danger/20"
                      >
                        <StopCircle size={20} className="mr-2" />
                        Stop Recording
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="w-full py-4 rounded-xl font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center mb-4 shadow-xl"
                    >
                      <Video size={20} className="mr-2" />
                      Record Evidence
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (isRecording) stopRecording();
                      cancelSOS();
                    }}
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
