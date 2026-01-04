'use client';

export default function AnimatedBackground() {
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Orb 1 */}
      <div
        className="absolute top-0 right-0 rounded-full bg-orb-1"
        style={{
          width: '384px',
          height: '384px',
          transform: 'translate(25%, -25%)',
          filter: 'blur(60px)',
          animation: 'floatOrb1 20s ease-in-out infinite'
        }}
      />
      
      {/* Orb 2 */}
      <div
        className="absolute bottom-0 left-0 rounded-full bg-orb-2"
        style={{
          width: '320px',
          height: '320px',
          transform: 'translate(-25%, 25%)',
          filter: 'blur(60px)',
          animation: 'floatOrb2 25s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />
      
      {/* Orb 3 */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full bg-orb-3"
        style={{
          width: '288px',
          height: '288px',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(60px)',
          animation: 'floatOrb3 30s ease-in-out infinite',
          animationDelay: '4s'
        }}
      />
    </div>
  );
}
