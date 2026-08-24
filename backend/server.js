const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Find spleeter inside the project's local python virtual environment
const spleeterPath = path.join(
  __dirname,
  '..',
  'spleeter-env',
  'Scripts',
  'python.exe'
);

if (!fs.existsSync(spleeterPath)) {
  console.error('Spleeter environment not found.');
  console.error(`Expected Python at: ${spleeterPath}`);
  console.error('Please run setup.bat before starting the server.');
  process.exit(1);
}

function extractHash(stdout) {
  const match = stdout.match(/stems[\\/](song\d+)[\\/](.+?)[\\/]/);
  return match ? match[2] : null;
}

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.post('/upload', upload.array('songs', 2), (req, res) => {
  if (!req.files || req.files.length !== 2) {
    return res.status(400).json({
      error: 'Please upload exactly two songs.'
    });
  }

  const [songA, songB] = req.files;

  const spleeterArgs1 = [
    '-m',
    'spleeter',
    'separate',
    '-p',
    'spleeter:4stems',
    '-o',
    path.join(__dirname, 'public', 'stems', 'song1'),
    songA.path
  ];

  execFile(spleeterPath, spleeterArgs1, (err, stdout, stderr) => {
    console.log('STDOUT:', stdout);
    console.log('STDERR:', stderr);

    if (err) {
      console.error(err);
      return res.status(500).json({
        error: 'Failed to separate the first song.',
        details: stderr || err.message
      });
    }

    const hash1 = extractHash(stdout);

    const spleeterArgs2 = [
      '-m',
      'spleeter',
      'separate',
      '-p',
      'spleeter:4stems',
      '-o',
      path.join(__dirname, 'public', 'stems', 'song2'),
      songB.path
    ];

    execFile(spleeterPath, spleeterArgs2, (err, stdout, stderr) => {
      console.log('STDOUT:', stdout);
      console.log('STDERR:', stderr);

      if (err) {
        console.error(err);
        return res.status(500).json({
          error: 'Failed to separate the second song.',
          details: stderr || err.message
        });
      }

      const hash2 = extractHash(stdout);

      res.json({
        song1: {
          hash: hash1,
          stemsBaseUrl: `/stems/song1/${hash1}`
        },
        song2: {
          hash: hash2,
          stemsBaseUrl: `/stems/song2/${hash2}`
        }
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
