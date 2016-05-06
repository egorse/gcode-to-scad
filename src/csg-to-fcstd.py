# See http://www.freecadweb.org/wiki/index.php?title=Topological_data_scripting#Creating_a_Circle
import sys
sys.path.insert(0, '/usr/lib/freecad/lib/')

from FreeCAD import Base
import importCSG

#
# This convertion may be time, cpu and memory consuming!!!
#
print 'Convert', sys.argv[1], 'to', sys.argv[2]

print 'Load the', sys.argv[1]
doc = importCSG.open(sys.argv[1])
print 'The', sys.argv[1], 'loaded'

print 'Save to', sys.argv[2], '...'
doc.saveAs(sys.argv[2])

print 'Done!!!'
