const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        resolve(null);
      }
    }).on('error', reject);
  });
}

async function processMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await processMarkdownFiles(fullPath);
    } else if (fullPath.endsWith('.md')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      let newContent = content;

      while ((match = imgRegex.exec(content)) !== null) {
        let alt = match[1];
        let url = match[2];
        if (url.startsWith('http')) {
          // Download the image
          const filename = path.basename(new URL(url).pathname);
          const imgDir = path.join(dir, 'images');
          if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
          const imgPath = path.join(imgDir, filename);
          
          console.log(`Downloading ${url} to ${imgPath}`);
          await downloadImage(url, imgPath);
          
          // Replace URL in markdown
          newContent = newContent.replace(url, `images/${filename}`);
        }
      }
      fs.writeFileSync(fullPath, newContent);
    }
  }
}

const baseDir = path.join('G:', 'Crawlia', 'documentation');
processMarkdownFiles(baseDir).then(() => console.log('Images downloaded and markdown updated.'));
