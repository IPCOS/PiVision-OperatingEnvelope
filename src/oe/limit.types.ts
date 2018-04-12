import { Axis, Category, Type } from './limit.constants'

class Pnt {
    x: number; y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    p1: Pnt; p2: Pnt;
    constructor(p1: Pnt, p2: Pnt) {
        this.p1 = p1;
        this.p2 = p2;
    }
}

class ConstantLimit {
    axis: Axis; type: Type; category: Category; value: number;
    constructor(axis: Axis, type: Type, category: Category, value: number) {
        this.axis = axis;
        this.type = type;
        this.category = category;
        this.value = value;
    }
}

class CurveLimit {
    category: Category; values: Pnt[];
    constructor(category: Category, values: Pnt[]) {
        this.category = category;
        this.values = values;
    }
}

class WindowOfInterest {
    upper_left: Pnt; upper_right: Pnt; lower_left: Pnt; lower_right: Pnt;
    constructor(upper_left: Pnt, upper_right: Pnt, lower_left: Pnt, lower_right: Pnt) {
        this.upper_left = upper_left;
        this.upper_right = upper_right;
        this.lower_left = lower_left;
        this.lower_right = lower_right;
    }
}

class ColorArea {
    points: Pnt[]; color: string;
    constructor(points: Pnt[], color: string) {
        this.points = points;
        this.color = color;
    }
}

export { Pnt, Line, ConstantLimit, CurveLimit, WindowOfInterest, ColorArea };