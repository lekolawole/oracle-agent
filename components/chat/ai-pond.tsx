import { useEffect, useState } from "react";
import ChatInput from "./chat-input";
import MessagesThread from "./message-thread";
import { oracleApi } from "@/interfaces/api-client";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { toast } from "sonner-native";
import { Text } from "../ui/text";
import { Center } from "../ui/center";
import { OracleOrb, OrbState } from "@/components/oracle-orb/oracle-orb";
import { usePalette } from "@/constants/colors";
import { speakOnWeb } from "@/hooks/use-elevenlabs";
import { useWebSpeech } from "@/hooks/use-web-speech";
import { useMobileSpeech } from "@/hooks/use-mobile-speech";
import { useMobileRecording } from "@/hooks/use-mobile-recording";

export type Message = { role: 'user' | 'oracle', text: string, audioUri?: string | null, error?: string };

export default function OracleAiPond() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const p = usePalette();
  const [isOracleSpeaking, setisOracleSpeaking] = useState(false);
  const [fileUri, setFileUri] = useState<string | null>(null);

  // Web STT should only send the transcription to the chat input element - this callback can return void
  const handleWebSpeech = useWebSpeech(transcript => handleTranscription(transcript));

  // Mobile STT - sends STT directly
  const handleMobileAudio = useMobileSpeech(transcript => handleSendMessage(transcript));

  // Mobile Audio Recording - saves audio locally to send when the user clicks send button
  const handleMobileRecording = useMobileRecording(recording => handleAudioRecording(recording))

  const speechMethod = Platform.OS === 'web' ? handleWebSpeech : handleMobileAudio;

  const { // STT state drive Web + MobileVoiceButton + orb
    isListening, 
    isSupported, 
    isMuted,
    startListening, 
    stopListening,
    toggleMute,
    transcript
  } = speechMethod;

  const { // Use Recording State to drive MobileAudioButton
    isRecording,
    startRecording,
    stopRecording,
    clearRecording
  } = handleMobileRecording;

  const orbState: OrbState = isOracleSpeaking ? 'speaking' : (isListening) ? 'listening' : 'idle';

  const handleSendMessage = async (text: string) => {
    if ((!text && !fileUri) || loading) return;

    setLoading(true);

    setTimeout(async () => {
      setMessages(prev => [...prev, { role: 'user', text, audioUri: fileUri }]);

      try {
        const response = await oracleApi.chat(text, messages);

        if (Platform.OS === 'web') {
          await speakOnWeb(
            text,
            () => setisOracleSpeaking(true),   // onStart
            () => setisOracleSpeaking(false),  // onEnd
          );
        } else {
          // handle mobile
        }

        setMessages(prev => [...prev, { role: 'oracle', text: response.text!, error: response.error }]);
      } catch (error: any) {
        setMessages(prev => [...prev, { role: 'oracle', text: error.error, error: error.error }]);

        toast.error(error.error)
      } finally {
        setLoading(false);
      }
    }, 1500)
   };

   const handleTranscription = async (text: string) => {
    // void - sets transcription automatically
   }

   const handleAudioRecording = async (fileUri: string) => {
    // handle file
    setFileUri(fileUri)
   }
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: p.background }}>
        {!messages.length && (
          <View style={{ alignItems: 'center', marginBottom: 36 }}>
            <OracleOrb state={orbState} />
            <Text style={{ color: p.textPrimary }}>Ask anything. Know everything.</Text>
          </View>
        )}
        <MessagesThread messages={messages} loading={loading} />
        <ChatInput 
          loading={loading} 
          onSend={handleSendMessage} 
          isOracleSpeaking={isOracleSpeaking}
          // STT Props
          isListening={isListening}
          isSupported={isSupported}
          isMuted={isMuted}
          startListening={startListening}
          stopListening={stopListening}
          toggleMute={toggleMute}
          transcript={transcript}
          // Recording Props
          fileUri={fileUri}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          clearRecording={clearRecording}
        />
        <Center>
          <Text size="xs">Oracle is AI and can sometimes make mistakes.</Text>
        </Center>
      </View>
    </KeyboardAvoidingView>
    
  )
}