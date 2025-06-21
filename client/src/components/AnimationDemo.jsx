import React, { useState } from 'react';
import animationManager, { 
  AnimatedButton, 
  AnimatedCard, 
  LoadingSpinner,
  ParticleEffect,
  ConfettiEffect 
} from './AnimationManager';

const AnimationDemo = () => {
  const [showParticles, setShowParticles] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chaosTriggered, setChaosTriggered] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerChaos = () => {
    setChaosTriggered(true);
    animationManager.triggerChaosShake();
    setTimeout(() => setChaosTriggered(false), 2000);
  };

  const triggerParticles = () => {
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className={`max-w-4xl mx-auto ${chaosTriggered ? 'chaos-trigger' : ''}`}>
        <AnimatedCard className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🎨 Animation Demo</h1>
          <p className="text-purple-300">Showcasing all the polished animations and effects</p>
        </AnimatedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button Animations */}
          <AnimatedCard>
            <h2 className="text-2xl font-bold mb-4 text-white">Button Effects</h2>
            <div className="space-y-4">
              <AnimatedButton onClick={() => {}} className="w-full">
                Hover & Click Me
              </AnimatedButton>
              <AnimatedButton onClick={triggerChaos} className="w-full bg-red-500">
                Trigger Chaos Shake
              </AnimatedButton>
              <AnimatedButton onClick={simulateLoading} className="w-full bg-green-500">
                {loading ? <LoadingSpinner size={20} /> : 'Show Loading'}
              </AnimatedButton>
            </div>
          </AnimatedCard>

          {/* Particle Effects */}
          <AnimatedCard>
            <h2 className="text-2xl font-bold mb-4 text-white">Particle Effects</h2>
            <div className="space-y-4">
              <AnimatedButton onClick={triggerParticles} className="w-full bg-blue-500">
                Create Particles
              </AnimatedButton>
              <AnimatedButton onClick={triggerConfetti} className="w-full bg-yellow-500">
                Celebrate with Confetti
              </AnimatedButton>
            </div>
          </AnimatedCard>

          {/* Card Animations */}
          <AnimatedCard>
            <h2 className="text-2xl font-bold mb-4 text-white">Card Animations</h2>
            <p className="text-gray-300 mb-4">
              This card has hover effects and entrance animations. Try hovering over it!
            </p>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white">Animated content here</p>
            </div>
          </AnimatedCard>

          {/* Timer Animation */}
          <AnimatedCard>
            <h2 className="text-2xl font-bold mb-4 text-white">Timer Effects</h2>
            <div className="text-center">
              <div className="timer text-4xl font-bold text-white mb-4">
                30s
              </div>
              <div className="timer-warning text-2xl font-bold text-red-400">
                5s Warning
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Game State Transitions */}
        <AnimatedCard className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Game State Transitions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Join', 'Waiting', 'Playing', 'Results'].map((state, index) => (
              <div 
                key={state}
                className="game-state-transition bg-white/10 rounded-lg p-4 text-center cursor-pointer hover:bg-white/20 transition-all"
                onClick={() => {
                  const element = document.querySelector('.game-state-transition');
                  if (element) {
                    animationManager.transitionGameState(element);
                  }
                }}
              >
                <h3 className="text-white font-semibold">{state}</h3>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Chaos Mode Demo */}
        <AnimatedCard className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Chaos Mode Effects</h2>
          <div className="chaos-glow bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
            <h3 className="text-red-400 font-bold text-xl mb-2">🔥 CHAOS MODE 🔥</h3>
            <p className="text-red-300">This element has a pulsing glow effect</p>
          </div>
        </AnimatedCard>
      </div>

      {/* Particle Effects */}
      <ParticleEffect 
        trigger={showParticles}
        x={window.innerWidth / 2}
        y={window.innerHeight / 2}
        count={50}
        color="#ffd700"
      />

      {/* Confetti Effect */}
      <ConfettiEffect 
        trigger={showConfetti}
        x={window.innerWidth / 2}
        y={0}
        count={150}
      />
    </div>
  );
};

export default AnimationDemo; 