let baya = document.getElementById('baya');
let dayan = document.getElementById('dayan');

let fullscreenButton = document.getElementById('fullscreen');
let efullscreenButton = document.getElementById('efullscreen');


let imageBox = document.getElementById('imageBox');

let output = document.getElementById('output');

let bpmInput = document.getElementById('bpm');

let touches = [];

let touchesX = [];
let touchesY = [];

let arrayOfSounds = [];

let intervalOn = false;
let interval = 60000 / bpmInput.value;

let beat = new Audio('beat.mp3');



const tableOfCombinedSounds = [
    ["S", "Taa", "Tin", "Ti"],
    ["Ke", "Kraa", "Ktin", "Ktee"],
    ["Ge", "Dhaa", "Dhin", "Dhee"]
]


//Scaling constants for left drum
const smallBayaCircle = [0.363, 0.490, 0.145]
const medBayaCircle = [0.418, 0.497, 0.278]
const largeBayaCircle = [0.483, 0.487, 0.400]

//Scaling constants for right drum
const smallDayanCircle = [0.498, 0.495, 0.111]
const medDayanCircle = [0.497, 0.497, 0.210]
const largeDayanCircle = [0.500, 0.490, 0.301]


//Adds x and y coordinates of a touch to seperate arrays of touch coordinates
function handleTouch(e, img) {

    e.preventDefault();
    let rect = img.getBoundingClientRect();

    for (let i = 0; i < e.touches.length; i++) {

        let touch = e.touches[i];

        if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {

            touches.push( img.id + " x=" + Math.round(touch.clientX) + ", y=" + Math.round(touch.clientY));
            touchesX.push(touch.clientX);
            touchesY.push(touch.clientY);
        }
    }
}

//Records initial touch for left drum
baya.addEventListener('touchstart', function(e) {
    handleTouch(e, baya);
}, false);

//Records all other touches for left drum
baya.addEventListener('touchmove', function(e) {
    handleTouch(e, baya);
}, false);

//Records initial touch for right drum
dayan.addEventListener('touchstart', function(e) {
    handleTouch(e, dayan);
}, false);

//Records all other touches for right drum
dayan.addEventListener('touchmove', function(e) {
    handleTouch(e, dayan);
}, false);

//Clears the output sounds
document.getElementById('reset').onclick = function() {
    touches = [];
    arrayOfSounds = [];
    output.innerText = '';
}

//Allows output paragraph to be editable by double clicking on it
window.onload = function() {

    output.addEventListener('dblclick', function() {
        this.setAttribute('contenteditable', 'true');
    });
};

//Clears the arrays of x and y touches
function clearTouches() {
        
    touchesX = [];
    touchesY = [];

    if (intervalOn == true){
        setTimeout(clearTouches, interval/2);
    }
   
}

//Plays the metronome beat sound
function playSound() {

    if(beat.paused == false) { //Stops current sound if there is one playing
        beat.pause();
        beat.currentTime = 0;
    }
        
    beat.play(); //Play metronome beat

    if (intervalOn == true){ //Checks if stop button has been pressed
        setTimeout(playSound, interval); //Calls this function again after waiting specified interval
    }
}

//Outputs formatted sounds on screen       
function outputText() {

    sound = 'S'
                
    if (touchesX.length > 0){
        sound = findAverageSound(touchesX, touchesY);
    }

    arrayOfSounds.push(sound)

    output.innerText = formatSounds(arrayOfSounds);

    if (intervalOn == true){
        setTimeout(outputText, interval/2);
    }
}

//Starts the intervals for recording the sounds and metronome
function startRecording() {

    if(intervalOn == false){

        interval = 60000 / bpmInput.value;

        intervalOn = true;
        
        setTimeout(clearTouches, 750);

        setTimeout(playSound, 950);
    
        setTimeout(outputText, 1200);
    } 
 
}

//Ends all intervals and stops recording sounds
function stopRecording() {
    intervalOn = false;
}

