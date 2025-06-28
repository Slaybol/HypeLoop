import React, { useState } from 'react';
import powerUpService from '../services/PowerUpService';

const PowerUpShop = ({ playerId, onPurchase, onClose }) => {
  const [selectedPowerUp, setSelectedPowerUp] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  
  const playerStats = powerUpService.getPlayerStats(playerId);
  const availablePowerUps = powerUpService.getAvailablePowerUps(playerId);
  const allPowerUps = powerUpService.getPowerUpShop();

  const handlePurchase = async (powerUpId) => {
    setPurchaseLoading(true);
    try {
      const result = powerUpService.usePowerUp(playerId, powerUpId, { players: [] });
      onPurchase(result);
      setSelectedPowerUp(null);
    } catch (error) {
      console.error('Failed to purchase power-up:', error);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">⚡ Power-Up Shop</h2>
              <p className="text-purple-100">Enhance your gameplay with powerful abilities</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">🪙 {playerStats.coins}</div>
              <div className="text-sm text-purple-100">Coins Available</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Power-up Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPowerUps.map((powerUp) => {
              const canAfford = playerStats.coins >= powerUp.cost;
              const isAvailable = availablePowerUps.some(p => p.id === powerUp.id);
              
              return (
                <div
                  key={powerUp.id}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    getRarityBorder(powerUp.rarity)
                  } ${
                    canAfford && isAvailable
                      ? 'hover:scale-105 hover:shadow-lg'
                      : 'opacity-60'
                  }`}
                  onClick={() => canAfford && isAvailable && setSelectedPowerUp(powerUp)}
                >
                  {/* Rarity Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getRarityColor(powerUp.rarity)}`}>
                    {powerUp.rarity}
                  </div>

                  {/* Power-up Icon */}
                  <div className="text-4xl mb-3 text-center">{powerUp.icon}</div>

                  {/* Power-up Info */}
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-1">{powerUp.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{powerUp.description}</p>
                    
                    {/* Cost */}
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-yellow-600 font-bold">🪙 {powerUp.cost}</span>
                      {!canAfford && (
                        <span className="text-red-500 text-xs">Not enough coins</span>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="mt-2 text-xs text-gray-500">
                      Duration: {powerUp.duration}
                    </div>
                  </div>

                  {/* Purchase Button */}
                  {canAfford && isAvailable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(powerUp.id);
                      }}
                      disabled={purchaseLoading}
                      className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {purchaseLoading ? 'Purchasing...' : 'Purchase'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Power-up Details */}
        {selectedPowerUp && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{selectedPowerUp.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{selectedPowerUp.name}</h3>
                <p className="text-gray-600">{selectedPowerUp.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Cost: 🪙 {selectedPowerUp.cost} | Duration: {selectedPowerUp.duration}
                </div>
              </div>
              <button
                onClick={() => handlePurchase(selectedPowerUp.id)}
                disabled={purchaseLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                {purchaseLoading ? 'Purchasing...' : 'Buy Now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerUpShop; 