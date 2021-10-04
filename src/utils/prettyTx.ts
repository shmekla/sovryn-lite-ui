export const prettyTx = (
  text: string,
  startLength = 6,
  endLength = 3,
): string => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start}...${end}`;
};
