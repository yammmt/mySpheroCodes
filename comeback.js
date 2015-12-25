var sphero = require("sphero")
orb = sphero("/dev/tty.Sphero-YRW-AMP-SPP");

const defaultSpheroColor = "lightskyblue";
const dangerSpheroColor = "darkred";
const calmSpheroColor = "mediumseagreen";


orb.connect(function() {

  var already_odo_init = false;
  var already_backed = false;
  var odo_bgn_x = 0;
  var odo_bgn_y = 0;



  function changeDangerColor() {
    orb.color(dangerSpheroColor);
    setTimeout(function() {
      orb.color(defaultSpheroColor);
    }, 1000);
  };

  function changeCalmColor() {
    orb.color(calmSpheroColor);
    setTimeout(function() {
      orb.color(defaultSpheroColor);
    }, 1000);
  };

  function back2me(dist_x, dist_y) {
    already_backed = true;
    console.log("back2me");
    console.log("dist_x:", dist_x);
    console.log("dist_y:", dist_y);
    var diff_x = odo_bgn_x-dist_x;
    var diff_y = odo_bgn_y-dist_y;
    deg_rad = Math.atan2(diff_y, diff_x);
    deg_ang = deg_rad/(Math.PI/180);
    console.log(deg_ang);
    orb.roll(70, deg_ang);
    changeCalmColor();
  };

  function prepare4back(data) {
    console.log("prepare4back");
    prepare_x = parseInt(data.xOdometer.value);
    prepare_y = parseInt(data.yOdometer.value);
    console.log("prepare_x:", prepare_x);
    console.log("prepare_y:", prepare_y);
    if(!already_odo_init) {
      odo_bgn_x = prepare_x;
      odo_bgn_y = prepare_y;
      already_odo_init = true;
    }
    setTimeout(function() {
      if(!already_backed) {
        back2me(prepare_x, prepare_y);
      }
    }, 10000);
  };



  orb.color(defaultSpheroColor);

  orb.detectCollisions();
  orb.streamOdometer();
  orb.streamOdometer.sps = 1;

  orb.on("collision", changeDangerColor);
  orb.on("odometer", function(data) {
    prepare4back(data); // NO need for calling this after back2me
  });

});
