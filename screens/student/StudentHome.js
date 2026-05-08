import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar, 
  Platform, 
  Animated, 
  SafeAreaView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { COLORS } from '../../theme';
import API from '../../services/api';

const { width } = Dimensions.get('window');

// --- Stylized Level Component with Orbiting Badges ---
const LevelNode = ({ level, onPress, style, isLeft, isRight }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.nodeWrapper, style]}>
      {/* 1. ADVENTURE PATH */}
      <View style={[styles.pathDotted, isLeft && styles.pathTurnLeft, isRight && styles.pathTurnRight]} />

      <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
        {/* 2. THE LEVEL CIRCLE */}
        <View style={styles.glowEffect}>
          <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.mainCircle}>
            <View style={styles.innerGlass}>
              <Text style={styles.levelNumText}>{level}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 3. ORBITING ACTIVITY ICONS */}
        <View style={[styles.orbitBadge, { top: 10, left: -5, backgroundColor: '#4FC3F7' }]}>
          <Icon name="mic" size={15} color="white" />
        </View>
        <View style={[styles.orbitBadge, { bottom: 10, left: -5, backgroundColor: '#81C784' }]}>
          <Icon name="volume-up" size={15} color="white" />
        </View>
        <View style={[styles.orbitBadge, { top: 10, right: -5, backgroundColor: '#FFD54F' }]}>
          <Icon name="content-cut" size={15} color="white" />
        </View>
        <View style={[styles.orbitBadge, { bottom: 10, right: -5, backgroundColor: '#FF8A65' }]}>
          <Icon name="edit" size={15} color="white" />
        </View>
      </Animated.View>
      
      <View style={styles.levelPill}>
        <Text style={styles.levelPillText}>LEVEL {level}</Text>
      </View>
    </View>
  );
};

const StudentHome = ({ navigation }) => {
  const [user, setUser] = useState({ name: 'CHAMPION', points: 0 });

  useEffect(() => {
    API.get('/user')
      .then(res => setUser(res.data))
      .catch(() => console.log("Using default user name"));
  }, []);

  // Safe name check
  const displayName = user.name ? user.name.toUpperCase() : "CHAMPION";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. CARTOON ENVIRONMENT */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.waterBg} />
        <View style={[styles.islandMass, {left: -100, top: 50, backgroundColor: '#8bbb54', borderRadius: 100}]} />
        <View style={[styles.islandMass, {right: -150, top: 350, backgroundColor: '#9CCC65', borderRadius: 120}]} />
        <View style={[styles.islandMass, {left: -80, top: 550, backgroundColor: '#73a040', borderRadius: 150}]} />
        <View style={[styles.decorRock, {top: 200, left: width * 0.4}]} />
      </View>

      {/* 2. REWARD BANNER */}
      <SafeAreaView style={styles.headerArea}>
        <View style={styles.bannerOuter}>
          <LinearGradient colors={['#FFEB3B', '#FBC02D']} style={styles.bannerInner}>
            <View style={styles.bannerIconBox}>
              <Text style={styles.starEmoji}>🌟</Text>
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerHi}>Hello, {displayName}!</Text>
              <Text style={styles.bannerSub}>BE READY ADVENTURER!</Text>
            </View>
            <View style={styles.xpPill}>
              <Icon name="bolt" size={50} color="#FBC02D" />
              <Text style={styles.xpText}>{user.points} XP</Text>
            </View>
          </LinearGradient>
        </View>
      </SafeAreaView>

      {/* 3. MAP SCROLL */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mapScroll}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl, index) => {
          const isRight = index % 4 === 1;
          const isLeft = index % 4 === 3;
          return (
            <LevelNode 
              key={lvl} 
              level={lvl} 
              isLeft={isLeft} 
              isRight={isRight}
              onPress={() => navigation.navigate('LessonScreen', { levelId: lvl })}
              style={{ marginLeft: isRight ? 110 : isLeft ? -110 : 0 }}
            />
          );
        })}
        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  waterBg: { flex: 1, backgroundColor: '#81D4FA' },
  islandMass: { position: 'absolute', width: width * 0.7, height: 400, opacity: 0.9 },
  decorRock: { position: 'absolute', width: 30, height: 30, backgroundColor: '#B0BEC5', borderRadius: 10, opacity: 0.5 },
  headerArea: { zIndex: 20 },
  bannerOuter: { margin: 20, marginTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, elevation: 12 },
  bannerInner: { flexDirection: 'row', padding: 15, borderRadius: 30, alignItems: 'center', borderWidth: 3, borderColor: 'white', borderBottomWidth: 8, borderBottomColor: 'rgba(0,0,0,0.1)' },
  bannerIconBox: { backgroundColor: 'white', padding: 5, borderRadius: 20 },
  starEmoji: { fontSize: 24 },
  bannerTextContainer: { flex: 1, marginLeft: 10 },
  bannerHi: { color: '#5D4037', fontWeight: '900', fontSize: 18 },
  bannerSub: { color: '#795548', fontWeight: 'bold', fontSize: 9 },
  xpPill: { backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 4 },
  xpText: { color: '#FBC02D', fontWeight: '900', fontSize: 13 },
  mapScroll: { paddingTop: 20, alignItems: 'center' },
  nodeWrapper: { alignItems: 'center', marginBottom: 80, position: 'relative' },
  pathDotted: { position: 'absolute', top: 60, width: 4, height: 100, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2, zIndex: -1 },
  pathTurnLeft: { transform: [{ rotate: '45deg' }], left: 60 },
  pathTurnRight: { transform: [{ rotate: '-45deg' }], right: 60 },
  glowEffect: { padding: 8, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.4)', elevation: 10 },
  mainCircle: { width: 85, height: 85, borderRadius: 42.5, backgroundColor: '#78C800', padding: 6, borderBottomWidth: 10, borderBottomColor: '#589000' },
  innerGlass: { flex: 1, borderRadius: 40, backgroundColor: '#A5D6A7', justifyContent: 'center', alignItems: 'center' },
  levelNumText: { fontSize: 34, fontWeight: '900', color: 'white' },
  orbitBadge: { position: 'absolute', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white', elevation: 5 },
  levelPill: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, marginTop: 15, elevation: 4, borderBottomWidth: 3, borderBottomColor: '#ECEFF1' },
  levelPillText: { fontWeight: '900', color: '#388E3C', fontSize: 10 },
  footerSpace: { height: 120 }
});

export default StudentHome;