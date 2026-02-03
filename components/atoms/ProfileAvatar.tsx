type ProfileAvatarProps = {
  src: string | null;
  alt: string;
  size?: string;
};

export function ProfileAvatar({ src, alt, size = "h-10 w-10" }: ProfileAvatarProps) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full ${size}`}>
      <img
        src={src ?? "/profileNullImg.webp"}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
