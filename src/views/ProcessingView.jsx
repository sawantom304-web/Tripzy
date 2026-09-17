import React, { useState, useEffect } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function ProcessingView({ tripParams, onComplete }) {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const destinationState = tripParams?.destinationState || 'Goa';

  const steps = [
    'Understanding your preferences',
    `Exploring destinations in ${destinationState}`,
    'Comparing transport options',
    'Shortlisting hotels',
    'Mapping your route',
    'Checking weather forecast',
    'Optimizing for your budget',
    'Finalizing itinerary',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCompletedSteps((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setIsFinished(true);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0E1A] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center space-y-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#38BDF8] flex items-center justify-center shadow-xl shadow-[#6C63FF]/30">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-syne font-extrabold tracking-wider text-white">
            YOUR JOURNEY IS TAKING SHAPE
          </h1>
          <p className="text-xs text-[#9CA3AF] font-mono mt-2 uppercase tracking-widest">
            AI Operating Engine · Tripzy OS v2.4
          </p>
        </div>

        <div className="w-full glass-card p-6 rounded-2xl border border-white/10 space-y-3.5 text-left">
          {steps.map((step, idx) => {
            const isDone = idx < completedSteps;
            const isCurrent = idx === completedSteps;
            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 transition-all duration-300 ${
                  isDone
                    ? 'text-white'
                    : isCurrent
                    ? 'text-[#38BDF8] font-semibold'
                    : 'text-gray-600 opacity-40'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-[#34D399] text-black scale-100'
                      : isCurrent
                      ? 'border-2 border-[#38BDF8] text-[#38BDF8] animate-spin'
                      : 'border border-gray-700 text-gray-700'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></div>
                  ) : (
                    <span className="text-[10px]">{idx + 1}</span>
                  )}
                </div>
                <span className="text-sm font-medium">{step}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] h-full transition-all duration-500"
            style={{ width: `${(completedSteps / steps.length) * 100}%` }}
          ></div>
        </div>

        {isFinished && (
          <div className="space-y-4 pt-4 animate-fade-in">
            <p className="text-sm font-semibold text-[#34D399] flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Your personalized trip is ready.</span>
            </p>
            <button
              onClick={onComplete}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#38BDF8] text-white font-syne font-bold text-lg shadow-xl shadow-[#6C63FF]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              <span>View Tripzy Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
