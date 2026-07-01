// Tiny classnames helper — joins truthy strings.
export const cn = (...parts) => parts.filter(Boolean).join(" ");
export default cn;
