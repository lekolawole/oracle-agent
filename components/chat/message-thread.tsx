import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList
} from 'react-native';
import { usePalette } from '@/constants/colors'; // Adjust path as needed
import TypingIndicator from './typing-indicator';
import { Message } from './ai-pond';
import { HStack } from '../ui/hstack';
import { OracleOrb } from '@/components/oracle-orb/oracle-orb';
import { ScrollView } from 'react-native-gesture-handler';

interface MessagesThreadProps {
  messages: Message[];
  loading: boolean;
}

export default function MessagesThread({ messages, loading }: MessagesThreadProps) {
  const p = usePalette();
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    
    return (
      <View style={[
        styles.bubbleWrapper, 
        isUser ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }
      ]}>
        <View style={[
          styles.bubble,
          isUser 
            ? { backgroundColor: p.textPrimary, borderBottomRightRadius: 4 } 
            : { backgroundColor: p.bgCard, borderColor: p.bgCardBorder, borderWidth: 1, borderBottomLeftRadius: 4 }
        ]}>
          <Text style={[
            styles.text, 
            { color: isUser ? p.textMuted : p.textPrimary }
          ]}>
            {item?.text || item?.error}
          </Text>
        </View>
      </View>
    );
  };

  return (
    // <ScrollView style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={loading ? (<>
          <HStack space='md'>
            <OracleOrb size={44} />
            <TypingIndicator />
          </HStack>
        </>
      ) : null}
      />
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  bubbleWrapper: {
    width: '100%',
    marginVertical: 6,
    marginHorizontal: 6
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '85%',
    // Soft shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.2,
  }
})