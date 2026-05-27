import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const MODULES = [
  {
    id: 'letter_recognition',
    title: 'Letter Recognition',
    subtitle: 'Learn ABCs through shapes & sounds',
    icon: 'text-outline',
    colors: ['#B3E5FC', '#81D4FA'],
    accent: '#0288D1',
    tag: 'PHONICS',
  },
  {
    id: 'picture_matching',
    title: 'Picture Matching',
    subtitle: 'Match images to their word pairs',
    icon: 'images-outline',
    colors: ['#C8E6C9', '#A5D6A7'],
    accent: '#388E3C',
    tag: 'VISUAL',
  },
  {
    id: 'word_matching',
    title: 'Word Matching',
    subtitle: 'Connect words that belong together',
    icon: 'git-compare-outline',
    colors: ['#F8BBD9', '#F48FB1'],
    accent: '#C2185B',
    tag: 'VOCABULARY',
  },
  {
    id: 'number_word_matching',
    title: 'Number + Word Matching',
    subtitle: 'Bridge numbers with their written form',
    icon: 'calculator-outline',
    colors: ['#FFE0B2', '#FFCC80'],
    accent: '#E65100',
    tag: 'NUMERACY',
  },
  {
    id: 'sound_matching',
    title: 'Sound Matching',
    subtitle: 'Listen carefully and match the sounds',
    icon: 'ear-outline',
    colors: ['#E1BEE7', '#CE93D8'],
    accent: '#7B1FA2',
    tag: 'LISTENING',
  },
];

const STORYTELLING = {
  id: 'storytelling',
  title: 'Storytelling',
  subtitle: 'Bring stories to life with imagination',
  icon: 'book-outline',
  colors: ['#37474F', '#263238'],
  accent: '#FFD54F',
  tag: 'CREATIVE',
};

const ModuleCard = ({ item, onPress, isStorytelling = false }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, isStorytelling && { marginTop: 8 }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress(item)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <LinearGradient
          colors={item.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, isStorytelling && styles.storyCard]}
        >
          {/* Tag */}
          <View style={[styles.tag, { backgroundColor: isStorytelling ? 'rgba(255,213,79,0.2)' : 'rgba(255,255,255,0.45)' }]}>
            <Text style={[styles.tagText, { color: isStorytelling ? '#FFD54F' : item.accent }]}>
              {item.tag}
            </Text>
          </View>

          <View style={styles.cardBody}>
            {/* Icon circle */}
            <View style={[styles.iconCircle, { backgroundColor: isStorytelling ? 'rgba(255,213,79,0.15)' : 'rgba(255,255,255,0.55)' }]}>
              <Ionicons name={item.icon} size={30} color={isStorytelling ? '#FFD54F' : item.accent} />
            </View>

            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, isStorytelling && { color: '#FFFFFF' }]}>
                {item.title}
              </Text>
              <Text style={[styles.cardSub, isStorytelling && { color: 'rgba(255,255,255,0.65)' }]}>
                {item.subtitle}
              </Text>
            </View>

            {/* Arrow */}
            <View style={[styles.arrow, { backgroundColor: isStorytelling ? 'rgba(255,213,79,0.2)' : 'rgba(255,255,255,0.55)' }]}>
              <Ionicons name="chevron-forward" size={18} color={isStorytelling ? '#FFD54F' : item.accent} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CreateModule = ({ route, navigation }) => {
  const { roomName } = route.params;

  const handleSelect = (module) => {
  const screenMap = {
    letter_recognition: 'LetterRecognition',
    picture_matching: 'PictureMatching',
     word_matching: 'WordMatching',
     number_word_matching: 'NumberWordMatching',
     sound_matching: 'SoundMatching',
    storytelling: 'Storytelling',
     
  };
  const screen = screenMap[module.id];
  if (screen) {
    navigation.navigate(screen, { roomName });
  } else {
    alert(`"${module.title}" — coming soon!`);
  }
};
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSub}>{roomName}</Text>
            <Text style={styles.headerTitle}>Choose a Module</Text>
          </View>
          <View style={{ width: 45 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Section label */}
          <View style={styles.sectionLabel}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionText}>READING ACTIVITIES</Text>
          </View>

          {MODULES.map((mod) => (
            <ModuleCard key={mod.id} item={mod} onPress={handleSelect} />
          ))}

          {/* Divider before storytelling */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>SPECIAL</Text>
            <View style={styles.dividerLine} />
          </View>

          <ModuleCard item={STORYTELLING} onPress={handleSelect} isStorytelling />

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    elevation: 4,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4FC3F7',
  },
  sectionText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 2,
  },

  // ── MODULE CARD ──
  card: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  storyCard: {
    borderRadius: 28,
    padding: 22,
    elevation: 8,
    shadowColor: '#263238',
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 14,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#263238',
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 12,
    color: '#546E7A',
    fontWeight: '600',
    lineHeight: 16,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── DIVIDER ──
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  dividerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 2,
  },
});

export default CreateModule;