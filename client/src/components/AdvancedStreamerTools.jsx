import React, { useState, useEffect, useRef } from 'react';

const AdvancedStreamerTools = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [streamStats, setStreamStats] = useState({
    viewers: 1250,
    followers: 15420,
    chatMessages: 3420,
    clips: 15,
    donations: 8,
    subscriptions: 3,
    bits: 2500
  });
  const [chatModeration, setChatModeration] = useState({
    enabled: true,
    autoMod: true,
    bannedWords: ['spam', 'hate', 'spoil'],
    slowMode: false,
    subscriberOnly: false,
    followerOnly: false
  });
  const [customCommands, setCustomCommands] = useState([
    { command: '!hype', response: 'Get hyped for HypeLoop! 🎮', cooldown: 30 },
    { command: '!chaos', response: 'Chaos mode is wild! 🌪️', cooldown: 60 },
    { command: '!winner', response: 'Who will win this round? 🤔', cooldown: 45 },
    { command: '!stats', response: 'Check out the leaderboard! 📊', cooldown: 120 }
  ]);
  const [pollData, setPollData] = useState({
    active: false,
    question: '',
    options: ['', ''],
    votes: {},
    totalVotes: 0
  });
  const [giveaway, setGiveaway] = useState({
    active: false,
    prize: '',
    entries: [],
    duration: 300,
    timeLeft: 0
  });
  const [customBranding, setCustomBranding] = useState({
    logo: '',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb'
    },
    overlayStyle: 'modern',
    animations: true
  });
  const [autoResponses, setAutoResponses] = useState([
    { trigger: 'new follower', response: 'Welcome to the HypeLoop family! 🎉', enabled: true },
    { trigger: 'subscription', response: 'Thank you for subscribing! You rock! 💎', enabled: true },
    { trigger: 'donation', response: 'Thank you for the donation! You\'re amazing! ❤️', enabled: true },
    { trigger: 'first time viewer', response: 'Welcome to the stream! Hope you enjoy HypeLoop! 🎮', enabled: true }
  ]);

  const tabs = [
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'moderation', name: 'Chat Moderation', icon: '🛡️' },
    { id: 'commands', name: 'Custom Commands', icon: '⚡' },
    { id: 'polls', name: 'Polls & Voting', icon: '🗳️' },
    { id: 'giveaways', name: 'Giveaways', icon: '🎁' },
    { id: 'branding', name: 'Custom Branding', icon: '🎨' },
    { id: 'automation', name: 'Auto Responses', icon: '🤖' }
  ];

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamStats(prev => ({
        ...prev,
        viewers: prev.viewers + Math.floor(Math.random() * 10) - 5,
        chatMessages: prev.chatMessages + Math.floor(Math.random() * 20),
        bits: prev.bits + Math.floor(Math.random() * 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Giveaway countdown
  useEffect(() => {
    if (giveaway.active && giveaway.timeLeft > 0) {
      const timer = setInterval(() => {
        setGiveaway(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [giveaway.active, giveaway.timeLeft]);

  const addCustomCommand = () => {
    const newCommand = {
      command: '',
      response: '',
      cooldown: 30
    };
    setCustomCommands([...customCommands, newCommand]);
  };

  const updateCustomCommand = (index, field, value) => {
    const updated = [...customCommands];
    updated[index] = { ...updated[index], [field]: value };
    setCustomCommands(updated);
  };

  const removeCustomCommand = (index) => {
    setCustomCommands(customCommands.filter((_, i) => i !== index));
  };

  const startPoll = () => {
    if (pollData.question && pollData.options.filter(opt => opt.trim()).length >= 2) {
      setPollData({
        ...pollData,
        active: true,
        votes: {},
        totalVotes: 0
      });
    }
  };

  const endPoll = () => {
    setPollData({
      ...pollData,
      active: false
    });
  };

  const startGiveaway = () => {
    if (giveaway.prize) {
      setGiveaway({
        ...giveaway,
        active: true,
        timeLeft: giveaway.duration,
        entries: []
      });
    }
  };

  const endGiveaway = () => {
    if (giveaway.entries.length > 0) {
      const winner = giveaway.entries[Math.floor(Math.random() * giveaway.entries.length)];
      alert(`🎉 Giveaway winner: ${winner}! Prize: ${giveaway.prize}`);
    }
    setGiveaway({
      ...giveaway,
      active: false,
      timeLeft: 0
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🎮 Advanced Streamer Tools</h2>
              <p className="text-purple-100">Professional tools for content creators</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">{streamStats.viewers}</div>
              <div className="text-sm text-purple-100">Live Viewers</div>
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
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
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
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">📊 Stream Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">{streamStats.viewers}</div>
                  <div className="text-sm">Viewers</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">{streamStats.followers}</div>
                  <div className="text-sm">Followers</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">{streamStats.chatMessages}</div>
                  <div className="text-sm">Chat Messages</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">{streamStats.bits}</div>
                  <div className="text-sm">Bits</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">🛡️ Chat Moderation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto Moderation</span>
                  <input
                    type="checkbox"
                    checked={chatModeration.autoMod}
                    onChange={(e) => setChatModeration({...chatModeration, autoMod: e.target.checked})}
                    className="toggle toggle-primary"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Slow Mode</span>
                  <input
                    type="checkbox"
                    checked={chatModeration.slowMode}
                    onChange={(e) => setChatModeration({...chatModeration, slowMode: e.target.checked})}
                    className="toggle toggle-primary"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Subscriber Only</span>
                  <input
                    type="checkbox"
                    checked={chatModeration.subscriberOnly}
                    onChange={(e) => setChatModeration({...chatModeration, subscriberOnly: e.target.checked})}
                    className="toggle toggle-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">⚡ Custom Commands</h3>
              <div className="space-y-4">
                {customCommands.map((cmd, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Command (e.g., !hype)"
                        value={cmd.command}
                        onChange={(e) => updateCustomCommand(index, 'command', e.target.value)}
                        className="input input-bordered"
                      />
                      <input
                        type="text"
                        placeholder="Response"
                        value={cmd.response}
                        onChange={(e) => updateCustomCommand(index, 'response', e.target.value)}
                        className="input input-bordered"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Cooldown (s)"
                          value={cmd.cooldown}
                          onChange={(e) => updateCustomCommand(index, 'cooldown', parseInt(e.target.value))}
                          className="input input-bordered w-24"
                        />
                        <button
                          onClick={() => removeCustomCommand(index)}
                          className="btn btn-error btn-sm"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addCustomCommand}
                  className="btn btn-primary"
                >
                  + Add Command
                </button>
              </div>
            </div>
          )}

          {activeTab === 'polls' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">🗳️ Polls & Voting</h3>
              {!pollData.active ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Poll question"
                    value={pollData.question}
                    onChange={(e) => setPollData({...pollData, question: e.target.value})}
                    className="input input-bordered w-full"
                  />
                  {pollData.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...pollData.options];
                        newOptions[index] = e.target.value;
                        setPollData({...pollData, options: newOptions});
                      }}
                      className="input input-bordered w-full"
                    />
                  ))}
                  <button
                    onClick={startPoll}
                    className="btn btn-primary"
                  >
                    Start Poll
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-bold">{pollData.question}</h4>
                  <div className="space-y-2">
                    {pollData.options.map((option, index) => (
                      <div key={index} className="bg-gray-100 p-3 rounded">
                        {option}: {pollData.votes[index] || 0} votes
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={endPoll}
                    className="btn btn-secondary"
                  >
                    End Poll
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'giveaways' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">🎁 Giveaways</h3>
              {!giveaway.active ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Prize description"
                    value={giveaway.prize}
                    onChange={(e) => setGiveaway({...giveaway, prize: e.target.value})}
                    className="input input-bordered w-full"
                  />
                  <input
                    type="number"
                    placeholder="Duration (seconds)"
                    value={giveaway.duration}
                    onChange={(e) => setGiveaway({...giveaway, duration: parseInt(e.target.value)})}
                    className="input input-bordered w-full"
                  />
                  <button
                    onClick={startGiveaway}
                    className="btn btn-primary"
                  >
                    Start Giveaway
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-bold">Prize: {giveaway.prize}</h4>
                  <div className="text-2xl font-bold text-center">
                    Time Left: {formatTime(giveaway.timeLeft)}
                  </div>
                  <div className="text-center">
                    Entries: {giveaway.entries.length}
                  </div>
                  <button
                    onClick={endGiveaway}
                    className="btn btn-secondary"
                  >
                    End Giveaway
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">🎨 Custom Branding</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Primary Color</label>
                  <input
                    type="color"
                    value={customBranding.colors.primary}
                    onChange={(e) => setCustomBranding({
                      ...customBranding,
                      colors: {...customBranding.colors, primary: e.target.value}
                    })}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Secondary Color</label>
                  <input
                    type="color"
                    value={customBranding.colors.secondary}
                    onChange={(e) => setCustomBranding({
                      ...customBranding,
                      colors: {...customBranding.colors, secondary: e.target.value}
                    })}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">Overlay Style</label>
                  <select
                    value={customBranding.overlayStyle}
                    onChange={(e) => setCustomBranding({...customBranding, overlayStyle: e.target.value})}
                    className="select select-bordered w-full"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">🤖 Auto Responses</h3>
              <div className="space-y-4">
                {autoResponses.map((response, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{response.trigger}</span>
                      <input
                        type="checkbox"
                        checked={response.enabled}
                        onChange={(e) => {
                          const updated = [...autoResponses];
                          updated[index] = {...updated[index], enabled: e.target.checked};
                          setAutoResponses(updated);
                        }}
                        className="toggle toggle-primary"
                      />
                    </div>
                    <input
                      type="text"
                      value={response.response}
                      onChange={(e) => {
                        const updated = [...autoResponses];
                        updated[index] = {...updated[index], response: e.target.value};
                        setAutoResponses(updated);
                      }}
                      className="input input-bordered w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedStreamerTools; 