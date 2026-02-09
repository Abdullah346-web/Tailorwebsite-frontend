import { useEffect, useRef, useState } from 'react';
import AnimatedDivider from './AnimatedDivider';
import TeamCard from './TeamCard';
import shahbazImg from '../assets/shahbaz.jpg';
import basitImg from '../assets/basit.jpeg';
import uzairImg from '../assets/uzair.jpg';
import mohsinImg from '../assets/mohsin.jpeg';

const teamMembers = [
  {
    name: 'Muhammad Shahbaz',
    role: 'Lead Tailor',
    image: shahbazImg,
    description: 'Premium tailoring expertise',
    experience: 15,
    skills: ['Stitching', 'Custom Designs', 'Fitting']
  },
  {
    name: 'Muhammad Basit',
    role: 'Senior Tailor',
    image: basitImg,
    description: 'Wedding & formal wear specialist',
    experience: 8,
    skills: ['Bridal Work', 'Formal Wear', 'Stitching']
  },
  {
    name: 'Uzair Khan',
    role: 'Junior Tailor',
    image: uzairImg,
    description: 'Modern cuts & designs',
    experience: 5,
    skills: ['Modern Cuts', 'Fabric Selection', 'Design']
  },
  {
    name: 'Muhammad Mohsin',
    role: 'Apprentice Tailor',
    image: mohsinImg,
    description: 'Precision & detail specialist',
    experience: 3,
    skills: ['Precision Stitching', 'Measurements', 'Fitting']
  }
];

const TeamSection = () => {
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
      { threshold: 0.18 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="team" className="relative overflow-hidden bg-[#0b0b12] py-20">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl"></div>
        <div className="absolute right-[-6rem] bottom-0 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <AnimatedDivider />
          <p className="text-xs uppercase tracking-[0.35em] text-purple-200/80">Team</p>
          <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">Our Professional Team</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">
            Premium craftsmanship, meticulous fittings, and attentive service from a crew that lives and breathes tailoring.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.name} {...member} isVisible={isVisible} delay={index * 120} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
