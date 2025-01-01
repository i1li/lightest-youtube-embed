require('dotenv').config();
const KEY = process.env.KEY
const path = require('path');
const fs = require('fs');
const https = require('https');
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const searchDivRegex = /id="shuffle">([\s\S]*?)<\/div>/;
const searchDiv = htmlContent.match(searchDivRegex)?.[1] || '';
const playlistIdRegex = /(?:p="([^"]+)"|v="([^"]+)")/g;
const totalVideosRegex = /"total-videos">([^<]*)<\/span>/;
function readExcludedIds() {
  try {
    const data = fs.readFileSync('exclude.txt', 'utf8');
    return data.split(',').map(id => id.trim()).filter(id => id !== '');
  } catch (err) {
    console.error('Error reading exclude.txt:', err);
    return [];
  }
}
const excludedIds = readExcludedIds();
if (!KEY) {
  throw new Error('API key is missing or empty. Please provide a valid API key. https://developers.google.com/youtube/v3/getting-started#before-you-start');
}
const extractIds = (regex, source) => {
  const ids = [];
  let match;
  while ((match = regex.exec(source)) !== null) {
    if (match[1]) {
      ids.push(...match[1].split(',').map(id => id.trim()));
    } else if (match[2]) {
      ids.push(...match[2].split(',').map(id => id.trim()));
    }
  }
  return ids;
};
const allIds = extractIds(playlistIdRegex, searchDiv);
const playlistIds = allIds.filter(id => id.split('?')[0].length > 11);
const videoIds = allIds.filter(id => id.split('?')[0].length === 11);
const getPlaylistItems = async (playlistIDs) => {
  let availableVideoIds = {};
  let errorCount = 0;
  for (const playlistID of playlistIDs) {
    try {
      console.log(`Fetching playlist items for playlist ID: ${playlistID}`);
      let pageToken = null;
      let totalItems = 0;
      let videoIds = [];
      do {
        const params = {
          part: 'id,snippet,status',
          maxResults: 50,
          playlistId: playlistID.trim(),
          key: KEY,
          pageToken: pageToken,
        };
        const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
        url.search = new URLSearchParams(params).toString();
        url.href = url.href.replace(/&pageToken=null/, '');
        const result = await new Promise((resolve, reject) => {
          https.get(url.toString(), (res) => {
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
        const availableVideos = result.items.filter((item) => 
          item.status.privacyStatus === 'public' && 
          !excludedIds.includes(item.snippet.resourceId.videoId)
        );
        videoIds = [...videoIds, ...availableVideos.map((item) => item.snippet.resourceId.videoId)];
        totalItems += result.items.length;
        console.log(`Fetched ${totalItems} items for playlist ID: ${playlistID}`);
        pageToken = result.nextPageToken;
      } while (pageToken);
      availableVideoIds[playlistID] = videoIds;
    } catch (error) {
      errorCount++;
      if (error.response && error.response.status === 404) {
        console.warn(`Skipping invalid playlist ID: ${playlistID}`);
      } else {
        console.error(`Error fetching playlist items for playlist ID ${playlistID}: ${error.message}`);
      }
    }
  }
  return { availableVideoIds, errorCount };
};
const writeOutput = async () => {
  const { availableVideoIds, errorCount } = await getPlaylistItems(playlistIds);
  let totalVideoCount = 0;
  const ytRegex = /<y-t([^>]*)>/g;
  const updatedSearchDiv = searchDiv.replace(ytRegex, (match, attributes) => {
    const pMatch = attributes.match(/p="([^"]+)"/);
    const vMatch = attributes.match(/v="([^"]+)"/);
    let playlistIdsInTag = pMatch ? pMatch[1].split(',').map(id => id.trim()) : [];
    let videoIdsInTag = vMatch ? vMatch[1].split(',').map(id => id.trim()) : [];
    const playlistIdsInV = videoIdsInTag.filter(id => id.match(/^(PL|FL|OL|TL|UU)/));
    playlistIdsInTag = [...new Set([...playlistIdsInTag, ...playlistIdsInV])];
    videoIdsInTag = videoIdsInTag.filter(id => !id.match(/^(PL|FL|OL|TL|UU)/));
    const newVideoIds = playlistIdsInTag.flatMap(playlistId => availableVideoIds[playlistId] || []);
    const combinedVideoIds = [...new Set([...videoIdsInTag, ...newVideoIds])].filter(id => !excludedIds.includes(id));
    totalVideoCount += combinedVideoIds.length;
    let newAttributes = attributes;
    if (playlistIdsInTag.length > 0) {
      newAttributes = newAttributes.replace(/p="[^"]*"/, `p="${playlistIdsInTag.join(',')}"`);
      if (!pMatch) {
        newAttributes = `p="${playlistIdsInTag.join(',')}" ` + newAttributes;
      }
    }
    if (vMatch) {
      newAttributes = newAttributes.replace(/v="[^"]*"/, `v="${combinedVideoIds.join(',')}"`);
    } else {
      newAttributes += ` v="${combinedVideoIds.join(',')}"`;
    }
    newAttributes = newAttributes.replace(/\s+/g, ' ').trim();
    return `<y-t ${newAttributes}>`;
  });
  const formattedTotalVideoCount = totalVideoCount.toLocaleString();
  const finalSearchDiv = updatedSearchDiv;
  const updatedHtmlContent = htmlContent
    .replace(searchDivRegex, `id="shuffle">${finalSearchDiv}</div>`)
    .replace(totalVideosRegex, `"total-videos">${formattedTotalVideoCount}</span>`);
  fs.writeFileSync('index.html', updatedHtmlContent, 'utf8');
  console.log(`Total videos: ${formattedTotalVideoCount}`);
  console.log(`Number of errors: ${errorCount}`);
};
writeOutput().catch(console.error);
