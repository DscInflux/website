import type { ReactElement } from "react";
import { FaDiscord, FaReddit, FaGithub, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaStackOverflow, FaYoutube, FaSteam, FaTwitch, FaSnapchatGhost, FaTiktok, FaTelegramPlane, FaSoundcloud, FaPaypal, FaPinterest, FaPatreon, FaGitlab, FaRegMoneyBillAlt } from "react-icons/fa";
import { SiMyanimelist, SiOnlyfans, SiRoblox, SiCashapp, SiBuymeacoffee, SiNamemc, SiKofi } from "react-icons/si";
import { TbBrandMinecraft } from "react-icons/tb";

export const SOCIAL_PROVIDERS = [
  {
    name: "Github",
    url: "https://github.com/{username}",
  },
  {
    name: "Twitter/X",
    url: "https://x.com/{username}",
  },
  {
    name: "Facebook",
    url: "https://facebook.com/{username}",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/{username}",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/{username}",
  },
  {
    name: "StackOverflow",
    url: "https://stackoverflow.com/users/{username}",
  },
  {
    name: "Reddit",
    url: "https://reddit.com/user/{username}",
  },
  {
    name: "YouTube",
    url: "https://youtube.com/channel/{username}",
  },
  {
    name: "Steam",
    url: "https://steamcommunity.com/{username}",
  },
  {
    name: "Twitch",
    url: "https://www.twitch.tv/{username}",
  },
  {
    name: "MyAnimeList",
    url: "https://myanimelist.net/profile/{username}",
  },
  {
    name: "Discord",
    url: "https://discord.com/users/{username}",
  },
  {
    name: "OnlyFans",
    url: "https://onlyfans.com/{username}",
  },
  {
    name: "Snapchat",
    url: "https://snapchat.com/add/{username}",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@{username}",
  },
  {
    name: "Telegram",
    url: "https://t.me/{username}",
  },
  {
    name: "SoundCloud",
    url: "https://soundcloud.com/{username}",
  },
  {
    name: "Roblox",
    url: "https://www.roblox.com/users/{username}/profile",
  },
  {
    name: "PayPal",
    url: "https://paypal.me/{username}",
  },
  {
    name: "CashApp",
    url: "https://cash.app/${username}",
  },
  {
    name: "GitLab",
    url: "https://gitlab.com/{username}",
  },
  {
    name: "Minecraft",
    url: "https://minecraft.net/en-us/profile/{username}",
  },
  {
    name: "NameMC",
    url: "https://namemc.com/profile/{username}",
  },
  {
    name: "Pinterest",
    url: "https://pinterest.com/{username}",
  },
  {
    name: "BuyMeACoffee",
    url: "https://buymeacoffee.com/{username}",
  },
  {
    name: "Patreon",
    url: "https://patreon.com/{username}",
  },
  {
    name: "Ko-fi",
    url: "https://ko-fi.com/{username}",
  },
];

export const SOCIAL_ICON_MAP: Record<string, ReactElement> = {
  Discord: <FaDiscord className="w-5 h-5" aria-label="Discord" />,
  Reddit: <FaReddit className="w-5 h-5" aria-label="Reddit" />,
  Github: <FaGithub className="w-5 h-5" aria-label="Github" />,
  "Twitter/X": <FaTwitter className="w-5 h-5" aria-label="Twitter/X" />,
  Facebook: <FaFacebook className="w-5 h-5" aria-label="Facebook" />,
  Instagram: <FaInstagram className="w-5 h-5" aria-label="Instagram" />,
  LinkedIn: <FaLinkedin className="w-5 h-5" aria-label="LinkedIn" />,
  StackOverflow: <FaStackOverflow className="w-5 h-5" aria-label="StackOverflow" />,
  YouTube: <FaYoutube className="w-5 h-5" aria-label="YouTube" />,
  Steam: <FaSteam className="w-5 h-5" aria-label="Steam" />,
  Twitch: <FaTwitch className="w-5 h-5" aria-label="Twitch" />,
  MyAnimeList: <SiMyanimelist className="w-5 h-5" aria-label="MyAnimeList" />,
  OnlyFans: <SiOnlyfans className="w-5 h-5" aria-label="OnlyFans" />,
  Snapchat: <FaSnapchatGhost className="w-5 h-5" aria-label="Snapchat" />,
  TikTok: <FaTiktok className="w-5 h-5" aria-label="TikTok" />,
  Telegram: <FaTelegramPlane className="w-5 h-5" aria-label="Telegram" />,
  SoundCloud: <FaSoundcloud className="w-5 h-5" aria-label="SoundCloud" />,
  Roblox: <SiRoblox className="w-5 h-5" aria-label="Roblox" />,
  PayPal: <FaPaypal className="w-5 h-5" aria-label="PayPal" />,
  CashApp: <SiCashapp className="w-5 h-5" aria-label="CashApp" />,
  GitLab: <FaGitlab className="w-5 h-5" aria-label="GitLab" />,
  Minecraft: <TbBrandMinecraft className="w-5 h-5" aria-label="Minecraft" />,
  NameMC: <SiNamemc className="w-5 h-5" aria-label="NameMC" />,
  Pinterest: <FaPinterest className="w-5 h-5" aria-label="Pinterest" />,
  BuyMeACoffee: <SiBuymeacoffee className="w-5 h-5" aria-label="BuyMeACoffee" />,
  Patreon: <FaPatreon className="w-5 h-5" aria-label="Patreon" />,
  "Ko-fi": <SiKofi className="w-5 h-5" aria-label="Ko-fi" />,
};
