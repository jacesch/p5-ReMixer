let slider = {};
let gainArr = [];
let synth;
let audioClips = [];
let isLoading = false;

const sliderTemp = {
  drums: {
    1: [
      { parameter: "tempo", min: 0.1, max: 2.0, val: 1, step: 0.01, x: 10, y: 55 },
      { parameter: "volume", min: 0, max: 1, val: 0.75, step: 0.01, x: 10, y: 85 }
    ],
    2: [
      { parameter: "tempo", min: 0.1, max: 2.0, val: 1, step: 0.01, x: 240, y: 55 },
      { parameter: "volume", min: 0, max: 1, val: 0.75, step: 0.01, x: 240, y: 85 }
    ]
  },
  bass: {
    1: [
      { parameter: "tempo", min: 0.1, max: 2.0, val: 1, step: 0.01, x: 10, y: 170 },
      { parameter: "pitch", min: -1200, max: 1200, val: 0, step: 1, x: 10, y: 200 },
      { parameter: "volume", min: 0, max: 1, val: 0.75, step: 0.01, x: 10, y: 230 }
    ],
    2: [
      { parameter: "tempo", min: 0.1, max: 2.0, val: 1, step: 0.01, x: 240, y: 170 },
      { parameter: "pitch", min: -1200, max: 1200, val: 0, step: 1, x: 240, y: 200 },
      { parameter: "volume", min: 0, max: 1, val: 0.75, step: 0.01, x: 240, y: 230 }
    ],
  },
  inst: {
    1: [
      { parameter: "tempo", min: 0.1, max: 2.0, val: 1, step: 0.01, x: 10, y: 295 },
      { parameter: "pitch", min: -1200, max: 1200, val: 0, step: 1, x: 10, y: 325 },
      { parameter: "volume", min: 0, max: 1, val: 0.75, step: 0.01, x: 10, y: 355 }
    ],
    2: [
      { parameter: "tempo", min: 0.1, max: 2.0, val: 1, step: 0.01, x: 240, y: 295 },
      { parameter: "pitch", min: -1200, max: 1200, val: 0, step: 1, x: 240, y: 325 },
      { parameter: "volume", min: 0, max: 1, val: 0.75, step: 0.01, x: 240, y: 355 }
    ],
  },
  vox: {
    1: [
      { parameter: "tempo", min: 0.1, max: 2.0, val: 1, step: 0.01, x: 10, y: 415 },
      { parameter: "pitch", min: -1200, max: 1200, val: 0, step: 1, x: 10, y: 445 },
      { parameter: "volume", min: 0, max: 1, val: 0.75, step: 0.01, x: 10, y: 475 }
    ],
    2: [
      { parameter: "tempo", min: 0.1, max: 2.0, val: 1, step: 0.01, x: 240, y: 415 },
      { parameter: "pitch", min: -1200, max: 1200, val: 0, step: 1, x: 240, y: 445 },
      { parameter: "volume", min: 0, max: 1, val: 0.75, step: 0.01, x: 240, y: 475 }
    ],
  },
};

const gsPlayers = [];

async function buildPlayers(audioClips) {
  gsPlayers.length = 0;
  gainArr.length = 0;

  for (const url of audioClips) {
    const player = new Tone.GrainPlayer({
      url,
      loop: true,
      grainSize: 0.1,
      overlap: 0.05,
      playbackRate: 1,
      detune: 0
    });

    const gain = new Tone.Gain(1).toDestination();
    player.connect(gain);

    gsPlayers.push(player);
    gainArr.push(gain);
  }

  await Tone.loaded();

  gsPlayers.forEach(p => {
    p.sync();
    p.start(0);
  });

  console.log("Players built:", gsPlayers.length);
}

function setup() {
  createCanvas(400, 500);
  
  for (let instType in sliderTemp) {
    slider[instType] = {};
    for (let songNum in sliderTemp[instType]) {
      slider[instType][songNum] = {};
      sliderTemp[instType][songNum].forEach(conf => {
        let s = createSlider(conf.min, conf.max, conf.val, conf.step);
        s.position(conf.x, conf.y);
        slider[instType][songNum][conf.parameter] = s;
      });
    }
  }
  
  for (let i = 0; i < gsPlayers.length; i++)
    {
      const gain = new Tone.Gain(1).toDestination();
      gsPlayers[i].connect(gain);
      gainArr[i] = gain;
    }
  console.log("Press any key to start/stop!");
  
  const uploadBtn = document.getElementById("uploadBtn");

  uploadBtn.addEventListener("click", async () => {
  isLoading = true;

  const fileA = document.getElementById("songA").files[0];
  const fileB = document.getElementById("songB").files[0];

  if (!fileA || !fileB) {
    alert("Please upload BOTH songs.");
    isLoading = false;
    return;
  }

  const formData = new FormData();
  formData.append("songs", fileA);
  formData.append("songs", fileB);

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    audioClips = [
      `http://localhost:3000${data.song1.stemsBaseUrl}/drums.wav`,
      `http://localhost:3000${data.song2.stemsBaseUrl}/drums.wav`,
      `http://localhost:3000${data.song1.stemsBaseUrl}/bass.wav`,
      `http://localhost:3000${data.song2.stemsBaseUrl}/bass.wav`,
      `http://localhost:3000${data.song1.stemsBaseUrl}/other.wav`,
      `http://localhost:3000${data.song2.stemsBaseUrl}/other.wav`,
      `http://localhost:3000${data.song1.stemsBaseUrl}/vocals.wav`,
      `http://localhost:3000${data.song2.stemsBaseUrl}/vocals.wav`
    ];

    await Tone.start();
    await buildPlayers(audioClips);

  } catch (err) {
    console.error(err);
    alert("Error loading stems. Check console for details.");
  } finally {
    isLoading = false;
  }
});
}

function draw() {
  background(220);
  
  if (isLoading) {
    textSize(24);
    fill(0);
    textAlign(CENTER, CENTER);
    text("Loading stems...", width / 2, height / 2 + 10);
    textSize(12);
    text("(Press SPACE to start/stop when stems load)", width / 2, height / 2 + 35);
    return;
  }

  if (gsPlayers.length === 0) {
    textSize(16);
    fill(10);
    text("Upload songs to start", 100, 200);
    return;
  }

  let index = 0;

  for (let instType of ['drums', 'bass', 'inst', 'vox']) {
    for (let songNum of [1, 2]) {
      const s = slider[instType][songNum];
      const player = gsPlayers[index];
      const gain = gainArr[index];

      if (s.tempo) player.playbackRate = s.tempo.value();
      if (s.pitch) player.detune = s.pitch.value();
      if (s.volume) gain.gain.value = s.volume.value();

      index++;
    }
  }
  
  textSize(16);
  fill(10);
  text("DRUMS", 170, 30);
  text("BASS", 170, 155);
  text("CHORDS", 158, 280);
  text("VOCALS", 160, 405);
  textSize(14);
  fill(120);
  text("Song 1", 23, 30);
  text("Song 2", 255, 30);
  fill(100);
  text("Tempo", 170, 65);
  text("Volume", 170, 100);
  text("Tempo", 170, 183);
  text("Pitch", 170, 213);
  text("Volume", 170, 243);
  text("Tempo", 170, 308);
  text("Pitch", 170, 338);
  text("Volume", 170, 368);
  text("Tempo", 170, 429);
  text("Pitch", 170, 459);
  text("Volume", 170, 489);
}

function keyPressed() {
  if (key === " " || keyCode === 32) {
    Tone.start();
  
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
    } 
    else {
      Tone.Transport.start();
    }
  }
} 