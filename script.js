let tapTimes = [];
let timeout;
let soundEnabled = localStorage.getItem('soundEnabled') === 'true' || true; 


const metronomeSound = new Audio('Metronome.wav');
const metronome2Sound = new Audio('Metronome2.wav');


function calculateBPM() {
  if (tapTimes.length < 2) return;

  const timeDifferences = [];
  for (let i = 1; i < tapTimes.length; i++) {
    timeDifferences.push(tapTimes[i] - tapTimes[i - 1]);
  }

  const averageDifference = timeDifferences.reduce((a, b) => a + b, 0) / timeDifferences.length;
  const averageBPM = 60000 / averageDifference;
  const nearestWholeBPM = Math.round(averageBPM);

  document.getElementById('averageBPM').textContent = averageBPM.toFixed(2);
  document.getElementById('nearestBPM').textContent = nearestWholeBPM;

  
  updateBPMBar(averageBPM);


  addToHistory(averageBPM);
}


function handleTap() {
  tapTimes.push(Date.now());

 
  if (soundEnabled) {
    if (tapTimes.length % 4 === 1) {
      metronome2Sound.currentTime = 0;
      metronome2Sound.play();
    } else {
      metronomeSound.currentTime = 0;
      metronomeSound.play();
    }
  }

 
  document.getElementById('tapCount').textContent = tapTimes.length;

  
  if (tapTimes.length === 1) {
    document.getElementById('directions').textContent = "Keep tapping!";
  }

  
  if (tapTimes.length >= 2) {
    calculateBPM();
  }

  
  animateTap();

  
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    tapTimes = [];
    document.getElementById('averageBPM').textContent = '0';
    document.getElementById('nearestBPM').textContent = '0';
    document.getElementById('tapCount').textContent = '0';
    document.getElementById('directions').textContent = "Press any key or click the button to start tapping!";
    document.getElementById('bpmBar').style.width = '0%';
  }, 2000);
}

function resetTapper() {
  tapTimes = [];
  document.getElementById('averageBPM').textContent = '0';
  document.getElementById('nearestBPM').textContent = '0';
  document.getElementById('tapCount').textContent = '0';
  document.getElementById('directions').textContent = "Press any key or click the button to start tapping!";
  document.getElementById('bpmBar').style.width = '0%';
  document.getElementById('historyList').innerHTML = ''; 
}

document.getElementById('soundToggle').addEventListener('click', (e) => {
  soundEnabled = !soundEnabled;
  document.getElementById('soundToggle').textContent = soundEnabled ? "Sound: On" : "Sound: Off";
  localStorage.setItem('soundEnabled', soundEnabled); 
  e.target.blur(); 
});


document.getElementById('soundToggle').textContent = soundEnabled ? "Sound: On" : "Sound: Off";


document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyR') {
    resetTapper();
  } else {
    handleTap(); 
  }
});
document.getElementById('tapButton').addEventListener('click', (e) => {
  handleTap();
  e.target.blur(); 
});
document.getElementById('resetButton').addEventListener('click', (e) => {
  resetTapper();
  e.target.blur(); 
});


const tapIndicator = document.querySelector('.tap-indicator');
function animateTap() {
  tapIndicator.classList.add('active');
  setTimeout(() => tapIndicator.classList.remove('active'), 200);
}


const bpmBar = document.getElementById('bpmBar');
function updateBPMBar(bpm) {
  const minBPM = 60;
  const maxBPM = 180;
  const percentage = ((bpm - minBPM) / (maxBPM - minBPM)) * 100;
  bpmBar.style.width = `${percentage}%`;
}

const maxHistoryItems = 10; 


const historyList = document.getElementById('historyList');
function addToHistory(bpm) {
  const listItem = document.createElement('li');
  listItem.textContent = `BPM: ${bpm.toFixed(2)}`;
  historyList.appendChild(listItem);

  
  if (historyList.children.length > maxHistoryItems) {
    historyList.removeChild(historyList.firstChild);
  }
}

window.addEventListener('load', () => {
  document.getElementById('loading').style.display = 'none';
});