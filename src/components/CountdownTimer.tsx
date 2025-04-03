
import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Target date: April 10, 2025
    const targetDate = new Date('2025-04-10T00:00:00').getTime();
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        // Countdown complete
        setIsComplete(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Cleanup
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-medium mb-4 text-seminar-gold">
        {isComplete ? "Seminar Has Started" : "Time Remaining"}
      </h3>
      
      <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center h-16 md:h-24 w-16 md:w-24 bg-background border-2 border-seminar-gold rounded-lg">
            <span className="text-2xl md:text-4xl font-bold">{timeLeft.days}</span>
          </div>
          <span className="text-sm mt-1">Days</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center justify-center h-16 md:h-24 w-16 md:w-24 bg-background border-2 border-seminar-gold rounded-lg">
            <span className="text-2xl md:text-4xl font-bold">{timeLeft.hours}</span>
          </div>
          <span className="text-sm mt-1">Hours</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center justify-center h-16 md:h-24 w-16 md:w-24 bg-background border-2 border-seminar-gold rounded-lg">
            <span className="text-2xl md:text-4xl font-bold">{timeLeft.minutes}</span>
          </div>
          <span className="text-sm mt-1">Minutes</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center justify-center h-16 md:h-24 w-16 md:w-24 bg-background border-2 border-seminar-gold rounded-lg">
            <span className="text-2xl md:text-4xl font-bold">{timeLeft.seconds}</span>
          </div>
          <span className="text-sm mt-1">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
