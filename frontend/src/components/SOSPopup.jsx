export default function SOSPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 max-w-md w-full mx-4 p-8 rounded-2xl shadow-2xl border-2 border-red-500/30">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">🆘</span>
          </div>
          <h3 className="text-2xl font-bold text-red-400 mb-2">Emergency Alert Sent</h3>
        </div>
        <p className="text-gray-300 text-center mb-6">
          We've notified your counselor. Please remain safe — if you're in immediate danger, call local emergency services now.
        </p>
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-300 text-center">
            Local emergency number: <strong className="text-red-400 text-lg">112</strong>
          </p>
        </div>
        <div className="text-center">
          <button 
            onClick={onClose} 
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