//Formats the outputted sounds based on beats per cycle of the taal
function formatSounds(soundArray) {

    let sounds = '';
    let pairCount = 0;

    for (let i = 1; i < soundArray.length; i++) { //If "Ti" appears twice in a row, changes the second "Ti" to "Ta"

        if (soundArray[i] == 'Ti' && soundArray[i - 1] == 'Ti') {
            soundArray[i] = 'Ta';
        }
    }

    for (let i = 0; i < soundArray.length; i++) { //Loops over sound array to add sounds to a string

        sounds += soundArray[i];

        if (i % 2 !== 0) { //Puts sounds into pairs seperated by spaces

            pairCount++;

            if (sounds.endsWith('S')) { //Removes "S" if it is the final sound in the pair
                sounds = sounds.slice(0, -1);
            }

            if (pairCount % 16 == 0) { //Starts a new line if number of pairs is divisible by beats per cycle
                sounds += '\n';
            }  
            else { //Adds a space between pairs
                sounds += ' ';
            }
        }
    }
    return sounds;
}

//Fullscreen button
document.getElementById('fullscreen').onclick = function() {

    imageBox.style.width = '100vw';

    fullscreenButton.style.display = "none";
    efullscreenButton.style.display = "flex";

    let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    let viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if (viewportWidth < viewportHeight) {
        baya.style.width = '50vw';
        baya.style.height = 'auto';
        dayan.style.width = '50vw';
        dayan.style.height = 'auto';
    } else {
        baya.style.height = '80vh';
        baya.style.width = 'auto';
        dayan.style.height = '80vh';
        dayan.style.width = 'auto';
    }
}

//Exit fullscreen button
document.getElementById('efullscreen').onclick = function() {

    imageBox.style.width = '80vw';

    fullscreenButton.style.display = "flex";
    efullscreenButton.style.display = "none";

    baya.style.width = '20vw';
    baya.style.height = 'auto';
    dayan.style.width = '20vw';
    dayan.style.height = 'auto';
    
}

//Checks if an (x, y) coordinate is inside a specified circle on a drum
function checkInCircle(drum, xPos, yPos, circleConstants){

    let rect = drum.getBoundingClientRect() //Gets coordinates for the edges of the image

    let [widthConstant, heightConstant, radiusConstant] = circleConstants; //Gets scaling constants for a specified circle

    x = (xPos - (drum.offsetWidth * widthConstant + rect.left)) 
    y = (yPos - (drum.offsetHeight * heightConstant + rect.top))
    r = (drum.offsetWidth * radiusConstant) 

    if (x*x + y*y < r*r){
        return true
    }
    else {
        return false
    }
}

//Returns a number representing a sound on the left drum
function determineSoundBaya(x, y){

    if(checkInCircle(baya, x, y, smallBayaCircle) == true){
        return 1;
    }

    else if(checkInCircle(baya, x, y, largeBayaCircle) == true){
        return 2;
    }
    
    else{
        return 0;
    }
}

//Returns a number representing a sound on the right drum
function determineSoundDayan(x, y){

    if(checkInCircle(dayan, x, y, smallDayanCircle) == true){
        return 3;
    }

    else if(checkInCircle(dayan, x, y, medDayanCircle) == true){
        return 2;
    }

    else if(checkInCircle(dayan, x, y, largeDayanCircle) == true){
        return 1;
    }
    
    else{
        return 0;
    }

}

//Takes in all coordinate pairs and determines the most likely sound played
function findAverageSound(xArray, yArray){

    bayaArray = [0, 0, 0];
    dayanArray = [0, 0, 0, 0];

    for(i = 0; i < xArray.length; i++){

        bayaSound = determineSoundBaya(xArray[i], yArray[i]);
        dayanSound = determineSoundDayan(xArray[i], yArray[i]);

        bayaArray[bayaSound] += 1;
        dayanArray[dayanSound] +=1;
    }

    bayaArray[0] = bayaArray[0]/3
    dayanArray[0] = dayanArray[0]/3

    return tableOfCombinedSounds[indexOfMax(bayaArray)][indexOfMax(dayanArray)];

}

//Finds the largest number in an array and returns the index of that number
function indexOfMax(arr) {

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}







