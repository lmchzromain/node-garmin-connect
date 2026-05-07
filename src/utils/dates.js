export const lastNDays = (endDate, n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

export const groupByDate = (keys, ...arrays) =>
  arrays[0].map((_, i) =>
    keys.reduce(
      (acc, key, j) => ({ ...acc, [key]: arrays[j][i] }),
      { date: arrays[0][i]?.date },
    ),
  );
