import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import AnimatedDivider from './AnimatedDivider';
import ServiceCard from './ServiceCard';
import StepCard from './StepCard';

const services = [
  {
    icon: '👗',
    title: 'Custom Dresses',
    description: 'Tailored dresses for all occasions, from casual to formal.'
  },
  {
    icon: '🧵',
    title: 'Saree Blouse Stitching',
    description: 'Perfect fit and stylish designs for traditional sarees.'
  },
  {
    icon: '✨',
    title: 'Gown Tailoring',
    description: 'Evening gowns and party wear with premium finishes.'
  },
  {
    icon: '👚',
    title: 'Kurti & Salwar Stitching',
    description: 'Casual and formal wear with elegant designs.'
  },
  {
    icon: '🔧',
    title: 'Alterations & Repairs',
    description: 'Adjustments to fit perfectly, hemming, and repairs.'
  },
  {
    icon: '💍',
    title: 'Bridal & Wedding Outfits',
    description: 'Designer bridal wear and wedding ensemble tailoring.'
  },
  {
    icon: '🌟',
    title: 'Premium Fabric Stitching',
    description: 'High-quality fabric tailoring with attention to detail.'
  },
  {
    icon: '🧥',
    title: 'Custom Jackets & Coats',
    description: 'Stylish outerwear for women with perfect fit.'
  }
];

const Services = () => {
  const [sectionRef, isVisible] = useIntersectionObserver();

  return (
    <div className="bg-[#0b0b12]">
      {/* Services Grid */}
      <section ref={sectionRef} id="services" className="relative overflow-hidden bg-[#0b0b12] py-20">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl"></div>
          <div className="absolute right-[-6rem] bottom-0 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-purple-200/80">Services</p>
            <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">Our Tailoring Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">
              Comprehensive tailoring services for women, from custom stitching to intricate alterations.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <ServiceCard key={service.title} {...service} isVisible={isVisible} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative overflow-hidden bg-[#0b0b12] py-20">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl"></div>
          <div className="absolute right-[-6rem] bottom-0 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AnimatedDivider />
            <p className="text-xs uppercase tracking-[0.35em] text-purple-200/80">Process</p>
            <h2 className="mt-3 text-4xl font-bold text-white md:text-5xl">Our Process</h2>
            <p className="mt-2 text-sm text-purple-300">How we create perfect outfits for you</p>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">
              A seamless journey from consultation to delivery, ensuring your satisfaction at every step.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard number="01" icon="💬" title="Consultation" description="Discuss your vision, style preferences, and requirements with our experts." isVisible={isVisible} delay={0} />
            <StepCard number="02" icon="📏" title="Measurement" description="Precise measurements taken to ensure perfect fit and comfort." isVisible={isVisible} delay={120} />
            <StepCard number="03" icon="✂️" title="Stitching" description="Expert craftsmanship with premium fabrics and meticulous attention." isVisible={isVisible} delay={240} />
            <StepCard number="04" icon="🎁" title="Delivery" description="Final fitting and quality check before delivering your outfit." isVisible={isVisible} delay={360} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
