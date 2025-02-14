import React from 'react';
import toast from 'react-hot-toast';

const AvatarGallery = ({ onSelect, onClose }) => {
  const styles = ['adventurer', 'avataaars', 'bottts', 'initials'];
  const seeds = Array.from({ length: 12 }, (_, i) => i + 1); // Generate 12 unique seeds
  
  const avatars = styles.flatMap(style =>
    seeds.map(seed => ({
      style,
      url: `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
    }))
  );

  const handleSelect = (url) => {
    onSelect(url);
    toast.success('Avatar selected!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Select Avatar</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {avatars.map((avatar, index) => (
            <button
              key={index}
              onClick={() => handleSelect(avatar.url)}
              className="p-2 border rounded-lg hover:border-blue-500 transition-colors"
            >
              <img
                src={avatar.url}
                alt={`${avatar.style} avatar ${index + 1}`}
                className="w-full aspect-square object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarGallery;