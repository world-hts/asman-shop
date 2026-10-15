import type { SVGProps } from "react";

export type IconName = "search" | "user" | "phone" | "home" | "grid" | "heart" | "chevron" | "arrow" | "box" | "headphones" | "watch" | "charger" | "laptop" | "case" | "store" | "lock";

const paths: Record<IconName, string[]> = {
  search: ["M11 4a7 7 0 1 0 4.95 11.95L21 21", "M16 11a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"],
  user: ["M20 21a8 8 0 0 0-16 0", "M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],
  phone: ["M7 4h3l1 4-2 2a14 14 0 0 0 5 5l2-2 4 1v3a2 2 0 0 1-2.2 2A17 17 0 0 1 5 6.2 2 2 0 0 1 7 4Z"],
  home: ["m3 10 9-7 9 7", "M5 9v10h14V9", "M9 19v-6h6v6"],
  grid: ["M4 4h6v6H4z", "M14 4h6v6h-6z", "M4 14h6v6H4z", "M14 14h6v6h-6z"],
  heart: ["M20.8 8.6c0 5.2-8.8 10-8.8 10S3.2 13.8 3.2 8.6A4.6 4.6 0 0 1 8 4c1.4 0 2.8.7 4 2.1C13.2 4.7 14.6 4 16 4a4.6 4.6 0 0 1 4.8 4.6Z"],
  chevron: ["m9 18 6-6-6-6"],
  arrow: ["M5 12h13", "m13 6 6 6-6 6"],
  box: ["m3 7 9-4 9 4-9 4-9-4Z", "M3 7v10l9 4 9-4V7", "M12 11v10"],
  headphones: ["M4 14a8 8 0 0 1 16 0", "M4 14v4a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2Z", "M20 14v4a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2Z"],
  watch: ["M8 4 9 2h6l1 2", "M16 20l-1 2H9l-1-2", "M6 6h12v12H6z", "M10 9h4", "M10 12h4"],
  charger: ["M8 3v6", "M16 3v6", "M6 7h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V7Z", "M12 17v4"],
  laptop: ["M5 5h14v10H5z", "M3 19h18", "M9 19l1-2h4l1 2"],
  case: ["M7 7h10v13H7z", "M9 7V5a3 3 0 0 1 6 0v2", "M9 11h6"],
  store: ["M4 10h16", "M5 10v10h14V10", "M3 10l2-6h14l2 6", "M9 20v-6h6v6"],
  lock: ["M6 10h12v10H6z", "M8 10V7a4 4 0 0 1 8 0v3", "M12 14v2"],
};

export function Icon({ name, size = 20, strokeWidth = 1.8, className = "" }: { name: IconName; size?: number; strokeWidth?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name].map((d, index) => <path d={d} key={index} />)}
    </svg>
  );
}
