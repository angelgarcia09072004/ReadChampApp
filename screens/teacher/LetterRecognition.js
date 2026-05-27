import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Animated,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const makePairs = (count) =>
  Array.from({ length: count }, (_, i) => ({
    pairId: `p${i + 1}`,
    uppercase: '',
    lowercase: '',
  }));

const makeDefault = () =>
  Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;

    // Question 1: Preloaded standard ABC matching template
    if (num === 1) {
      return {
        id: `q${num}`,
        number: num,
        pairCount: 3,
        pairs: [
          { pairId: 'p1', uppercase: 'A', lowercase: 'a' },
          { pairId: 'p2', uppercase: 'B', lowercase: 'b' },
          { pairId: 'p3', uppercase: 'C', lowercase: 'c' },
        ],
        saved: true,
      };
    }

    // Question 2: Preloaded with 3 randomized letter pairs
    if (num === 2) {
      return {
        id: `q${num}`,
        number: num,
        pairCount: 3,
        pairs: [
          { pairId: 'p1', uppercase: 'S', lowercase: 's' },
          { pairId: 'p2', uppercase: 'M', lowercase: 'm' },
          { pairId: 'p3', uppercase: 'T', lowercase: 't' },
        ],
        saved: true,
      };
    }

    // Questions 3 to 10: Empty defaults (always 3 pairs)
    return {
      id: `q${num}`,
      number: num,
      pairCount: 3,
      pairs: makePairs(3),
      saved: false,
    };
  });

