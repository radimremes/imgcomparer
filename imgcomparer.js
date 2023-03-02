/*
(c) 2022-2023 Radim Remes, Jiri Vanice, Ladislav Beranek, Jan Fiala / imgcomparer v0.3
URL: https://github.com/radimremes/imgcomparer/
*/

(function(root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.imgcomparer = factory();
    }
})(this, function() {
    "use strict";

    const comparerType =  Object.freeze({
        Analytic: Symbol("analytic"),
        Bitmap: Symbol("bitmap")
    });

    function normaliseXY(task, accurancy = 10) {
        // remove lines with d: false
        task = task.filter(function(value, index, arr) {
            return value.d;
        });
        var normX = 0;
        for (let i = 0; i < task.length; i++) {
            task[i].x1 = Math.round(task[i].x1 * accurancy) / accurancy;
            task[i].y1 = Math.round(task[i].y1 * accurancy) / accurancy;
            task[i].x2 = Math.round(task[i].x2 * accurancy) / accurancy;
            task[i].y2 = Math.round(task[i].y2 * accurancy) / accurancy;
            if (task[i].x2 < task[i].x1) { 
                // swap
                const x = task[i].x1;
                const y = task[i].y1;
                task[i].x1 = task[i].x2;
                task[i].y1 = task[i].y2;
                task[i].x2 = x;
                task[i].y2 = y;
                normX++;
            }        
        }
        var normY = 0;
        for (let i = 0; i < task.length; i++) {
            for (let j = i + 1; j < task.length; j++) {
                if ( (task[i].y1 > task[j].y1)         // prvni y je vetsi
                        || ((task[i].y1 == task[j].y1)     // jsou stejne y
                        && (task[i].x1 > task[j].x1)) ) {  // prvni x je vetsi
                    // swap
                    var item  = task[i];
                    task[i] = task[j];
                    task[j] = item;
                    normY++;
                }
            }        
        }
        return task;
    }
    
    function getVector(line) {
        var uy = line.y2 - line.y1;
        var ux = line.x2 - line.x1;
        return {"ux": ux, "uy": uy};
    }
    
    function testLineV2(line, point) {
        var testResult = false;
        const delta = .1;
        var vector = getVector(line);
        var k1 = (point.x - line.x1) / vector.ux;
        var k2 = (point.y - line.y1) / vector.uy;
        if (vector.ux == 0) {
            k1 = 10;
            if (point.x == line.x1) { // on the same X
                if ( (point.y >= Math.min(line.y1, line.y2))
                    && (point.y <= Math.max(line.y2, line.y1)) ) {
                    k1 = k2;
                }
            }
        }
        if (vector.uy == 0) {
            k2 = 10;
            if (point.y == line.y1) { // on the same Y
                if ( (point.x >= Math.min(line.x1, line.x2))
                    && (point.x <= Math.max(line.x2, line.x1)) ) {
                    k2 = k1;
                }
            }
        }
        if ((k1 >= 0) && (k1 <= 1) &&
            (k2 >= 0) && (k2 <= 1) &&
            (Math.abs(k2 - k1) < delta)) {
            testResult = true;
        }
        return testResult;
    }
    
    function getLineLength(line) {
        return Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
    }

    function testAllLines(t1, t2) {
        var points = 10;
        var resultArray = Array.apply(null, Array(t2.length * (points + 1))).map(function (x, i) { return false; });
        var resK = true;
        var res = true;
        for (let i = 0; i < t1.length; i++) {
            const line1 = t1[i];
            const vector1 = getVector(line1);
            const line1Length = getLineLength(line1);
            var kDelta = 1 / points;
            for (let j = 0; j < t2.length; j++) {
                const line2 = t2[j];
                const vector2 = getVector(line2);
                const line2Length = getLineLength(line2);
                var kk = -kDelta;
                for (let k = 0; k <= points; k++) {
                    kk += kDelta;
                    const pointX = line2.x1 + kk * vector2.ux;
                    const pointY = line2.y1 + kk * vector2.uy;
                    const pointK = {"x": pointX, "y": pointY};
                    resK = testLineV2(line1, pointK);
                    if (resK)
                    {
                        resultArray[j * (points + 1) + k] = true;
                    }
                    res = res && resK;
                } // for k
            } // for j
        } // for i
        //console.log(resultArray);
        var resultOK = true;
        var diffs = 0;
        for (let i = 0; i < resultArray.length; i++) {
            if (resultArray[i] === false) {
                resultOK = false;
                diffs++;
                var poradi = (i % (points + 1)) + 1;
                var index = Math.trunc(i / (points + 1));
            } // if resultArray[i] === false
        } // for i
        //console.log("resultOK = ", resultOK);
        return [resultOK, diffs];
    } // function testAllLines(t1, t2)

    var imgcomparer = {
        compareType : comparerType.Analytic,
        points : 10,
        normaliseImages: true,                
        compare : function(img1, img2) {
            var result1 = false;
            var result2 = false;
            var diffs1 = 0;
            var diffs2 = 0;
            if (this.normaliseImages) {
                img1 = normaliseXY(img1);
                img2 = normaliseXY(img2);
            }
            switch (this.compareType) {
                case comparerType.Analytic:
                    [result1, diffs1] = testAllLines(img1, img2);
                    [result2, diffs2] = testAllLines(img2, img1);
                    break;
                case comparerType.Bitmap:
                    result1 = false; // TODO bitmap comparison
                    result2 = false; 
                    break;
                default:
                    [result1, diffs1] = testAllLines(img1, img2, this.points, this.compareType, this.normaliseImages);
                    [result2, diffs2] = testAllLines(img2, img1, this.points, this.compareType, this.normaliseImages);
                    break;
            }
            this.output.result = result1 && result2;
            this.output.difference1 = diffs1;
            this.output.difference2 = diffs2;
            this.output.differences = diffs1 + diffs2;
            //console.log("image1 length", img1.length);
            //console.log("image2 length", img2.length);
            return this.output.result;
        },
        normalise: function(img) {
            return normaliseXY(img);
        },
        setOptionsDefault : function() {
            this.compareType = comparerType.Analytic,
            this.points = 10;
            this.normaliseImages = true;
        },
        output : {
            "result": false,
            "difference1": 0,
            "difference2": 0,
            "differences": 0
        }
    };

    return imgcomparer;
});
