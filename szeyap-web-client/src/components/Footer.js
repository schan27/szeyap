import nextConfig from "../../next.config.mjs";

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div></div>
        <div className="text-center">
          <span className="text-sm text-gray-600">License: </span>
          <a 
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            Attribution-NonCommercial-ShareAlike 4.0 International
          </a>
        </div>
        <div className="text-sm text-gray-600 ml-4">Version: {nextConfig.version}</div>
      </div>
    </footer>
  );
}