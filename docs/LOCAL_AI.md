# Local AI Setup Guide

TrailMate uses Ollama and LLaVA for local, offline-capable AI vision.

## 1. System requirements
- 8GB RAM minimum
- GPU is highly recommended but optional

## 2. Install Ollama
- Linux/Mac: `curl -fsSL https://ollama.com/install.sh | sh`
- Windows: Download the installer from the official website

## 3. Pull LLaVA
Run the following command to download the model:
`ollama pull llava`

## 4. Test the model
Verify it works:
`ollama run llava "describe this image" --images path/to/image.jpg`

## 5. Start serving
Ensure the Ollama service is running:
`ollama serve` (Usually auto-starts on most systems)

## 6. Configure TrailMate
Set `AI_MODE=local` in your `.env.local` file.

## 7. Expected performance table
| Hardware | Inference Time |
| --- | --- |
| M1/M2 Mac | ~2-5s |
| Nvidia RTX 3060 | ~1-3s |
| CPU only | ~10-30s |

## 8. Troubleshooting common issues
- **Ollama API not found:** Ensure `OLLAMA_BASE_URL` is set if running on a different port/machine.
- **Out of Memory (OOM):** Try a smaller quantization of the model.

## 9. Alternative models
- `llava:13b`: Better accuracy, but requires more RAM (16GB+ recommended).
- `llava:7b`: Faster, good for standard hardware.
