"use client";

import { useEffect, useState } from 'react';

const Sparkle = ({ style }: { style: React.CSSProperties }) => {
  return <div className="sparkle-instance" style={style} />;
};

const Sparkles = ({ count = 40 }: { count?: number }) => {
  const [sparkles, setSparkles] = useState<any[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        },
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    
    // We don't need to regenerate on resize for this effect,
    // as it's purely decorative and covers the viewport.
  }, [count]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {sparkles.map(sparkle => (
        <Sparkle key={sparkle.id} style={sparkle.style} />
      ))}
    </div>
  );
};

export default Sparkles;
