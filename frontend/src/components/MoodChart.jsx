import React from 'react'

const MoodChart = ({ data, type = "week" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-400 text-sm">No mood data yet</p>
        <p className="text-gray-500 text-xs mt-1">Start logging to see trends!</p>
      </div>
    );
  }

  // Calculate mood sentiment score
  const getMoodScore = (moodText) => {
    const text = moodText.toLowerCase();
    if (text.includes('great') || text.includes('positive (95%)')) return 5;
    if (text.includes('good') || text.includes('positive (75%)')) return 4;
    if (text.includes('okay') || text.includes('neutral')) return 3;
    if (text.includes('down') || text.includes('negative (70%)')) return 2;
    if (text.includes('bad') || text.includes('negative (90%)')) return 1;
    // Default fallback based on sentiment
    if (text.includes('positive')) return 4;
    if (text.includes('negative')) return 2;
    return 3;
  };

  const getMoodEmoji = (score) => {
    if (score >= 4.5) return '😊';
    if (score >= 3.5) return '🙂';
    if (score >= 2.5) return '😐';
    if (score >= 1.5) return '😔';
    return '😢';
  };

  if (type === "week") {
    // Group by day of week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayData = days.map((day, idx) => {
      const dayMoods = data.filter(m => new Date(m.date).getDay() === idx);
      const avgScore = dayMoods.length > 0
        ? dayMoods.reduce((sum, m) => sum + getMoodScore(m.mood), 0) / dayMoods.length
        : 0;
      return { day, score: avgScore, count: dayMoods.length };
    });

    return (
      <div className="space-y-3">
        {dayData.map(({ day, score, count }) => (
          <div key={day} className="flex items-center gap-3">
            <div className="w-12 text-sm text-gray-400 font-medium">{day}</div>
            <div className="flex-1 bg-gray-900/50 rounded-lg h-10 relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition-all duration-500"
                style={{ width: `${(score / 5) * 100}%` }}
              />
            </div>
            <div className="w-16 text-right">
              <span className="text-xl">{count > 0 ? getMoodEmoji(score) : '➖'}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Day view - show last 7 entries
  const recentEntries = data.slice(-7).reverse();
  
  return (
    <div className="space-y-2">
      {recentEntries.map((entry, idx) => {
        const score = getMoodScore(entry.mood);
        const date = new Date(entry.date);
        return (
          <div key={idx} className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-800/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getMoodEmoji(score)}</span>
                <div>
                  <p className="text-sm text-white font-medium">{entry.mood}</p>
                  <p className="text-xs text-gray-500">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="w-24 bg-gray-800 rounded-full h-2">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MoodChart