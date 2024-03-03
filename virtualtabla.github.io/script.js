let baya = document.getElementById('baya');
let dayan = document.getElementById('dayan');

let fullscreenButton = document.getElementById('fullscreen');
let efullscreenButton = document.getElementById('efullscreen');


let imageBox = document.getElementById('imageBox');

let output = document.getElementById('output');

let touches = [];

function handleTouch(e, img) {
    e.preventDefault();
    var rect = img.getBoundingClientRect();
    for (var i = 0; i < e.touches.length; i++) {
        var touch = e.touches[i];
        if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            touches.push( img.id + " x=" + Math.round(touch.clientX) + ", y=" + Math.round(touch.clientY));
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

/*setInterval(function() {
    output.innerText = touches.join(' ');
}, 100);*/

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

function checkInCircle(drum, x, y, widthConstant, heightConstant, radiusConstant){

    let rect = drum.getBoundingClientRect()


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

document.addEventListener('click', function(e) {
    let x = e.pageX;
    let y = e.pageY; 

    output.innerText = ('X: ' + x + ', Y: ' + y + checkInCircle(baya, x, y, 0.363, 0.490, 0.145));
});

function findCoordinates() {

    let x = baya.offsetWidth;
    let y = baya.offsetHeight;

    
    return(String(x) + " " + String(y))
}

test = document.getElementById('test');

setInterval(function() {
    test.innerText = findCoordinates();;
}, 100);


