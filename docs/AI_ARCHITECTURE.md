# AI Architecture for TrailMate AI

## 1. Why open-weight AI matters for TrailMate
TrailMate leverages local, open-weight AI (Ollama + LLaVA) primarily for:
- **Privacy:** Outdoor photos and location data never need to leave the user's device.
- **Offline Capabilities:** Local models enable the app to function even in remote areas without cell service.
- **Model Control:** We can pin exact model versions and fine-tune them specifically for nature identification.
- **Cost:** Avoids variable cloud inference costs.

## 2. The AIProvider Interface
We abstracted all AI interactions behind an `AIProvider` interface. This allows us to transparently switch between local, cloud, and mock providers.

## 3. How to add a new AI provider
1. Implement the `AIProvider` interface in a new file (e.g., `src/lib/ai/my-provider/index.ts`).
2. Implement all required methods using your API.
3. Update `src/lib/ai/index.ts` to instantiate your provider when appropriate.

## 4. Model selection rationale
We use **LLaVA** for vision because it offers excellent multimodal capabilities while remaining small enough to run locally on consumer hardware.

## 5. Prompt engineering decisions
Prompts explicitly ask for JSON output and use specific structures to ensure reliable parsing via Zod. Temperature is kept low (0.3) for consistency.

## 6. Confidence calibration approach
Models often over-estimate confidence. We strictly enforce a `< 0.5` threshold to mark results as "Uncertain", prompting the user to take a clearer photo instead of guessing incorrectly.

## 7. Fallback chain: local → cloud → mock
The system gracefully degrades: it attempts to use local Ollama, falls back to Gemini Flash if configured and local is unavailable, and ultimately uses a Mock provider for development or if all else fails.

## 8. How to fine-tune a model for better nature identification
Future plans include fine-tuning a LLaMA/LLaVA base model on verified nature datasets (e.g., iNaturalist) to improve accuracy on flora and fauna.

## 9. Future: on-device inference possibilities
With tools like MLC LLM or WebGPU, we could eventually run these models directly in the user's browser or mobile app, completely eliminating the need for a separate Ollama server.
