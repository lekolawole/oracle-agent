import { Platform } from 'react-native';

const ELEVENLABS_API_KEY = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
const VOICE_ID = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

export async function speakOnWeb(text: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
  if (Platform.OS !== 'web') return;
  if (!ELEVENLABS_API_KEY) {
    console.warn('ElevenLabs API key not set');
    return;
  }

  // 🔇 TTS disabled until ElevenLabs is configured
  // try {
  //   onStart?.();

  //   const response = await fetch(
  //     `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'xi-api-key': ELEVENLABS_API_KEY,
  //       },
  //       body: JSON.stringify({
  //         text,
  //         model_id: 'eleven_monolingual_v1',
  //         voice_settings: { stability: 0.5, similarity_boost: 0.75 },
  //       }),
  //     }
  //   );

  //   const audioBlob = await response.blob();
  //   const audioUrl = URL.createObjectURL(audioBlob);
  //   const audio = new Audio(audioUrl);
  //   await audio.play();

  //   // Clean up blob URL after playback
  //   audio.onended = () => URL.revokeObjectURL(audioUrl);
  // } catch (err) {
  //   console.error('ElevenLabs TTS error:', err);
  // }
  onEnd?.();
}