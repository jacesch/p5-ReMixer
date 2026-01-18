const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();

function extractHash(stdout) {
  const match = stdout.match(/stems[\\/](song\d+)[\\/](.+?)[\\/]/);
  return match ? match[2] : null;
}

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('songs', 2), (req, res) => {
  const [songA, songB] = req.files;

  exec(
  `"D:\\Downloads\\ReMixer\\backend\\spleeter-env\\Scripts\\spleeter.exe" separate -p spleeter:4stems -o public/stems/song1 ${songA.path}`,
  (err, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    const hash1 = extractHash(stdout);

    exec(
      `"D:\\Downloads\\ReMixer\\backend\\spleeter-env\\Scripts\\spleeter.exe" separate -p spleeter:4stems -o public/stems/song2 ${songB.path}`,
      (err, stdout, stderr) => {
        console.log("STDOUT:", stdout);
        console.log("STDERR:", stderr);
        if (err) {
          console.error(err);
          return res.status(500).json({ error: err.message });
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
      }
    );
  }
);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
