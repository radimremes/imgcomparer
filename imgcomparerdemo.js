// cmpimagedemo.js
// include(imgcomparer.js)

function loadImage(imgNumber) {
    var ta = document.getElementById("text"+imgNumber).value;
    task = JSON.parse(ta);
    showImage(imgNumber, task);    
}

function showImage(imgNumber, task, color = "black") {
    if (task === undefined) {
        task = getImagePoints(imgNumber);
    }
    const canvas = getCanvas(imgNumber);
    const ctx = canvas.getContext("2d");
    //ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    for (let i = 0; i < task.length; i++) {
        const e = task[i];
        if (e.d) {        
            ctx.beginPath();
            ctx.moveTo(e.x1, e.y1);
            ctx.lineTo(e.x2, e.y2);
            ctx.strokeStyle = color;
            ctx.stroke();    
        }
    }
}

function clearImage(imgNumber) {
    const canvas = document.getElementById("myCanvas"+imgNumber);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function compareImage12() {
    var task = [[], []];
    for (let i = 0; i < 2; i++) {
        task[i] = imgcomparer.normalise(getImagePoints(i+1));
        clearImage(i+1);
        showImage(i+1);
    }
    console.log("task[0].length", task[0].length);
    console.log("task[1].length", task[1].length);
    var result = imgcomparer.compare(task[0], task[1]);
    console.log("result", result);
    console.log("output", imgcomparer.output);
    var sp = document.getElementById("test1");
    sp.innerText = result;
    return result;
}

function compareImage34() {
    var task = [[], [], [], []];
    for (let i = 2; i < 4; i++) {
        task[i] = imgcomparer.normalise(getImagePoints(i+1));
        clearImage(i+1);
        showImage(i+1);
    }
    console.log("task[2].length", task[2].length);
    console.log("task[3].length", task[3].length);
    var result = imgcomparer.compare(task[2], task[3]);
    console.log("result", result);
    console.log("output", imgcomparer.output);
    var sp = document.getElementById("test2");
    sp.innerText = result;
    return result;
}

function getImagePoints(imgNumber) {
    var ta = document.getElementById("text"+imgNumber).value;
    task = JSON.parse(ta);
    return task;
}

var task = [[], [], [], [], []];
task[0] = [];
for (let i = 1; i < 4; i++) {
    task[i] = getImagePoints(i);    
}

console.log("task: ", task);
//
//
// ************************************************************
//
//

for (let i = 1; i < 5; i++) {
    loadImage(i);
    showImage(i);    
}

function getCanvas(canvasNumber) {
    return document.getElementById("myCanvas"+canvasNumber);
}

function getContext(canvasNumber) {
    var canvas = document.getElementById("myCanvas"+canvasNumber);
    return canvas.getContext("2d");
}

//// main code ////

const ctx1  = getContext(1);
const ctx2  = getContext(2);
const ctx3  = getContext(3);
const ctx4  = getContext(4);
const ctx9  = getContext(9);
const ctx10 = getContext(10);
const ctx0  = getContext(0);

const canvas1  = getCanvas(1);
const canvas2  = getCanvas(2);
const canvas3  = getCanvas(3);
const canvas4  = getCanvas(4);
const canvas9  = getCanvas(9);
const canvas10 = getCanvas(10);
const canvas0  = getCanvas(0);


// save images

const data1 = canvas1.toDataURL();
const data2 = canvas2.toDataURL();
const data3 = canvas3.toDataURL();
const data4 = canvas4.toDataURL();

var imgdiff1 = document.getElementById("diff1");
var imgdiff2 = document.getElementById("diff2");
var imgdiff3 = document.getElementById("diff3");

// show images

var img1 = document.getElementById("img1");
img1.src = data1;
var img2 = document.getElementById("img2");
img2.src = data2;
var img3 = document.getElementById("img3");
img3.src = data3;
var img4 = document.getElementById("img4");
img4.src = data4;

var task1 = getImagePoints(1);
var task2 = getImagePoints(2);


for (let i = 0; i < task1.length; i++) {
    const e = task1[i];
    if (e.d) {
        ctx0.beginPath();        
        ctx0.moveTo(e.x1, e.y1);
        ctx0.lineTo(e.x2, e.y2);
        ctx0.strokeStyle = "red";
        ctx0.stroke();    
    }
}

for (let i = 0; i < task2.length; i++) {
    const e = task2[i];
    if (e.d) {        
        ctx0.beginPath();        
        ctx0.moveTo(e.x1, e.y1);
        ctx0.lineTo(e.x2, e.y2);
        ctx0.strokeStyle = "black";
        ctx0.stroke();    
    }
}



var countData = 0;
var countDiff = 0;
var dataMod = ctx1.getImageData(0, 0, 400, 400);
var dataMod2 = ctx2.getImageData(0, 0, 400, 400);
//var dataMod = ctx1.data;
//console.log(dataMod);
var dif = 40;
var c1 = 0;
var c2 = 0;
var w = dataMod.width;
var h = dataMod.height;
for (let i = 0; i < h; i++) {
  for (let j = 0; j < w * 4; j+=4) {
    if (dataMod.data[i * w * 4 + j + 0] == dataMod2.data[i * w * 4 + j + 0]) {
        c1++;
        if (dataMod.data[i * w * 4 + j + 1] == dataMod2.data[i * w * 4 + j + 1]) {
          c1++;        
          if (dataMod.data[i * w * 4 + j + 2] == dataMod2.data[i * w * 4 + j + 2]) {
            c1++;                
            if (dataMod.data[i * w * 4 + j + 3] == dataMod2.data[i * w * 4 + j + 3]) {
              c1++;                
            } else
                c2++;
            } 
        } 
    }
  }
}
console.log("shoda = " + c1);
console.log("neshoda = " + c2);

imgdiff1.innerText = "shoda = " + c1 + ", neshoda = " + c2;

var luma;
var threshold = 127;

for (let i = 0; i < dataMod.data.length; i+=4) {
    luma =  dataMod.data[i + 0] * .3 + 
            dataMod.data[i + 1] *.59 +
            dataMod.data[i + 2] * .11;
    luma = luma < threshold ? 0 : 255;
    dataMod.data[i + 0] = luma;
    dataMod.data[i + 1] = luma;
    dataMod.data[i + 2] = luma;
}


for (let i = 0; i < dataMod2.data.length; i+=4) {
    luma =  dataMod2.data[i + 0] * .3 + 
            dataMod2.data[i + 1] *.59 +
            dataMod2.data[i + 2] * .11;
    luma = luma < threshold ? 0 : 255;
    dataMod2.data[i + 0] = luma;
    dataMod2.data[i + 1] = luma;
    dataMod2.data[i + 2] = luma;
}


ctx9.putImageData(dataMod, 0, 0);
ctx10.putImageData(dataMod2, 0, 0);
// console.log(countDiff);
// console.log(countData);
// console.log(dataMod);

countDiff = 0;
countData = 0;
for (let i = 0; i < dataMod.data.length; i++) {
    if (
//        (Math.abs(dataMod.data[i + 0] - dataMod2.data[i + 0]) < dif) 
//        || (Math.abs(dataMod.data[i + 1] - dataMod2.data[i + 1]) < dif) 
//        || (Math.abs(dataMod.data[i + 2] - dataMod2.data[i + 2]) < dif) 
        (dataMod.data[i + 0] != dataMod2.data[i + 0]) 
        || (dataMod.data[i + 1] != dataMod2.data[i + 1]) 
        || (dataMod.data[i + 2] != dataMod2.data[i + 2])  
//    //    || (dataMod.data[i + 3] > 0) 
        ) {
//            dataMod.data[i + 0] = 255;
//            dataMod.data[i + 1] = 255;
//            dataMod.data[i + 2] = 255;
//            dataMod.data[i + 3] = 0;
            countDiff++;
        } else {
//            dataMod.data[i + 0] = 100;
//            dataMod.data[i + 1] = 100;
//            dataMod.data[i + 2] = 100;
//            dataMod.data[i + 3] = 0;
            countData++;
//            dataMod.data[i + 0] = dataMod.data[i + 0] | dataMod2.data[i + 0];
//            dataMod.data[i + 1] = dataMod.data[i + 0] | dataMod2.data[i + 0];
//            dataMod.data[i + 2] = dataMod.data[i + 0] | dataMod2.data[i + 0];
//            dataMod.data[i + 3] = 0;
//            dataMod.data[i + 3] = dataMod.data[i + 0] & dataMod2.data[i + 0];
    }
}

// make comparisions
    console.log("dataMod: diff = ", countDiff);
    console.log("dataMod: count = ", countData);
    console.log("dataMod: ratio = ", countDiff / countData);

imgdiff3.innerHTML = "celkem bodu = " + countData + ", neshoda = " + countDiff + ", pomer = " + (countDiff/countData);
   

//************************* imgcomparer.compare() */

console.log("--");
//imgcomparer.compare([1, 2, 3], [1, 2]);

var result = imgcomparer.compare(task1, task2);
console.log("all points t1 and t2: ", result);
//for (let i = 0; i < task1a.length; i++) {
//    console.log("t1: ", i, ". ", JSON.stringify(task1a[i]));    
//}
//for (let i = 0; i < task1b.length; i++) {
//    console.log("t2: ", i, ". ", JSON.stringify(task1b[i]));    
//}

//console.log("t1: ", JSON.stringify(task1));    
//console.log("t2: ", JSON.stringify(task2));    

//console.log("t3: ", JSON.stringify(task2a));    
//console.log("t4: ", JSON.stringify(task2b));    

//var result3 = testAllLines(normalizeXY(task2a), normalizeXY(task2b));
//var result4 = testAllLines(normalizeXY(task2b), normalizeXY(task2a), 10, pointType.Count, true);
//console.log("all points t4 in t3: ", result3);
//console.log("all points t3 in t4: ", result4);


console.log("====");
//task1 = imgcomparer.normaliseXY(getImagePoints(1));
//task2 = imgcomparer.normaliseXY(getImagePoints(2));
var result12 = imgcomparer.compare(task1, task2);
console.log("comparing points t1 and t2: ", result12);
console.log("imgcomparer:", imgcomparer);