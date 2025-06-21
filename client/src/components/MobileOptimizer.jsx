import React, { useState, useEffect } from "react";

class MobileOptimizer {
  constructor() {
    this.isMobile = false;
    this.isTablet = false;
    this.isLandscape = false;
    this.screenSize = 'desktop';
    this.touchSupported = false;
    this.orientation = 'portrait';
    this.init();
  }

  init() {
    this.detectDevice();
    this.setupEventListeners();
    this.applyMobileStyles();
  }

  detectDevice() {
    // Detect mobile device
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Detect tablet
    this.isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent);
    
    // Detect touch support
    this.touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Detect screen size
    this.updateScreenSize();
    
    // Detect orientation
    this.updateOrientation();
    
    console.log(`📱 Mobile Optimizer: ${this.isMobile ? 'Mobile' : 'Desktop'}, Touch: ${this.touchSupported}, Size: ${this.screenSize}`);
  }

  updateScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width < 768) {
      this.screenSize = 'mobile';
    } else if (width < 1024) {
      this.screenSize = 'tablet';
    } else {
      this.screenSize = 'desktop';
    }
    
    this.isLandscape = width > height;
  }

  updateOrientation() {
    this.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }

  setupEventListeners() {
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.updateOrientation();
        this.updateScreenSize();
        this.applyMobileStyles();
      }, 100);
    });

    // Handle resize
    window.addEventListener('resize', () => {
      this.updateScreenSize();
      this.updateOrientation();
      this.applyMobileStyles();
    });

    // Handle touch events for better mobile interaction
    if (this.touchSupported) {
      this.setupTouchOptimizations();
    }
  }

  setupTouchOptimizations() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Add touch feedback
    document.addEventListener('touchstart', (event) => {
      if (event.target.tagName === 'BUTTON') {
        event.target.style.transform = 'scale(0.95)';
      }
    });

    document.addEventListener('touchend', (event) => {
      if (event.target.tagName === 'BUTTON') {
        event.target.style.transform = 'scale(1)';
      }
    });
  }

  applyMobileStyles() {
    // Add mobile-specific CSS classes
    document.body.classList.toggle('mobile-device', this.isMobile);
    document.body.classList.toggle('tablet-device', this.isTablet);
    document.body.classList.toggle('touch-device', this.touchSupported);
    document.body.classList.toggle('landscape', this.isLandscape);
    document.body.classList.toggle('portrait', !this.isLandscape);
    document.body.classList.add(`screen-${this.screenSize}`);
  }

  // Mobile-specific utility methods
  isSmallScreen() {
    return this.screenSize === 'mobile';
  }

  isTouchDevice() {
    return this.touchSupported;
  }

  getOptimalFontSize(baseSize) {
    if (this.screenSize === 'mobile') {
      return Math.max(baseSize * 0.8, 14); // Minimum 14px for readability
    } else if (this.screenSize === 'tablet') {
      return baseSize * 0.9;
    }
    return baseSize;
  }

  getOptimalSpacing(baseSpacing) {
    if (this.screenSize === 'mobile') {
      return baseSpacing * 0.7;
    } else if (this.screenSize === 'tablet') {
      return baseSpacing * 0.85;
    }
    return baseSpacing;
  }

  // Mobile-specific UI adjustments
  optimizeForMobile() {
    if (!this.isMobile) return;

    // Adjust viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Add mobile-specific styles
    this.addMobileStyles();
  }

  addMobileStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Mobile-specific styles */
      .mobile-device {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }

      .mobile-device button {
        min-height: 44px;
        min-width: 44px;
        touch-action: manipulation;
      }

      .mobile-device input, 
      .mobile-device textarea {
        font-size: 16px !important; /* Prevents zoom on iOS */
        touch-action: manipulation;
      }

      .mobile-device .mobile-optimized {
        padding: 12px;
        margin: 8px;
        border-radius: 12px;
      }

      /* Landscape optimizations */
      .landscape .mobile-device {
        /* Adjust layout for landscape mode */
      }

      /* Touch feedback */
      .touch-device button:active {
        transform: scale(0.95);
        transition: transform 0.1s ease;
      }

      /* Mobile navigation */
      .mobile-device .mobile-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        z-index: 1000;
        padding: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Mobile-friendly cards */
      .mobile-device .mobile-card {
        margin: 8px;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      /* Mobile text sizing */
      .mobile-device h1 { font-size: 2rem !important; }
      .mobile-device h2 { font-size: 1.5rem !important; }
      .mobile-device h3 { font-size: 1.25rem !important; }
      .mobile-device p { font-size: 1rem !important; line-height: 1.5; }

      /* Mobile grid adjustments */
      .mobile-device .mobile-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }

      /* Mobile button groups */
      .mobile-device .mobile-button-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .mobile-device .mobile-button-group button {
        width: 100%;
        padding: 12px;
        font-size: 1rem;
      }
    `;
    document.head.appendChild(style);
  }

  // Get device info for debugging
  getDeviceInfo() {
    return {
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isLandscape: this.isLandscape,
      screenSize: this.screenSize,
      touchSupported: this.touchSupported,
      orientation: this.orientation,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
  }
}

// Create singleton instance
const mobileOptimizer = new MobileOptimizer();

export default mobileOptimizer; 