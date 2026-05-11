import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  Animated, Dimensions, Modal, StatusBar, Platform, Alert 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme';
import GameButton from '../../components/GameButton';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

// --- DATA CONSTANTS ---
const CONGRATS = ["AWESOME!", "GREAT JOB!", "VERY GOOD!", "PERFECT!"];

const BADGES = {
  1: { name: 'At-Family Hero', icon: 'cat' }, 2: { name: 'In-It Master', icon: 'pin' },
  3: { name: 'Short-O Expert', icon: 'dog' }, 4: { name: 'Vowel Voyager', icon: 'weather-sunny' },
  5: { name: 'Digraph Champ', icon: 'ship-wheel' }, 6: { name: 'Blend Boss', icon: 'star-face' },
  7: { name: 'Syllable Scout', icon: 'apple' }, 8: { name: 'Compound King', icon: 'home-variant' },
  9: { name: 'Sight Word Star', icon: 'eye-check' }, 10: { name: 'Reading Champion', icon: 'trophy-variant' }
};

const LESSON_DATA = {
  1: { speak: { word: "CAT", emoji: "🐱" }, id: { sound: "Meow", options: [{e:'🐷', n:'PIG'}, {e:'🐱', n:'CAT'}, {e:'🐶', n:'DOG'}], correct: 'CAT' }, syllable: { word: "CAT", count: 1 }, spell: { word: "CAT", pool: ['T', 'A', 'C'], emoji: "🐱" } },
  2: { speak: { word: "PIN", emoji: "📍" }, id: { sound: "Pop!", options: [{e:'📍', n:'PIN'}, {e:'📦', n:'BOX'}, {e:'☀️', n:'SUN'}], correct: 'PIN' }, syllable: { word: "SIT", count: 1 }, spell: { word: "BIN", pool: ['I', 'B', 'N'], emoji: "🗑️" } },
  3: { speak: { word: "DOG", emoji: "🐶" }, id: { sound: "Bark!", options: [{e:'🐶', n:'DOG'}, {e:'🐱', n:'CAT'}, {e:'🐔', n:'HEN'}], correct: 'DOG' }, syllable: { word: "LOG", count: 1 }, spell: { word: "FROG", pool: ['O', 'F', 'G', 'R'], emoji: "🐸" } },
  4: { speak: { word: "SUN", emoji: "☀️" }, id: { sound: "Rain", options: [{e:'☀️', n:'SUN'}, {e:'🌧️', n:'RAIN'}, {e:'💨', n:'WIND'}], correct: 'SUN' }, syllable: { word: "BUN", count: 1 }, spell: { word: "BUG", pool: ['G', 'U', 'B'], emoji: "🐞" } },
  5: { speak: { word: "SHIP", emoji: "🚢" }, id: { sound: "Waves", options: [{e:'🚢', n:'SHIP'}, {e:'🚗', n:'CAR'}, {e:'✈️', n:'PLANE'}], correct: 'SHIP' }, syllable: { word: "FISH", count: 1 }, spell: { word: "FISH", pool: ['S', 'I', 'F', 'H'], emoji: "🐟" } },
  6: { speak: { word: "STAR", emoji: "⭐" }, id: { sound: "Twinkle", options: [{e:'⭐', n:'STAR'}, {e:'🌙', n:'MOON'}, {e:'☀️', n:'SUN'}], correct: 'STAR' }, syllable: { word: "STOP", count: 1 }, spell: { word: "SLIDE", pool: ['L', 'S', 'D', 'I', 'E'], emoji: "🛝" } },
  7: { speak: { word: "APPLE", emoji: "🍎" }, id: { sound: "Crunch", options: [{e:'🍎', n:'APPLE'}, {e:'🍌', n:'BANANA'}, {e:'🍊', n:'ORANGE'}], correct: 'APPLE' }, syllable: { word: "AP-PLE", count: 2 }, spell: { word: "PAPER", pool: ['P', 'E', 'P', 'A', 'R'], emoji: "📄" } },
  8: { speak: { word: "SUNSET", emoji: "🌇" }, id: { sound: "Chirp", options: [{e:'🌇', n:'SUNSET'}, {e:'🌃', n:'NIGHT'}, {e:'🌅', n:'MORNING'}], correct: 'SUNSET' }, syllable: { word: "SUN-SET", count: 2 }, spell: { word: "BEDROOM", pool: ['B','E','D','R','O','O','M'], emoji: "🛏️" } },
  9: { speak: { word: "THE BIG RED BUS", emoji: "🚌" }, id: { sound: "Honk!", options: [{e:'🚌', n:'BUS'}, {e:'🚗', n:'CAR'}, {e:'🚲', n:'BIKE'}], correct: 'BUS' }, syllable: { word: "YEL-LOW", count: 2 }, spell: { word: "SAID", pool: ['D', 'I', 'A', 'S'], emoji: "💬" } },
  10: { speak: { word: "I LOVE SCHOOL", emoji: "🏫" }, id: { sound: "Bell", options: [{e:'🏫', n:'SCHOOL'}, {e:'🏠', n:'HOUSE'}, {e:'🌳', n:'PARK'}], correct: 'SCHOOL' }, syllable: { word: "READ-ING", count: 2 }, spell: { word: "CHAMPION", pool: ['C','H','A','M','P','I','O','N'], emoji: "🏆" } }
};

