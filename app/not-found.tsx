import CustomLink from "@/components/ui/CustomLink";
import { ArrowBigLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col grow items-center justify-center gap-8">
      <h1 className="page-title">Page Not Found!</h1>

      <CustomLink href="/">
        <ArrowBigLeft /> Go to the home page
      </CustomLink>
    </div>
  );
}
