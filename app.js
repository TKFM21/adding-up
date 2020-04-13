"use strict";
const fs = require("fs");
const readline = require("readline");
const rs = fs.createReadStream("./popu-pref.csv");
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map();
rl.on("line", (lineString) => {
  const columns = lineString.split(",");
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu0: 0,
        popu5: 0,
        change: null,
      };
    }
    if (year === 2010) {
      value.popu0 = popu;
    }
    if (year === 2015) {
      value.popu5 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on("close", () => {
  for (let [key, value] of prefectureDataMap) {
    value.change = value.popu5 / value.popu0;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair1[1].change - pair2[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value], index) => {
    return (
      index +
      1 +
      "位： " +
      key +
      ": " +
      value.popu0 +
      "=>" +
      value.popu5 +
      " 変化率：" +
      value.change
    );
  });
  console.log(rankingStrings);
});
