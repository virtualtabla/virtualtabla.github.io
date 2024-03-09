let baya = document.getElementById('baya');
let dayan = document.getElementById('dayan');

let fullscreenButton = document.getElementById('fullscreen');
let efullscreenButton = document.getElementById('efullscreen');


let imageBox = document.getElementById('imageBox');

let output = document.getElementById('output');

let touches = [];

let touchesX = [];
let touchesY = [];

let intervalOn = false;

const tableOfCombinedSounds = [
    ["S", "Taa", "Tin", "Ti", "Tun"],
    ["Ke", "Kraa", "Ktin", "Ktee", "Ktun"],
    ["Ge", "Dhaa", "Dhin", "Dhee", "Dhun"]
]

const smallBayaCircle = [0.363, 0.490, 0.145]
const medBayaCircle = [0.418, 0.497, 0.278]
const largeBayaCircle = [0.483, 0.487, 0.400]

const smallDayanCircle = [0.498, 0.495, 0.111]
const medDayanCircle = [0.497, 0.497, 0.210]
const largeDayanCircle = [0.500, 0.490, 0.301]


function handleTouch(e, img) {
    e.preventDefault();
    var rect = img.getBoundingClientRect();
    for (var i = 0; i < e.touches.length; i++) {
        var touch = e.touches[i];
        if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            touches.push( img.id + " x=" + Math.round(touch.clientX) + ", y=" + Math.round(touch.clientY));
            touchesX.push(touch.clientX);
            touchesY.push(touch.clientY);
        }
    }
}

baya.addEventListener('touchstart', function(e) {
    handleTouch(e, baya);
}, false);

baya.addEventListener('touchmove', function(e) {
    handleTouch(e, baya);
}, false);

dayan.addEventListener('touchstart', function(e) {
    handleTouch(e, dayan);
}, false);

dayan.addEventListener('touchmove', function(e) {
    handleTouch(e, dayan);
}, false);

document.getElementById('reset').onclick = function() {
    touches = [];
    output.innerText = '';
}


function startRecording() {

    if(intervalOn == false){

        intervalOn = true;
        
        setTimeout(function clearTouches() {
        
            touchesX = [];
            touchesY = [];

            if (intervalOn == true){
                setTimeout(clearTouches, 1000);
            }
            
        }, 750);

    
        setTimeout(function outputText() {
        
            sound = 'S'
                        
            if (touchesX.length > 0){
                sound = findAverageSound(touchesX, touchesY);
            }

            if (intervalOn == true){
                setTimeout(outputText, 1000);
            }

            output.innerText = output.innerText + " " + sound;

        }, 1300);

    } 
    
}
 
function stopRecording(){
    intervalOn = false;
}

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


document.getElementById('efullscreen').onclick = function() {

    imageBox.style.width = '80vw';

    fullscreenButton.style.display = "flex";
    efullscreenButton.style.display = "none";

    baya.style.width = '20vw';
    baya.style.height = 'auto';
    dayan.style.width = '20vw';
    dayan.style.height = 'auto';
    
}

function checkInCircle(drum, x, y, circleConstants){

    let rect = drum.getBoundingClientRect()

    widthConstant = circleConstants[0]
    heightConstant = circleConstants[1]
    radiusConstant = circleConstants[2]

    x = (x - (drum.offsetWidth * widthConstant + rect.left)) 
    y = (y - (drum.offsetHeight * heightConstant + rect.top))
    r = (drum.offsetWidth * radiusConstant) 


    if (x*x + y*y < r*r){
        return true
    }

    else {
        return false
    }

}


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

function findAverageSound(xArray, yArray){


    bayaArray = [0, 0, 0];
    dayanArray = [0, 0, 0, 0, 0];

    for(i = 0; i < xArray.length; i++){

        bayaSound = determineSoundBaya(xArray[i], yArray[i]);
        dayanSound = determineSoundDayan(xArray[i], yArray[i]);

        bayaArray[bayaSound] += 1;
        dayanArray[dayanSound] +=1;
    }

    bayaArray[0] = bayaArray[0]/2
    dayanArray[0] = dayanArray[0]/2

    return tableOfCombinedSounds[indexOfMax(bayaArray)][indexOfMax(dayanArray)];

}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1; 
    }
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







