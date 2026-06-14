import versionData from "../../public/version.json";

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-2">
        <div>
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

        <div className="text-xs text-gray-500">
          Version {versionData.version}
        </div>
      </div>
    </footer>
  );
}