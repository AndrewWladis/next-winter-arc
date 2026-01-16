'use client';

import { useState, useEffect } from 'react';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  timestamp: Date;
}

const DAILY_GOAL = 2200;

export default function CalorieTracker() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('winterArcFoodItems');
    if (saved) {
      const items = JSON.parse(saved).map((item: FoodItem) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
      setFoodItems(items);
    }
  }, []);

  // Calculate total calories
  useEffect(() => {
    const total = foodItems.reduce((sum, item) => sum + item.calories, 0);
    setTotalCalories(total);
  }, [foodItems]);

  // Save to localStorage whenever foodItems change
  useEffect(() => {
    if (foodItems.length > 0) {
      localStorage.setItem('winterArcFoodItems', JSON.stringify(foodItems));
    }
  }, [foodItems]);

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName.trim() || !calories.trim()) {
      return;
    }

    const caloriesNum = parseInt(calories, 10);
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      return;
    }

    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: foodName.trim(),
      calories: caloriesNum,
      timestamp: new Date(),
    };

    setFoodItems([newItem, ...foodItems]);
    setFoodName('');
    setCalories('');
  };

  const handleDelete = (id: string) => {
    const updated = foodItems.filter((item) => item.id !== id);
    setFoodItems(updated);
    if (updated.length === 0) {
      localStorage.removeItem('winterArcFoodItems');
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">Winter Arc</h1>
        <p className="text-gray-400 text-lg">Calorie Tracker</p>
      </div>

      {/* Total Calories Card */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-xl">
        <div className="text-center space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">Total Calories Today</p>
            <p className="text-6xl font-bold text-white">{totalCalories}</p>
            <p className="text-gray-500 text-sm mt-1">of {DAILY_GOAL} goal</p>
          </div>
          <div className="pt-4 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Calories Remaining</p>
            <p className={`text-5xl font-bold ${DAILY_GOAL - totalCalories >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Math.max(0, DAILY_GOAL - totalCalories)}
            </p>
            {DAILY_GOAL - totalCalories < 0 && (
              <p className="text-red-400 text-sm mt-1">Over goal by {Math.abs(DAILY_GOAL - totalCalories)}</p>
            )}
          </div>
          {/* Progress Bar */}
          <div className="pt-4">
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  totalCalories >= DAILY_GOAL ? 'bg-red-500' : 'bg-white'
                }`}
                style={{
                  width: `${Math.min(100, (totalCalories / DAILY_GOAL) * 100)}%`,
                }}
              />
            </div>
            <p className="text-gray-400 text-xs mt-2">
              {Math.round((totalCalories / DAILY_GOAL) * 100)}% of daily goal
            </p>
          </div>
        </div>
      </div>

      {/* Add Food Form */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-xl">
        <form onSubmit={handleAddFood} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="foodName" className="block text-gray-300 text-sm mb-2">
                Food Item
              </label>
              <input
                id="foodName"
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g., Pizza"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="calories" className="block text-gray-300 text-sm mb-2">
                Calories
              </label>
              <input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g., 67"
                min="1"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
          >
            Add Food Item
          </button>
        </form>
      </div>

      {/* Food Items List */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Food Log</h2>
        {foodItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No food items yet. Start tracking!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {foodItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                    <span className="text-white font-bold">{item.calories} cal</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="ml-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
