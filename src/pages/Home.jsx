import SEO from "../components/SEO";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";

function Home() {
  return (
    <>
      <SEO
        title="Rivera Coffee | Fresh Roasted Coffee in Calicut"
        description="Small-batch coffee roasted daily. Visit Rivera Coffee for espresso, filter coffee, and fresh pastries in Calicut."
      />
      <Hero />
      <About />
      <Services />
    </>
  );
}

export default Home;