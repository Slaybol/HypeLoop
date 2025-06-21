import React, { useState, useEffect } from 'react';
import { AnimatedCard, AnimatedButton } from './AnimationManager';
import promptService from '../services/PromptService';

const CostAnalysis = () => {
  const [stats, setStats] = useState(promptService.getStats());
  const [projections, setProjections] = useState({
    dailyPlayers: 1000,
    promptsPerPlayer: 5,
    aiUsagePercentage: 10
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(promptService.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateCosts = () => {
    const dailyPrompts = projections.dailyPlayers * projections.promptsPerPlayer;
    const aiPrompts = dailyPrompts * (projections.aiUsagePercentage / 100);
    const databasePrompts = dailyPrompts - aiPrompts;

    return {
      daily: {
        ai: aiPrompts * 0.01, // $0.01 per AI prompt
        database: 0, // Free
        total: aiPrompts * 0.01
      },
      monthly: {
        ai: aiPrompts * 0.01 * 30,
        database: 0,
        total: aiPrompts * 0.01 * 30
      },
      yearly: {
        ai: aiPrompts * 0.01 * 365,
        database: 0,
        total: aiPrompts * 0.01 * 365
      },
      savings: {
        vsOpenAI: {
          daily: dailyPrompts * 0.03 - (aiPrompts * 0.01),
          monthly: dailyPrompts * 0.03 * 30 - (aiPrompts * 0.01 * 30),
          yearly: dailyPrompts * 0.03 * 365 - (aiPrompts * 0.01 * 365)
        }
      }
    };
  };

  const costs = calculateCosts();

  const renderCostComparison = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <AnimatedCard>
        <h3 className="text-xl font-bold text-white mb-4">Daily Costs</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">AI Prompts:</span>
            <span className="text-red-400">${costs.daily.ai.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Database Prompts:</span>
            <span className="text-green-400">$0.00</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-white font-semibold">Total:</span>
            <span className="text-white font-semibold">${costs.daily.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">vs OpenAI:</span>
            <span className="text-green-400">Save ${costs.savings.vsOpenAI.daily.toFixed(2)}</span>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard>
        <h3 className="text-xl font-bold text-white mb-4">Monthly Costs</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">AI Prompts:</span>
            <span className="text-red-400">${costs.monthly.ai.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Database Prompts:</span>
            <span className="text-green-400">$0.00</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-white font-semibold">Total:</span>
            <span className="text-white font-semibold">${costs.monthly.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">vs OpenAI:</span>
            <span className="text-green-400">Save ${costs.savings.vsOpenAI.monthly.toFixed(2)}</span>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard>
        <h3 className="text-xl font-bold text-white mb-4">Yearly Costs</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">AI Prompts:</span>
            <span className="text-red-400">${costs.yearly.ai.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Database Prompts:</span>
            <span className="text-green-400">$0.00</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-white font-semibold">Total:</span>
            <span className="text-white font-semibold">${costs.yearly.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">vs OpenAI:</span>
            <span className="text-green-400">Save ${costs.savings.vsOpenAI.yearly.toFixed(2)}</span>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );

  const renderProjections = () => (
    <AnimatedCard className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Cost Projections</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Daily Players
          </label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={projections.dailyPlayers}
            onChange={(e) => setProjections(prev => ({ ...prev, dailyPlayers: parseInt(e.target.value) }))}
            className="w-full"
          />
          <span className="text-gray-300 text-sm">{projections.dailyPlayers}</span>
        </div>
        
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Prompts per Player
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={projections.promptsPerPlayer}
            onChange={(e) => setProjections(prev => ({ ...prev, promptsPerPlayer: parseInt(e.target.value) }))}
            className="w-full"
          />
          <span className="text-gray-300 text-sm">{projections.promptsPerPlayer}</span>
        </div>
        
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            AI Usage %
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={projections.aiUsagePercentage}
            onChange={(e) => setProjections(prev => ({ ...prev, aiUsagePercentage: parseInt(e.target.value) }))}
            className="w-full"
          />
          <span className="text-gray-300 text-sm">{projections.aiUsagePercentage}%</span>
        </div>
      </div>
    </AnimatedCard>
  );

  const renderCurrentStats = () => (
    <AnimatedCard className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Current Usage Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.totalPrompts}</div>
          <div className="text-gray-300 text-sm">Total Prompts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.usedPrompts}</div>
          <div className="text-gray-300 text-sm">Used Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{stats.aiUsageCount}</div>
          <div className="text-gray-300 text-sm">AI Generated</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">${stats.estimatedCost.toFixed(2)}</div>
          <div className="text-gray-300 text-sm">Total Cost</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-300">
          AI Usage: {stats.aiUsagePercentage.toFixed(1)}% • 
          Cost per prompt: ${(stats.estimatedCost / Math.max(stats.usedPrompts, 1)).toFixed(4)}
        </div>
      </div>
    </AnimatedCard>
  );

  const renderOptimizationTips = () => (
    <AnimatedCard>
      <h3 className="text-xl font-bold text-white mb-4">Cost Optimization Tips</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="text-green-400 text-lg">💡</div>
          <div>
            <h4 className="text-white font-semibold">Use Pre-built Prompts</h4>
            <p className="text-gray-300 text-sm">Our database has 100+ high-quality prompts that cost nothing to use.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="text-blue-400 text-lg">⚡</div>
          <div>
            <h4 className="text-white font-semibold">Limit AI Usage</h4>
            <p className="text-gray-300 text-sm">Keep AI generation under 10% for maximum cost efficiency.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="text-purple-400 text-lg">🎯</div>
          <div>
            <h4 className="text-white font-semibold">Category Rotation</h4>
            <p className="text-gray-300 text-sm">Rotate between categories to maximize prompt variety without AI costs.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="text-yellow-400 text-lg">🚀</div>
          <div>
            <h4 className="text-white font-semibold">Future: Fine-tuned Model</h4>
            <p className="text-gray-300 text-sm">Consider training a custom model for even lower costs at scale.</p>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">💰 Cost Analysis Dashboard</h1>
          <p className="text-xl text-purple-300">
            See how our cost-effective prompt system saves money compared to traditional AI APIs
          </p>
        </div>

        {/* Current Stats */}
        {renderCurrentStats()}

        {/* Projections */}
        {renderProjections()}

        {/* Cost Comparison */}
        {renderCostComparison()}

        {/* Optimization Tips */}
        {renderOptimizationTips()}

        {/* Action Buttons */}
        <div className="text-center mt-8">
          <AnimatedButton
            onClick={() => promptService.resetUsage()}
            className="bg-blue-600 hover:bg-blue-700 mr-4"
          >
            🔄 Reset Stats
          </AnimatedButton>
          <AnimatedButton
            onClick={() => {
              const newPrompt = promptService.generatePrompt('general', true);
              console.log('Generated prompt:', newPrompt);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            🎲 Generate Test Prompt
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default CostAnalysis; 