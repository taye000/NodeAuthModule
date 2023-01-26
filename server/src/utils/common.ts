export const randomCode = async () => {
  const digits = 100000;
  return Math.floor(digits + Math.random() * 9000).toString();
};
