import React, { useEffect, useRef } from 'react';

class AnimationManager {
  constructor() {
    this.particles = [];
    this.confetti = [];
    this.audioContext = null;
  }

  // Particle system for chaos mode and celebrations
  createParticles(x, y, count = 20, color = '#ffd700') {
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = color;
      particle.style.animationDelay = Math.random() * 0.5 + 's';
      particle.style.animationDuration = (2 + Math.random() * 2) + 's';
      
      container.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 4000);
    }

    // Remove container after all particles are gone
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 5000);
  }

  // Confetti effect for winners
  createConfetti(x, y, count = 50) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = (x + Math.random() * 200 - 100) + 'px';
      confetti.style.top = y + 'px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (3 + Math.random() * 2) + 's';
      
      container.appendChild(confetti);
    }

    // Remove container after animation
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 6000);
  }

  // Chaos mode screen shake
  triggerChaosShake() {
    const gameContainer = document.querySelector('.game-container') || document.body;
    gameContainer.classList.add('chaos-trigger');
    
    setTimeout(() => {
      gameContainer.classList.remove('chaos-trigger');
    }, 800);
  }

  // Chaos mode glow effect
  triggerChaosGlow(element) {
    if (!element) return;
    
    element.classList.add('chaos-glow');
    
    setTimeout(() => {
      element.classList.remove('chaos-glow');
    }, 2000);
  }

  // Vote count pop animation
  animateVoteCount(element) {
    if (!element) return;
    
    element.classList.add('vote-count');
    
    setTimeout(() => {
      element.classList.remove('vote-count');
    }, 300);
  }

  // Winner celebration
  celebrateWinner(element) {
    if (!element) return;
    
    element.classList.add('winner-celebration');
    this.createConfetti(window.innerWidth / 2, 0, 100);
    
    setTimeout(() => {
      element.classList.remove('winner-celebration');
    }, 600);
  }

  // Game state transition
  transitionGameState(element) {
    if (!element) return;
    
    element.classList.add('game-state-transition');
    
    setTimeout(() => {
      element.classList.remove('game-state-transition');
    }, 500);
  }

  // Loading spinner
  showLoading(element) {
    if (!element) return;
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    element.appendChild(spinner);
    
    return () => {
      if (spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
      }
    };
  }

  // Pulse animation
  pulseElement(element, duration = 2000) {
    if (!element) return;
    
    element.classList.add('loading-pulse');
    
    setTimeout(() => {
      element.classList.remove('loading-pulse');
    }, duration);
  }

  // Timer warning animation
  animateTimer(element, isWarning = false) {
    if (!element) return;
    
    if (isWarning) {
      element.classList.add('timer-warning');
    } else {
      element.classList.add('timer');
    }
    
    return () => {
      element.classList.remove('timer', 'timer-warning');
    };
  }

  // Button click ripple effect
  createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  // Smooth scroll to element
  scrollToElement(element, offset = 0) {
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Fade in element
  fadeIn(element, duration = 600) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    
    // Trigger reflow
    element.offsetHeight;
    
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  // Slide in element
  slideIn(element, direction = 'left', duration = 600) {
    if (!element) return;
    
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    };
    
    element.style.opacity = '0';
    element.style.transform = transforms[direction] || transforms.left;
    element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    
    // Trigger reflow
    element.offsetHeight;
    
    element.style.opacity = '1';
    element.style.transform = 'translate(0, 0)';
  }

  // Bounce animation
  bounce(element, intensity = 0.2) {
    if (!element) return;
    
    element.style.transform = `scale(${1 + intensity})`;
    element.style.transition = 'transform 0.1s ease-out';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.transition = 'transform 0.3s ease-out';
    }, 100);
  }

  // Shake animation
  shake(element, intensity = 5) {
    if (!element) return;
    
    const originalTransform = element.style.transform;
    const keyframes = [];
    
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * intensity * 2;
      keyframes.push(`translateX(${x}px)`);
    }
    
    element.style.animation = `shake ${0.8}s ease-in-out`;
    element.style.animationName = 'shake';
    
    // Add temporary keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-${intensity}px); }
        20%, 40%, 60%, 80% { transform: translateX(${intensity}px); }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      element.style.animation = '';
      element.style.transform = originalTransform;
      document.head.removeChild(style);
    }, 800);
  }

  // Typewriter effect
  typewriter(element, text, speed = 50) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  // Cleanup all animations
  cleanup() {
    // Remove all particle containers
    const particles = document.querySelectorAll('.particles');
    particles.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    
    // Remove all ripples
    const ripples = document.querySelectorAll('.ripple');
    ripples.forEach(ripple => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    });
  }
}

// Create global instance
const animationManager = new AnimationManager();

// React hook for animations
export const useAnimations = () => {
  const elementRef = useRef(null);

  const animate = (animationType, ...args) => {
    if (elementRef.current) {
      animationManager[animationType](elementRef.current, ...args);
    }
  };

  return { elementRef, animate, animationManager };
};

// Animation components
export const AnimatedButton = ({ children, onClick, className = '', ...props }) => {
  const handleClick = (e) => {
    animationManager.createRipple(e);
    if (onClick) onClick(e);
  };

  return (
    <button 
      className={`btn ${className}`} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const AnimatedCard = ({ children, className = '', ...props }) => {
  const { elementRef } = useAnimations();

  return (
    <div 
      ref={elementRef}
      className={`card ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const LoadingSpinner = ({ size = 40, className = '' }) => {
  return (
    <div 
      className={`loading-spinner ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export const ParticleEffect = ({ trigger, x, y, count, color }) => {
  useEffect(() => {
    if (trigger) {
      animationManager.createParticles(x, y, count, color);
    }
  }, [trigger, x, y, count, color]);

  return null;
};

export const ConfettiEffect = ({ trigger, x, y, count }) => {
  useEffect(() => {
    if (trigger) {
      animationManager.createConfetti(x, y, count);
    }
  }, [trigger, x, y, count]);

  return null;
};

export default animationManager; 