import { COLORS } from "@/constants";

export function HalftonePattern() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="halftone" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="3" fill={COLORS.white} /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#halftone)" />
    </svg>
  );
}