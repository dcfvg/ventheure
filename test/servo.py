import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

GPIO.setup(12, GPIO.OUT)

p = GPIO.PWM(12, 50)

p.start(7.5)

try:
  while True:

    p.ChangeDutyCycle(7.5)  # turn towards 90 degree
    time.sleep(3) # sleep 1 second
    print '7.5'

    p.ChangeDutyCycle(25) # turn towards 180 degree
    time.sleep(3) # sleep 1 second
    print '25'

    p.ChangeDutyCycle(25) # turn towards 180 degree
    time.sleep(3) # sleep 1 second
    print '25 bis'

    p.ChangeDutyCycle(2.5)  # turn towards 0 degree
    time.sleep(3) # sleep 1 second
    print '2.5'

    p.ChangeDutyCycle(12.5) # turn towards 180 degree
    time.sleep(3) # sleep 1 second
    print '12.5'

    p.ChangeDutyCycle(20) # turn towards 180 degree
    time.sleep(3) # sleep 1 second
    p.ChangeDutyCycle(50) # turn towards 180 degree
    time.sleep(3) # sleep 1 second
    p.ChangeDutyCycle(0) # turn towards 180 degree
    time.sleep(3) # sleep 1 second
    print 'ok'
except KeyboardInterrupt:
  p.stop()
  GPIO.cleanup()
