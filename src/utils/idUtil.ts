export const generateId = (size = 21) => {
  const characters =
    "QAZWSX_-puhygtCDERFVLdresxzPIOmnbvlkjawq019GTBJNHYUMK2837iofcx465";

  const now = Date.now().toString(36);

  const getChar = (i: number) => {
    return characters[i];
  };

  let id = now;
  for (let i = now.length; i < size; i++) {
    const randIndex = Math.floor(Math.random() * characters.length);
    id = getChar(randIndex) + id;
  }

  const addSpecials = () => {
    const ids = id.split("");
    Math.random() < 0.5
      ? (ids[Math.floor(Math.random() * id.length)] = "_")
      : (ids[Math.floor(Math.random() * id.length)] = "-");
    return ids.join("");
  };

  id = id.includes("_" || "-") ? id : addSpecials();
  return id;
};