// ── Student Preview (mini matching layout) ─────────────────────────
const StudentPreview = ({ pairs, rightColumnOrder, onShuffle }) => {
  const filled = pairs.filter(
    p => (p?.uppercase || p?.lowercase)
  );

  if (filled.length === 0) return null;

  return (
    <View style={styles.previewBox}>
      {/* Interactive Preview Header */}
      <View style={styles.previewHeaderRow}>
        <Text style={styles.previewLabel}>STUDENT VIEW </Text>
        <TouchableOpacity style={styles.miniShuffleBtn} onPress={onShuffle} activeOpacity={0.7}>
          <Ionicons name="shuffle-outline" size={13} color="#78909C" />
          <Text style={styles.miniShuffleText}>Shuffle Preview</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewColumns}>
        {/* Left column – uppercase (fixed sequence) */}
        <View style={styles.previewCol}>
          {pairs.map(p => (
            <View key={p.pairId} style={styles.previewBubbleUpper}>
              <Text style={styles.previewUpperText}>{p.uppercase || '?'}</Text>
            </View>
          ))}
        </View>

        {/* Dotted line separator */}
        <View style={styles.previewSep}>
          {pairs.map((_, i) => (
            <View key={i} style={styles.previewDot} />
          ))}
        </View>

        {/* Right column – lowercase (shuffled dynamically) */}
        <View style={styles.previewCol}>
          {(rightColumnOrder || []).map(index => {
            const p = pairs[index];
            if (!p) return null;
            return (
              <View key={p.pairId} style={styles.previewBubbleLower}>
                <Text style={styles.previewLowerText}>{p.lowercase || '?'}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ── Single Pair Row inside a question ─────────────────────────────
const PairRow = ({ pair, index, onUpdate, questionId }) => (
  <View style={styles.pairRow}>
    <View style={styles.pairIndex}>
      <Text style={styles.pairIndexText}>{index + 1}</Text>
    </View>

    {/* Uppercase input */}
    <TextInput
      style={[styles.letterInput, { borderColor: '#81D4FA' }]}
      value={pair.uppercase}
      onChangeText={t => onUpdate(questionId, pair.pairId, 'uppercase', t.toUpperCase().slice(0, 1))}
      placeholder="A"
      placeholderTextColor="#CFD8DC"
      maxLength={1}
      autoCapitalize="characters"
    />

    <Ionicons name="swap-horizontal" size={18} color="#CFD8DC" style={{ marginHorizontal: 4 }} />

    {/* Lowercase input */}
    <TextInput
      style={[styles.letterInput, { borderColor: '#F48FB1' }]}
      value={pair.lowercase}
      onChangeText={t => onUpdate(questionId, pair.pairId, 'lowercase', t.toLowerCase().slice(0, 1))}
      placeholder="a"
      placeholderTextColor="#CFD8DC"
      maxLength={1}
      autoCapitalize="none"
    />

    {/* Mini checkmark if both filled */}
    <View style={[styles.pairCheck, { opacity: pair.uppercase && pair.lowercase ? 1 : 0 }]}>
      <Ionicons name="checkmark" size={12} color="white" />
    </View>
  </View>
);

// ── Single Question Card ───────────────────────────────────────────
const QuestionCard = ({ item, onUpdate, onSave, onClear }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(item.number === 1);

  // Local state to keep track of visual choice shuffle indices for the right column
  const [rightColumnOrder, setRightColumnOrder] = useState(() =>
    Array.from({ length: item.pairCount }, (_, i) => i).reverse()
  );

  const filledPairs = (item.pairs || []).filter(
    p => p.uppercase?.trim() && p.lowercase?.trim()
  ).length;

  const isComplete = filledPairs === item.pairCount;

  const toggleExpand = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    setExpanded(v => !v);
  };

  // Randomized shuffle handler for the right side column
  const handleShuffle = () => {
    const arr = Array.from({ length: item.pairCount }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setRightColumnOrder([...arr]);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View style={[styles.qCard, item.saved && styles.qCardSaved, { borderLeftColor: '#4FC3F7' }]}>

        {/* ── Card Header ── */}
        <TouchableOpacity style={styles.qHeader} onPress={toggleExpand} activeOpacity={0.8}>
          <View style={[styles.qBadge, { backgroundColor: '#E3F2FD' }]}>
            <Text style={[styles.qBadgeText, { color: '#0288D1' }]}>Q{item.number}</Text>
          </View>

          <View style={styles.qHeaderMiddle}>
            <View style={styles.qHeaderTopRow}>
              {item.saved && (
                <View style={styles.savedChip}>
                  <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
                  <Text style={styles.savedChipText}>SAVED</Text>
                </View>
              )}
            </View>
            <Text style={styles.qProgress}>
              {filledPairs}/{item.pairCount} pairs filled
            </Text>
          </View>

          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#90A4AE"
          />
        </TouchableOpacity>

        {/* ── Mini progress bar inside card ── */}
        <View style={styles.cardProgressTrack}>
          <View style={[
            styles.cardProgressFill,
            { width: `${(filledPairs / item.pairCount) * 100}%`, backgroundColor: '#4FC3F7' }
          ]} />
        </View>

        {/* ── Expanded Body ── */}
        {expanded && (
          <View style={styles.qBody}>

            {/* Column labels */}
            <View style={styles.colLabels}>
              <View style={{ width: 28 }} />
              <Text style={[styles.colLabel, { color: '#0288D1' }]}>UPPERCASE</Text>
              <View style={{ width: 26 }} />
              <Text style={[styles.colLabel, { color: '#C2185B' }]}>LOWERCASE</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Pair rows */}
            {item.pairs.map((pair, index) => (
              <PairRow
                key={pair.pairId}
                pair={pair}
                index={index}
                questionId={item.id}
                onUpdate={onUpdate}
              />
            ))}

            {/* Student preview */}
            <StudentPreview 
              pairs={item.pairs} 
              rightColumnOrder={rightColumnOrder} 
              onShuffle={handleShuffle}
            />

            {/* Action buttons */}
            <View style={styles.cardBtnRow}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => onClear(item.id)}>
                <Ionicons name="trash-outline" size={15} color="#FF5252" />
                <Text style={styles.clearBtnText}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, !isComplete && styles.saveBtnDisabled]}
                onPress={() => { if (isComplete) { onSave(item.id); setExpanded(false); } }}
                disabled={!isComplete}
              >
                <LinearGradient
                  colors={isComplete ? ['#0288D1', '#0288D1'] : ['#ECEFF1', '#ECEFF1']}
                  style={styles.saveBtnGrad}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={15}
                    color={isComplete ? 'white' : '#B0BEC5'}
                  />
                  <Text style={[styles.saveBtnText, !isComplete && { color: '#B0BEC5' }]}>
                    Save Question
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {!isComplete && (
              <Text style={styles.incompleteHint}>
                Fill all {item.pairCount} pairs to save this question.
              </Text>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ── Main Screen ────────────────────────────────────────────────────
const LetterRecognition = ({ route, navigation }) => {
  const { roomName } = route.params ?? {};
  const [questions, setQuestions] = useState(() => makeDefault());
  const [publishModal, setPublishModal] = useState(false);

  const totalQuestionsCount = questions.length;
  const savedCount = questions.filter(q => q.saved).length;
  const progressPercent = totalQuestionsCount > 0 ? (savedCount / totalQuestionsCount) * 100 : 0;

  const handleUpdate = (questionId, pairId, field, value) => {
    setQuestions(prev =>
      prev.map(q => q.id !== questionId ? q : {
        ...q,
        saved: false,
        pairs: q.pairs.map(p =>
          p.pairId !== pairId ? p : { ...p, [field]: value }
        ),
      })
    );
  };

  const handleSave = (id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, saved: true } : q));
  };

  const handleClear = (id) => {
    Alert.alert('Clear Question', 'Remove all pairs in this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: () =>
          setQuestions(prev =>
            prev.map(q => q.id === id
              ? { ...q, saved: false, pairs: makePairs(3) }
              : q
            )
          ),
      },
    ]);
  };

  const handleAddQuestion = () => {
    setQuestions(prev => {
      const nextNum = prev.length + 1;
      return [
        ...prev,
        {
          id: `q${nextNum}`,
          number: nextNum,
          pairCount: 3,
          pairs: makePairs(3),
          saved: false,
        }
      ];
    });
  };

  const handlePublish = () => {
    setPublishModal(false);
    Alert.alert('Published! 🎉', `Letter Recognition module for ${roomName} is now live.`);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSub}>{roomName ?? 'Room'}</Text>
            <Text style={styles.headerTitle}>Letter Recognition Module</Text>
          </View>
          <View style={{ width: 45 }} />
        </View>

        {/* ── OVERALL PROGRESS ── */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{savedCount}/{totalQuestionsCount} saved</Text>
        </View>

        {/* ── QUESTION LIST ── */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {questions.map(q => (
            <QuestionCard
              key={q.id}
              item={q}
              onUpdate={handleUpdate}
              onSave={handleSave}
              onClear={handleClear}
            />
          ))}

          {/* ── ADD QUESTION BUTTON ── */}
          <TouchableOpacity style={styles.addQuestionBtn} onPress={handleAddQuestion}>
            <Ionicons name="add-circle" size={20} color="#0288D1" />
            <Text style={styles.addQuestionText}>Add Question</Text>
          </TouchableOpacity>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* ── BOTTOM PUBLISH BAR ── */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomCount}>{savedCount}</Text>
            <Text style={styles.bottomLabel}>/{totalQuestionsCount}</Text>
          </View>
          <TouchableOpacity
            style={[styles.publishBtn, savedCount < 1 && styles.publishDisabled]}
            onPress={() => savedCount > 0 && setPublishModal(true)}
          >
            <LinearGradient
              colors={savedCount > 0 ? ['#81D4FA', '#4FC3F7'] : ['#ECEFF1', '#ECEFF1']}
              style={styles.publishGrad}
            >
              <Ionicons name="rocket-outline" size={18} color={savedCount > 0 ? 'white' : '#B0BEC5'} />
              <Text style={[styles.publishText, savedCount < 1 && { color: '#B0BEC5' }]}>
                Publish Module
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── PUBLISH MODAL ── */}
      <Modal visible={publishModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={['#81D4FA', '#4FC3F7']} style={styles.modalIcon}>
              <Ionicons name="rocket" size={32} color="white" />
            </LinearGradient>
            <Text style={styles.modalTitle}>Publish Module?</Text>
            <Text style={styles.modalSub}>
              {savedCount} question{savedCount !== 1 ? 's' : ''} will go live for students in {roomName}.
            </Text>

            {/* Summary chips */}
            <View style={styles.modalChips}>
              {questions.filter(q => q.saved).map(q => (
                <View key={q.id} style={[styles.modalChip, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={[styles.modalChipText, { color: '#0288D1' }]}>
                    Q{q.number} · 3 pairs
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#F5F5F5' }]}
                onPress={() => setPublishModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: '#546E7A' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={handlePublish}>
                <LinearGradient colors={['#81D4FA', '#4FC3F7']} style={styles.modalBtnGrad}>
                  <Text style={styles.modalBtnText}>Publish</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ── STYLES ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    elevation: 4,
  },
  headerCenter: { alignItems: 'center' },
  headerSub: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 2,
  },

  // Progress
  progressWrapper: {
    paddingHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4FC3F7',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0288D1',
    minWidth: 65,
  },

  scroll: { paddingHorizontal: 18 },

  // Question Card
  qCard: {
    backgroundColor: 'white',
    borderRadius: 22,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    overflow: 'hidden',
    borderLeftWidth: 4,
  },
  qCardSaved: {
    elevation: 2,
    opacity: 0.95,
  },
  qHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  qBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qBadgeText: {
    fontSize: 13,
    fontWeight: '900',
  },
  qHeaderMiddle: { flex: 1 },
  qHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  savedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  savedChipText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#4CAF50',
    letterSpacing: 0.5,
  },
  qProgress: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '700',
  },

  // Card mini progress bar
  cardProgressTrack: {
    height: 3,
    backgroundColor: '#F5F5F5',
  },
  cardProgressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Expanded body
  qBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 12,
  },

  // Column labels
  colLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 0,
  },
  colLabel: {
    flex: 1,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },

  // Pair row
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  pairIndex: {
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pairIndexText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#90A4AE',
  },
  letterInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#F8FBFF',
    borderWidth: 2,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
  },
  pairCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Preview
  previewBox: {
    backgroundColor: '#F8FBFF',
    borderRadius: 14,
    padding: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  previewLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B0BEC5',
    letterSpacing: 1.5,
  },
  miniShuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(120, 144, 156, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  miniShuffleText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#546E7A',
  },
  previewColumns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewCol: {
    gap: 6,
  },
  previewSep: {
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  previewDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CFD8DC',
    marginVertical: 8,
  },
  previewBubbleUpper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#81D4FA',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  previewBubbleLower: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#F48FB1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  previewUpperText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0288D1',
  },
  previewLowerText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F06292',
  },

  // Card buttons
  cardBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFF8F8',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF5252',
  },
  saveBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: 'white',
  },
  incompleteHint: {
    fontSize: 11,
    color: '#B0BEC5',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },

  // Add Question Button style
  addQuestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#0288D1',
    borderStyle: 'dashed',
    borderRadius: 22,
    paddingVertical: 16,
    marginVertical: 12,
    backgroundColor: '#F0F8FF',
  },
  addQuestionText: {
    fontSize: 15,
    fontWeight: '850',
    color: '#0288D1',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 22,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 16,
  },
  bottomCount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0288D1',
  },
  bottomLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.muted,
  },
  publishBtn: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  publishDisabled: { opacity: 0.5 },
  publishGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  publishText: {
    fontSize: 15,
    fontWeight: '900',
    color: 'white',
  },

  // Publish Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 28,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 28,
    alignItems: 'center',
    elevation: 12,
  },
  modalIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalSub: {
    textAlign: 'center',
    color: COLORS.muted,
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  modalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  modalChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalBtnRow: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalBtnGrad: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalBtnText: {
    fontWeight: '900',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 14,
  },
});

export default LetterRecognition;