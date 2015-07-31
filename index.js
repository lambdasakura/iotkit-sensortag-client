var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var async = require('async');
var SensorTag = require("sensortag");

var udpOptions = {
  host : '127.0.0.1',
  port : 41234
};

function sendObservation(name, value, on){
  var msg = JSON.stringify({
    n: name,
    v: value,
    on: on
  });

  var sentMsg = new Buffer(msg);
  console.log("Sending observation: " + sentMsg);
  client.send(sentMsg, 0, sentMsg.length, udpOptions.port, udpOptions.host);
}

SensorTag.discover(function(sensorTag) {

  sensorTag.on('disconnect', function() {
    console.log('disconnected SensorTag');
    process.exit(0);
  });

  console.log('connect SensorTag');

  sensorTag.connect(function() {
    sensorTag.discoverServicesAndCharacteristics(function() {
      sensorTag.enableIrTemperature(function() {
        sensorTag.enableHumidity(function() {
          setInterval(function() {
            async.series([
              function(callback) {
                console.log('readIrTemperature');
                sensorTag.readIrTemperature(function(objectTemperature, ambientTemperature) {
                  console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
                  console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));

                  var obj = Object();
                  obj['objectTemperature'] = objectTemperature;
                  obj['ambientTemperature'] = ambientTemperature;
                  callback(null, obj);
                });
              },
              function(callback) {
                console.log('readHumidity');
                sensorTag.readHumidity(function(temperature, humidity) {
                  console.log('\ttemperature = %d °C', temperature.toFixed(1));
                  console.log('\thumidity = %d %', humidity.toFixed(1));

                  var obj = Object();
                  obj['temperature'] = temperature;
                  obj['humidity'] = humidity;
                  callback(null, obj);
                });
              }
            ],
                         function(err, results) {
                           console.log('results');
                           console.log(results);

                           var date = new Date();
                           console.log("==== " + date + " ====");
                           var temp = results[0].objectTemperature;
                           var humidity = results[1].humidity;

                           console.log("temp: " + temp);
                           sendObservation('temp', temp, date.getTime());

                           console.log("humidity:" + humidity);
                           sendObservation('humidity', humidity, date.getTime());
                         }
                        );
          }, 1000*10);
        });
      });
    });
  });
});
