# 🫀 Cardiac Pathology Detection App

Une plateforme complète de monitoring cardiaque combinant l'Internet des Objets (IoT) et l'Intelligence Artificielle pour la surveillance en temps réel et le diagnostic prédictif des pathologies cardiaques.

## 🌟 Features

### 🔬 **Dual Mode Operation**
- **IoT Monitoring Mode**: Real-time monitoring with connected sensors
- **Diagnostic Prediction Mode**: AI-powered ECG analysis and prediction

### 🏥 **IoT Health Monitoring**
- **Real-time Sensor Data**: Heart rate, blood pressure, temperature, SpO2
- **Live Charts**: Interactive real-time data visualization
- **Smart Alerts**: Automatic threshold monitoring and notifications
- **Historical Data**: Trend analysis and data export capabilities
- **Sensor Management**: Device status, calibration, and configuration

### 🧠 **AI Diagnostic System**
- **Multimodal Analysis**: Processes both ECG images and clinical data
- **Deep Learning Integration**: XResNet model for cardiac pathology detection
- **Real-time Processing**: Upload ECG images and get instant analysis
- **Confidence Scoring**: Returns diagnosis with confidence levels

### 🎨 **User Experience**
- **Modern Interface**: Material-UI with medical-grade design
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Animations**: Heartbeat effects and smooth transitions
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🏗️ Architecture

- **Frontend**: React + Vite + Material-UI + Chart.js
- **Backend**: Python Flask with IoT endpoints
- **IoT Integration**: ESP32/Arduino compatible sensors
- **AI Model**: XResNet (.keras format) for multimodal cardiac analysis
- **Real-time Communication**: REST API with live data streaming

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

### Required Software

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Python** (version 3.8 or higher)
   - Download from: https://python.org/
   - Verify installation: `python --version` or `python3 --version`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project

```bash
# Option 1: Clone with Git
git clone <repository-url>
cd Modele_APP

# Option 2: Download and extract the ZIP file
# Then navigate to the extracted folder
```

### Step 2: Install Frontend Dependencies

```bash
# Install Node.js dependencies
npm install
```

### Step 3: Install Backend Dependencies

```bash
# Install Python dependencies
pip install flask flask-cors pillow numpy

# Or if you're using Python 3 specifically:
pip3 install flask flask-cors pillow numpy
```

### Step 4: Verify Model File

Ensure your `model.keras` file is in the root directory of the project. If you don't have the model file yet, the application will run in simulation mode.

## 🎯 Running the Application

### Method 1: Run Both Servers Separately (Recommended)

#### Terminal 1 - Start the Backend Server
```bash
python model_integration.py
```
You should see:
```
Démarrage du serveur sur le port 5000...
* Running on http://127.0.0.1:5000
```

#### Terminal 2 - Start the Frontend Server
```bash
npm run dev
```
You should see:
```
VITE v6.3.5  ready in 246 ms
➜  Local:   http://localhost:5174/
```

### Method 2: Alternative Backend (Node.js)

If you prefer to use the Node.js backend instead:

```bash
# Install additional Node.js dependencies
npm install express cors multer

# Run the Node.js server
node server.js
```

## 🌐 Accessing the Application

Once both servers are running:

1. **Frontend**: Open your browser and go to `http://localhost:5174`
2. **Backend API**: Available at `http://localhost:5000`

## 📱 How to Use

### 🏠 **Mode Selection**
1. **Launch Application**: Open http://localhost:5173 in your browser
2. **Choose Mode**: Select between "IoT Monitoring" or "Diagnostic Prediction"

### 📊 **IoT Monitoring Mode**
1. **Start Monitoring**: Click "Démarrer le monitoring" to begin real-time data collection
2. **View Live Data**: Monitor heart rate, blood pressure, temperature, and SpO2 in real-time
3. **Check Alerts**: Receive automatic notifications for abnormal values
4. **Analyze Trends**: View historical data and trends in interactive charts
5. **Manage Sensors**: Check sensor status, calibrate devices, and configure thresholds

### 🧠 **Diagnostic Prediction Mode**
1. **Upload ECG Image**: Click on the upload area and select an ECG image file
2. **Fill Clinical Data**: Enter patient information in the form:
   - Age, Blood Pressure, Cholesterol levels
   - Heart Rate, ST Depression, Number of vessels
   - Chest Pain Type, Resting ECG, ST Slope, Thalassemia
3. **Analyze**: Click the "Analyser" button to get results
4. **View Results**: See the diagnosis, confidence score, and detailed analysis

### 🔗 **IoT Sensor Integration**
For connecting real IoT sensors, see the detailed guide: `IoT_Integration_Guide.md`

## 🔧 Configuration

### Port Configuration

If you need to change the default ports:

#### Frontend (Vite)
Edit `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3000  // Change to your preferred port
  }
})
```

#### Backend (Flask)
Edit `model_integration.py`:
```python
PORT = 8000  # Change to your preferred port
```

### API Endpoint Configuration

If you change the backend port, update the frontend API calls in `src/services/modelService.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';  // Update port here
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# If port 5173/5174 is busy, Vite will automatically try the next available port
# If port 5000 is busy, change the PORT variable in model_integration.py
```

#### Python Dependencies Issues
```bash
# Try using pip3 instead of pip
pip3 install flask flask-cors pillow numpy

# Or create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install flask flask-cors pillow numpy
```

#### Node.js Dependencies Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### CORS Issues
Make sure the Flask server is running with CORS enabled. The `flask-cors` package should handle this automatically.

## 📁 Project Structure

```
Modele_APP/
├── src/                    # React frontend source
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── assets/            # Static assets
├── public/                # Public assets
├── model.keras            # Deep learning model file
├── model_integration.py   # Python Flask backend
├── server.js             # Alternative Node.js backend
├── package.json          # Node.js dependencies
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## 🔧 Model Integration

### Expected Data Structure

The model expects the following clinical data:

**Numeric Columns**:
- `age`: Patient age
- `trestbps`: Resting blood pressure (mm Hg)
- `chol`: Serum cholesterol (mg/dl)
- `thalach`: Maximum heart rate achieved
- `oldpeak`: ST depression induced by exercise relative to rest
- `ca`: Number of major vessels (0-3) colored by fluoroscopy

**Categorical Columns**:
- `slope`: ST segment slope (0: downsloping, 1: flat, 2: upsloping)
- `restecg`: Resting ECG results (0: normal, 1: ST-T wave abnormality, 2: left ventricular hypertrophy)
- `cp`: Chest pain type (0: typical angina, 1: atypical angina, 2: non-anginal pain, 3: asymptomatic)
- `thal`: Thalassemia (1: fixed defect, 2: reversible defect, 3: normal)

## 🔒 Security Notes

- This is a development setup. For production deployment, use proper WSGI servers
- Implement proper authentication and authorization for production use
- Validate and sanitize all user inputs
- Use HTTPS in production environments

## 🤝 Support

If you encounter any issues:

1. Check that all dependencies are properly installed
2. Verify that both servers are running on the correct ports
3. Check the browser console and terminal outputs for error messages
4. Ensure your `model.keras` file is in the correct location

## ⚠️ Medical Disclaimer

This application is designed as a decision support tool and does not replace the medical expertise of a qualified healthcare professional. Always consult with medical professionals for clinical decisions.

## 📄 License

This project is for educational and research purposes. Please ensure compliance with relevant medical software regulations if used in clinical settings.
