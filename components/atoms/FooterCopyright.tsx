type FooterCopyrightProps = {
  year?: number;
  siteName?: string;
};

export function FooterCopyright({
  year = new Date().getFullYear(),
  siteName = "TypeSomething",
}: FooterCopyrightProps) {
  return (
    <p className="text-xs text-neutral-500">
      Copyright © {year} {siteName}. All rights reserved.
    </p>
  );
}
