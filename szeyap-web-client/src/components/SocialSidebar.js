'use client';

// Social media links data
export const socialLinks = [
  {
    imgSrc: "/youtube_logo.svg",
    altText: "YouTube logo",
    platform: "YouTube",
    className: "h-1",
    href: "https://www.youtube.com/@HoisanSauce"
  },
  {
    imgSrc: "/discord_logo.jpeg",
    altText: "Discord logo",
    platform: "Discord",
    className: "h-8 rounded-lg",
    href: "https://discord.gg/TtU2v3S"
  },
  {
    imgSrc: "/github_logo.png",
    altText: "GitHub logo",
    platform: "GitHub",
    className: "h-8 rounded-lg",
    href: "https://github.com/schan27/szeyap"
  },
  {
    imgSrc: "/linktree_logo.png",
    altText: "Linktree logo",
    platform: "Linktree",
    className: "h-8 rounded-lg",
    href: "https://linktr.ee/hoisansauce"
  },
];

export default function SocialSidebar() {
  return (
    <div className="fixed left-6 top-32 hidden lg:flex flex-col gap-2">
      {socialLinks.map((link) => (
        <SocialItem key={link.platform} {...link} />
      ))}
    </div>
  );
}

function SocialItem({ imgSrc, altText, platform, className, href }) {
  return (
    <a 
      className="group px-3 py-0.5 border-l-2 border-gray-400 flex items-center justify-start gap-3 hover:scale-105 transition-all duration-500 opacity-80 hover:opacity-100 cursor-pointer" 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={imgSrc} alt={altText} className={`h-6 object-fill ${className}`} />
      <span className="text-gray-800 text-lg text-left group-hover:text-gray-600">{platform}</span>
    </a>
  );
}