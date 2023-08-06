// defines pins numbers

const int stepX = 2;
const int dirX = 5;

const int enPin = 8;

const int irPin = 52;

bool dispenserDetected = false;
char instruction = "";

void setup() {
  // Sets the two pins as Outputs

  pinMode(stepX, OUTPUT);
  pinMode(dirX, OUTPUT);

  pinMode(enPin, OUTPUT);

  pinMode(irPin, INPUT);

  digitalWrite(enPin, LOW);
  digitalWrite(dirX, HIGH);

  Serial.begin(115200);
  Serial1.begin(115200);
}

void loop() {
  // Enables the motor to move in a particular direction
  // Makes 200 pulses for making one full cycle rotation
  if (Serial1.available()) {
    instruction = Serial1.read();
    Serial.println(instruction);
  }

  // int val = digitalRead(irPin);
  // if (!val) dispenserDetected = true;
  // if (instruction == 's') dispenserDetected = false;

  // if (!dispenserDetected) {
  //   digitalWrite(stepX, HIGH);
  //   delayMicroseconds(50);
  //   digitalWrite(stepX, LOW);
  //   delayMicroseconds(50);
  // }
}