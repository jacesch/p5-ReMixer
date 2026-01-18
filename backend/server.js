const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();

app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('songs', 2), (req, res) => {
  const [songA, songB] = req.files;
  console.log(songA.path);
  console.log(songB.path);


  exec(
  `"D:\\Downloads\\ReMixer\\backend\\spleeter-env\\Scripts\\spleeter.exe" separate -p spleeter:4stems -o public/stems/song1 ${songA.path}`,
  (err, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);
    if (err) return res.status(500).send(err.message);

    exec(
      `"D:\\Downloads\\ReMixer\\backend\\spleeter-env\\Scripts\\spleeter.exe" separate -p spleeter:4stems -o public/stems/song2 ${songB.path}`,
      (err, stdout, stderr) => {
        console.log("STDOUT:", stdout);
        console.log("STDERR:", stderr);
        if (err) return res.status(500).send(err.message);

        res.send("Stems generated!");
      }
    );
  }
);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
