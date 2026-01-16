import CalorieTracker from './components/CalorieTracker';
import SnowAnimation from './components/SnowAnimation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black relative overflow-hidden">
      <SnowAnimation />
      <div className="relative z-10 min-h-screen py-8">
        <CalorieTracker />
      </div>
    </div>
  );
}
