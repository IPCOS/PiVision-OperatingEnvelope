import { Axis, Type, Category } from './limit.constants'
import { Pnt, ConstantLimit, CurveLimit, WindowOfInterest } from './limit.types'

let const1 = new ConstantLimit(Axis.X,Type.Max,Category.Integrity,600);
let const2 = new ConstantLimit(Axis.X,Type.Min,Category.Capacity,180);
let constCollection = [const1,const2];

let curvePnts1 = [new Pnt (30,3000),new Pnt (120,3500),new Pnt (500,1500),new Pnt (1500,300),new Pnt (3100,200),new Pnt (5200,100),new Pnt (6600,50),new Pnt (7100,25)];
let curve1 = new CurveLimit(Category.Window, curvePnts1);
let curvePnts2 = [new Pnt(500/10,130.89),new Pnt(800/10,146.43),new Pnt(1100/10,169.62),new Pnt(1500/10,212.66),new Pnt(2000/10,274.88),new Pnt(2500/10,331.88),new Pnt(3100/10,403.03),new Pnt(3700/10,476.72),new Pnt(4400/10,559.34),new Pnt(5200/10,649.6),new Pnt(5600/10,693.78),new Pnt(6100/10,748.48),new Pnt(6600/10,1500),new Pnt(7100/10,4000)];
let curve2 = new CurveLimit(Category.Capacity, curvePnts2.reverse());
let curvePnts3 = [new Pnt(12/2,305.462*4), new Pnt(17/2,306.686*4), new Pnt(25/2,309.304*4), new Pnt(50/2,322.513*4), new Pnt(80/2,348.931*4), new Pnt(110/2,388.354*4), new Pnt(150/2,461.522*4), new Pnt(200/2,567.296*4), new Pnt(300/2,664.196*4), new Pnt(410/2,785.151*4), new Pnt(570/2,810.424*4), new Pnt(740/2,950.878*4), new Pnt(820/2,1104.32*4), new Pnt(5600/2,1179.426*4), new Pnt(1100/2,1272.416*4), new Pnt(1600/2,1364.743*4), new Pnt(2100/2,1455.574*4)];
let curve3 = new CurveLimit(Category.Window, curvePnts3);
let curveCollection = [curve1, curve2];

// window of interest
let minX = 40;
let maxX = 7000;
let minY = 0;
let maxY = 1600;
let windowOfInterest = new WindowOfInterest(
    new Pnt(minX,maxY),
    new Pnt(maxX, maxY),
    new Pnt(minX, minY),
    new Pnt(maxX, minY)
);

export { constCollection, curveCollection, windowOfInterest };