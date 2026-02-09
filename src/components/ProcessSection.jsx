import { useEffect, useRef, useState } from 'react';
import AnimatedDivider from './AnimatedDivider';
import StepCard from './StepCard';

const processSteps = [
  {
    number: '01',
    icon: '💬',
    title: 'Consultation',
    description: 'Discuss your vision, style preferences, and requirements with our expert tailors.'
  },
  {
    number: '02',
    icon: '📏',
    title: 'Measurement',
    description: 'Precise measurements taken to ensure perfect fit and maximum comfort.'
  },
  {
    number: '03',
    icon: '✂️',
    title: 'Stitching',
    description: 'Expert craftsmanship with premium fabrics and meticulous attention to detail.'
  },
  {
    number: '04',
    icon: '🎁',
    title: 'Delivery',
    description: 'Final fitting and quality check before delivering your perfect outfit.'
  }
];

const ProcessSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative overflow-hidden bg-[#0b0b12] py-20">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl"></div>
        <div className="absolute right-[-6rem] bottom-0 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-200/80">Process</p>
          <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">Our Process</h2>
          <p className="mt-2 text-sm text-purple-300">How we create perfect outfits for you</p>
          <AnimatedDivider />
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">
            A seamless journey from consultation to delivery, ensuring your satisfaction at every step.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <StepCard key={step.number} {...step} isVisible={isVisible} delay={index * 120} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
