import Header from '../../components/Header';
import SocialSidebar from '../../components/SocialSidebar';
import Footer from '../../components/Footer';
import ScrollToTop from "@/components/ScrollToTop";


export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SocialSidebar />
      <main className="pt-32 flex-grow">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Main Logo */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <img
              src="/hoisan_sauce_logo.webp"
              alt="台山醬 Hoisan Sauce Logo"
              className="h-24 sm:h-32 md:h-36 lg:h-40 object-contain mx-auto mb-4 sm:mb-6"
            />
          </div>

          {/* Resources Content */}
          <section className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Under Construction</h2>
             Check back soon for more Taishanese resources here!
            </section>
        </div>
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}