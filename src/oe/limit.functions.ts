import { Axis, Type } from './limit.constants'
import { Pnt, Line, ConstantLimit, CurveLimit, ColorArea, WindowOfInterest } from './limit.types'

function constantToCurve(constant: ConstantLimit, window: WindowOfInterest){
    let values = new Array<Pnt>();
    let minX = window.lower_left.x-1;
    let minY = window.lower_left.y-1;
    let maxX = window.upper_right.x+1;
    let maxY = window.upper_right.y+1;

    if (constant.axis == Axis.X) {
        if (constant.type == Type.Min){
            values.push(new Pnt(constant.value,minY));
            values.push(new Pnt(constant.value,maxY));
        }
        else{
            values.push(new Pnt(constant.value,maxY));
            values.push(new Pnt(constant.value,minY));
        }
    }

    else {
        if (constant.type == Type.Min){
            values.push(new Pnt(maxX,constant.value));
            values.push(new Pnt(minX,constant.value));
        }
        else{
            values.push(new Pnt(minX,constant.value));
            values.push(new Pnt(maxX,constant.value));
        }
    }

    return new CurveLimit(constant.category, values);
}

function isInsideWindow(point: Pnt, window: WindowOfInterest) {
    let minX = window.lower_left.x;
    let minY = window.lower_left.y;
    let maxX = window.upper_right.x;
    let maxY = window.upper_right.y;

    return (point.x > minX) &&
           (point.x < maxX) &&
           (point.y > minY) &&
           (point.y < maxY);
}

function areIntersecting(line1: Line, line2: Line) {
    let x1 = line1.p1.x;
    let y1 = line1.p1.y;
    let x2 = line1.p2.x;
    let y2 = line1.p2.y;
    let x3 = line2.p1.x;
    let y3 = line2.p1.y;
    let x4 = line2.p2.x;
    let y4 = line2.p2.y;
    let x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    let y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y)) {
        return false;
    } else {
        if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) {
                return false;
            }
        } else {
            if (!(x1 <= x && x <= x2)) {
                return false;
            }
        }
        if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) {
                return false;
            }
        } else {
            if (!(y1 <= y && y <= y2)) {
                return false;
            }
        }
        if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) {
                return false;
            }
        } else {
            if (!(x3 <= x && x <= x4)) {
                return false;
            }
        }
        if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) {
                return false;
            }
        } else {
            if (!(y3 <= y && y <= y4)) {
                return false;
            }
        }
    }
    return true;
}

function numberOfIntersections(crossLine: Line, curve: Pnt[]){
    let cnt = 0;
    for (let i = 0; i < curve.length-1; i++) {
        var curveLine = new Line(curve[i], curve[i+1]);

        if (areIntersecting(curveLine,crossLine)) {
            cnt++;
        }
    }
    return cnt;
}

function rotateVector(vector: Pnt, degrees: number) {
	var newx = vector.x * Math.cos(degrees) - vector.y * Math.sin(degrees);
	var newy = vector.x * Math.sin(degrees) + vector.y * Math.cos(degrees);
	var newVect = new Pnt(newx,newy);
	return newVect;
}

function isOnSafeSide(point: Pnt, curve: Pnt[]) {
	var midx = (curve[1].x)/2 - (curve[0].x)/2;
	var midy = (curve[1].y)/2 - (curve[0].y)/2;
	var perpVect = rotateVector(new Pnt(midx,midy), -Math.PI/2);
	var perpVectLength = Math.sqrt(perpVect.x * perpVect.x + perpVect.y * perpVect.y);
	var normPerpVect = new Pnt((perpVect.x)/perpVectLength,(perpVect.y)/perpVectLength);
	var safePoint = new Pnt(curve[0].x + midx + (normPerpVect.x)*1e-2,curve[0].y + midy + (normPerpVect.y)*1e-2);
	var crossLine = new Line(safePoint,point);
	return (numberOfIntersections(crossLine,curve) %2 == 0);
}

function curvelimitToArea(curveLimit: CurveLimit, window: WindowOfInterest) {
    let pointsAdded = false;
    let windowPoints = [window.upper_left, window.lower_left, window.lower_right, window.upper_right];
    let points = new Array<Pnt>();
	for (var i = 0; i < windowPoints.length; i++) {
		var safe = isOnSafeSide(windowPoints[i], curveLimit.values);
		if(i==0){
			if(!safe){
				points.push(windowPoints[i]);
			}
		}
		else{
			//if(!pointsAdded && safe != previousSafe){
			var crossLine = new Line(windowPoints[i-1], windowPoints[i]);
			if(!pointsAdded && numberOfIntersections(crossLine,curveLimit.values) > 0){
				for (var j = 0; j < curveLimit.values.length; j++) {
					points.push(curveLimit.values[j]);
				}
				pointsAdded = true;
			}
			if(!safe){
				points.push(windowPoints[i]);
			}
		}

		var previousSafe = safe;
	}
	if (!pointsAdded) {
		for (var j = 0; j < curveLimit.values.length; j++) {
			points.push(curveLimit[j]);
		}
	}

	// Closing the area by adding the first point
	points.push(points[0]);

    return new ColorArea(points, curveLimit.category.color);
}

export { constantToCurve, isInsideWindow, numberOfIntersections, isOnSafeSide, curvelimitToArea };