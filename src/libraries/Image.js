import { useState, useRef } from "react";
import Image from "next/image";

export default function ImageWithFallback(props) {
  const { fallbackSrc, src, ...rest } = props;
  const [oldSRC, setOldSrc] = useState(src);
  const [imageSRC, setImageSRC] = useState(false);
  const [fallbackImage, setFallbackImage] = useState(false);

  if (fallbackSrc === "banner" && !fallbackImage)
    setFallbackImage(
      "https://cdn.dscinflux.xyz/assets/jpg/influxbanner.jpg",
    );
  if (fallbackSrc === "avatar" && !fallbackImage)
    setFallbackImage(
      "https://cdn.dscinflux.xyz/assets/png/influx.png",
    );

  if (imageSRC === false && oldSRC !== src) {
    if (imageSRC) setImageSRC(false);
    setOldSrc(src);
  }

  return (
    <img
      alt={"dscinflux.xyz/image"}
      key={imageSRC}
      src={imageSRC ? fallbackImage : src}
      onError={() => {
        setImageSRC(true);
      }}
      draggable={false}
      layout="fill"
      {...rest}
    />
  );
}
