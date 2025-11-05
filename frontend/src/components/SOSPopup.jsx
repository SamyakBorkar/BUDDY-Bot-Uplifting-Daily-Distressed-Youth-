export default function SOSPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white max-w-md w-full p-6 rounded">
        <h3 className="text-xl font-bold text-red-600 mb-2">Emergency alert sent</h3>
        <p>We've notified your counsellor. Please remain safe — if you're in immediate danger, call local emergency services now.</p>
        <div className="mt-4 text-sm text-gray-600">
          <p>Local emergency number: <strong>911</strong> (replace with your country specific number).</p>
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
