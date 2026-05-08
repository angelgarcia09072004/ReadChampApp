import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  Animated, Dimensions, Modal, StatusBar, Platform, Alert 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme';
import GameButton from '../../components/GameButton';

// --- REAL AI LIBRARIES ---
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognition } from 'expo-speech-recognition';

const { width } = Dimensions.get('window');

const LESSON_DATA = {
  1: { speak: { word: "CAT", emoji: "🐱" }, id: { sound: "Meow", options: [{e:'🐷', n:'PIG'}, {e:'🐱', n:'CAT'}, {e:'🐶', n:'DOG'}], correct: 'CAT' }, syllable: { word: "CAT", count: 1 }, spell: { word: "CAT", pool: ['T', 'A', 'C'], emoji: "🐱" } },
  // ... (Add other levels here)
};

const LessonScreen = ({ route, navigation }) => {
  const { levelId } = route.params || { levelId: 1 };
  const currentLesson = LESSON_DATA[levelId] || LESSON_DATA[1];

  const [step, setStep] = useState(0); 
  const [isCorrect, setIsCorrect] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [targetWord, setTargetWord] = useState([]); 
  const [pool, setPool] = useState(currentLesson.spell.pool);
  const [isListening, setIsListening] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  // --- 1. REAL AI VOICE (Hearing) ---
  const speak = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.2,
      rate: 0.7, // Slower for kids
    });
  };

  // --- 2. REAL SPEECH RECOGNITION (Speaking) ---
  const startRealListening = async () => {
    const { granted } = await ExpoSpeechRecognition.requestPermissionsAsync();
    if (!granted) {
      Alert.alert("Mic Error", "Please allow microphone access!");
      return;
    }

    setIsListening(true);
    
    ExpoSpeechRecognition.start({
      lang: "en-US",
      interimResults: false,
      onResult: (event) => {
        const result = event.results[0].transcript.toUpperCase().trim();
        console.log("AI Heard:", result);
        
        if (result.includes(currentLesson.speak.word)) {
          handleAnswer(true);
        } else {
          handleAnswer(false);
        }
        setIsListening(false);
      },
      onError: (err) => {
        setIsListening(false);
        console.log("Speech Error:", err);
      }
    });
  };

  const handleAnswer = (answer) => {
    setIsCorrect(answer);
    if (answer) speak("Great Job!");
    else speak("Try again!");
  };

  const handleNext = () => {
    setIsCorrect(null);
    if (step < 3) {
      setStep(step + 1);
      setTargetWord([]);
      setPool(LESSON_DATA[levelId].spell.pool);
    } else {
      setShowReward(true);
    }
  };

  // --- UI RENDERERS ---
  const RenderSpeak = () => (
    <View style={styles.gameBox}>
      <Text style={styles.instruction}>Say the word! 🗣️</Text>
      <TouchableOpacity style={styles.mainCard} onPress={() => speak(currentLesson.speak.word)}>
          <Text style={{fontSize: 80}}>{currentLesson.speak.emoji}</Text>
          <Text style={styles.bigWord}>{currentLesson.speak.word}</Text>
          <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>Tap to Hear AI Voice</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.micBtn} onPress={startRealListening}>
        <LinearGradient colors={isListening ? ['#FF5252', '#FF8A80'] : ['#1CB0F6', '#64B5F6']} style={styles.micCircle}>
            <Ionicons name={isListening ? "pulse" : "mic"} size={45} color="white" />
        </LinearGradient>
      </TouchableOpacity>
      <Text style={styles.hintText}>{isListening ? "Listening..." : "Tap to Speak"}</Text>
    </View>
  );

  const RenderIdentify = () => (
    <View style={styles.gameBox}>
      <Text style={styles.instruction}>Who makes this sound? 🔊</Text>
      
      {/* THIS BUTTON NOW TRIGGERS THE AI VOICE */}
      <TouchableOpacity 
        style={styles.audioPlayer} 
        onPress={() => speak(currentLesson.id.correct)} 
      >
          <Ionicons name="volume-high" size={50} color="#1CB0F6" />
          <Text style={styles.audioText}>PLAY SOUND</Text>
      </TouchableOpacity>

      <View style={styles.choiceGrid}>
          {currentLesson.id.options.map((item, i) => (
              <TouchableOpacity 
                key={i} 
                style={styles.choiceCard} 
                onPress={() => handleAnswer(item.n === currentLesson.id.correct)}
              >
                  <Text style={{fontSize: 45}}>{item.e}</Text>
              </TouchableOpacity>
          ))}
      </View>
    </View>
  )

  const RenderSyllable = () => (
    <View style={styles.gameBox}>
      <Text style={styles.instruction}>Tap how many syllables! 👏</Text>
      <View style={styles.mainCard}>
          <Text style={styles.bigWord}>{currentLesson.syllable.word}</Text>
      </View>
      <View style={styles.syllableGrid}>
          {[1, 2, 3, 4].map(num => (
              <TouchableOpacity key={num} style={[styles.syllableBtn, {backgroundColor: num % 2 === 0 ? '#FF80AB' : '#1CB0F6'}]} onPress={() => handleAnswer(num === currentLesson.syllable.count)}>
                  <Text style={styles.syllableBtnText}>{num}</Text>
              </TouchableOpacity>
          ))}
      </View>
    </View>
  );

  const handleSpellTap = (char, index) => {
      setTargetWord([...targetWord, char]);
      setPool(pool.filter((_, i) => i !== index));
  };

  const RenderSpell = () => (
    <View style={styles.gameBox}>
      <Text style={styles.instruction}>Spell the word! 🧩</Text>
      <View style={styles.imageBox}><Text style={{fontSize: 60}}>{currentLesson.spell.emoji}</Text></View>
      <View style={styles.slotRow}>
        {currentLesson.spell.word.split('').map((_, i) => (
            <View key={i} style={styles.slot}><Text style={styles.tileText}>{targetWord[i] || ""}</Text></View>
        ))}
      </View>
      <View style={styles.poolRow}>
        {pool.map((c, i) => (
            <TouchableOpacity key={i} style={styles.tile} onPress={() => handleSpellTap(c, i)}>
                <Text style={styles.tileText}>{c}</Text>
            </TouchableOpacity>
        ))}
      </View>
      <GameButton title="CHECK" color={COLORS.primary} onPress={() => handleAnswer(targetWord.join('') === currentLesson.spell.word)} disabled={targetWord.length < currentLesson.spell.word.length} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <Ionicons name="close" size={30} color="#B0BEC5" />
          </TouchableOpacity>
          <View style={styles.pBarBg}>
              <Animated.View style={[styles.pBarFill, { width: progressAnim.interpolate({inputRange: [0, 1], outputRange: ['0%', '100%']}) }]} />
          </View>
          <View style={styles.heartBox}><Ionicons name="heart" size={24} color="#FF5252" /><Text style={styles.heartText}>5</Text></View>
      </SafeAreaView>

      <View style={{flex: 1, justifyContent: 'center'}}>
          {step === 0 && <RenderSpeak />}
          {step === 1 && <RenderIdentify />}
          {step === 2 && <RenderSyllable />}
          {step === 3 && <RenderSpell />}
      </View>

      {isCorrect !== null && (
          <View style={[styles.feedback, { backgroundColor: isCorrect ? '#D7FFB7' : '#FFDFE0' }]}>
              <View style={styles.feedbackInfo}>
                  <Ionicons name={isCorrect ? "checkmark-circle" : "close-circle"} size={35} color={isCorrect ? '#4CAF50' : '#FF5252'} />
                  <Text style={[styles.feedbackTitle, { color: isCorrect ? '#478200' : '#EE2C2C' }]}>{isCorrect ? "AWESOME! ✨" : "TRY AGAIN! 🧐"}</Text>
              </View>
              <TouchableOpacity style={[styles.contBtn, {backgroundColor: isCorrect ? '#78C800' : '#FF5252'}]} onPress={isCorrect ? handleNext : () => {setTargetWord([]); setPool(currentLesson.spell.pool); setIsCorrect(null);}}>
                  <Text style={styles.contText}>{isCorrect ? "CONTINUE" : "GOT IT"}</Text>
              </TouchableOpacity>
          </View>
      )}

      <Modal visible={showReward} transparent animationType="slide">
          <View style={styles.rewardOverlay}>
              <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.rewardCard}>
                  <MaterialCommunityIcons name="trophy" size={100} color="white" />
                  <Text style={styles.rewardTitle}>LEVEL {levelId} CLEAR!</Text>
                  <Text style={styles.rewardXP}>+50 XP EARNED</Text>
                  <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
                      <Text style={styles.doneText}>FINISH</Text>
                  </TouchableOpacity>
              </LinearGradient>
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, paddingBottom: 15, elevation: 4, backgroundColor: 'white' },
  pBarBg: { flex: 1, height: 16, backgroundColor: '#F0F0F0', borderRadius: 10, marginHorizontal: 15, overflow: 'hidden' },
  pBarFill: { height: '100%', backgroundColor: '#78C800', borderRadius: 10 },
  heartBox: { flexDirection: 'row', alignItems: 'center' },
  heartText: { marginLeft: 5, fontWeight: '900', color: '#FF5252', fontSize: 16 },
  gameBox: { flex: 1, padding: 25, alignItems: 'center', justifyContent: 'center' },
  instruction: { fontSize: 24, fontWeight: '900', color: '#455A64', textAlign: 'center', marginBottom: 20 },
  mainCard: { width: '100%', backgroundColor: '#F8F9FA', padding: 35, borderRadius: 35, alignItems: 'center', borderBottomWidth: 8, borderBottomColor: '#ECEFF1' },
  bigWord: { fontSize: 50, fontWeight: '900', color: '#1CB0F6', letterSpacing: 4, marginTop: 10, textAlign: 'center' },
  micBtn: { marginTop: 30, elevation: 5 },
  micCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 6, borderBottomColor: 'rgba(0,0,0,0.2)' },
  hintText: { marginTop: 10, fontWeight: 'bold', color: '#B0BEC5' },
  audioPlayer: { backgroundColor: '#E1F5FE', padding: 30, borderRadius: 30, alignItems: 'center', marginBottom: 30, borderBottomWidth: 6, borderBottomColor: '#B3E5FC' },
  audioText: { color: '#03A9F4', fontWeight: '900', marginTop: 10 },
  choiceGrid: { flexDirection: 'row', gap: 15 },
  choiceCard: { backgroundColor: 'white', padding: 15, borderRadius: 20, elevation: 5, borderBottomWidth: 5, borderBottomColor: '#ECEFF1' },
  syllableGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center', marginTop: 30 },
  syllableBtn: { width: 75, height: 75, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 6, borderBottomWidth: 6, borderBottomColor: 'rgba(0,0,0,0.15)' },
  syllableBtnText: { color: 'white', fontSize: 36, fontWeight: '900' },
  imageBox: { backgroundColor: '#F8F9FA', padding: 20, borderRadius: 20, marginBottom: 20 },
  slotRow: { flexDirection: 'row', gap: 8, marginBottom: 30, flexWrap: 'wrap', justifyContent: 'center' },
  slot: { width: 50, height: 50, backgroundColor: '#F5F5F5', borderRadius: 10, borderBottomWidth: 4, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' },
  poolRow: { flexDirection: 'row', gap: 10, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' },
  tile: { width: 60, height: 60, backgroundColor: 'white', borderRadius: 10, elevation: 5, borderBottomWidth: 5, borderBottomColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  tileText: { fontSize: 24, fontWeight: '900', color: '#1CB0F6' },
  feedback: { position: 'absolute', bottom: 0, width: '100%', padding: 25, borderTopLeftRadius: 40, borderTopRightRadius: 40, elevation: 20 },
  feedbackInfo: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
  feedbackTitle: { fontSize: 22, fontWeight: '900' },
  contBtn: { width: '100%', padding: 18, borderRadius: 20, alignItems: 'center' },
  contText: { color: 'white', fontWeight: '900', fontSize: 18 },
  rewardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 30 },
  rewardCard: { borderRadius: 50, padding: 40, alignItems: 'center' },
  rewardTitle: { color: 'white', fontSize: 32, fontWeight: '900', marginTop: 20 },
  rewardXP: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  doneBtn: { backgroundColor: 'white', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 25, marginTop: 40 },
  doneText: { color: '#FFA000', fontWeight: '900', fontSize: 18 }
});

export default LessonScreen;