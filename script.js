let baya = document.getElementById('baya');
let dayan = document.getElementById('dayan');

let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');

let resetButton = document.getElementById('reset');

let fullscreenButton = document.getElementById('fullscreen');
let efullscreenButton = document.getElementById('efullscreen');

let imageBox = document.getElementById('imageBox');
let output = document.getElementById('output');

let bpmInput = document.getElementById('bpm');
let taalInput = document.getElementById('taalSelect');

let bpmLabel = document.getElementById('bpmLabel');
let taallabel = document.getElementById('taalLabel');
let a = document.getElementById('1')

let metronomeCheck = document.getElementById("accept");

let interval = 60000 / bpmInput.value;
let beatsPerCycle = taalInput.value;

let touchesX = [];
let touchesY = [];

let arrayOfSounds = [];

let intervalOn = false;
//let interval;
//let beatsPerCycle;

let beat = new Audio('beat.mp3');

let ke = new Audio('Ke.m4a');
let ge = new Audio('Ge.m4a');
let taa = new Audio('Taa.m4a');
let tin = new Audio('Tin.m4a');
let ti = new Audio('Ti.m4a');
let ktee = new Audio('Ktee.m4a');
let ktin = new Audio('Ktin.m4a');
let kraa = new Audio('Ktaa.m4a');
let dhaa = new Audio('Dhaa.m4a');
let dhin = new Audio('Dhin.m4a');
let dhee = new Audio('Dhe.m4a');



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




//Records initial touch for left drum
baya.addEventListener('touchstart', function(e) {
    handleTouch(e);
}, false);

