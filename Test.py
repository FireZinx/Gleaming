from PIL import ImageGrab, ImageEnhance, Image
import socket
import time
import numpy
from numba import jit, cuda
import pyautogui

width, height = pyautogui.size()

esp32 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
esp32.bind(("0.0.0.0", 3030))
esp32.listen()

@jit(forceobj=True)
def colors(screen):
    output = []

    for img in screen:
        np_img = numpy.array(img)
        average = numpy.average(np_img, axis=(0, 1))

        output = [*output, *average.astype(int).tolist()]

    return output
    
@jit()
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
        client, addr = esp32.accept()
        print(f"client connected: {addr}")

        while True:
            data = client.recv(16)

            if data:
                screen = ImageGrab.grab()
                downscale = screen.resize((24, 24), resample=Image.Resampling.BILINEAR)
                screen_downscale = downscale.resize(screen.size, Image.Resampling.NEAREST)
                screen_saturation = ImageEnhance.Color(screen_downscale).enhance(2)

                left = screen_saturation.crop(getPos(size, int(width * 0.2), int(height * 0.3)))
                center = screen_saturation.crop(getPos(size, int(width * 0.5), int(height * 0.3)))
                right = screen_saturation.crop(getPos(size, int(width * 0.8), int(height * 0.3)))

                allColors = colors([right, center, left])

                try:
                    sent_bytes = client.send(bytes([len(allColors), *allColors]))
                    if sent_bytes == 0:
                        raise Exception("Disconnected")
                except:
                    print("client disconnected")
                    break

getScreenColor()