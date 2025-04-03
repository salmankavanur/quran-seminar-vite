import React from 'react';
import { cn } from "@/lib/utils";

interface FixedLogoProps {
  className?: string;
}

const FixedLogo = ({ className }: FixedLogoProps) => {
  return (
    <div className={cn(
      "fixed bottom-8 left-8 z-50 overflow-hidden border-2 border-seminar-gold  w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center",
      "hover:scale-110 transition-transform duration-200",
      className
    )}>
      <img 
        src="https://ugc.production.linktr.ee/Naef3rk6SZqxrdWDiJ6Y_leujRCeS96Hzr8x9?io=true&size=avatar-v3_0" 
        alt="QLF Logo" 
        className="w-full h-full object-cover object-cover"
      />
    </div>
  );
};

export default FixedLogo; 