import React, { useState, useEffect } from 'react';

const MobilePrototype = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('mobile');
  const [mobileFeatures, setMobileFeatures] = useState({
    offlineMode: true,
    pushNotifications: true,
    hapticFeedback: true,
    touchGestures: true,
    socialSharing: true
  });

  const tabs = [
    { id: 'mobile', name: '📱 Mobile', icon: '📱' },
    { id: 'desktop', name: '🖥️ Desktop', icon: '🖥️' },
    { id: 'steam', name: '🎮 Steam', icon: '🎮' },
    { id: 'console', name: '🎯 Console', icon: '🎯' }
  ];

  const mobileFeaturesList = [
    {
      name: 'Offline Mode',
      description: 'Play without internet connection',
      icon: '📱',
      enabled: mobileFeatures.offlineMode,
      toggle: () => setMobileFeatures(prev => ({ ...prev, offlineMode: !prev.offlineMode }))
    },
    {
      name: 'Push Notifications',
      description: 'Game invites, round updates, achievements',
      icon: '🔔',
      enabled: mobileFeatures.pushNotifications,
      toggle: () => setMobileFeatures(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))
    },
    {
      name: 'Haptic Feedback',
      description: 'Vibrate on interactions and events',
      icon: '📳',
      enabled: mobileFeatures.hapticFeedback,
      toggle: () => setMobileFeatures(prev => ({ ...prev, hapticFeedback: !prev.hapticFeedback }))
    },
    {
      name: 'Touch Gestures',
      description: 'Swipe, pinch, and tap controls',
      icon: '👆',
      enabled: mobileFeatures.touchGestures,
      toggle: () => setMobileFeatures(prev => ({ ...prev, touchGestures: !prev.touchGestures }))
    },
    {
      name: 'Social Sharing',
      description: 'Share scores and invite friends',
      icon: '📤',
      enabled: mobileFeatures.socialSharing,
      toggle: () => setMobileFeatures(prev => ({ ...prev, socialSharing: !prev.socialSharing }))
    }
  ];

  const desktopFeatures = [
    { name: 'Local Multiplayer', description: 'Same-screen multiplayer', icon: '👥' },
    { name: 'Fullscreen Mode', description: 'Immersive gaming experience', icon: '🖥️' },
    { name: 'Keyboard Shortcuts', description: 'Quick access to features', icon: '⌨️' },
    { name: 'System Tray', description: 'Background notifications', icon: '📋' },
    { name: 'Auto Updates', description: 'Automatic game updates', icon: '🔄' }
  ];

  const steamFeatures = [
    { name: 'Steam Workshop', description: 'User-generated content', icon: '🔧' },
    { name: 'Steam Achievements', description: '50+ unlockable achievements', icon: '🏆' },
    { name: 'Steam Leaderboards', description: 'Global and friend rankings', icon: '📊' },
    { name: 'Steam Friends', description: 'Invite Steam friends to games', icon: '👥' },
    { name: 'Cloud Saves', description: 'Cross-device progress sync', icon: '☁️' },
    { name: 'Trading Cards', description: 'Collectible Steam cards', icon: '🃏' }
  ];

  const consoleFeatures = [
    { name: 'Cross-Platform Play', description: 'Play with friends on any platform', icon: '🌐' },
    { name: 'Controller Support', description: 'Full gamepad integration', icon: '🎮' },
    { name: 'Platform Achievements', description: 'Xbox/PlayStation/Nintendo achievements', icon: '🏅' },
    { name: 'Party System', description: 'Platform-specific party features', icon: '🎉' },
    { name: '4K Support', description: 'High-resolution graphics', icon: '📺' }
  ];

  const revenueModels = [
    {
      platform: 'Mobile',
      model: 'Freemium',
      basePrice: 'Free',
      premiumPrice: '$2.99',
      iap: '$0.99 - $4.99',
      subscription: '$4.99/month',
      projectedRevenue: '$200K+ annually'
    },
    {
      platform: 'Desktop/Steam',
      model: 'Premium',
      basePrice: '$9.99 - $14.99',
      premiumPrice: 'N/A',
      iap: 'DLC: $4.99 each',
      subscription: 'N/A',
      projectedRevenue: '$150K+ annually'
    },
    {
      platform: 'Console',
      model: 'Premium',
      basePrice: '$19.99 - $29.99',
      premiumPrice: 'N/A',
      iap: 'DLC: $4.99 each',
      subscription: 'N/A',
      projectedRevenue: '$100K+ annually'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🚀 Platform Expansion Prototype</h2>
              <p className="text-blue-100">Multi-platform strategy and implementation</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b bg-white">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Mobile Tab */}
          {activeTab === 'mobile' && (
            <div>
              <h3 className="text-xl font-bold mb-4">📱 Mobile Expansion (iOS/Android)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">React Native Conversion</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Timeline:</span>
                        <span className="font-semibold">3-4 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team Size:</span>
                        <span className="font-semibold">2-3 developers</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost:</span>
                        <span className="font-semibold">$50K - $80K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Revenue:</span>
                        <span className="font-semibold text-green-600">$200K+ annually</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">App Store Strategy</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Game:</span>
                        <span className="font-semibold">Free with ads</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium Version:</span>
                        <span className="font-semibold">$2.99 (ad-free)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In-App Purchases:</span>
                        <span className="font-semibold">$0.99 - $4.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subscription:</span>
                        <span className="font-semibold">$4.99/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-lg mb-3">Mobile Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mobileFeaturesList.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{feature.icon}</span>
                        <span className="font-semibold">{feature.name}</span>
                      </div>
                      <button
                        onClick={feature.toggle}
                        className={`w-6 h-6 rounded-full border-2 transition-colors ${
                          feature.enabled
                            ? 'bg-green-500 border-green-500'
                            : 'bg-gray-200 border-gray-300'
                        }`}
                      >
                        {feature.enabled && <span className="text-white text-xs">✓</span>}
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Tab */}
          {activeTab === 'desktop' && (
            <div>
              <h3 className="text-xl font-bold mb-4">🖥️ Desktop/Steam Expansion</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Electron Application</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Timeline:</span>
                        <span className="font-semibold">2-3 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team Size:</span>
                        <span className="font-semibold">1-2 developers</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost:</span>
                        <span className="font-semibold">$30K - $50K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Revenue:</span>
                        <span className="font-semibold text-green-600">$150K+ annually</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Steam Strategy</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span className="font-semibold">$9.99 - $14.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DLC Packs:</span>
                        <span className="font-semibold">$4.99 each</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Season Pass:</span>
                        <span className="font-semibold">$19.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Release:</span>
                        <span className="font-semibold">Early Access → Full</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-lg mb-3">Desktop Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {desktopFeatures.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{feature.icon}</span>
                      <span className="font-semibold">{feature.name}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-semibold text-lg mb-3 mt-6">Steam Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {steamFeatures.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{feature.icon}</span>
                      <span className="font-semibold">{feature.name}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Console Tab */}
          {activeTab === 'console' && (
            <div>
              <h3 className="text-xl font-bold mb-4">🎯 Console Expansion (Future)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Platform Support</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Xbox Series X/S:</span>
                        <span className="font-semibold">Xbox Live integration</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PlayStation 5:</span>
                        <span className="font-semibold">PSN integration</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nintendo Switch:</span>
                        <span className="font-semibold">Nintendo Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Revenue:</span>
                        <span className="font-semibold text-green-600">$100K+ annually</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Technical Requirements</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Engine:</span>
                        <span className="font-semibold">Unity/Unreal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Controller:</span>
                        <span className="font-semibold">Full gamepad support</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Performance:</span>
                        <span className="font-semibold">60fps optimization</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeline:</span>
                        <span className="font-semibold">6-12 months</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-lg mb-3">Console Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {consoleFeatures.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{feature.icon}</span>
                      <span className="font-semibold">{feature.name}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Models Tab */}
          {activeTab === 'steam' && (
            <div>
              <h3 className="text-xl font-bold mb-4">💰 Revenue Models & Investment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {revenueModels.map((model, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3">{model.platform}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Model:</span>
                        <span className="font-semibold">{model.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span className="font-semibold">{model.basePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium:</span>
                        <span className="font-semibold">{model.premiumPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IAP/DLC:</span>
                        <span className="font-semibold">{model.iap}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subscription:</span>
                        <span className="font-semibold">{model.subscription}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Projected Revenue:</span>
                        <span className="font-semibold text-green-600">{model.projectedRevenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Investment Requirements</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Mobile Development:</span>
                        <span className="font-semibold">$80,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Desktop/Steam:</span>
                        <span className="font-semibold">$50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Marketing:</span>
                        <span className="font-semibold">$50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Legal/Compliance:</span>
                        <span className="font-semibold">$20,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contingency:</span>
                        <span className="font-semibold">$50,000</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total Investment:</span>
                          <span className="text-blue-600">$250,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Expected ROI</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Mobile Revenue:</span>
                        <span className="font-semibold text-green-600">$200K+ annually</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Steam Revenue:</span>
                        <span className="font-semibold text-green-600">$150K+ annually</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Console Revenue:</span>
                        <span className="font-semibold text-green-600">$100K+ annually</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total Annual Revenue:</span>
                          <span className="text-green-600">$450K+</span>
                        </div>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>ROI (2 years):</span>
                          <span className="text-green-600">300-500%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobilePrototype; 