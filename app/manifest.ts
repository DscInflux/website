import type { MetadataRoute } from "next";
import {
  siteTitle,
  description_short,
  banner as defaultImage,
  website_url,
  logo,
  siteKeywords,
  twitter,
} from "../lib/siteConfig";

const manifest: MetadataRoute.Manifest = {
  name: siteTitle,
  short_name: siteTitle,
  description: description_short,
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  orientation: "portrait",
  icons: [
    {
      src: logo ?? "/logo.webp",
      sizes: "192x192",
      type: "image/webp",
    },
    {
      src: logo ?? "/logo.webp",
      sizes: "512x512",
      type: "image/webp",
    },
  ],
};

export default manifest;
