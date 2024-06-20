import os
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Path ke model TFLite
model_path = os.path.abspath('model-ml.tflite')

# Memuat model TFLite dan mengalokasikan tensor
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

# Mendapatkan input dan output tensor
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Menghasilkan label kelas otomatis dari 'A' hingga 'Z'
class_labels = [chr(i) for i in range(ord('A'), ord('Z') + 1)]

# Inisialisasi aplikasi FastAPI
app = FastAPI()

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Membuat direktori sementara jika belum ada
    if not os.path.exists('temp'):
        os.makedirs('temp')

    # Menyimpan file yang diupload
    file_location = f"temp/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Memuat dan memproses gambar
    img = image.load_img(file_location, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    # Menyiapkan tensor input untuk inferensi
    interpreter.set_tensor(input_details[0]['index'], img_array)

    # Menjalankan inferensi
    interpreter.invoke()

    # Mendapatkan output tensor
    output_data = interpreter.get_tensor(output_details[0]['index'])
    class_idx = np.argmax(output_data[0])

    # Mendapatkan label kelas
    class_label = class_labels[class_idx]

    # Menghapus file setelah prediksi
    os.remove(file_location)

    return JSONResponse(content={"prediction": class_label})

if __name__ == "__main__":
    if not os.path.exists('temp'):
        os.makedirs('temp')
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
