'use client';

export default function SocialSidebar() {
  return (
    <div className="fixed left-8 top-32 hidden md:flex flex-col gap-2">
      <SocialItem
        imgSrc="youtube_icon.svg"
        altText="Hoisan Sauce Profile Pic"
        platform="Youtube"
        href="https://www.youtube.com/@HoisanSauce"
      />
      <SocialItem
        imgSrc="discord_logo.jpeg"
        altText="Hoisan Sauce Profile Pic"
        platform="Discord"
        className="h-8 rounded-lg"
        href="https://discord.gg/Jp8HfEEN"
      />
      <SocialItem
        imgSrc="github_logo.png"
        altText="GitHub Repository"
        platform="GitHub"
        className="h-8 rounded-lg"
        href="https://github.com/schan27/szeyap"
      />
    </div>
  );
}

function SocialItem({ imgSrc, altText, platform, className, href }) {
  return (
    <a 
      className="group px-4 py-0.5 border-l-2 border-gray-400 flex items-center justify-start gap-4 hover:scale-105 transition-all duration-500 opacity-80 hover:opacity-100 cursor-pointer" 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={imgSrc} alt={altText} className={`h-6 object-fill ${className}`} />
      <span className="text-gray-800 text-lg text-left group-hover:text-gray-600">{platform}</span>
    </a>
  );
}