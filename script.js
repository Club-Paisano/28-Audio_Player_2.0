//jshint esversion: 8

/*
-This page is the 2.0 my previously made song player that now includes a playbackrate changer
Future Development
-Add functionality for shuffle and repeat
-Add functionality to go to the beginning of the song
-Customize the appearance range inputs
-Add time stamps on the sides of the time slider
-Add a artist to the left side under the title
-Experiment with using addtrack()
-Create the audio element in js instead of having it in the html
-Stop the position of the flexbox from moving when the song changes
-Update the cover art upon changing the songs
-Find a better way to initially set and update the playback slider besides 2 different functions
-Make it go to the next song upon finishing
-Refactor code
*/

const songName = document.querySelector("p");
//The back and forward button
const timeButtons = Array.from(document.querySelectorAll("button[data-time]"));
const playButton = document.querySelector(".playButton");
const playBack = document.querySelector("input[data-playBack]");
const volumeControl = document.querySelector(".volumeControl");
const audio = document.querySelector("audio");
const playbackSpeed = document.querySelector("section[data-player]");
console.log(playbackSpeed);

//Use to hold is mouse is clicked on element or not for drag events
let mouseDown = false;
//array to hold the song names
const songs = [
    "No Flockin.mp3",
    "Aisha.mp3",
    "Tribe.mp3",
    "Muévelo.mp3"
];

//used to hold the index of the current song playing
let currentSongIndex;

//When the page first loads
const initPage = async () => {
  //The audio to load the first song from the songs Array and display the song name
  audio.src = `${songs[0]}`;
  updateSongName(songs[0]);
  currentSongIndex = 0;
  //Add eventlisteners to the buttons, and range inputs
  timeButtons.forEach(button => button.addEventListener("click", changeSong));
  playButton.addEventListener("click", updatePlayStatus);

  //Add event listeners to the volume control
  volumeControl.addEventListener("mousedown", () => mouseDown = true);
  volumeControl.addEventListener("mouseup", () => mouseDown = false);
  volumeControl.addEventListener("mousemove", () => mouseDown && changeVolume());
  volumeControl.addEventListener("click",changeVolume);


  //On initial load
  audio.onloadeddata = () => playBack.value = (audio.currentTime/audio.duration)*100;
  audio.addEventListener("loadeddata", updateTime);
  //Add an event listener to capture further events
   audio.addEventListener("timeupdate", updateTime);

  //Add event listeners to the song playback
  playBack.addEventListener("mousedown", () => mouseDown = true);
  playBack.addEventListener("mouseup", () => mouseDown = false);
  playBack.addEventListener("mousemove", () => mouseDown && changeSongTime);
  playBack.addEventListener("click",changeSongTime);

  //Add event listeners to the song playback speed
  playbackSpeed.addEventListener("mousedown", () => mouseDown = true);
  playbackSpeed.addEventListener("mouseup", () => mouseDown = false);
  playbackSpeed.addEventListener("mousemove", () => mouseDown && changeSongTime);
  playbackSpeed.addEventListener("click",changeplaybackSpeed);



};

const updateSongName = (name) => songName.textContent = (name.includes(".mp3")) ? name.replace(".mp3", "") : name;

async function changeSong() {

  //Show a loading text as the songName
  updateSongName("Loading...");
  //Get whether we're going to the next track or the previous one
  //Change the currentSongIndex
  //Make sure the index isn't on the first or last song

  currentSongIndex = (this.dataset.time === "prev" && currentSongIndex != 0) ? currentSongIndex-1
    : (this.dataset.time === "next" && currentSongIndex != songs.length-1) ? currentSongIndex+1
    : currentSongIndex;
  //Play the song according to the index from the list of songs

  audio.src = songs[currentSongIndex];
  //Play the new song
  await playSong();
  //Update the currentsong name
  updateSongName(songs[currentSongIndex]);

  //Change text to to play ►
  playButton.textContent = "►";


  //Update the playbackspeed
  playbackSpeed.querySelector("input").value = audio.playbackRate;

  let span = playbackSpeed.querySelector(".playbackSpeedIndicator");
  span.textContent = `${audio.playbackRate}x`;

}

const playSong =  () => audio.play();
const pauseSong = () => audio.pause();

const updatePlayStatus= async() => {
    //If the audio is being played, pause it, if it's paused play it
    const method = (audio.paused) ? "play" : "pause";

    await audio[method]();
    //Change text to reflect it's play status: ► or ❚❚
    playButton.textContent = (method === "play")? "❚❚":"►";


};

const changeVolume = () => {
  //Grab the value of the volume control input
  //update the volume of the audio with the new volume
  audio.volume = parseFloat(volumeControl.value);

};

const changeSongTime = () => {
  //Grab the value of the playback input
  //Change to percentage
  //update the value of the audio with the new value
  audio.currentTime =(parseFloat(playBack.value)/100)*audio.duration;
};
const changeplaybackSpeed = (e) => {
  if(e.target != playbackSpeed.querySelector("input")) return;
  //grab the value of the e.target
  let playbackSpeedValue = e.target.value;
  audio.playbackRate = e.target.value;
  console.log(audio.playbackRate);
  //Update the span with the playback rate
  //Select the second span item
  let span = playbackSpeed.querySelector(".playbackSpeedIndicator");
  console.log(span);
  //Update the span element with an innerText of the playbackrate
  span.textContent = `${audio.playbackRate}x`;
} ;
//used to adjust the slider with the time
const updateTime = () => {


  //Get the current time in relation to the song playing and the slider
  const songPercent =(audio.currentTime/audio.duration)*100;
  //Update the volume range
  playBack.value = songPercent;

};

initPage();
