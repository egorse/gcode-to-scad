var version='0.0.1';
if (process.argv.length <= 2) {
    console.log('gcode-to-scad translator v%s', version);
    console.log('Usage: %s <input-file>',       __filename);
    process.exit(1);
}

var fs       =  require('fs'),
    readline = require('readline');

var input_filename = process.argv[2];
if (!fs.existsSync(input_filename)) {
    console.error('File "%s" does not exists!!!', input_filename);
    process.exit(2);
}

//
//
//
var printer = {
    x: 0,
    y: 0,
    z: 0,
    e: 0,

    //
    //
    //
    home: function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.e = 0;
        //console.info('Printer possition X:%d, Y:%d, Z:%d, E:%d', this.x, this.y, this.z, this.e);
    },
    set: function (pos) {
        const has_x = pos.hasOwnProperty('x'),
              has_y = pos.hasOwnProperty('y'),
              has_z = pos.hasOwnProperty('z'),
              has_e = pos.hasOwnProperty('e');

        if (has_x) this.x = pos.x;
        if (has_y) this.y = pos.y;
        if (has_z) this.z = pos.z;
        if (has_e) this.e = pos.e;
        //console.info('Printer possition X:%d, Y:%d, Z:%d, E:%d', this.x, this.y, this.z, this.e);
    },
    layer: 0,
    move: function (pos) {
        const has_x = pos.hasOwnProperty('x'),
              has_y = pos.hasOwnProperty('y'),
              has_z = pos.hasOwnProperty('z'),
              has_e = pos.hasOwnProperty('e');

        if (!has_x && !has_y && has_z && !has_e) { // Z only move
            if (this.layer != 0) console.log('}');
            ++this.layer;
            this.z = pos.z;
            console.log('union () { // Layer %d', this.layer);
        } else if (has_x && has_y && !has_z && !has_e) { // Move
            this.x = pos.x;
            this.y = pos.y;
        } else if (!has_x && !has_y && !has_z && has_e && this.e > pos.e) { // Retract
            this.e = pos.e
        } else if (!has_x && !has_y && !has_z && has_e && this.e < pos.e) { // Push
            this.e = pos.e;
        } else if (has_x && has_y && !has_z && has_e && this.e < pos.e && (this.x != pos.x || this.y != pos.y)) { // Move and extrude

            console.log('    segment(a=[%d,%d], b=[%d,%d], z=%d);',
                this.x, this.y,
                pos.x,  pos.y,
                this.z);

            this.x = pos.x;
            this.y = pos.y;
            this.e = pos.e;
        } else {
            console.warn('Unsupported move to X:%d, Y:%d, Z:%d, E:%d', pos.x, pos.y, pos.z, pos.e);
            console.warn('Printer possition X:%d, Y:%d, Z:%d, E:%d', this.x, this.y, this.z, this.e);
        }
        //console.info('Printer move to   X:%d, Y:%d, Z:%d, E:%d', pos.x, pos.y, pos.z, pos.e);
        //console.info('Printer possition X:%d, Y:%d, Z:%d, E:%d', this.x, this.y, this.z, this.e);
    }
};

//
// The cb @on_line called once per each line from @input_filename
// It parse G code and calls the @printer
//
function on_line(line) {
    var l = line.trimLeft(); if (!l.length || l[0] === ';') return;
    var a = l.split(' ');
    var gcode = a[0];

    // See https://thingiverse-production-new.s3.amazonaws.com/assets/87/b0/2c/f5/4c/CheatSheet.pdf
    // See http://reprap.org/wiki/G-code
    if (gcode == 'G28') { // Home
        printer.home();
    } else if (gcode == 'G92') { // G92 - Set Position
        var index, axis, value, pos = {};
        for (index = 1; index < a.length; ++index) {
            axis  = a[index].charAt(0).toLowerCase();
            value = a[index].slice(1);
            pos[axis] = parseFloat(value);
        }
        printer.set(pos);
    } else if (gcode == 'G1') { // Move
        var index, axis, value, pos = {};
        for (index = 1; index < a.length; ++index) {
            axis  = a[index].charAt(0).toLowerCase();
            value = a[index].slice(1);
            pos[axis] = parseFloat(value);
        }
        printer.move(pos);
    } else if (gcode == 'G21') { // Set Units to Millimeters
        console.warn('G21 - Set Units to Millimeters - ignored!!!');
    } else if (gcode == 'M82' || gcode == 'G90')  { // M82 - Set extruder to absolute mode, G90 - Set to Absolute Positioning
    } else if (gcode == 'M83' || gcode == 'G91')  { // M83 - Set extruder to relative mode, G91 - Set to Relative Positioning
        console.error('Relative Positioning is not supported!!!');
        process.abort();
    } else if (gcode == 'M84')  { // M84 - Stop idle hold
    } else if (gcode == 'M104') { // Set extruder temperature (not waiting)
    } else if (gcode == 'M106') { // Turn Fan on
    } else if (gcode == 'M107') { // Turn Fan off
    } else if (gcode == 'M109') { // Set extruder Temperature (waits till reached)
    } else {
        console.info('Unsupported code: %s', a[0]);
    }
}

//
// Read @input_filename line by line and process via @on_line cb
//
readline.createInterface({
    terminal: false, //
    input: fs.createReadStream(input_filename)
}).on('line', on_line);
