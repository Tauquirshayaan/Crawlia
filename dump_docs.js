const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'documentation');
const outputFile = path.join(__dirname, 'all_docs_dump.md');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.md')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(docsDir);
let combinedContent = '';

allFiles.forEach(file => {
  combinedContent += `\n\n======================================================\n`;
  combinedContent += `FILE: ${file}\n`;
  combinedContent += `======================================================\n\n`;
  combinedContent += fs.readFileSync(file, 'utf8');
});

fs.writeFileSync(outputFile, combinedContent);
console.log(`Successfully dumped ${allFiles.length} files to ${outputFile}`);
