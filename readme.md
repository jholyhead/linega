A simple project that attempts to use genetic algorithms to 'evolve' a picture using only single colour straight lines that must start and end at the boundary of the canvas. Inspired by artwork like https://www.reddit.com/r/Art/comments/454joy/drawing_experiment_every_line_goes_through_the/

Example.jpg provides an illustration of long run performance.

Written in HTML5 and Javascript. This was a quick hacky project that a couple of PhD students at the University of Southampton students hacked together in an afternoon while procrastinating.

The easiest way to run the code is to spin up a simple http server from the source directory in python. With python 3:

~~~~
python3 -m http.server
~~~~

Chrome will complain about 'cross-origin data' if you attempt to run this locally without a server.

There's quite a lot of computation going on in each generation, so just leave it running whilst you grab a cup of tea...or an entire night's sleep.
