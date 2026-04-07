import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const PathNode = ({ title, icon, color, locked, style }) => (
  <TouchableOpacity style={[styles.nodeContainer, style]}>
    <View style={[styles.node, { backgroundColor: locked ? '#E5E5E5' : color }]}>
      <Ionicons name={icon} size={30} color="white" />
    </View>
    <Text style={styles.nodeTitle}>{title}</Text>
  </TouchableOpacity>
);

const StudentHome = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.path}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Unit 1: Let's Read! 📚</Text>
      </View>

      <PathNode title="Word Sounds" icon="volume-high" color={COLORS.success} style={{ alignSelf: 'center' }} />
      <PathNode title="Object ID" icon="search" color={COLORS.primary} style={{ alignSelf: 'flex-end', marginRight: 40 }} locked />
      <PathNode title="Syllable Splash" icon="water" color={COLORS.warning} style={{ alignSelf: 'center' }} locked />
      <PathNode title="Spellcraft" icon="extension-puzzle" color={COLORS.error} style={{ alignSelf: 'flex-start', marginLeft: 40 }} locked />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  path: { paddingVertical: 40, gap: 30 },
  header: { backgroundColor: COLORS.success, padding: 20, marginBottom: 20 },
  welcome: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  nodeContainer: { alignItems: 'center' },
  node: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  nodeTitle: { marginTop: 8, fontWeight: 'bold', color: '#4B4B4B' }
});

export default StudentHome;