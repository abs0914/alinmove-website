import Image from "next/image";

export const AdminIcon = () => (
  <Image
    src="/src/ALiNmove_logo.png"
    alt="ALiN Move"
    width={120}
    height={32}
    style={{ objectFit: "contain", objectPosition: "left center" }}
  />
);
