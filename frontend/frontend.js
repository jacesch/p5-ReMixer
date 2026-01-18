let fileInputA, fileInputB;
let songA, songB;

function handleFileA(file) {
  songA = file.file;
}

function handleFileB(file) {
  songB = file.file;
}

function setup() {
  createCanvas(400, 400);

  fileInputA = createFileInput(handleFileA);
  fileInputB = createFileInput(handleFileB);
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

  formData.append('songs', songA);
  formData.append('songs', songB);

  fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
}
