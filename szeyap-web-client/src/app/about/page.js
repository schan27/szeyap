import Header from '../../components/Header';
import SocialSidebar from '../../components/SocialSidebar';
import Footer from '../../components/Footer';

export default function AboutPage() {
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

          {/* About Content */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8">
              This is a modern, searchable dictionary that compiles existing dictionary resources in Taishanese, also known as Hoisanva
            </p>
            
            <div className="mt-12">
              <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-4">Team</h2>
              <p className="text-lg sm:text-xl text-gray-700">
                Edmond Xu, Evan Loe, Sophia Chan, and Sabrina Yu
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}