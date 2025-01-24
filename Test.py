from PIL import ImageGrab, ImageEnhance, Image
import serial
import time
import numpy
from numba import jit, cuda
import pyautogui

width, height = pyautogui.size()

arduino = serial.Serial(port='COM3', baudrate=2000000)

@jit(forceobj=True)
def colors(screen, arduino):
    output = []

    for img in screen:
        np_img = numpy.array(img)
        average = numpy.average(np_img, axis=(0, 1))

        output = [*output, *average.astype(int).tolist()]

    arduino.write(str(output).encode())

def getPos(size, x, y):
    return (
        min(max(0, x - int(size / 2)), width),
        min(max(0, y - int(size / 2)), height),
        min(max(0, x + int(size / 2)), width),
        min(max(0, y + int(size / 2)), height),
    )
            
def getScreenColor():
    size = 100

    while True:
        screen = ImageGrab.grab()
        downscale = screen.resize((24, 24), resample=Image.Resampling.BILINEAR)
        screen_downscale = downscale.resize(screen.size, Image.Resampling.NEAREST)
        screen_saturation = ImageEnhance.Color(screen_downscale).enhance(2)

        left = screen_saturation.crop(getPos(size, int(width * 0.2), int(height * 0.5)))
        center = screen_saturation.crop(getPos(size, int(width * 0.5), int(height * 0.5)))
        right = screen_saturation.crop(getPos(size, int(width * 0.8), int(height * 0.5)))

        allColors = colors([right, center, left], arduino) 

getScreenColor()