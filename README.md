# iotkit-sensor-tag-client

[Indel Edison](http://www.intel.com/content/www/us/en/do-it-yourself/edison.html)上で動作する、[IoTAnaltics](http://enableiot.com/)、TI の[SensorTag](http://www.tij.co.jp/tool/jp/cc2650stk)を連携させるためのクライアント。

BLEでsensortagと通信して、温度、湿度を取得して、```Intel Edison```上の```iotkit-agent```に対して、udpで情報送信する。

事前に以下のコマンドで、iotkit-agentが```Iot Analytics```にデータを送信できるように設定しておく必要がある。

```
iotkit-admin register temp temperature.v1.0
iotkit-admin register humidity humidity.v1.0
```


