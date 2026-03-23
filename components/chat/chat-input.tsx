import '@/global.css';
import React, { useState, useRef } from 'react';
import { 
  Platform, 
  Animated, 
  KeyboardAvoidingView, 
  TextInput,
  Pressable,
  Alert,
  Linking
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePalette } from '@/constants/colors';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Button } from '@/components/ui/button';
import { WebVoiceButton } from '../voice-button/web-voice-button';
import { useMicrophonePermission } from '@/hooks/use-microphone-permission';
import { MobileVoiceButton } from '../voice-button/mobile-voice-button';

interface ChatInputProps {
  loading: boolean;
  isOracleSpeaking: boolean;
  isListening: boolean;
  isSupported: boolean;
  isMuted: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleMute: () => void;
  onSend: (message: string) => void;
}

export default function ChatInput({ 
  loading, 
  onSend, 
  isOracleSpeaking,
  isListening,
  isSupported,
  isMuted,
  startListening,
  stopListening,
  toggleMute
}: ChatInputProps) {
  const p = usePalette();
  const [input, setInput] = useState('');
  const [isFull, setIsFull] = useState(false);
  const { granted, requestPermission } = useMicrophonePermission();
  
  const containerHeight = useRef(new Animated.Value(180)).current;

  function toggleFullscreen() {
    Animated.spring(containerHeight, {
      toValue: isFull ? 180 : 450, 
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
    setIsFull(!isFull);
  }

  function sendMessage() {
    if (!input.trim() || loading) return;
    onSend(input.trim()); 
    setInput(''); 
  }

  const handleVoicePress = async () => {
    if (!granted) {
      const allowed = await requestPermission();
      if (!allowed) {
        // Show a message explaining why Oracle needs the mic
        Alert.alert(
          'Microphone Required',
          'Oracle needs microphone access to hear your voice. Enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }
    }
    // Permission granted — start recording
    startListening();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
    <Animated.View style={{ height: containerHeight, marginTop: 'auto', width: '100%' }}>
      <Box 
        className="mx-4 mb-4 flex-1 rounded-3xl overflow-hidden"
        style={{ backgroundColor: p.bgCard, borderColor: p.bgCardBorder }}>
        <BlurView intensity={30} tint="light" className="flex-1">
            
            {/* HEADER: Always stays at the top */}
          <HStack className="justify-end px-2">
            <Pressable onPress={toggleFullscreen} className="p-2 w-10 h-10 rounded-full border justify-center items-center"
              style={{ backgroundColor: p.bgCard, borderColor: p.bgCardBorder }}>
              <MaterialCommunityIcons name={isFull ? "arrow-collapse" : "arrow-expand"} size={22} color={p.textSecondary} />
            </Pressable>
          </HStack>

            {/* BODY: The Input area MUST have flex-1 to prevent clipping */}
          <Box style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 8 }}>
            <TextInput
              placeholder="Ask Oracle..."
              placeholderTextColor={p.textSecondary}
              value={input}
              onChangeText={setInput}
              multiline={true}
              style={{
                flex: 1, // Ensures it fills the 180px or 450px container height
                fontSize: 16,
                color: p.text, 
                textAlignVertical: 'top',
                paddingLeft: 24,
                borderWidth: 0, // Removes the standard border
                // @ts-ignore - Kills the focus ring on Web/Browsers
                outlineStyle: 'none'
              }}/>
          </Box>

            {/* FOOTER: Always stays at the bottom */}
          <Box className="px-4 py-3 border-t border-white/10">
            <HStack className="justify-between items-center" reversed>
              {input.trim() ? (
                // Send Message Button
                <Button 
                onPress={sendMessage}
                className="rounded-full px-5 h-11"
                style={{ backgroundColor: input.trim() ? p.tint : p.textMuted }}>
                <Feather name="send" size={20} color="white" />
              </Button>
              ) : (
                // Text to Speech Button
                // <Button variant='solid'
                //   className="w-10 h-10 rounded-full border border-white/40 justify-center items-center bg-white/10">
                //   <Feather name="mic" size={20} color={p.textSecondary} />
                // </Button>
                <WebVoiceButton 
                  isListening={isListening}
                  isMuted={isMuted}
                  isOracleSpeaking={isOracleSpeaking}
                  isSupported={isSupported}
                  onPress={() => {
                    if (isMuted) return;
                    if (isListening) stopListening();
                    else startListening();
                  }}
                  onLongPress={toggleMute} />
              )}

              {/* Mobile — only renders on iOS/Android */}
              <MobileVoiceButton
                isListening={isListening}
                isMuted={isMuted}
                oracleSpeaking={isOracleSpeaking}
                onStartListening={() => {
                  if (isMuted) return;
                  startListening()
                  // Placeholder — whisper.rn wired here later
                  console.log('Mobile voice pressed — STT coming in Phase 2');
                }}
                onStopListening={() => {
                  // placeholder for mobile
                  stopListening()
                  console.log('Mobile voice pressed — STT coming in Phase 2');
                }}
                onLongPress={toggleMute}
              />
              
              
              <HStack space="md">
                <Box className="w-10 h-10 rounded-full justify-center items-center">
                  <Pressable className="w-10 h-10 rounded-full justify-center items-center"
                    style={{ backgroundColor: p.bgCard, borderColor: p.bgCardBorder }}>
                    <Feather name="plus" size={18} color={p.textSecondary} />
                  </Pressable>
                </Box>
                <Box className="w-10 h-10 rounded-full justify-center items-center">
                  <Pressable className="w-10 h-10 rounded-full justify-center items-center"
                    style={{ backgroundColor: p.bgCard, borderColor: p.bgCardBorder }}>
                    <MaterialCommunityIcons name="transit-connection-variant" size={18} color={p.textSecondary} />
                  </Pressable>
                </Box>
              </HStack>
            </HStack>
          </Box>
          </BlurView>
        </Box>
      </Animated.View> 
    </KeyboardAvoidingView>
  );
}