export function createValueScaler(values, minSize = 8, maxSize = 40, mode = "sqrt") {
  const numericValues = values
    .map(Number)
    .filter((v) => Number.isFinite(v) && v >= 0);

  const minVal = Math.min(...numericValues);
  const maxVal = Math.max(...numericValues);

  // fallback if all values are same
  if (!numericValues.length || minVal === maxVal) {
    return () => (minSize + maxSize) / 2;
  }

  return (value) => {
    let t = (value - minVal) / (maxVal - minVal); // normalize 0 to 1

    // optional non-linear scaling
    if (mode === "sqrt") t = Math.sqrt(t);
    if (mode === "log") {
      const logMin = Math.log(minVal + 1);
      const logMax = Math.log(maxVal + 1);
      t = (Math.log(value + 1) - logMin) / (logMax - logMin);
    }

    return minSize + t * (maxSize - minSize);
  };
}