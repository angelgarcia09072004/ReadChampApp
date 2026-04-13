import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground, 
  Dimensions, 
  SafeAreaView,
  ActivityIndicator,
  StatusBar, 
  Platform    
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import API from '../../services/api';

const { width } = Dimensions.get('window');

// --- Level Node Component (The Circular Levels) ---
const LevelNode = ({ level, status, onPress, style }) => {
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';
  
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={isLocked ? null : onPress} 
      style={[styles.nodeContainer, style]}
    >
      <View style={[
        styles.outerCircle, 
        isLocked && styles.lockedOuterCircle,
        isCurrent && { borderColor: COLORS.primary }
      ]}>
        
        {/* 4 MINI-GAME PROGRESS SEGMENTS (The 4 Dots) */}
        <View style={styles.segmentContainer}>
            {/* Segment 1: Word Sounds | Segment 2: Object ID */}
            {/* Segment 3: Syllable Splash | Segment 4: Spellcraft */}
            {[1, 2, 3, 4].map((dot) => (
                <View 
                    key={dot} 
                    style={[
                        styles.progressDot, 
                        { backgroundColor: isCompleted ? '#FFD700' : '#E0E0E0' } 
                    ]} 
                />
            ))}
        </View>

        {/* INNER LEVEL CIRCLE */}
        <View style={[
            styles.innerCircle, 
            { backgroundColor: isLocked ? '#BDBDBD' : isCurrent ? COLORS.primary : COLORS.success }
        ]}>
          {isLocked ? (
            <Ionicons name="lock-closed" size={30} color="white" />
          ) : (
            <Text style={styles.levelNumber}>{level}</Text>
          )}
        </View>
      </View>
      
      <Text style={[styles.nodeLabel, isLocked && { color: '#90A4AE' }]}>
        LEVEL {level}
      </Text>
    </TouchableOpacity>
  );
};

const StudentHome = ({ navigation }) => {
  const [userData, setUserData] = useState({ name: 'Champion', points: 0, level: 1 });
  const [loading, setLoading] = useState(true);

  // 1. FETCH REAL STUDENT RECORD FROM DATABASE
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await API.get('/user'); // Fetch logged in user
        setUserData(response.data);
      } catch (error) {
        console.log("Using local data (Login Bypassed)");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  // 2. GENERATE THE 10 LEVELS LOGIC
  const levelsData = Array.from({ length: 10 }, (_, i) => {
    const currentLvl = i + 1;
    let status = 'locked';
    if (currentLvl < userData.level) status = 'completed';
    else if (currentLvl === userData.level) status = 'current';
    return { id: currentLvl, status };
  });

  if (loading) {
    return (
        <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
  }

return (
    <View style={styles.container}>
      {/* 1. STATUS BAR CONFIG (Makes system icons white) */}
      <StatusBar barStyle="light-content" />

      {/* 2. THE IMPROVED HEADER */}
      <LinearGradient colors={[COLORS.primary, '#64B5F6']} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hi, {userData.name}! 🏆</Text>
              <Text style={styles.subGreeting}>Level {userData.level} Explorer</Text>
            </View>
            <View style={styles.statsBadge}>
              <Text style={styles.statText}>✨ {userData.points} pts</Text>
            </View>
          </View>
      </LinearGradient>


      {/* GAME MAP (GRASS THEME) */}
      <ScrollView 
        style={styles.mapScroll} 
        contentContainerStyle={styles.mapContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground 
            source={{ uri: 'https://www.transparenttextures.com/patterns/p6.png' }} // Subtle grass-like texture
            style={styles.grassBg}
        >
          {levelsData.map((lvl, index) => {
            // ZIG-ZAG SNAKE PATTERN LOGIC
            let marginSide = 0;
            if (index % 4 === 1) marginSide = 90;   // Move Right
            if (index % 4 === 2) marginSide = 0;    // Center
            if (index % 4 === 3) marginSide = -90;  // Move Left

            return (
              <LevelNode 
                key={lvl.id}
                level={lvl.id}
                status={lvl.status}
                onPress={() => alert(`Level ${lvl.id}: Choose a Game!`)}
                style={{ marginLeft: marginSide }}
              />
            );
          })}
          
          {/* Footer space to see the last level clearly above the tabs */}
          <View style={{ height: 120 }} /> 
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F8E9' },
  
  header: {
    // This adds space for the status bar on Android and extra padding for iOS
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 60,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    // Removed paddingTop from here to use header padding instead
  },
  greeting: { 
    color: 'white', 
    fontSize: 26, 
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  statText: { color: 'white', fontWeight: '900', fontSize: 16 },

  mapScroll: { flex: 1 },
  mapContent: { paddingTop: 40 },
  grassBg: { width: width, alignItems: 'center' },

  nodeContainer: { alignItems: 'center', marginBottom: 45 },
  outerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#C8E6C9',
    elevation: 6,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lockedOuterCircle: { borderColor: '#ECEFF1' },
  
  // The 4 dots inside the circle representing the 4 mini-games
  segmentContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
    zIndex: 0
  },
  progressDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#E0E0E0', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },

  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 8, // The Duolingo 3D "clicky" look
    borderBottomColor: 'rgba(0,0,0,0.15)',
    zIndex: 1,
  },
  levelNumber: { color: 'white', fontSize: 36, fontWeight: '900', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  nodeLabel: { marginTop: 12, fontWeight: '900', color: '#388E3C', fontSize: 12, letterSpacing: 1 },
});

export default StudentHome;