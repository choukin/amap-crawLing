/* eslint-disable @typescript-eslint/no-var-requires */
const copyfiles = require('copyfiles');

copyfiles(
  ['src/crawLing/stealth.min.js', 'dist/crawLing'],
  { up: 1 },
  (err) => {
    if (err) {
      console.error('Error copying file:', err);
    } else {
      console.log('File copied successfully');
    }
  },
);
// copyfiles(['node_modules/chrome', 'dist'], { up: 1 }, (err) => {
//   if (err) {
//     console.error('Error copying file:', err);
//   } else {
//     console.log('File copied successfully');
//   }
// });
