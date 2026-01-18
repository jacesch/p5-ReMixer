let fileInputA, fileInputB;
let songA, songB;

function setup() {
  createCanvas(400, 400);

  fileInputA = createFileInput(handleFileA);
  fileInputB = createFileInput(handleFileB);
}

function handleFileA(file) {
  songA = file.file;   // IMPORTANT: use file.file
}

function handleFileB(file) {
  songB = file.file;   // IMPORTANT: use file.file
}

function draw() {
  background(220);
}

function keyPressed() {
  if (key === 'U') {
    uploadSongs();
  }
}

function uploadSongs() {
  console.log("uploadSongs() called");
  
  let formData = new FormData();

  formData.append('songA', songA);
  formData.append('songB', songB);

  fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData
  })
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
}

