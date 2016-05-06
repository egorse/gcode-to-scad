# cube.scad -> cube.stl -> cube.gcode -> out.cube.scad -> out.cube.csg
# FreeCAD can handle .scad as well as .csg

.PHONY:all clean
all: out.cube.csg

cube.stl: cube.scad
	openscad -o $@ $<

cube.gcode: cube.stl
	slic3r $< --output $@ --layer-height 0.2 --nozzle-diameter 0.4 --filament-diameter 1.75

out.cube.scad: cube.gcode ../../src/gcode-to-scad.js ../../src/segment.scad
	cat ../../src/segment.scad > $@
	nodejs ../../src/gcode-to-scad.js $< >> $@

out.cube.csg: out.cube.scad
	openscad -o $@ $<

clean:
	rm -f cube.stl cube.gcodes out.*
