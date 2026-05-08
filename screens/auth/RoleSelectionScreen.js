import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Dimensions, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

// --- Premium Role Card Component ---
const RoleCard = ({ icon, title, description, accentColor, onPress }) => (
  <TouchableOpacity 
    activeOpacity={0.7} 
    style={[styles.card, { borderColor: accentColor + '30' }]} 
    onPress={onPress}
  >
    {/* Subtle Accent Glow */}
    <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
        <Ionicons name={icon} size={28} color={accentColor} />
    </View>

    <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
    </View>

    <Ionicons name="chevron-forward" size={20} color="#CFD8DC" />
  </TouchableOpacity>
);

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. PRESERVED PASTEL BACKGROUND */}
      <LinearGradient 
        colors={['#E1F5FE', '#FCE4EC']} 
        style={StyleSheet.absoluteFill} 
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* 2. HEADER SECTION */}
          <View style={styles.header}>
            <Text style={styles.title}>Join the Team!</Text>
            <Text style={styles.subtitle}>Choose your role to sign up</Text>
          </View>

          {/* 3. CARDS SECTION */}
          <View style={styles.cardsWrapper}>
            <RoleCard 
                icon="school-outline"
                title="Student"
                description="I am ready to learn and play"
                accentColor="#1CB0F6" // Modern Blue
                onPress={() => navigation.navigate('Register', { role: 'student' })}
            />

            <RoleCard 
                icon="person-outline"
                title="Teacher"
                description="I want to manage my classroom"
                accentColor="#FFA000" // Warm Gold
                onPress={() => navigation.navigate('Register', { role: 'teacher' })}
            />
          </View>

          {/* 4. FOOTER SECTION */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>GO BACK</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  safeArea: { 
    flex: 1 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', // Centers content vertically
    paddingHorizontal: 30 
  },

  // TYPOGRAPHY
  header: { 
    marginBottom: 50, 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 34, 
    fontWeight: '900', 
    color: '#263238', 
    letterSpacing: -0.5,
    marginBottom: 8
  },
  subtitle: { 
    fontSize: 16, 
    color: '#78909C', 
    fontWeight: '600' 
  },

  // CARD STYLING
  cardsWrapper: { 
    gap: 20 
  },
  card: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    // Soft Premium Shadows
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#455A64',
    marginBottom: 4
  },
  cardDescription: {
    fontSize: 12,
    color: '#90A4AE',
    fontWeight: 'bold',
  },

  // FOOTER
  backButton: {
    marginTop: 60,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B0BEC5',
    letterSpacing: 2
  }
});

export default RoleSelectionScreen;