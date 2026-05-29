import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const Analytics = ({ route, navigation }) => {
  const { roomName, students = [] } = route.params ?? {};
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'HELP'

  // ── Dynamic Performance Analyzer ────────────────────────────────
  // Process students in real-time to compute diagnostics
  const analyzedStudents = useMemo(() => {
    return students.map(student => {
      // Gumagamit ng hash batay sa pangalan para sa consistent at dynamic na simulation data
      const hash = student.name.charCodeAt(0) + student.name.length;
      
      const pronunciationAccuracy = Math.max(60, Math.min(98, 65 + (hash % 34))); // Range: 65% - 98%
      const comprehensionScore = Math.max(50, Math.min(100, 52 + (hash % 47)));    // Range: 52% - 99%
      
      const weakWords = hash % 2 === 0 
        ? ['outside', 'bounced', 'high'] 
        : ['sweet', 'flew', 'through'];

      // Categorization Rule
      const isComprehending = comprehensionScore >= 75;
      const isPronouncingAccurate = pronunciationAccuracy >= 80;
      const status = (isComprehending && isPronouncingAccurate) ? 'Active Reader' : 'Needs Help';

      return {
        ...student,
        pronunciationAccuracy,
        comprehensionScore,
        weakWords,
        status,
      };
    });
  }, [students]);

  // ── Aggregate Data ───────────────────────────────────────────────
  const aggregateMetrics = useMemo(() => {
    if (analyzedStudents.length === 0) {
      return { avgPron: 0, avgComp: 0, activeCount: 0, helpCount: 0, topWeakWords: [] };
    }

    let totalPron = 0;
    let totalComp = 0;
    let activeCount = 0;
    let helpCount = 0;
    const wordFrequency = {};

    analyzedStudents.forEach(s => {
      totalPron += s.pronunciationAccuracy;
      totalComp += s.comprehensionScore;
      if (s.status === 'Active Reader') activeCount++;
      else helpCount++;

      s.weakWords.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    });

    const topWeakWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    return {
      avgPron: Math.round(totalPron / analyzedStudents.length),
      avgComp: Math.round(totalComp / analyzedStudents.length),
      activeCount,
      helpCount,
      topWeakWords,
    };
  }, [analyzedStudents]);

  // Filtered list based on teacher's filter selection
  const filteredStudents = useMemo(() => {
    if (statusFilter === 'ACTIVE') {
      return analyzedStudents.filter(s => s.status === 'Active Reader');
    }
    if (statusFilter === 'HELP') {
      return analyzedStudents.filter(s => s.status === 'Needs Help');
    }
    return analyzedStudents;
  }, [analyzedStudents, statusFilter]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F8FAFC', '#FFFDF4', '#F1F5F9']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#37474F" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerSub}>{roomName}</Text>
            <Text style={styles.headerTitle}>Student Analytics</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {students.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#90A4AE" />
              <Text style={styles.emptyText}>No students in this room to analyze.</Text>
            </View>
          ) : (
            <>
              {/* Aggregate Performance Cards */}
              <View style={styles.metricsGrid}>
                {/* Pronunciation Card */}
                <View style={styles.metricCard}>
                  <View style={styles.metricIconWrap}>
                    <Ionicons name="mic-outline" size={20} color="#37474F" />
                  </View>
                  <Text style={styles.metricLabel}>Pronunciation</Text>
                  <Text style={styles.metricValue}>{aggregateMetrics.avgPron}%</Text>
                  <Text style={styles.metricSub}>Average Accuracy</Text>
                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${aggregateMetrics.avgPron}%` }]} />
                  </View>
                </View>

                {/* Comprehension Card */}
                <View style={styles.metricCard}>
                  <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(255, 213, 79, 0.15)' }]}>
                    <Ionicons name="book-outline" size={20} color="#D4AF37" />
                  </View>
                  <Text style={styles.metricLabel}>Comprehension</Text>
                  <Text style={[styles.metricValue, { color: '#D4AF37' }]}>{aggregateMetrics.avgComp}%</Text>
                  <Text style={styles.metricSub}>Average Quiz Score</Text>
                  <View style={[styles.progressBarTrack, { backgroundColor: '#ECEFF1' }]}>
                    <View style={[styles.progressBarFill, { width: `${aggregateMetrics.avgComp}%`, backgroundColor: '#FFD54F' }]} />
                  </View>
                </View>
              </View>

              {/* Identify Weak Reading Areas */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="warning-outline" size={18} color="#E53935" />
                  <Text style={styles.sectionTitle}>WEAK READING AREAS (DIFFICULT WORDS)</Text>
                </View>
                <Text style={styles.sectionDescription}>
                  These vocabulary words present the highest pronunciation error rate in this room:
                </Text>
                <View style={styles.wordChipsRow}>
                  {aggregateMetrics.topWeakWords.map((word, idx) => (
                    <View key={idx} style={styles.wordChip}>
                      <Ionicons name="close-circle-outline" size={14} color="#E53935" />
                      <Text style={styles.wordChipText}>{word}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Categorization & Filter Tabs */}
              <View style={styles.filterTabsRow}>
                <TouchableOpacity
                  style={[styles.tabBtn, statusFilter === 'ALL' && styles.tabBtnActive]}
                  onPress={() => setStatusFilter('ALL')}
                >
                  <Text style={[styles.tabBtnText, statusFilter === 'ALL' && styles.tabBtnTextActive]}>
                    All ({analyzedStudents.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, statusFilter === 'ACTIVE' && styles.tabBtnActive]}
                  onPress={() => setStatusFilter('ACTIVE')}
                >
                  <View style={styles.dotIndicatorActive} />
                  <Text style={[styles.tabBtnText, statusFilter === 'ACTIVE' && styles.tabBtnTextActive]}>
                    Active ({aggregateMetrics.activeCount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, statusFilter === 'HELP' && styles.tabBtnActive]}
                  onPress={() => setStatusFilter('HELP')}
                >
                  <View style={styles.dotIndicatorHelp} />
                  <Text style={[styles.tabBtnText, statusFilter === 'HELP' && styles.tabBtnTextActive]}>
                    Needs Help ({aggregateMetrics.helpCount})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Individual Student Diagnostics */}
              <Text style={styles.subHeading}>INDIVIDUAL DIAGNOSTICS</Text>
              {filteredStudents.map(student => (
                <View key={student.id} style={[styles.studentCard, student.status === 'Needs Help' && styles.studentCardHelp]}>
                  <View style={styles.studentInfoRow}>
                    <View>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text style={styles.studentSub}>Comprehension: {student.comprehensionScore}%</Text>
                    </View>
                    <View style={[
                      styles.statusBadge, 
                      student.status === 'Active Reader' ? styles.statusBadgeActive : styles.statusBadgeHelp
                    ]}>
                      <Text style={[
                        styles.statusBadgeText, 
                        student.status === 'Active Reader' ? styles.statusBadgeTextActive : styles.statusBadgeTextHelp
                      ]}>
                        {student.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.diagnosticDivider} />

                  <View style={styles.diagnosticMetrics}>
                    <View style={styles.diagItem}>
                      <Text style={styles.diagLabel}>Pronunciation</Text>
                      <Text style={styles.diagValue}>{student.pronunciationAccuracy}%</Text>
                    </View>
                    <View style={styles.diagItem}>
                      <Text style={styles.diagLabel}>Difficult Words</Text>
                      <Text style={styles.diagValue} numberOfLines={1}>
                        {student.weakWords.join(', ')}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ── STYLES ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  backBtn: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D4AF37',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#37474F',
    marginTop: 1,
  },
  scroll: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#90A4AE',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(55, 71, 79, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78909C',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#37474F',
  },
  metricSub: {
    fontSize: 10,
    color: '#90A4AE',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#ECEFF1',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#37474F',
    borderRadius: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD54F',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#37474F',
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#78909C',
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: '600',
  },
  wordChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  wordChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E53935',
  },
  filterTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#ECEFF1',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78909C',
  },
  tabBtnTextActive: {
    color: '#37474F',
    fontWeight: '900',
  },
  dotIndicatorActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  dotIndicatorHelp: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF8A65',
  },
  subHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#78909C',
    letterSpacing: 1,
    marginBottom: 10,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  studentCardHelp: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF8A65',
  },
  studentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  studentName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#37474F',
  },
  studentSub: {
    fontSize: 11,
    color: '#90A4AE',
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
  },
  statusBadgeHelp: {
    backgroundColor: 'rgba(255, 138, 101, 0.12)',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  statusBadgeTextActive: {
    color: '#4CAF50',
  },
  statusBadgeTextHelp: {
    color: '#FF8A65',
  },
  diagnosticDivider: {
    height: 1,
    backgroundColor: '#ECEFF1',
    marginVertical: 12,
  },
  diagnosticMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  diagItem: {
    flex: 1,
  },
  diagLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#90A4AE',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  diagValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#546E7A',
  },
});

export default Analytics;