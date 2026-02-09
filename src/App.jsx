import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedDivider from './components/AnimatedDivider';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="bg-[#0b0b12] text-white">
      <Navbar />
      
      {!user ? (
        <>
          <div id="home">
            <Hero />
          </div>

          <AnimatedDivider />

          <div id="about">
            <About />
          </div>

          <AnimatedDivider />

          <div id="services">
            <Services />
          </div>

          <AnimatedDivider />

          <div id="gallery">
            <Gallery />
          </div>

          <div id="contact">
            <Contact />
          </div>

          <AnimatedDivider />

          <Footer />
        </>
      ) : (
        <>
          <div style={{position: 'fixed', top: '100px', right: '20px', background: 'yellow', color: 'black', padding: '10px', zIndex: 9999}}>
            User: {user.name}, Role: {user.role}
          </div>
          {user.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <UserDashboard />
          )}
        </>
      )}
    </div>
  );
}

export default App;
