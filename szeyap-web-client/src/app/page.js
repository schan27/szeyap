import Header from '../components/Header';
import SocialSidebar from '../components/SocialSidebar';
import SearchSection from '../components/SearchSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <SocialSidebar />
      <main className="pt-8">
        <SearchSection />
      </main>
    </div>
  );
}
