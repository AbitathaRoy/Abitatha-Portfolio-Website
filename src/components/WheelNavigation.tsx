import React, { useState, useEffect } from 'react';
import { DivideIcon as LucideIcon, Compass } from 'lucide-react';
import { Corner } from '../App';


interface WheelCorner {
  id: Corner;
  name: string;
  icon: LucideIcon;
  color: string;
}

interface WheelNavigationProps {
  corners: WheelCorner[];
  activeCorner: Corner;
  onCornerChange: (corner: Corner) => void;
}

const WheelNavigation: React.FC<WheelNavigationProps> = ({ 
  corners, 
  activeCorner, 
  onCornerChange 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCorner, setHoveredCorner] = useState<Corner | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(true);

  // Flashing caption effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCaptionVisible(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = () => {
    if (!isHovered) {
      setShowPreview(true);
      setTimeout(() => setShowPreview(false), 800);
    }
  };

  const isExpanded = isHovered || showPreview;
  const radius = isExpanded ? 140 : 40;
  const centerX = isExpanded ? 20 : 15;
  const centerY = 260;

  return (
    <div className={`fixed top-0 h-screen z-50 transition-all duration-700 ease-in-out ${
      isHovered ? 'left-0 w-32' : '-left-8 w-16'
    }`}>
      {/* Wheel Container */}
      <div 
        className="relative h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredCorner(null);
        }}
        onMouseMove={handleMouseMove}
      >

        
        {/* Flashing Caption */}

        
        <div className={`absolute left-20 top-1/2 transform -translate-y-1/2 transition-opacity duration-500 ${
          !isHovered && captionVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap shadow-lg">
            My Corners
          </div>
        </div>
  

        {/* FAB Button (Collapsed State) */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-in duration-700 transition-out duration-14000 ease-in-out ${
          !isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <button className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-white/30">
            <Compass className="w-6 h-6 text-white mx-auto animate-pulse" />
          </button>
        </div>

        {/* Background Arc */}
        <div className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-700 ease-in-out ${
          isExpanded ? 'opacity-100 left-0' : 'opacity-0 left-4'
        }`}>
          <svg 
            width={isExpanded ? "140" : "80"} 
            height={isExpanded ? "400" : "200"} 
            className="overflow-visible transition-all duration-700 ease-in-out"
          >
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path
              d={`M 20 ${isExpanded ? '100' : '180'} A ${radius} ${radius} 0 0 1 20 ${isExpanded ? '300' : '220'}`}
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth={isExpanded ? "3" : "2"}
              className="transition-all duration-700 ease-in-out"
            />
          </svg> 
        </div>

        {/* Corner Icons */}
        {corners.map((corner, index) => {
          const totalAngle = isExpanded ? Math.PI : Math.PI * 0.4;
          const startAngle = isExpanded ? -Math.PI / 2 : -Math.PI * 0.2;
          const angle = startAngle + (index / (corners.length - 1)) * totalAngle;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          const isActive = activeCorner === corner.id;
          const isHoveredItem = hoveredCorner === corner.id;
          
          return (
            <div
              key={corner.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out ${
                isExpanded ? 'opacity-100 scale-100' : !isActive ? 'opacity-0 scale-75' : 'opacity-80 scale-90'
              } ${showPreview && !isHovered ? 'opacity-60' : ''}`}
              style={{ 
                left: `${x}px`, 
                top: `${y}px`,
                zIndex: isActive || isHoveredItem ? 20 : 10
              }}
            >
              <button
                onClick={() => onCornerChange(corner.id)}
                onMouseEnter={() => setHoveredCorner(corner.id)}
                onMouseLeave={() => setHoveredCorner(null)}
                className={`relative rounded-full transition-all duration-300 ease-out group border-2 ${
                  isActive 
                    ? 'scale-125 shadow-2xl p-3 border-white/70' 
                    : isHoveredItem 
                    ? 'scale-110 shadow-xl p-3 border-white/50' 
                    : `${isExpanded ? 'p-3 border-white/30' : 'p-2 border-white/20'} shadow-lg hover:scale-105 hover:border-white/50`
                }`}
                style={{
                  background: isActive || isHoveredItem 
                    ? `linear-gradient(135deg, ${corner.color.split(' ')[1]}, ${corner.color.split(' ')[3]})` 
                    : `linear-gradient(135deg, ${corner.color.split(' ')[1]}, ${corner.color.split(' ')[3]})`
                }}
              >
                <div className="relative rounded-full p-2 bg-gradient-to-r from-blue-500 to-purple-600">
                  <corner.icon 
                    className={`${isExpanded ? 'w-6 h-6' : 'w-3 h-3'} transition-all duration-700 ease-in-out text-white`} 
                  />
                </div>
                
                {/* Tooltip */}
                <div className={`absolute left-full ml-4 top-1/2 transform -translate-y-1/2 
                  px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200
                  whitespace-nowrap transition-all duration-300 ease-out ${
                    (isHoveredItem || isActive) && isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                  style={{ zIndex: isHoveredItem ? 40 : 30 }}>
                  <span className="text-sm font-medium text-gray-800">{corner.name}</span>
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 
                    w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45"></div>
                </div>
              </button>
            </div>
          );
        })}

        {/* Center Indicator */}
        <div className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-700 ease-in-out ${
          isExpanded ? 'left-4 opacity-100' : 'left-1 opacity-50'
        }`}>
          <div className={`rounded-full transition-all duration-700 ease-in-out ${
            isExpanded
              ? 'w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600' 
              : 'w-1 h-4 bg-gray-300'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

export default WheelNavigation;