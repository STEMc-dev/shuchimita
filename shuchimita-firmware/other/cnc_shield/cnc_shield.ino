// defines pins numbers
const int pingPin = 50;

const int stepX = 2;
const int dirX = 5;

const int enPin = 8;

const int irPin = 52;

bool dispenserDetected = false;
char instruction = "";

void setup() {
  // Sets the two pins as Outputs
  pinMode(pingPin, INPUT);

  pinMode(stepX, OUTPUT);
  pinMode(dirX, OUTPUT);

  pinMode(enPin, OUTPUT);

  pinMode(irPin, INPUT);

  digitalWrite(enPin, LOW);
  digitalWrite(dirX, HIGH);

  Serial.begin(115200);
}

void loop() {
  int ping = digitalRead(pingPin);
  if (ping) {
    Serial.println("high");
  }
  else{
    Serial.println("low");
  }

  int val = digitalRead(irPin);
  if (!val) dispenserDetected = true;
  if (ping) dispenserDetected = false;

  if (!dispenserDetected) {
    digitalWrite(stepX, HIGH);
    delayMicroseconds(50);
    digitalWrite(stepX, LOW);
    delayMicroseconds(50);
  }
}