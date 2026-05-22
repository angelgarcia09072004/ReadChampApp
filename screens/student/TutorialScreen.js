import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Standard Expo vector icons

const { width } = Dimensions.get('window');

const steps = [
  {
    title: "Hi! I'm Champ!",
    description: "Your new reading buddy! Let's learn reading through fun games and stories!",
    image: require('../../assets/mascot-trophy.png'), 
    narration: "Hi kids! Welcome to ReadChamp! I'm Champ the Reading Buddy! Let's learn reading through fun games and stories!"
  },
  {
    title: "How to Play",
    description: "Play games, read stories, and earn cool badges!",
    image: require('../../assets/mascot-trophy.png'), 
    narration: "Play games, read stories, and earn cool badges!"
  },
  {
    title: "Read Along!",
    description: "Tap the words while reading to hear them out loud!",
    image: require('../../assets/mascot-trophy.png'), 
    narration: "Tap the words while reading to hear them out loud!"
  },
  {
    title: "Earn Rewards",
    description: "Answer quizzes to earn XP points and unlock badges!",
    image: require('../../assets/mascot-trophy.png'), 
    narration: "Answer quizzes to earn XP points and unlock badges!"
  },
  {
    title: "Ready to Start?",
    description: "Let's begin our reading adventure together!",
    image: require('../../assets/mascot-trophy.png'),
    narration: "Are you ready? Tap 'Start Adventure' to begin!"
  }
];

