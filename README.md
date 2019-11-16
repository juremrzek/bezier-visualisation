# bezier-visualisation

This program draws a bezier curve based on any number of given points.
It works by having three types of points 
	- stationary points(pointsN) that will always have the same coordinates
	- midpoints (pointsA) that travel across lines between stationary points or lines between other midpoints
	- final points (pointsF) that, when connected with each other, form a bezier curve