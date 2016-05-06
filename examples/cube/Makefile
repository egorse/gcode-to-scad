# cube.scad -(openscad)-> cube.stl -(slicer)-> cube.gcode -(gcode-to-scad)-> out.cube.scad -(openscad)-> out.cube.csg -(freecad)-> out.cube.fcstd

.PHONY:all clean
all: out.cube.fcstd

cube.stl: cube.scad
	openscad -o $@ $<

cube.gcode: cube.stl
	slic3r $< --output $@ --layer-height 0.2 --nozzle-diameter 0.4 --filament-diameter 1.75

out.cube.scad: cube.gcode ../../src/gcode-to-scad.js ../../src/segment.scad
	cat ../../src/segment.scad > $@
	nodejs ../../src/gcode-to-scad.js $< >> $@
	echo "}" >> $@

out.cube.csg: out.cube.scad
	openscad -o $@ $<

out.cube.fcstd: out.cube.csg
	# Run the FreeCAD in batch mode
	#taskset -c 0
	time python ../../src/csg-to-fcstd.py $< $@

clean:
	rm -f cube.stl cube.gcode out.* parsetab.py
