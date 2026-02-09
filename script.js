// ===================== TRACK SCROLL =====================
const track1 = document.getElementById("track_frame1").parentElement;
const track2 = document.getElementById("track_frame2").parentElement;

let speed = 4;
let y1 = 0;
let y2 = -window.innerHeight;
let gamePaused = false;

function moveTracks() {
  if (!gamePaused) {
    y1 += speed;
    y2 += speed;

    if (y1 >= window.innerHeight) y1 = y2 - window.innerHeight;
    if (y2 >= window.innerHeight) y2 = y1 - window.innerHeight;

    track1.style.top = y1 + "px";
    track2.style.top = y2 + "px";

    speed += 0.00001;
    requestAnimationFrame(moveTracks);
  }
}

// ===================== CHARACTERS =====================
const char_frame_left = document.querySelector("#char_frame_left");
const char_frame_center = document.querySelector("#char_frame_center");
const char_frame_right = document.querySelector("#char_frame_right");

let charTrack = 0; // -1=left, 0=center, 1=right

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    if (charTrack === 0) {
      char_frame_left.style.visibility = "visible";
      char_frame_center.style.visibility = "hidden";
      charTrack = -1;
    } else if (charTrack === 1) {
      char_frame_center.style.visibility = "visible";
      char_frame_right.style.visibility = "hidden";
      charTrack = 0;
    }
  }
  if (e.key === "ArrowRight") {
    if (charTrack === 0) {
      char_frame_right.style.visibility = "visible";
      char_frame_center.style.visibility = "hidden";
      charTrack = 1;
    } else if (charTrack === -1) {
      char_frame_center.style.visibility = "visible";
      char_frame_left.style.visibility = "hidden";
      charTrack = 0;
    }
  }
});

function getActiveCharacter() {
  if (charTrack === -1) return char_frame_left;
  if (charTrack === 0) return char_frame_center;
  if (charTrack === 1) return char_frame_right;
}

// ===================== TRAINS =====================
// Swap left and right in JS mapping to match your CSS
const left_train = document.querySelector("#right_train");   // swapped
const center_train = document.querySelector("#center_train");
const right_train = document.querySelector("#left_train");   // swapped

const trains = [
  { el: left_train, lane: -1, y: -450, height: 0, visible: false, inScreen: false, hasCollided: false },
  { el: center_train, lane: 0, y: -450, height: 0, visible: false, inScreen: false, hasCollided: false },
  { el: right_train, lane: 1, y: -450, height: 0, visible: false, inScreen: false, hasCollided: false }
];

let activeTrains = [];

// ===================== SPAWN TRAINS =====================
function spawnTrain() {
  activeTrains = [];
  trains.forEach(train => {
    train.height = train.el.querySelector("img").clientHeight;
    train.y = -train.height - 20;
    train.el.style.top = train.y + "px";
    train.el.style.visibility = "hidden";
    train.visible = false;
    train.inScreen = false;
    train.hasCollided = false;
  });

  const howMany = Math.random() < 0.3 ? 2 : 1;
  let lanes = [];

  while (lanes.length < howMany) {
    let lane = Math.floor(Math.random() * 3) - 1; // -1,0,1
    if (!lanes.includes(lane)) lanes.push(lane);
  }

  lanes.forEach(lane => {
    const train = trains.find(t => t.lane === lane);
    train.el.style.visibility = "visible";
    train.visible = true;
    activeTrains.push(train);
  });
}

// ===================== MOVE TRAINS =====================
function moveTrains() {
  if (!gamePaused) {
    activeTrains.forEach(train => {
      train.y += 6;
      train.el.style.top = train.y + "px";
      if (!train.inScreen && train.y + train.height > 0) train.inScreen = true;
    });

    activeTrains = activeTrains.filter(train => train.y < window.innerHeight);
    if (activeTrains.length === 0) spawnTrain();

    requestAnimationFrame(moveTrains);
  }
}

// ===================== COLLISION =====================
const collisionOverlay = document.getElementById("collision_overlay");
const replayBtn = document.getElementById("replay_btn");
const collisionSound = document.getElementById("collision_sound");

function checkCollision() {
  if (!gamePaused) {
    const player = getActiveCharacter();
    const playerTop = player.offsetTop;
    const playerBottom = playerTop + player.clientHeight;
    const offset = 5;

    activeTrains.forEach(train => {
      if (train.visible && train.inScreen && train.lane === charTrack && !train.hasCollided) {
        const trainTop = train.y;
        const trainBottom = train.y + train.height;

        if (trainBottom - offset >= playerTop && trainTop + offset <= playerBottom) {
          gamePaused = true;
          train.hasCollided = true;
          collisionOverlay.style.display = "flex";
          collisionSound.play();
          activeTrains.forEach(t => t.el.style.animation = "none");
        }
      }
    });

    requestAnimationFrame(checkCollision);
  }
}

// ===================== GAME START =====================
const game_start = document.getElementById("game_start");
const game_load = document.querySelector(".game_load");
const bgm = document.getElementById("bgm");

game_start.addEventListener("click", () => {
  game_load.remove();
  bgm.play();
  moveTracks();
  spawnTrain();
  moveTrains();
  checkCollision();
});

// ===================== REPLAY BUTTON =====================
replayBtn.addEventListener("click", () => location.reload());
