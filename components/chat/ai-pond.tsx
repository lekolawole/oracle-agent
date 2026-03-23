import { useState } from "react";
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

export type Message = { role: 'user' | 'oracle', text: string | null, error?: string };

export default function OracleAiPond() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const p = usePalette();
  const [isOracleSpeaking, setisOracleSpeaking] = useState(false);
  const [isMobileListening, setIsMobileListening] = useState(false);

  const handleWebSpeech = useWebSpeech(transcript => handleSendMessage(transcript));
  const handleMobileSpeech = useMobileSpeech(transcript => handleSendMessage(transcript));
  const speechMethod = Platform.OS === 'web' ? handleWebSpeech : handleMobileSpeech;

  const { 
    isListening, 
    isSupported, 
    isMuted,
    startListening, 
    stopListening,
    toggleMute
  } = speechMethod;

  const orbState: OrbState = isOracleSpeaking ? 'speaking' : (isListening) ? 'listening' : 'idle';

  const handleSendMessage = async (text: string) => {
    setLoading(true);

    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', text }]);

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

      setMessages(prev => [...prev, { role: 'oracle', text: response.text, error: response.error }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'oracle', text: error.error, error: error.error }]);

      toast.error(error.error)
    } finally {
      setLoading(false);
    }
   };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, margin: 24 }}>
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
          isListening={isListening}
          isSupported={isSupported}
          isMuted={isMuted}
          startListening={startListening}
          stopListening={stopListening}
          toggleMute={toggleMute}
        />
        <Center>
          <Text size="xs">Oracle is AI and can sometimes make mistakes.</Text>
        </Center>
      </View>
    </KeyboardAvoidingView>
    
  )
}