"use client";

import Link from "next/link";
import { useState } from "react";
import DecryptedText from "./DecryptedText";

type Props = {
  href: string;
  children: string;
  external?: boolean;
};

export function NavLink({ href, children, external }: Props) {
  const [hovered, setHovered] = useState(false);

  const base =
    "relative text-xs font-medium text-neutral-700 hover:text-neutral-600 transition-colors";

  const content = (
    <span className="inline-block w-[100px] text-left">
      {hovered ? (
        <DecryptedText
          text={children}
          speed={100}
          maxIterations={20}
          characters="ABCD1234!?"
          className="revealed"
          parentClassName="all-letters"
          encryptedClassName="encrypted"
          animateOn="hover"
          revealDirection="start"
          sequential
        />
      ) : (
        children
      )}
    </span>
  );

  const commonProps = {
    className: base,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} {...commonProps}>
      {content}
    </Link>
  );
}