import CalorieTracker from './components/CalorieTracker';
import SnowAnimation from './components/SnowAnimation';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <SnowAnimation />
      <div className="relative z-10 min-h-screen py-8">
        <CalorieTracker />
      </div>
    </div>
  );
}
