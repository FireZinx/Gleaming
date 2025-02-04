import socket
import time

class fastLed:
    def __init__(self):
        esp32 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        esp32.bind(("0.0.0.0", 3031))
        esp32.listen()

        client, addr = esp32.accept()

        self.client = client

        self.sendBytes([0, 155])

        cmd = []
        for i in range(155):
            cmd.extend([i, 255, 0, 0])

        time.sleep(1)

        self.sendBytes([1, int(len(cmd) / 4), *cmd])

    def sendBytes(self, data):
        self.client.send(bytes(data))

fastLed()