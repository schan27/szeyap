import Header from "@/components/Header";
import SocialSidebar from "@/components/SocialSidebar";
import SearchSection from "@/components/SearchSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";


export default async function SearchPage({ params }) {
  const { term } = await params;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SocialSidebar />
      <main className="pt-32 flex-grow">
        <SearchSection initialSearch={term} />
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}