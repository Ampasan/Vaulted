import { useState, useEffect } from 'react';

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  };
};

const Countdown = ({ initialSeconds = 3600, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="flex items-center text-3xl font-mono font-bold tracking-tight">
      <span>{hours}</span>
      <span className="mx-2 text-gray-400 font-normal">:</span>
      <span>{minutes}</span>
      <span className="mx-2 text-gray-400 font-normal">:</span>
      <span>{seconds}</span>
    </div>
  );
};

export default Countdown;
