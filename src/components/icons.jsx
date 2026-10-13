// Inline SVG icon set — keeps the bundle free of icon libraries.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

function Icon({ children, className = 'h-5 w-5', ...rest }) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const Icons = {
  overview: (p) => (
    <Icon {...p}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Icon>
  ),
  analytics: (p) => (
    <Icon {...p}>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </Icon>
  ),
  customers: (p) => (
    <Icon {...p}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3.5 20c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M16 15.2c2.2.3 3.8 1.9 4.3 4.3" />
    </Icon>
  ),
  revenue: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M15.2 9.2c-.5-1-1.7-1.6-3.2-1.6-1.9 0-3.3 1-3.3 2.4 0 3.2 6.8 1.6 6.8 4.9 0 1.5-1.5 2.5-3.5 2.5-1.6 0-2.9-.7-3.4-1.8" />
    </Icon>
  ),
  reports: (p) => (
    <Icon {...p}>
      <path d="M6 2.5h9L20 7.5V21.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-18a.5.5 0 0 1 .5-.5Z" />
      <path d="M14.5 2.5v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </Icon>
  ),
  settings: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
    </Icon>
  ),
  search: (p) => (
    <Icon {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Icon>
  ),
  bell: (p) => (
    <Icon {...p}>
      <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9Z" />
      <path d="M10 20a2.2 2.2 0 0 0 4 0" />
    </Icon>
  ),
  sun: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Icon>
  ),
  moon: (p) => (
    <Icon {...p}>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </Icon>
  ),
  chevronLeft: (p) => (
    <Icon {...p}>
      <path d="m14.5 6-6 6 6 6" />
    </Icon>
  ),
  chevronRight: (p) => (
    <Icon {...p}>
      <path d="m9.5 6 6 6-6 6" />
    </Icon>
  ),
  chevronDown: (p) => (
    <Icon {...p}>
      <path d="m6 9.5 6 6 6-6" />
    </Icon>
  ),
  arrowUp: (p) => (
    <Icon {...p}>
      <path d="M12 19V5" />
      <path d="m5.5 11.5 6.5-6.5 6.5 6.5" />
    </Icon>
  ),
  arrowDown: (p) => (
    <Icon {...p}>
      <path d="M12 5v14" />
      <path d="m5.5 12.5 6.5 6.5 6.5-6.5" />
    </Icon>
  ),
  bolt: (p) => (
    <Icon {...p}>
      <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z" />
    </Icon>
  ),
};
