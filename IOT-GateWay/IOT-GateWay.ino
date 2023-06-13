#include <NTPClient.h>
#include <WiFiUdp.h>
#if defined(ESP32)
#include <WiFi.h>
#include <FB_Const.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>

#include <ESP8266WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"
#include <DHT.h>

#define DHTPin 4
#define RelayPin 5
#define DHTType DHT11
DHT dht(DHTPin, DHTType);
float t,h;

#define WLAN_SSID       "GalaxyA128C0B"
#define WLAN_PASS       "1234567888"

#define AIO_SERVER      "io.adafruit.com"
#define AIO_SERVERPORT  1883                   
#define AIO_USERNAME    "HungNguyenHung"
#define AIO_KEY         "aio_KMwK36lCUmcx8jJnHH13QxS3FY2v"

/* 2. Define the API Key */
#define API_KEY "AIzaSyC-2dSQ6CMSWyxie0sYE6zcADXWQ8unnmY"

/* 3. Define the project ID */
#define FIREBASE_PROJECT_ID "iotproject-a9462"

/* 4. Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "hungvtvt01@gmail.com"
#define USER_PASSWORD "Anhhungnhata1"

#define EMAIL_PASSWORD "ahqdhvltijzwqcvr"

//Define NTP Client to get Time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

String uid;

String path;
String pathtemp;
String pathhumi;

unsigned long dataMillis = 0;

int count  = 0;
int countFlag = 0;
bool flag = false;
WiFiClient client;
Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);

Adafruit_MQTT_Publish Temperature = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/bbc-temp");
Adafruit_MQTT_Publish Humidity = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/bbc-humi");
Adafruit_MQTT_Publish pubRelay = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/bbc-pump");
Adafruit_MQTT_Subscribe Relay = Adafruit_MQTT_Subscribe(&mqtt, AIO_USERNAME "/feeds/bbc-pump");

void MQTT_connect();

void setup() {
  Serial.begin(115200);
  delay(10);

  pinMode(RelayPin, OUTPUT);
  digitalWrite(RelayPin, LOW);
  dht.begin();
  delay(10);

  Serial.println(); Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WLAN_SSID);

  WiFi.begin(WLAN_SSID, WLAN_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.println("WiFi connected");
  Serial.println("IP address: "); Serial.println(WiFi.localIP());
  timeClient.begin();
  timeClient.setTimeOffset(0);

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);
  

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

  Firebase.begin(&config, &auth);
  
  Firebase.reconnectWiFi(true);

  mqtt.subscribe(&Relay);

  //----------------------------------------------
  // Getting the user UID might take a few seconds
  //-----------------------------------------------

  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
    //-----------------
   // Print user UID
   //------------------
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.println(uid);
}



void loop() {

  t = dht.readTemperature();
  h = dht.readHumidity();
  Serial.print("Temperature: ");
  Serial.println(t);
  Serial.print("Humi: ");
  Serial.println(h);
  MQTT_connect();

  Adafruit_MQTT_Subscribe *subscription;
  while ((subscription = mqtt.readSubscription(5000))) {
    if (subscription == &Relay) {
      Serial.print(F("Got: "));
      String pumpStatus = (char *)Relay.lastread;
      Serial.println(pumpStatus);
      if (pumpStatus == "3")
      {
        digitalWrite(RelayPin, HIGH);
        Serial.println(pumpStatus);
      }
      else if (pumpStatus == "2")
      {
        digitalWrite(RelayPin, LOW);
        Serial.print(F("Got: Low "));
        Serial.println(pumpStatus);
      }
    }
  }

  

  if(count == 4){
    Serial.println(F("Count = 4"));
    
    t = dht.readTemperature();
    h = dht.readHumidity();
    Serial.print("Temperature: ");
    Serial.println(t);
    Serial.print("humi: ");
    Serial.println(h);
    if(!isnan(h) && !isnan(t)){
        if (! Temperature.publish(t)) {
        Serial.println(F("Temperature Failed"));
      } else {
        Serial.print(F("Temperature OK!: "));
        Serial.println(t);
      }
      if (! Humidity.publish(h)) {
        Serial.println(F("Humidity Failed"));
      } else {
        Serial.print(F("Humidity OK!: "));
        Serial.println(h);
      }
    }
    if(countFlag == 3){
      countFlag == 0;
      flag = false;
    }else{
      countFlag = countFlag + 1;
    }
    count = 0;
  } else {
    count = count + 1;
    if(t >= 29 && flag == false){
      flag = true;
      digitalWrite(RelayPin, HIGH);
      pubRelay.publish(3);
      if (Firebase.ready() && (millis() - dataMillis > 60000 || dataMillis == 0))
      {
          dataMillis = millis();

          timeClient.update();
          time_t epochTime = timeClient.getEpochTime();
          struct tm *ptm = gmtime ((time_t *)&epochTime);
          int day = ptm->tm_mday;
          int hour = ptm->tm_hour;
          int minute = ptm->tm_min;
          int second = ptm->tm_sec;
          String daypush;
          String hourpush;
          String minutepush;
          String secondpush;
          if(day < 10){
            daypush ="0" + String(day);
          } else{
            daypush = String(day);
          }
          if(hour < 10){
            hourpush ="0" + String(hour);
          } else{
            hourpush = String(hour);
          }
          if(minute < 10){
            minutepush ="0" + String(minute);
          } else{
            minutepush = String(minute);
          }
          if(second < 10){
            secondpush ="0" + String(second);
          } else{
            secondpush = String(second);
          }
          String time = String(ptm->tm_year+1900) + "-" + String(ptm->tm_mon+1) + "-" + daypush + "T" + hourpush +":" + minutepush +":" + secondpush + "Z";

          //-------------------
          //Create Document
          //-------------------
          FirebaseJson content;

          
          content.set("fields/startTime/timestampValue",time); // RFC3339 UTC "Zulu" format
          content.set("fields/endTime/timestampValue", time);
          content.set("fields/auto/booleanValue", true);
          content.set("fields/pumpRecordid/stringValue", "");
          content.set("fields/user/stringValue","user");
          
          //esp is the collection id, user uid is the document id in collection info.
          path = "location/2KBQ8FWBfxKcf8tOG8GK/pumpRecords/";
          
          Serial.print("Create document... ");
          String ledstatus = (char *)content.raw();
          Serial.println(ledstatus);

          if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", path.c_str(), content.raw()))
              Serial.println("Create relay document success");
          else
              Serial.println(fbdo.errorReason());
      }
    }
  }
  Serial.println(count);
  delay(100);
}

void MQTT_connect() 
{
  int8_t ret;
  if (mqtt.connected()) 
  {
    return;
  }

  Serial.print("Connecting to MQTT... ");

  uint8_t retries = 3;
  while ((ret = mqtt.connect()) != 0) { // connect will return 0 for connected
       Serial.println(mqtt.connectErrorString(ret));
       Serial.println("Retrying MQTT connection in 5 seconds...");
       mqtt.disconnect();
       delay(5000);  // wait 5 seconds
       retries--;
       if (retries == 0) {
         // basically die and wait for WDT to reset me
         while (1);
       }
  }
  Serial.println("MQTT Connected!");
}