export default function TutorialScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Trigger voice narration when the step changes
  useEffect(() => {
    speak(steps[currentStep].narration);
    return () => Speech.stop(); // Stop speaking if user navigates away
  }, [currentStep]);

  const speak = (text) => {
    Speech.stop();
    Speech.speak(text, {
      language: 'en',
      pitch: 1.15,
      rate: 0.80, // Slightly slower for Grade 1 comprehension
    });
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await finishTutorial();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await finishTutorial();
  };

  const finishTutorial = async () => {
    try {
      await AsyncStorage.setItem('hasSeenTutorial', 'true');
    } catch (error) {
      console.log("Error saving tutorial preference: ", error);
    }
    navigation.replace('MainTabs'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* RICH EDUCATIONAL BACKGROUND (Stylized letters, numbers & floating shapes) */}
      <View style={styles.backgroundDecorations} pointerEvents="none">
        {/* Letters */}
        <Text style={[styles.bgLetter, { top: '10%', left: '8%', color: '#FF6B6B', fontSize: 38 }]}>A</Text>
        <Text style={[styles.bgLetter, { top: '14%', right: '10%', color: '#4D96FF', fontSize: 44 }]}>B</Text>
        <Text style={[styles.bgLetter, { top: '38%', left: '6%', color: '#6BCB77', fontSize: 34 }]}>C</Text>
        <Text style={[styles.bgLetter, { top: '42%', right: '6%', color: '#FFD93D', fontSize: 42 }]}>Z</Text>
        
        {/* Numbers */}
        <Text style={[styles.bgLetter, { bottom: '26%', left: '10%', color: '#4D96FF', fontSize: 36 }]}>1</Text>
        <Text style={[styles.bgLetter, { bottom: '30%', right: '8%', color: '#FF6B6B', fontSize: 38 }]}>2</Text>
        <Text style={[styles.bgLetter, { bottom: '15%', left: '46%', color: '#6BCB77', fontSize: 40 }]}>3</Text>

        {/* Soft Background circles */}
        <View style={[styles.bgCircle, { top: '22%', right: '24%', width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFD93D' }]} />
        <View style={[styles.bgCircle, { top: '30%', left: '20%', width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#E8F1FF' }]} />
        <View style={[styles.bgCircle, { bottom: '38%', left: '28%', width: 25, height: 25, borderRadius: 12.5, backgroundColor: '#FFEAEA' }]} />
        <View style={[styles.bgCircle, { bottom: '20%', right: '28%', width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFF2B2' }]} />
      </View>

      {/* HEADER ROW */}
      <View style={styles.header}>
        {currentStep > 0 ? (
          <TouchableOpacity 
            onPress={handleBack} 
            style={styles.backButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <View style={styles.backButtonInner}>
              <Ionicons name="arrow-back" size={20} color="#1E62D0" style={{ marginRight: 4 }} />
              <Text style={styles.backButtonText}>Back</Text>
            </View>
          </TouchableOpacity>
        ) : <View style={styles.placeholder} />}

        {currentStep < steps.length - 1 ? (
          <TouchableOpacity 
            onPress={handleSkip} 
            style={styles.skipButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <View style={styles.skipButtonInner}>
              <Text style={styles.skipText}>Skip</Text>
              <Ionicons name="play-skip-forward" size={16} color="#FF5E5E" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        ) : <View style={styles.placeholder} />}
      </View>

      {/* MASCOT AND INSTRUCTION BLOCK */}
      <View style={styles.content}>
        <View style={styles.mascotContainer}>
          <View style={styles.glowAura} />
          <View style={styles.sparkleRing} />
          <Image 
            source={steps[currentStep].image} 
            style={styles.mascot} 
            resizeMode="contain"
          />
        </View>

        {/* Text Container with Larger Grade 1 Fonts */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{steps[currentStep].title}</Text>
          <Text style={styles.description}>{steps[currentStep].description}</Text>
        </View>

        {/* Listen Again Button with 3D Tactile Design */}
        <TouchableOpacity 
          onPress={() => speak(steps[currentStep].narration)} 
          style={styles.audioButton}
          activeOpacity={0.8}
        >
          <View style={styles.audioButtonInner}>
            <Ionicons name="volume-medium" size={22} color="#1E62D0" style={{ marginRight: 6 }} />
            <Text style={styles.audioButtonText}>Hear Champ speak!</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* FOOTER BAR */}
      <View style={styles.footer}>
        {/* Progress indicators (Duolingo style) */}
        <View style={styles.indicatorContainer}>
          {steps.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.indicatorPill, 
                currentStep === index ? styles.activePill : styles.inactivePill
              ]} 
            />
          ))}
        </View>

        {/* Start Adventure / Next button (Tactile 3D Design) */}
        <TouchableOpacity 
          onPress={handleNext} 
          style={styles.tactileButton}
          activeOpacity={0.9}
        >
          <View style={styles.tactileButtonInner}>
            <Text style={styles.tactileButtonText}>
              {currentStep === steps.length - 1 ? "Start Adventure! " : "Next "}
            </Text>
            <Ionicons 
              name={currentStep === steps.length - 1 ? "rocket" : "arrow-forward-sharp"} 
              size={22} 
              color="#FFFFFF" 
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FF', 
  },
  backgroundDecorations: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  bgLetter: {
    position: 'absolute',
    fontWeight: '900',
    opacity: 0.25, // Clean subtle background blend
  },
  bgCircle: {
    position: 'absolute',
    opacity: 0.40,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 99, 
    marginTop: 50, 
  },
  backButton: {
    width: 100,
    height: 50,
    borderRadius: 24,
    backgroundColor: '#B5D3F7', // Shadow color
  },
  backButtonInner: {
    flex: 1,
    height: 43,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D0E1FD',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E62D0',
  },
  skipButton: {
    width: 100,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFCCCC', // Shadow color
  },
  skipButtonInner: {
    flex: 1,
    height: 43,
    borderRadius: 24,
    backgroundColor: '#FFEAEA',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD1D1',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FF5E5E',
  },
  placeholder: {
    width: 100,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 5,
  },
  mascotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 500,  
    height: 300, 
    marginBottom: 5,
  },
  glowAura: {
    position: 'absolute',
    width: 270,  
    height: 270, 
    borderRadius: 135,
    backgroundColor: '#FFF2B2',
    opacity: 0.65,
  },
  sparkleRing: {
    position: 'absolute',
    width: 300,  
    height: 300, 
    borderRadius: 150,
    borderWidth: 2.5,
    borderColor: '#FFF',
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  mascot: {
    width: 320,  
    height: 320, 
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 40, // Exceptionally large and legible for early readers
    fontWeight: '900',
    color: '#1E62D0', 
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 20, // Increased size for Grade 1 readability
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 27,
    fontWeight: '800',
  },
  audioButton: {
    width: 220,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#9EC5FE', // Shadow color
  },
  audioButtonInner: {
    flex: 1,
    height: 46,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4D96FF',
  },
  audioButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E62D0',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
    zIndex: 5,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  indicatorPill: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activePill: {
    backgroundColor: '#FF6B6B',
    width: 28, 
  },
  inactivePill: {
    backgroundColor: '#D0D5DD',
    width: 10,
  },
  tactileButton: {
    width: width * 0.75,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E04A4A', 
  },
  tactileButtonInner: {
    flex: 1,
    height: 54, 
    borderRadius: 30,
    backgroundColor: '#FF6B6B', 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tactileButtonText: {
    fontSize: 25,
    fontWeight: '950', // Extremely bold and crisp
    color: '#FFFFFF',
  },
});