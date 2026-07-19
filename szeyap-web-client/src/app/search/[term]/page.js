import Header from "@/components/Header";
import SocialSidebar from "@/components/SocialSidebar";
import SearchSection from "@/components/SearchSection";
import Footer from "@/components/Footer";

export default async function SearchPage({ params, searchParams }) {
  const { term } = await params;
  const { penyim } = await searchParams;

  const decodedTerm = decodeURIComponent(term);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SocialSidebar />
      <main className="pt-32 flex-grow">
        <SearchSection
          initialSearch={decodedTerm}
          initialPenyim={penyim === "true"}
        />
      </main>
      <Footer />
    </div>
  );
}