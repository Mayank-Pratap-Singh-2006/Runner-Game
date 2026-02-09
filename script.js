const track1 = document.getElementById("track_frame1").parentElement;
const track2 = document.getElementById("track_frame2").parentElement;

let speed = 4;
let y1 = 0;
let y2 = -window.innerHeight;

function moveTracks() {
  y1 += speed;
  y2 += speed;

  if (y1 >= window.innerHeight) y1 = y2 - window.innerHeight;
  if (y2 >= window.innerHeight) y2 = y1 - window.innerHeight;

  track1.style.top = y1 + "px";
  track2.style.top = y2 + "px";

  speed = speed + 0.00001;

  requestAnimationFrame(moveTracks);
}

moveTracks();

let char_frame_left = document.querySelector("#char_frame_left");
let char_frame_center = document.querySelector("#char_frame_center");
let char_frame_right = document.querySelector("#char_frame_right");
let ontrack = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && ontrack == 0) {
    char_frame_left.style.visibility = "visible";
    char_frame_center.style.visibility = "hidden";
    ontrack = -1;
  }
  if (e.key === "ArrowRight" && ontrack == 0) {
    char_frame_right.style.visibility = "visible";
    char_frame_center.style.visibility = "hidden";
    ontrack = 1;
  }
  if (e.key === "ArrowLeft" && ontrack == 1) {
    char_frame_right.style.visibility = "hidden";
    char_frame_center.style.visibility = "visible";
    ontrack = 0;
  }
  if (e.key === "ArrowRight" && ontrack == -1) {
    char_frame_left.style.visibility = "hidden";
    char_frame_center.style.visibility = "visible";
    ontrack = 0;
  }
});

let left_train = document.querySelector("#left_train");
let center_train = document.querySelector("#center_train");
let right_train = document.querySelector("#right_train");

function train_system() {

  setInterval(() => {
    let train_lc = Math.floor(Math.random() * 100);
    console.log(train_lc);

    if (train_lc%3==0) {
      left_train.style.visibility = "visible";
      center_train.style.visibility = "hidden";
      right_train.style.visibility = "hidden";
    }

    if (train_lc%3==1) {
      left_train.style.visibility = "hidden";
      center_train.style.visibility = "visible";
      right_train.style.visibility = "hidden";
    }

    if (train_lc%3 == 2) {
      left_train.style.visibility = "hidden";
      center_train.style.visibility = "hidden";
      right_train.style.visibility = "visible";
    }
  }, 1100); 
}

train_system();