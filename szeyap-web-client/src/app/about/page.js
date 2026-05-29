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
            <p className="text-lg sm:text-xl lg:text-l text-gray-700 mb-8">
              This is a modern, searchable dictionary that compiles existing dictionary resources in Taishanese, also known as Hoisanva.
            </p>

             <div className="max-w-3xl mx-auto">
            {/* Dictionary Data Section */}
            <section className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dictionary Data</h2>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://taishandict.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Stephen Li
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.chinfamilytree.com/hed/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Gene Chin
                  </a>
                </li>
              </ul>
            </section>

            {/* Romanization Systems Section */}
            <section className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Romanization Systems</h2>
              <ul className="space-y-3">
                <li>Learn to Speak Taishanese 1 by Jade Wu</li>
                <li>Taishanese Essentials 台山話概要 by Deng Jun 鄧鈞</li>
              </ul>
            </section>

            {/* Acknowledgements Section */}
            <section className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acknowledgements</h2>
              <p className="text-gray-700">
                Thank you to @suspiciouscactus on Discord for helping us retrieve the Stephen Li dictionary data, and to Chen-Yu Ho for creating <a href="https://www.chenyuho.com/project/handwritingjs/#demo">handwriting.js</a>
              </p>
            </section>

            {/* Contributors Section */}
            <section className="text-center mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contributors</h2>
              <p className="text-gray-700">
                Edmond Xu, Evan Loe, Sophia Chan, Sabrina Yu, Jackson Chen, Eric Chen
              </p>
            </section>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}