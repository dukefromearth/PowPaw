int fsrAnalogPin0 = A0;
int fsrAnalogPin1 = A1;
int fsrAnalogPin2 = A2;
int fsrAnalogPin3 = A3;

int lastS0 = 0;
int lastS1 = 0;
int lastS2 = 0;
int lastS3 = 0;

bool trigger = false;

void setup(void) {
  Serial.begin(9600);   // We'll send debugging information via the Serial monitor
}
 
void loop(void) {
  int s0 = analogRead(fsrAnalogPin0);
  int s1 = analogRead(fsrAnalogPin2);
  int s2 = analogRead(fsrAnalogPin3);
  int s3 = analogRead(fsrAnalogPin1);

  if( (lastS0 == 0 && s0 > 20) || 
      (lastS1 == 0 && s1 > 20) || 
      (lastS2 == 0 && s2 > 20) ||  
      (lastS3 == 0 && s3 > 20)) {
    trigger = true;
  }

  if(trigger){
    trigger = false;
    String toSend  = "";
    toSend = toSend + "[" + s0 + "," + s1 + "," + s2 + "," + s3 + "]";
    Serial.print(toSend);
    delay(20);
  }
  
  lastS0 = s0;
  lastS1 = s1;
  lastS2 = s2;
  lastS3 = s3;

  
}
