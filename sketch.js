let slider = {};
let gainArr = [];
let synth;

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
const audioClips = ["Drums1.mp3", "Drums2.mp3", "Bass1.mp3", "Bass2.mp3", "Inst1.mp3", "Inst2.mp3", "Vox1.mp3", "Vox2.mp3"]

for (let i = 0; i < audioClips.length; i++)
  {
    const tempClip = audioClips[i];
    const tempPlayer = new Tone.GrainPlayer(tempClip, () => {
        //console.log(tempClip + " has finished loading!");
        tempPlayer.playbackRate = 1
        tempPlayer.detune = 0
        tempPlayer.grainSize = 0.1
        tempPlayer.overlap = 0.05
        tempPlayer.sync();
        tempPlayer.start(0);
        tempPlayer.loop = true;
      });
    gsPlayers.push(tempPlayer);
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
  
}

function draw() {
  background(220);
  
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
  text("Song 1 (D Major)", 23, 30);
  text("Song 2 (A Major)", 255, 30);
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
  Tone.start();
  
  if (Tone.Transport.state === "started") {
    Tone.Transport.stop();
  } 
  else {
    Tone.Transport.start();
  }
}