import asyncio
import websockets
import whisper
import numpy as np
import os
import tempfile
# myenv\Scripts\activate for virtual enviornment script
async def handle_client(websocket, path):
    print("HANDLING CLIENT")
    model = whisper.load_model("small")
    try:
        while True:
            # Receive audio data from client
            audio_data = await websocket.recv()

            # Save audio data as an MP3 file
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_file:
                tmp_file.write(audio_data)
                mp3_file_path = tmp_file.name

            # Transcribe audio from the MP3 file
            result = model.transcribe(mp3_file_path)

            # Send transcription back to client
            await websocket.send(result["text"])

            # Clean up temporary MP3 file
            os.remove(mp3_file_path)

    except websockets.exceptions.ConnectionClosedError:
        # Client disconnected
        print("Client disconnected")

async def start_server():
    async with websockets.serve(handle_client, "localhost", 8765):
        print("Server started")
        await asyncio.Future()  # Run indefinitely

if __name__ == "__main__":
    asyncio.run(start_server())
