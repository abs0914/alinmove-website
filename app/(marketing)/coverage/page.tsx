import { permanentRedirect } from "next/navigation";

export default function CoveragePage() {
  permanentRedirect("/branches");
}
