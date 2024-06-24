const CircularProgress = ({ progress }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg className="rotate-[-90deg]" width="50" height="50">
      <circle
        className="text-slate-600 stroke-current"
        strokeWidth="4"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="25"
        cy="25"
      />
      <circle
        className="text-yellow-500 stroke-current"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx="25"
        cy="25"
        style={{
          transition: 'stroke-dashoffset 0.1s ease-in-out', // CSS transition 설정
        }}
      />
    </svg>
  );
};

export default CircularProgress;
