import React, { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';

interface Token {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export const ParachuteTokens: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    // Generate initial tokens
    const generateTokens = () => {
      const newTokens: Token[] = [];
      for (let i = 0; i < 15; i++) {
        newTokens.push({
          id: i,
          x: Math.random() * 100, // Random horizontal position (0-100%)
          delay: Math.random() * 5, // Random delay (0-5s)
          duration: 8 + Math.random() * 4, // Random duration (8-12s)
          size: 20 + Math.random() * 16, // Random size (20-36px)
        });
      }
      setTokens(newTokens);
    };

    generateTokens();

    // Regenerate tokens periodically to keep the animation going
    const interval = setInterval(generateTokens, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {tokens.map((token) => (
        <div
          key={token.id}
          className="absolute animate-parachute"
          style={{
            left: `${token.x}%`,
            animationDelay: `${token.delay}s`,
            animationDuration: `${token.duration}s`,
          }}
        >
          {/* Token */}
          <div 
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            style={{ 
              width: `${token.size}px`, 
              height: `${token.size}px`,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <Coins 
              className="text-white" 
              style={{ width: `${token.size * 0.6}px`, height: `${token.size * 0.6}px` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};