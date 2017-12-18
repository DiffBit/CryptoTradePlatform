#!/usr/bin/env python
import os
import sys
import telegram
from socketIO_client import SocketIO, LoggingNamespace

token='133505823:AAHZFMHno3mzVLErU5b5jJvaeG--qUyLyG0'
channel_id='@pythontelegrambottests'
websocketIO='ws://207.182.158.162:3000/socket.io/?EIO=3&transport=polling&t=M1fQkA_&sid=fjsRN3zfnL9KIeWnAADB'

def on_connect():
    print('connect')

def on_disconnect():
    print('disconnect')

def on_reconnect():
    print('reconnect')

def on_aaa_response(*args):
    print('on_aaa_response', args)

socketIO = SocketIO('207.182.158.162', 3000, LoggingNamespace)
socketIO.on('connect', on_connect)
socketIO.on('disconnect', on_disconnect)
socketIO.on('reconnect', on_reconnect)

# Listen
socketIO.on('aaa_response', on_aaa_response)
socketIO.emit('aaa')
socketIO.emit('aaa')
socketIO.wait(seconds=10)

# Stop listening
#socketIO.off('aaa_response')
#socketIO.emit('aaa')
#socketIO.wait(seconds=1)
