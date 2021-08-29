import React, { useMemo } from 'react';

type Props = {
  progress: number;
  size: number;
  strokeWidth: number;
  transitionMs: number;
};

const CircularProgress: React.FC<Partial<Props>> = ({ progress, size, strokeWidth, transitionMs }) => {

  const radius = size! / 2 - strokeWidth! / 2;
  const center = size! / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = useMemo(() => ((100 - progress!) / 100) * circumference, [progress, circumference]);

  return (
    <>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={center} cy={center} r={radius} stroke="rgba(255, 255, 255, 0.25)" fill="transparent" strokeWidth={strokeWidth}/>
        <circle cx={center} cy={center} r={radius} stroke="rgba(37, 99, 235, 0.75)" fill="transparent"
                strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transition: `stroke-dashoffset ${transitionMs}ms ease-in-out` }}/>
      </svg>
    </>
  );
};

CircularProgress.defaultProps = {
  size: 24,
  strokeWidth: 3,
  progress: 0,
  transitionMs: 50,
};

export default CircularProgress;
