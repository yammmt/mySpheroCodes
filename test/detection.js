var sphero = require("sphero");
orb = sphero("/dev/tty.Sphero-YRW-AMP-SPP");

orb.connect(function() {
  orb.color("cyan");

  orb.detectCollisions();

  orb.on("collision", function(data) {
    orb.color("mistyrose");
    setTimeout(function() {
      orb.color("cyan");
    }, 1000);
  });
});
