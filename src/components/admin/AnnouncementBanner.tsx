import { X } from "lucide-react";
import { useState } from "react";

export const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-blue-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-blue-900">Announcements</p>
          <p className="text-blue-800">Lock your TMail with a Password - <a href="#" className="underline">Try Now</a></p>
        </div>
      </div>
      <button onClick={() => setIsVisible(false)} className="text-blue-500 hover:text-blue-700">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};