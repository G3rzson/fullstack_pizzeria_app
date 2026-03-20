import Link from "next/link";
import Image from "next/image";
import { LOGO_DATA } from "../Constants/Constants";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        priority
        src={LOGO_DATA.src}
        alt={LOGO_DATA.alt}
        width={LOGO_DATA.width}
        height={LOGO_DATA.height}
      />
    </Link>
  );
}