function handleTouch(e) {

    e.preventDefault();

    for (let i = 0; i < e.touches.length; i++) {

        let touch = e.touches[i];

        touchesX.push(touch.clientX);
        touchesY.push(touch.clientY);
    }
}

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
resetButton.onclick = function() {
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
function playSound(counter) {

    if(beat.paused == false) {
        beat.pause();
        beat.currentTime = 0;
    }
       
    if(metronomeCheck.checked){
        beat.play();
    }
 
    if(counter > 600) {
        intervalOn = false;
    }

    if (intervalOn == true){ 
        setTimeout(function() {playSound(counter + 1); }, interval); 
    }
}

//Outputs formatted sounds on screen       
function outputText() {

    sound = 'S'
                
    if (touchesX.length > 0){
        sound = findAverageSound(touchesX, touchesY);
    }

    arrayOfSounds.push(sound)


    let audioObject = findAudioObject(sound)

    if(audioObject && metronomeCheck.checked == false){
        audioObject.currentTime = 0.3; 
        audioObject.play();
    }

    output.innerText = formatSounds(arrayOfSounds);

    if (intervalOn == true){
        setTimeout(outputText, interval/2);
    }
}

function findAudioObject(soundName){

    switch(soundName){
        
        case("Ke"):
            return ke
        case("Ge"):
            return ge
        case("Ti"):
            return ti
        case("Taa"):
            return taa
        case("Tin"):
            return tin
        case("Kraa"):
            return kraa
        case("Ktin"):
            return ktin
        case("Ktee"):
            return ktee
        case("Dhaa"):
            return dhaa
        case("Dhin"):
            return dhin
        case("Dhee"):
            return dhee
        case('S'):
            return
    }

}

//Starts the intervals for recording the sounds and metronome
startButton.onclick = function startRecording() {

    if(intervalOn == false){

        interval = 60000 / bpmInput.value;
        intervalOn = true;

        beatsPerCycle = taalInput.value;
        
        setTimeout(clearTouches, 750);

        setTimeout(playSound(0), 950);
    
        setTimeout(outputText, 1200);
    } 
 
}

//Ends all intervals and stops recording sounds
stopButton.onclick = function stopRecording() {
    intervalOn = false;
}

//Formats the outputted sounds based on beats per cycle of the taal
function formatSounds(soundArray) {

    //If "Ti" appears twice in a row, changes the second "Ti" to "Ta"
    for (let i = 1; i < soundArray.length; i++) { 

        if (soundArray[i] == 'Ti' && soundArray[i - 1] == 'Ti') {
            soundArray[i] = 'Ta';
        }
    }

    let sounds = '';
    let pairCount = 0;

    //Loops over sound array to add sounds to a string
    for (let i = 0; i < soundArray.length; i++) { 

        sounds += soundArray[i];
         
        if (i % 2 !== 0) {

            pairCount++;

            if (sounds.endsWith('S')) {
                sounds = sounds.slice(0, -1);
            }
            
            if (pairCount % beatsPerCycle == 0) {
                sounds += '\n';
            }
            else {
                sounds += ' ';
            }
        }
    }

    return sounds;
}

//Fullscreen button
fullscreenButton.onclick = function() {

    imageBox.style.width = '100vw';

    fullscreenButton.style.display = "none";
    taalInput.style.display = "none";
    bpmInput.style.display = "none";
    taalLabel.style.display = "none";
    bpmLabel.style.display = "none";
    resetButton.style.display = "none"
    metronomeCheck.style.display = "none"
    a.style.display = "none"
    efullscreenButton.style.display = "flex";
    document.getElementById('download').style.display = "none";

    let viewportWidth = window.innerWidth;                                            // || document.documentElement.clientWidth;
    let viewportHeight = window.innerHeight;                                          // || document.documentElement.clientHeight;

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

document.getElementById('download').onclick = function(){
    const paragraphContent = output.innerText; // Replace with your actual content
            const filename = "output.txt"; // Specify the desired filename

            // Create a Blob with the paragraph content
            const blob = new Blob([paragraphContent], { type: "text/plain" });

            // Create a temporary link to trigger the download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;

            // Programmatically click the link to initiate the download
            link.click();

            // Clean up the temporary URL
            URL.revokeObjectURL(link.href);
}

//Exit fullscreen button
efullscreenButton.onclick = function() {

    imageBox.style.width = '80vw';

    fullscreenButton.style.display = "flex";
    efullscreenButton.style.display = "none";
    taalInput.style.display = "flex";
    bpmInput.style.display = "flex";
    taalLabel.style.display = "flex";
    bpmLabel.style.display = "flex";
    a.style.display = "flex"
    metronomeCheck.style.display = "flex"
    resetButton.style.display = "flex"
    document.getElementById('download').style.display = "flex";
    

    baya.style.width = '20vw';
    baya.style.height = 'auto';
    dayan.style.width = '20vw';
    dayan.style.height = 'auto'; 
}

//Checks if an (x, y) coordinate is inside a specified circle on a drum
function checkInCircle(drum, x, y, circleConstants){

    //Gets coordinates for the edges of the image
    let rect = drum.getBoundingClientRect() 

    //Gets scaling constants for a specified circle
    let [widthConstant, heightConstant, radiusConstant] = circleConstants; 

    xShift = drum.offsetWidth * widthConstant + rect.left
    yShift = drum.offsetHeight * heightConstant + rect.top
    r = (drum.offsetWidth * radiusConstant) 

    if ((x - xShift)*(x - xShift) + (y - yShift)*(y - yShift) < r*r){
        return true
    }
    else {
        return false
    }
}


//Returns a number representing a sound on the left drum

function determineSoundBaya(x, y){
    if(checkInCircle(baya, x, y, smallBayaCircle) == true)
        return 1;
    
    else if(checkInCircle(baya, x, y, largeBayaCircle) == true)
        return 2;
    
    else
        return 0; 
}
//Returns a number representing a sound on the right drum
function determineSoundDayan(x, y){

    if(checkInCircle(dayan, x, y, smallDayanCircle) == true)
        return 3;

    else if(checkInCircle(dayan, x, y, medDayanCircle) == true)
        return 2;

    else if(checkInCircle(dayan, x, y, largeDayanCircle) == true)
        return 1;

    else
        return 0;
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







