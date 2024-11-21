import { FeaturesSection } from '@frontend/pages/home/components/FeaturesSection.tsx';
import { HeroSection } from '@frontend/pages/home/components/HeroSection.tsx';
import { QuestionsSection } from '@frontend/pages/home/components/QuestionsSection.tsx';

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <QuestionsSection />
    </>
  );
};
