import fs from 'fs';
import path from 'path';

export const memoryStoreInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'memoryStoreInfo.json'))
);

export const segment1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'segment1.json')));
export const segment2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'segment2.json')));
export const segment3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'segment3.json')));
