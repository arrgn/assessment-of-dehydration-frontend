import { useState, type FC } from "react";
import { DEFAULT_IMAGE, DEFAULT_VIDEO } from "../../modules/media";

interface ImageProps {
  src: string;
  className?: string;
  alt?: string;
}

/**
 * Изображение услуги. Если поле imgSrc пустое или файл не загрузился
 * (например, MinIO недоступен) — показывается изображение по умолчанию.
 */
export const SignImage: FC<ImageProps> = ({ src, className, alt = "" }) => {
  const [failed, setFailed] = useState(false);

  return (
    <img
      className={className}
      src={!src || failed ? DEFAULT_IMAGE : src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
};

interface VideoProps {
  src: string;
  poster: string;
  className?: string;
}

/**
 * Видео услуги. При пустом vidSrc или ошибке загрузки подставляются
 * видео и обложка по умолчанию.
 */
export const SignVideo: FC<VideoProps> = ({ src, poster, className }) => {
  const [failed, setFailed] = useState(false);
  const useDefault = !src || failed;

  return (
    <video
      className={className}
      src={useDefault ? DEFAULT_VIDEO : src}
      poster={useDefault || !poster ? DEFAULT_IMAGE : poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onError={() => setFailed(true)}
    />
  );
};
