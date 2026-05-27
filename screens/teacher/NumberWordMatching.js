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

const ACCENT_COLOR = '#E65100'; // Deep Orange accent matching your numeracy card screenshot
const LIGHT_BG = '#FFE0B2';     // Soft peach/cream color matching card background

// ── Default State Builder ─────────────────────────────────────────
const makeDefault = () =>
  Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;

    // Question 1: Matching your exact mockup image values
    if (num === 1) {
      return {
        id: `q${num}`,
        number: num,
        targetNumber: '3',
        correctWord: 'Three',
        distractor1: 'Two',
        distractor2: 'Four',
        saved: true,
      };
    }

    // Question 2: Pre-populated with matching numeric sequence
    if (num === 2) {
      return {
        id: `q${num}`,
        number: num,
        targetNumber: '5',
        correctWord: 'Five',
        distractor1: 'Four',
        distractor2: 'Six',
        saved: true,
      };
    }

    return {
      id: `q${num}`,
      number: num,
      targetNumber: '',
      correctWord: '',
      distractor1: '',
      distractor2: '',
      saved: false,
    };
  });

// ── Student Preview Component (Mocking the provided mockup design) ──
const StudentPreview = ({ 
  targetNumber, 
  correctWord, 
  distractor1, 
  distractor2,
  previewOrder = [0, 1, 2],
  onShuffle
}) => {
  if (!targetNumber && !correctWord && !distractor1 && !distractor2) return null;

  // Map choices to indexes for shuffling visual representation
  const items = [
    { text: distractor1, isCorrect: false }, // Index 0
    { text: correctWord, isCorrect: true },   // Index 1
    { text: distractor2, isCorrect: false }   // Index 2
  ];

  // Rearrange items visually based on current previewOrder
  const renderedChoices = (previewOrder || [0, 1, 2]).map(index => items[index]);

  return (
    <View style={styles.previewBox}>
      {/* Interactive Preview Header */}
      <View style={styles.previewHeaderRow}>
        <Text style={styles.previewLabel}>STUDENT VIEW </Text>
        <TouchableOpacity style={styles.miniShuffleBtn} onPress={onShuffle} activeOpacity={0.7}>
          <Ionicons name="shuffle-outline" size={13} color="#78909C" />
          <Text style={styles.miniShuffleText}>Shuffle Answers</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.studentCard}>
        <Text style={styles.studentCardTitle}>Number Matching</Text>
        
        {/* Large Central Number Container */}
        <View style={styles.numberBubble}>
          <Text style={styles.numberBubbleText}>
            {targetNumber ? targetNumber : '?'}
          </Text>
        </View>

        {/* 3 Vertical Shuffled Choice Buttons */}
        <View style={styles.choicesColumn}>
          {renderedChoices.map((choice, idx) => (
            <View 
              key={idx} 
              style={[
                styles.choiceBtn, 
                choice?.isCorrect && choice?.text ? styles.choiceBtnCorrectPreview : null
              ]}
            >
              <Text style={[styles.choiceText, choice?.isCorrect && choice?.text ? styles.choiceTextCorrect : null]}>
                {choice?.text || `Choice ${idx + 1}`}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// ── Single Question Card ───────────────────────────────────────────
const QuestionCard = ({ item, onUpdate, onSave, onClear }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(item.number === 1);
  
  // Local state to keep track of visual choice shuffle indices
  const [previewOrder, setPreviewOrder] = useState([0, 1, 2]);

  const isComplete =
    item.targetNumber.trim() &&
    item.correctWord.trim() &&
    item.distractor1.trim() &&
    item.distractor2.trim();

  const toggleExpand = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    setExpanded(v => !v);
  };

  // Randomized shuffle handler for choices
  const handleShuffle = () => {
    const arr = [0, 1, 2];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setPreviewOrder([...arr]);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View style={[styles.qCard, item.saved && styles.qCardSaved]}>
        
        {/* Card Header */}
        <TouchableOpacity style={styles.qHeader} onPress={toggleExpand} activeOpacity={0.8}>
          <View style={[styles.qBadge, { backgroundColor: LIGHT_BG }]}>
            <Text style={[styles.qBadgeText, { color: ACCENT_COLOR }]}>Q{item.number}</Text>
          </View>

          <View style={styles.qHeaderMiddle}>
            <View style={styles.qHeaderTopRow}>
              <View style={[styles.diffBadge, { backgroundColor: LIGHT_BG }]}>
                <Text style={[styles.diffBadgeText, { color: ACCENT_COLOR }]}>3 CHOICES</Text>
              </View>
              {item.saved && (
                <View style={styles.savedChip}>
                  <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
                  <Text style={styles.savedChipText}>SAVED</Text>
                </View>
              )}
            </View>
            <Text style={styles.qProgress}>
              {item.targetNumber ? `Number: "${item.targetNumber}"` : 'No Number'} •{' '}
              {[item.correctWord, item.distractor1, item.distractor2].filter(Boolean).length}/3 words
            </Text>
          </View>

          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#90A4AE"
          />
        </TouchableOpacity>

        {/* Card Mini Progress Bar */}
        <View style={styles.cardProgressTrack}>
          <View
            style={[
              styles.cardProgressFill,
              {
                width: `${
                  ((item.targetNumber.trim() ? 1 : 0) +
                    [item.correctWord, item.distractor1, item.distractor2].filter(Boolean).length) *
                  25
                }%`,
              },
            ]}
          />
        </View>

        {/* Expanded Body */}
        {expanded && (
          <View style={styles.qBody}>
            
            {/* Step 1: Target Number (Digit) */}
            <Text style={styles.sectionHeading}>STEP 1: TARGET NUMBER (DIGIT OR NUMERAL)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.numInput]}
                value={item.targetNumber}
                onChangeText={t => onUpdate(item.id, 'targetNumber', t)}
                placeholder=""
                placeholderTextColor="#90A4AE"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            {/* Step 2: Written Number Words */}
            <Text style={styles.sectionHeading}>STEP 2: ADD CHOICES</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correct Word</Text>
              <TextInput
                style={[styles.input, styles.inputCorrect]}
                value={item.correctWord}
                onChangeText={t => onUpdate(item.id, 'correctWord', t)}
                placeholder=""
                placeholderTextColor="#90A4AE"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Distractor Option 1</Text>
              <TextInput
                style={styles.input}
                value={item.distractor1}
                onChangeText={t => onUpdate(item.id, 'distractor1', t)}
                placeholder=""
                placeholderTextColor="#90A4AE"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Distractor Option 2</Text>
              <TextInput
                style={styles.input}
                value={item.distractor2}
                onChangeText={t => onUpdate(item.id, 'distractor2', t)}
                placeholder=""
                placeholderTextColor="#90A4AE"
              />
            </View>

            {/* Student Live Preview Component with Shuffling capability */}
            <StudentPreview
              targetNumber={item.targetNumber}
              correctWord={item.correctWord}
              distractor1={item.distractor1}
              distractor2={item.distractor2}
              previewOrder={previewOrder}
              onShuffle={handleShuffle}
            />

            {/* Action Buttons */}
            <View style={styles.cardBtnRow}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => onClear(item.id)}>
                <Ionicons name="trash-outline" size={15} color="#FF5252" />
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, !isComplete && styles.saveBtnDisabled]}
                onPress={() => {
                  if (isComplete) {
                    onSave(item.id);
                    setExpanded(false);
                  }
                }}
                disabled={!isComplete}
              >
                <LinearGradient
                  colors={isComplete ? [ACCENT_COLOR, '#D84315'] : ['#ECEFF1', '#ECEFF1']}
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
                Add the digit and fill all choices to save.
              </Text>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ── Main Screen ────────────────────────────────────────────────────
const NumberWordMatching = ({ route, navigation }) => {
  const { roomName } = route.params ?? {};
  const [questions, setQuestions] = useState(() => makeDefault());
  const [publishModal, setPublishModal] = useState(false);

  const totalQuestionsCount = questions.length;
  const savedCount = (questions || []).filter(q => q?.saved).length;
  const progressPercent = totalQuestionsCount > 0 ? (savedCount / totalQuestionsCount) * 100 : 0;

  const handleUpdate = (questionId, field, value) => {
    setQuestions(prev =>
      (prev || []).map(q =>
        q?.id !== questionId
          ? q
          : { ...q, saved: false, [field]: value }
      )
    );
  };

  const handleSave = (id) => {
    setQuestions(prev => (prev || []).map(q => (q?.id === id ? { ...q, saved: true } : q)));
  };

  const handleClear = (id) => {
    Alert.alert('Clear Question', 'Erase digit and all written word choices?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () =>
          setQuestions(prev =>
            (prev || []).map(q =>
              q?.id === id
                ? {
                    ...q,
                    saved: false,
                    targetNumber: '',
                    correctWord: '',
                    distractor1: '',
                    distractor2: '',
                  }
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
          targetNumber: '',
          correctWord: '',
          distractor1: '',
          distractor2: '',
          saved: false,
        }
      ];
    });
  };

  const handlePublish = () => {
    setPublishModal(false);
    Alert.alert('Published! 🎉', `Number matching module for ${roomName || 'Room'} is now live.`);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSub}>{roomName ?? 'Room'}</Text>
            <Text style={styles.headerTitle}>Number Matching Module</Text>
          </View>
          <View style={{ width: 45 }} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{savedCount}/{totalQuestionsCount} saved</Text>
        </View>

        {/* Scrollable list of questions */}
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {(questions || []).map(q => (
            <QuestionCard
              key={q?.id}
              item={q}
              onUpdate={handleUpdate}
              onSave={handleSave}
              onClear={handleClear}
            />
          ))}

          {/* ── ADD QUESTION BUTTON ── */}
          <TouchableOpacity style={styles.addQuestionBtn} onPress={handleAddQuestion}>
            <Ionicons name="add-circle" size={20} color={ACCENT_COLOR} />
            <Text style={styles.addQuestionText}>Add Question</Text>
          </TouchableOpacity>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Navigation Publish Area */}
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
              colors={savedCount > 0 ? [ACCENT_COLOR, '#D84315'] : ['#ECEFF1', '#ECEFF1']}
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

      {/* Publish Confirmation Modal */}
      <Modal visible={publishModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={[ACCENT_COLOR, '#D84315']} style={styles.modalIcon}>
              <Ionicons name="rocket" size={32} color="white" />
            </LinearGradient>
            <Text style={styles.modalTitle}>Publish Module?</Text>
            <Text style={styles.modalSub}>
              {savedCount} number matching question{savedCount !== 1 ? 's' : ''} will go live in{' '}
              {roomName || 'Room'}.
            </Text>

            {/* Summary chips */}
            <View style={styles.modalChips}>
              {questions.filter(q => q.saved).map(q => (
                <View key={q.id} style={[styles.modalChip, { backgroundColor: LIGHT_BG }]}>
                  <Text style={[styles.modalChipText, { color: ACCENT_COLOR }]}>
                    Q{q.number} · 3 choices
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
                <LinearGradient colors={[ACCENT_COLOR, '#D84315']} style={styles.modalBtnGrad}>
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

  // Progress Bar
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
    backgroundColor: ACCENT_COLOR,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '800',
    color: ACCENT_COLOR,
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
    borderLeftColor: ACCENT_COLOR,
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
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  diffBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
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

  cardProgressTrack: {
    height: 3,
    backgroundColor: '#F5F5F5',
  },
  cardProgressFill: {
    height: '100%',
    backgroundColor: ACCENT_COLOR,
  },

  qBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.muted,
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 8,
  },

  // Number Input
  numInput: {
    height: 48,
    backgroundColor: '#F8FBFF',
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },

  // Text Inputs
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78909C',
    marginBottom: 4,
  },
  input: {
    height: 48,
    backgroundColor: '#F8FBFF',
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  inputCorrect: {
    borderColor: ACCENT_COLOR,    // MATCHED: correct answer input border color
    backgroundColor: '#FFF3E0',   // Soft light peach/orange background
  },

  // Student Preview Component
  previewBox: {
    backgroundColor: '#ECEFF1',
    borderRadius: 18,
    padding: 14,
    marginVertical: 14,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  previewLabel: {
    fontSize: 9,
    fontWeight: '850',
    color: '#78909C',
    letterSpacing: 1.2,
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
  studentCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  studentCardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1565C0',
    marginBottom: 12,
  },
  numberBubble: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#E3F2FD',
    backgroundColor: '#F8FBFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  numberBubbleText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1565C0',
  },
  choicesColumn: {
    width: '100%',
    gap: 8,
  },
  choiceBtn: {
    width: '100%',
    height: 44,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1E8FC',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceBtnCorrectPreview: {
    borderColor: ACCENT_COLOR,    // MATCHED: correct preview border color (instead of green)
    backgroundColor: '#FFF3E0',   // Soft matching background (instead of green)
  },
  choiceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#37474F',
  },
  choiceTextCorrect: {
    color: ACCENT_COLOR,          // MATCHED: correct preview text color (instead of green)
  },

  // Action Buttons
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
    borderColor: ACCENT_COLOR,
    borderStyle: 'dashed',
    borderRadius: 22,
    paddingVertical: 16,
    marginVertical: 12,
    backgroundColor: '#FFF8F1', // Soft matching orange highlight
  },
  addQuestionText: {
    fontSize: 15,
    fontWeight: '850',
    color: ACCENT_COLOR,
  },

  // Bottom Publish Navigation Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    color: ACCENT_COLOR,
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

  // Modal styling
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
    marginBottom: 20,
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

export default NumberWordMatching;