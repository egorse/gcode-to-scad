.PHONY:all clean
all: cube.gcode

cube.stl: cube.scad
	echo "Create stl"
	openscad -o $@ $<

cube.gcode: cube.stl
	echo "Create gcode"
	slic3r $< --output $@ --layer-height 0.2 --nozzle-diameter 0.4 --filament-diameter 1.75

clean:
	rm -f cube.stl cube.gcodes
