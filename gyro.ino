#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include "MPU6050.h"

const char* ssid = "iPhone von Eray";
const char* password = "herguel35421";
const char* mqtt_server = "mqtt.hfg.design";

WiFiClient espClient;
PubSubClient client(espClient);
MPU6050 gyro(Wire);

void setup_wifi() {
    delay(10);
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void reconnect() {
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        if (client.connect("ESP32Client")) {
            Serial.println("connected");
            client.subscribe("sensor/gyro");
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void setup() {
    Serial.begin(115200);
    Wire.begin(4, 5); // SDA ist GPIO 4, SCL ist GPIO 5
    gyro.initialize();

    setup_wifi();
    client.setServer(mqtt_server, 1883);
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    if (gyro.testConnection()) {
        int16_t ax, ay, az, gx, gy, gz;
        gyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
        String payload = String("Accel X: ") + ax + ", Accel Y: " + ay + ", Accel Z: " + az +
                         ", Gyro X: " + gx + ", Gyro Y: " + gy + ", Gyro Z: " + gz;
        client.publish("sensor/gyro", payload.c_str());
        Serial.println(payload);
    }

    delay(500); // Verzögerung zwischen den Messungen zur Begrenzung der Datenrate
}
