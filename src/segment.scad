$fn = 100; // global quality
nozzle = 0.4;
layer = 0.2;

//
//
//
module segment(a = [0,0], b = [0,0], z = 0) {
    translate([a[0], a[1], z]) cylinder(h=layer, d=nozzle); // drop A    
    translate([b[0], b[1], z]) cylinder(h=layer, d=nozzle); // drop B

    // line
    segment_length = norm([a[0] - b[0], a[1] - b[1]]);
    dx = b[0] - a[0];
    dy = b[1] - a[1];
    // http://stackoverflow.com/questions/7586063/how-to-calculate-the-angle-between-a-line-and-the-horizontal-axis
    r = atan2(dy, dx) - 90;
    echo(a);
    translate([a[0], a[1], z]) 
        rotate (r)
            translate([-(nozzle / 2), 0, 0]) 
                cube([nozzle, segment_length, layer], center = false);
}

segment(a=[0,0], b=[10,0], z=0);
segment(a=[1,1], b=[1,3], z=0);
segment(a=[2,1], b=[2,6], z=0);
segment(a=[0,0], b=[0,10], z=1);
segment(a=[1,1], b=[3,10], z=2);
