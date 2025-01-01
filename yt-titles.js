const path = require('path');
const fs = require('fs');
const https = require('https');
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const regex = /<y-t\s+v="([^"]+)"(?:(?!t).)*?>/g;
async function fetchTitle(videoId) {
  const response = await new Promise((resolve, reject) => {
    https.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId.split('?')[0]}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
  return response.title;
}
async function updateTitles() {
  let matches = [...htmlContent.matchAll(regex)];
  const replacements = await Promise.all(Array.from(matches).map(async match => {
    const videoId = match[1];
    const title = await fetchTitle(videoId);
    let newTag = `<y-t`;
    const existingAttributes = match[0].match(/\w+="[^"]*"/g);
    existingAttributes.forEach(attr => {
      newTag += ` ${attr}`;
    });
    if (match[0].includes('t="')) {
      const existingTitle = match[0].match(/t="([^"]*)"/)[1];
      if (existingTitle) {
        newTag += ` t="${existingTitle}"`;
      } else {
        newTag += ` t="${title}"`;
      }
    } else {
      newTag += ` t="${title}"`;
    }
    newTag += '>';
    return {
      old: match[0],
      new: newTag
    };
  }));
  replacements.forEach(replacement => {
    htmlContent = htmlContent.replace(replacement.old, replacement.new);
  });
  fs.writeFileSync('index.html', htmlContent, 'utf8');
}
updateTitles().then(() => console.log('Titles updated.'));
