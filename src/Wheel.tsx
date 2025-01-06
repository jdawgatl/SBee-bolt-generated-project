import React from 'react';

interface WheelProps {
  mustStartSpinning: boolean;
  prizeNumber: number;
  data: { option: string; style?: { backgroundColor?: string; textColor?: string } }[];
  onStopSpinning: () => void;
  textColors: string[];
  fontSize: number;
}

const Wheel: React.FC<WheelProps> = ({
  mustStartSpinning,
  prizeNumber,
  data,
  onStopSpinning,
  textColors,
  fontSize,
}) => {
  const [spinning, setSpinning] = React.useState(false);

  React.useEffect(() => {
    if (mustStartSpinning) {
      setSpinning(true);
      const timer = setTimeout(() => {
        setSpinning(false);
        onStopSpinning();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [mustStartSpinning, onStopSpinning]);

  const getRotation = (index: number) => {
    const segmentAngle = 360 / data.length;
    return segmentAngle * index;
  };

  const getSegmentPath = (index: number) => {
    const startAngle = (index * 360) / data.length;
    const endAngle = ((index + 1) * 360) / data.length;
    const radius = 100;
    const x = 125;
    const y = 125;

    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      x,
      y,
      'L',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'Z',
    ].join(' ');
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="wheel-container">
      <svg
        width="250"
        height="250"
        viewBox="0 0 250 250"
        className={spinning ? 'spin' : ''}
        style={{ transform: `rotate(${-90 - (prizeNumber * 360) / data.length}deg)` }}
      >
        {data.map((segment, index) => {
          const segmentPath = getSegmentPath(index);
          const textColor = segment.style?.textColor || textColors[0];
          const midAngle = (index + 0.5) * (360 / data.length);
          const textX = 125 + 50 * Math.cos((midAngle * Math.PI) / 180); // Adjusted for text position
          const textY = 125 + 50 * Math.sin((midAngle * Math.PI) / 180);

          return (
            <g key={index}>
              <path
                d={segmentPath}
                fill={segment.style?.backgroundColor}
                stroke="white"
                strokeWidth="1"
              />
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={textColor}
                fontSize={fontSize}
                fontWeight="bold"
                transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                style={{ userSelect: 'none' }}
              >
                {segment.option}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="wheel-marker"></div>
      <div className="wheel-center"></div>
    </div>
  );
};

export default Wheel;
