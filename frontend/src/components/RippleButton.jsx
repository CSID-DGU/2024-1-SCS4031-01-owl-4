import { useState, useRef, useEffect } from 'react';
import '../RippleButton.css';

const RippleButton = ({ children }) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 300);
    } else setIsRippling(false);
  }, [coords]);

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);

  const handleClick = e => {
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ripple-button"
      onClick={handleClick}
      ref={buttonRef}
    >
      {isRippling && (
        <span
          className="ripple"
          style={{
            left: coords.x,
            top: coords.y,
          }}
        />
      )}
      <span className="content">{children}</span>
    </button>
  );
};

export default RippleButton;
