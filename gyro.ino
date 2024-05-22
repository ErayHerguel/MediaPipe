#include <WiFi.h>
#include <PubSubClient.h>
#include "MPU6050.h"  // Ersetzen Sie dies durch Ihre spezifische Gyroskop-Bibliothek

// Netzwerk und MQTT-Broker Einstellungen
const char* ssid = "iPhone von Eray";
const char* password = "hergueer35421";
const char* mqtt_server = "mqtt.hfg.design";

WiFiClient espClient;
PubSubClient client(espClient);
MPU6050 gyro;

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);  // MQTT port ist typischerweise 1883
  gyro.initialize();
}

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (gyro.testConnection()) {
      int16_t ax, ay, az, gx, gy, gz;
      gyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
      String payload = String(gx) + "," + String(gy) + "," + String(gz);
      client.publish("sensor/gyro", payload.c_str());
  }
  delay(500);  // Update interval
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
      // Nach der Verbindung abonnieren oder Publizieren
      client.subscribe("sensor/gyro");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
