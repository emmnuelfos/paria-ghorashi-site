import type { SVGProps } from "react";

/** Arrow glyphs used site-wide (extracted inline SVGs). */

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      style={{ width: "1.25em", height: "1.25em", verticalAlign: "-0.25em" }}
      viewBox="0 0 84 85"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" />
    </svg>
  );
}

export function ArrowUpLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      style={{ width: "1.25em", height: "1.25em", verticalAlign: "-0.25em" }}
      viewBox="0 0 84 85"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="rotate(-135 42 42.5)">
        <path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" />
      </g>
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      style={{
        width: "0.9em",
        height: "0.9em",
        verticalAlign: "-0.1em",
        transform: "translateY(-0.1em)",
      }}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" />
    </svg>
  );
}
