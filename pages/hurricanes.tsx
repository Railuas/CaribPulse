import dynamic from 'next/dynamic';

const HurricaneTracker = dynamic(() => import('../components/HurricaneTracker'), { ssr: false });

export default function Hurricanes() {
  return (
    <div>
      <HurricaneTracker />
      <p className="muted small" style={{ marginTop: 8 }}>
        
      </p>
    </div>
  );
}
