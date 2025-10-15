import Header from '../components/Header';
import SocialSidebar from '../components/SocialSidebar';
import SearchSection from '../components/SearchSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SocialSidebar />
      <main className="pt-32 flex-grow">
        <SearchSection />
      </main>
      <Footer />
    </div>
  );
}
