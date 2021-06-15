void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  
  pinMode(10, OUTPUT);    // sets the digital pin 13 as output

 
}

bool comienza = false;
bool enable = false;
bool activate = false;

int i=0;
String comandoRecibidoString;
String comandoRecibidoEndString;
String comandoRecibidoImportString;
String comandoRecibidoEnaActiString;

void loop() {
  
  char comandoRecibido;
  char charArray1[100] = "";
  char comandoRecibidoEnd;
  char charArray1End[100] = "";
  char comandoRecibidoImport;
  char charArray1Import[100] = "";
  char comandoRecibidoEnaActi;
  char charArray1EnaActi[100] = "";
  

/////////COMIENZO... ESCUCHA EL COMANDO START

while(!comienza){
     while(Serial.available()) {
        if (Serial.available() > 0){
          
          comandoRecibido = Serial.read();
          comandoRecibidoString += comandoRecibido;
        }
      }
      
      comandoRecibidoString.toCharArray(charArray1,100);
      
      if(strcmp(charArray1, "start") == 0){//LLEGÓ START
          digitalWrite(10, HIGH); // sets the digital pin 10 on
          delay(300);
          digitalWrite(10, LOW);  
          comienza = true;
      }else if(strcmp(charArray1, "import") == 0){//////////IMPORT, ESCUCHA EL COMANDO IMPORT
            digitalWrite(10, HIGH); // sets the digital pin 10 on
            delay(300);
            digitalWrite(10, LOW); 
            charArray1 == ""; 
            comandoRecibidoString = ""; 
            
     }     
}

////////FINAL, ESCUCHA EL COMANDO END
while(Serial.available()) {
  if (Serial.available() > 0){
    
    comandoRecibidoEnd = Serial.read();
    comandoRecibidoEndString += comandoRecibidoEnd;
  }
  comandoRecibidoEndString.toCharArray(charArray1End,100);
      
  if(strcmp(charArray1End, "end") == 0){//LLEGÓ END
      digitalWrite(10, HIGH); // sets the digital pin 10 on
      delay(300);
      digitalWrite(10, LOW);  
      comienza = false;
  } else if(strcmp(charArray1End, "enable") == 0){
      digitalWrite(10, HIGH); // sets the digital pin 10 on
      delay(300);
      digitalWrite(10, LOW);
      enable = true;
    }
    else if(strcmp(charArray1End, "activate") == 0){//LLEGÓ Activate
      digitalWrite(10, HIGH); // sets the digital pin 10 on
      delay(300);
      digitalWrite(10, LOW);  
      activate = true;
    } 
}

  
//while(Serial.available()) {
//  if (Serial.available() > 0){
//    
//    comandoRecibidoEnaActi = Serial.read();
//    comandoRecibidoEnaActiString += comandoRecibidoEnaActi;
//    }
//    comandoRecibidoEnaActiString.toCharArray(charArray1EnaActi,100);
//    
//    if(strcmp(charArray1EnaActi, "enable") == 0){//LLEGÓ Enable
//      digitalWrite(10, HIGH); // sets the digital pin 10 on
//      delay(300);
//      digitalWrite(10, LOW);  
//      //enable = true;
//    } 
//    else if(strcmp(charArray1EnaActi, "activate") == 0){//LLEGÓ Activate
//      digitalWrite(10, HIGH); // sets the digital pin 10 on
//      delay(300);
//      digitalWrite(10, LOW);  
//      //activate = true;
//    } 
//
//  
//}
if(enable && activate){
  Serial.print("2092,12:13:43,1,C,S,SP1_ON,SP2_ON,101325,20,50,12:13:43,19.438981568699457,-99.18059088591527,450,5,OK,45,50,CMDECHO,");
  delay(100);
  Serial.print("2092,12:13:43,1,S1,20,25,345,");
  delay(100);
  Serial.print("2092,12:13:43,1,S2,30,25,340,");
  delay(100);
}else{
  Serial.print("2092,12:13:43,1,C,S,SP1_ON,SP2_ON,20,20,50,12:13:43,19.438981568699457,-99.18059088591527,450,5,OK,45,50,CMDECHO,");
  delay(100);
  Serial.print("2092,12:13:43,1,S1,20,25,345,");
  delay(100);
  Serial.print("2092,12:13:43,1,S2,30,25,340,");
  delay(100);
}
  delay(700);


  //Reinicia todas la variables...
  comandoRecibidoString = "";
  charArray1 == ""; 
  comandoRecibidoEndString = "";
  charArray1End == ""; 
  comandoRecibidoImportString = "";
  charArray1Import == ""; 
  comandoRecibidoEnaActiString = "";
  charArray1EnaActi == "";

}