const LessonScreen = ({ route, navigation }) => {
  const { levelId } = route.params || { levelId: 1 };
  const currentLesson = LESSON_DATA[levelId] || LESSON_DATA[1];

  // --- STATES ---
  const [step, setStep] = useState(0); 
  const [isCorrect, setIsCorrect] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lives, setLives] = useState(5);
  const [xpEarned, setXpEarned] = useState(0);
  const [score, setScore] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const [targetWord, setTargetWord] = useState([]); 
  const [pool, setPool] = useState(currentLesson.spell.pool);

  const speak = (text) => Speech.speak(text, { language: 'en-US', pitch: 1.2, rate: 0.8 });

  const handleAnswer = (answer) => {
    if (answer) {
      const randomMsg = CONGRATS[Math.floor(Math.random() * CONGRATS.length)];
      setFeedbackMsg(randomMsg);
      setIsCorrect(true);
      setXpEarned(prev => prev + 10);
      setScore(prev => prev + 100);
      speak(randomMsg);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setIsCorrect(false);
      speak("Oops! Try again!");
      if (newLives <= 0) setIsGameOver(true);
    }
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

  // --- SPELLING ACTIONS ---
  const addLetter = (char, index) => {
    setTargetWord([...targetWord, char]);
    setPool(pool.filter((_, idx) => idx !== index));
  };

  const removeLetter = (char, index) => {
    const newTarget = [...targetWord];
    newTarget.splice(index, 1);
    setTargetWord(newTarget);
    setPool([...pool, char]);
  };

  // --- RENDERERS ---
  const RenderSpeak = () => (
    <View style={styles.gameBox}>
      <Text style={styles.instruction}>Say the word! 🗣️</Text>
      <View style={styles.mainCard}>
          <Text style={{fontSize: 80}}>{currentLesson.speak.emoji}</Text>
          <Text style={styles.bigWord}>{currentLesson.speak.word}</Text>
      </View>
      <TouchableOpacity style={styles.micBtn} onPress={() => handleAnswer(true)}>
        <LinearGradient colors={['#1CB0F6', '#64B5F6']} style={styles.micCircle}><Ionicons name="mic" size={45} color="white" /></LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const RenderIdentify = () => (
    <View style={styles.gameBox}>
      <Text style={styles.instruction}>Who makes this sound? 🔊</Text>
      <TouchableOpacity style={styles.audioPlayer} onPress={() => speak(currentLesson.id.correct)}>
          <Ionicons name="volume-high" size={50} color="#1CB0F6" /><Text style={styles.audioText}>PLAY SOUND</Text>
      </TouchableOpacity>
      <View style={styles.choiceGrid}>
          {currentLesson.id.options.map((item, i) => (
              <TouchableOpacity key={i} style={styles.choiceCard} onPress={() => handleAnswer(item.n === currentLesson.id.correct)}>
                  {/* FIXED: Emoji visibility with dark color */}
                  <Text style={{fontSize: 45, color: '#000'}}>{item.e}</Text>
              </TouchableOpacity>
          ))}
      </View>
    </View>
  );

  const RenderSyllable = () => (
    <View style={styles.gameBox}>
      <Text style={styles.instruction}>Tap how many syllables! 👏</Text>
      <View style={styles.mainCard}><Text style={styles.bigWord}>{currentLesson.syllable.word}</Text></View>
      <View style={styles.syllableGrid}>
          {[1, 2, 3, 4].map(num => (
              <TouchableOpacity key={num} style={[styles.syllableBtn, {backgroundColor: num % 2 === 0 ? '#FF80AB' : '#1CB0F6'}]} onPress={() => handleAnswer(num === currentLesson.syllable.count)}><Text style={styles.syllableBtnText}>{num}</Text></TouchableOpacity>
          ))}
      </View>
    </View>
  );

  const RenderSpell = () => (
    <View style={styles.gameBox}>
      <Text style={styles.instruction}>Spell the word! 🧩</Text>
      <View style={styles.imageBox}><Text style={{fontSize: 60}}>{currentLesson.spell.emoji}</Text></View>
      <View style={styles.slotRow}>
        {currentLesson.spell.word.split('').map((_, i) => (
            <TouchableOpacity key={i} style={styles.slot} onPress={() => targetWord[i] && removeLetter(targetWord[i], i)}>
                <Text style={styles.tileText}>{targetWord[i] || ""}</Text>
            </TouchableOpacity>
        ))}
      </View>
      <View style={styles.poolRow}>
        {pool.map((c, i) => (
            <TouchableOpacity key={i} style={styles.tile} onPress={() => addLetter(c, i)}><Text style={styles.tileText}>{c}</Text></TouchableOpacity>
        ))}
      </View>
      <GameButton title="CHECK" color={COLORS.primary} onPress={() => handleAnswer(targetWord.join('') === currentLesson.spell.word)} disabled={targetWord.length < currentLesson.spell.word.length} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={30} color="#B0BEC5" /></TouchableOpacity>
          <View style={styles.pBarBg}><Animated.View style={[styles.pBarFill, { width: `${((step + 1) / 4) * 100}%` }]} /></View>
          <View style={styles.heartBox}><Ionicons name="heart" size={24} color="#FF5252" /><Text style={styles.heartText}>{lives}</Text></View>
      </SafeAreaView>

      <View style={{flex: 1, justifyContent: 'center'}}>
          {step === 0 && <RenderSpeak />}
          {step === 1 && <RenderIdentify />}
          {step === 2 && <RenderSyllable />}
          {step === 3 && <RenderSpell />}
      </View>

      {/* CENTERED FEEDBACK MODAL */}
      <Modal visible={isCorrect !== null} transparent animationType="fade">
          <View style={styles.centerOverlay}>
              <View style={[styles.feedbackCard, { backgroundColor: isCorrect ? '#78C800' : '#FF5252' }]}>
                  <Text style={styles.feedbackText}>{isCorrect ? feedbackMsg : "TRY AGAIN!"}</Text>
                  {isCorrect && <Text style={styles.xpGain}>+10 XP ✨</Text>}
                  <TouchableOpacity style={styles.popBtn} onPress={isCorrect ? handleNext : () => setIsCorrect(null)}>
                      <Text style={{fontWeight:'900', color: isCorrect ? '#78C800' : '#FF5252'}}>{isCorrect ? "CONTINUE" : "GOT IT"}</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

      {/* GAME OVER MODAL */}
      <Modal visible={isGameOver} transparent animationType="slide">
          <View style={styles.rewardOverlay}>
              <View style={[styles.rewardCard, {backgroundColor: '#FF5252'}]}>
                  <Ionicons name="heart-dislike" size={80} color="white" />
                  <Text style={styles.rewardTitle}>YOU LOSE!</Text>
                  <Text style={styles.rewardXP}>YOU USED ALL OF YOUR LIVES.</Text>
                  <TouchableOpacity style={styles.doneBtn} onPress={() => {setLives(5); setIsGameOver(false); setStep(0);}}><Text style={[styles.doneText, {color: '#FF5252'}]}>TRY AGAIN</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{color:'white', marginTop: 20, fontWeight:'bold'}}>EXIT</Text></TouchableOpacity>
              </View>
          </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal visible={showReward} transparent animationType="slide">
          <View style={styles.rewardOverlay}>
              <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.rewardCard}>
                  <MaterialCommunityIcons name="party-popper" size={60} color="white" />
                  <Text style={styles.rewardTitle}>LEVEL {levelId} CLEAR!</Text>
                  <View style={styles.statsRow}>
                      <View style={styles.statItem}><Text style={styles.statLabel}>SCORE</Text><Text style={styles.statVal}>{score}</Text></View>
                      <View style={styles.statItem}><Text style={styles.statLabel}>XP</Text><Text style={styles.statVal}>+{xpEarned}</Text></View>
                      <View style={styles.statItem}><Text style={styles.statLabel}>LIVES USED</Text><Text style={styles.statVal}>{5 - lives}</Text></View>
                  </View>
                  <View style={styles.badgeBox}>
                      <MaterialCommunityIcons name={BADGES[levelId].icon} size={50} color="#FFA000" />
                      <Text style={styles.badgeName}>{BADGES[levelId].name} Unlocked!</Text>
                  </View>
                  <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}><Text style={styles.doneText}>FINISH</Text></TouchableOpacity>
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
  heartBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF1F0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  heartText: { marginLeft: 5, fontWeight: '900', color: '#FF5252', fontSize: 16 },
  gameBox: { flex: 1, padding: 25, alignItems: 'center', justifyContent: 'center' },
  instruction: { fontSize: 24, fontWeight: '900', color: '#455A64', textAlign: 'center', marginBottom: 20 },
  mainCard: { width: '100%', backgroundColor: '#F8F9FA', padding: 35, borderRadius: 35, alignItems: 'center', borderBottomWidth: 8, borderBottomColor: '#ECEFF1' },
  bigWord: { fontSize: 50, fontWeight: '900', color: '#1CB0F6', letterSpacing: 4, marginTop: 10, textAlign: 'center' },
  micBtn: { marginTop: 30, elevation: 5 },
  micCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 6, borderBottomColor: 'rgba(0,0,0,0.2)' },
  audioPlayer: { backgroundColor: '#E1F5FE', padding: 30, borderRadius: 30, alignItems: 'center', marginBottom: 30, borderBottomWidth: 6, borderBottomColor: '#B3E5FC' },
  audioText: { color: '#03A9F4', fontWeight: '900', marginTop: 10 },
  choiceGrid: { flexDirection: 'row', gap: 15 },
  choiceCard: { backgroundColor: 'white', padding: 15, borderRadius: 20, elevation: 5, borderBottomWidth: 5, borderBottomColor: '#ECEFF1' },
  syllableGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'center', marginTop: 30 },
  syllableBtn: { width: 75, height: 75, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 6, borderBottomWidth: 6, borderBottomColor: 'rgba(0,0,0,0.15)' },
  syllableBtnText: { color: 'white', fontSize: 36, fontWeight: '900' },
  imageBox: { backgroundColor: '#F8F9FA', padding: 20, borderRadius: 20, marginBottom: 20 },
  slotRow: { flexDirection: 'row', gap: 8, marginBottom: 30 },
  slot: { width: 50, height: 50, backgroundColor: '#F5F5F5', borderRadius: 10, borderBottomWidth: 4, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' },
  poolRow: { flexDirection: 'row', gap: 10, marginBottom: 40 },
  tile: { width: 60, height: 60, backgroundColor: 'white', borderRadius: 10, elevation: 5, borderBottomWidth: 5, borderBottomColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  tileText: { fontSize: 24, fontWeight: '900', color: '#1CB0F6' },
  centerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  feedbackCard: { width: width * 0.85, padding: 40, borderRadius: 40, alignItems: 'center', elevation: 20 },
  feedbackText: { color: 'white', fontSize: 36, fontWeight: '900', textAlign: 'center' },
  xpGain: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  popBtn: { backgroundColor: 'white', paddingHorizontal: 50, paddingVertical: 18, borderRadius: 25, marginTop: 30 },
  rewardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 30 },
  rewardCard: { borderRadius: 50, padding: 30, alignItems: 'center', width: '100%' },
  rewardTitle: { color: 'white', fontSize: 32, fontWeight: '900', marginTop: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 20 },
  statItem: { alignItems: 'center' },
  statLabel: { color: 'white', fontSize: 10, fontWeight: 'bold', opacity: 0.8 },
  statVal: { color: 'white', fontSize: 18, fontWeight: '900' },
  badgeBox: { backgroundColor: 'white', padding: 20, borderRadius: 30, alignItems: 'center', width: '100%', elevation: 5 },
  badgeName: { fontWeight: '900', color: '#455A64', marginTop: 10 },
  doneBtn: { backgroundColor: 'white', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 25, marginTop: 30 },
  doneText: { color: '#FFA000', fontWeight: '900', fontSize: 18 }
});

export default LessonScreen;