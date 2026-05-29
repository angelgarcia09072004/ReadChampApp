import React, { useState, useRef, useEffect } from 'react';
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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../theme';

// ── New Color Theme Configuration ──────────────────────────────────
const ACCENT_COLOR = '#FFD54F';   // Requested Gold Accent
const CHARCOAL = '#37474F';       // Requested Charcoal
const CHARCOAL_LIGHT = '#263238'; // Requested Dark Charcoal
const GOLD_DARK = '#D4AF37';      // Legible gold shade for text on light backgrounds
const PROGRESS_COLOR = '#FFD54F';  // Gold progress fill

// ── Default State Builder ──────────────────────────────────────────
const makeDefaultStory = () => [
  {
    id: 'story_1',
    number: 1,
    title: 'Ben and the Red Ball',
    sentences: [
      { id: 's1', text: 'Ben has a red ball.', illustrationUri: null, vocabWords: ['red', 'ball.'] },
      { id: 's2', text: 'He played outside today.', illustrationUri: null, vocabWords: ['played', 'outside'] },
      { id: 's3', text: 'The ball bounced high.', illustrationUri: null, vocabWords: ['bounced', 'high.'] },
    ],
    quizzes: [
      { id: 'q1', type: 'picture_comp', question: "What color is Ben's ball?", choices: ['Blue', 'Red', 'Green'], correctIndex: 1 },
      { id: 'q2', type: 'sequence', question: 'What happened first?', choices: ['Ben found the ball', 'Ben played outside', 'Ben smiled'], correctIndex: 1 },
      { id: 'q3', type: 'vocab_match', question: 'Which picture shows BALL?', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 1 },
      { id: 'q4', type: 'read_aloud', targetSentence: 'Ben has a red ball.' },
    ],
    saved: true,
  },
  {
    id: 'story_2',
    number: 2,
    title: 'The Little Yellow Bird',
    sentences: [
      { id: 's1', text: 'A little bird sang a sweet song.', illustrationUri: null, vocabWords: ['bird', 'sang', 'song.'] },
      { id: 's2', text: 'It sat on a tall green tree.', illustrationUri: null, vocabWords: ['tall', 'green', 'tree.'] },
      { id: 's3', text: 'It flew high up in the blue sky.', illustrationUri: null, vocabWords: ['flew', 'blue', 'sky.'] },
    ],
    quizzes: [
      { id: 'q1', type: 'picture_comp', question: 'What color was the bird?', choices: ['Blue', 'Yellow', 'Red'], correctIndex: 1 },
      { id: 'q2', type: 'sequence', question: 'What did the bird do first?', choices: ['It flew away', 'It sang a song', 'It slept'], correctIndex: 1 },
      { id: 'q3', type: 'vocab_match', question: 'Which picture shows TREE?', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 1 },
      { id: 'q4', type: 'read_aloud', targetSentence: 'A little bird sang a sweet song.' },
    ],
    saved: true,
  },
  ...Array.from({ length: 8 }, (_, i) => {
    const num = i + 3;
    return {
      id: `story_${num}`,
      number: num,
      title: '',
      sentences: [
        { id: 's1', text: '', illustrationUri: null, vocabWords: [] },
        { id: 's2', text: '', illustrationUri: null, vocabWords: [] },
        { id: 's3', text: '', illustrationUri: null, vocabWords: [] },
      ],
      quizzes: [
        { id: 'q1', type: 'picture_comp', question: '', choices: ['', '', ''], correctIndex: 0 },
        { id: 'q2', type: 'sequence', question: '', choices: ['', '', ''], correctIndex: 0 },
        { id: 'q3', type: 'vocab_match', question: '', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 0 },
        { id: 'q4', type: 'read_aloud', targetSentence: '' },
      ],
      saved: false,
    };
  }),
];

// ── Student Book Preview ───────────────────────────────────────────
const StudentPreview = ({ title, sentences }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const activeSentence = sentences?.[currentPage];

  React.useEffect(() => { setCurrentPage(0); }, [sentences]);

  if (!activeSentence) return null;
  const words = (activeSentence.text || '').split(' ').filter(Boolean);

  return (
    <View style={styles.previewBox}>
      <View style={styles.previewLabelRow}>
        <View style={styles.previewLabelLine} />
        <Text style={styles.previewLabel}>STUDENT VIEW PREVIEW</Text>
        <View style={styles.previewLabelLine} />
      </View>

      <View style={styles.studentCard}>
        <LinearGradient colors={[CHARCOAL, CHARCOAL_LIGHT]} style={styles.studentCardHeader}>
          <Text style={styles.studentStoryTitle}>"{title || 'Untitled Story'}"</Text>
        </LinearGradient>

        <View style={styles.studentCardBody}>
          <View style={styles.studentIllustrationBox}>
            {activeSentence.illustrationUri ? (
              <Image source={{ uri: activeSentence.illustrationUri }} style={styles.studentImage} />
            ) : (
              <View style={styles.placeholderBox}>
                <View style={styles.placeholderIconWrap}>
                  <Ionicons name="image-outline" size={28} color={ACCENT_COLOR} />
                </View>
                <Text style={styles.placeholderText}>Page {currentPage + 1} Illustration</Text>
              </View>
            )}
          </View>

          <View style={styles.sentenceWordsRow}>
            {words.length > 0 ? (
              words.map((word, idx) => {
                const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
                const isVocab = activeSentence.vocabWords?.some(
                  v => v.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') === cleanWord
                );
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.wordBubble, isVocab && styles.vocabWordBubble]}
                    onPress={() => Alert.alert('AI Voice', `Reading: "${cleanWord}"`)}
                  >
                    <Text style={[styles.wordText, isVocab && styles.vocabWordText]}>{word}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.noSentenceText}>No sentence text typed yet.</Text>
            )}
          </View>

          <View style={styles.aiVoiceRow}>
            <View style={styles.aiVoiceIconWrap}>
              <Ionicons name="volume-high-outline" size={14} color={ACCENT_COLOR} />
            </View>
            <Text style={styles.aiVoiceText}>AI Voice reads this sentence aloud</Text>
          </View>

          <View style={styles.bookNavRow}>
            <TouchableOpacity
              disabled={currentPage === 0}
              onPress={() => setCurrentPage(p => Math.max(0, p - 1))}
              style={[styles.bookNavBtn, currentPage === 0 && { opacity: 0.3 }]}
            >
              <Ionicons name="arrow-back" size={18} color={CHARCOAL} />
            </TouchableOpacity>
            <View style={styles.pageCountBadge}>
              <Text style={styles.pageCountText}>{currentPage + 1} / {sentences.length}</Text>
            </View>
            <TouchableOpacity
              disabled={currentPage === sentences.length - 1}
              onPress={() => setCurrentPage(p => Math.min(sentences.length - 1, p + 1))}
              style={[styles.bookNavBtn, currentPage === sentences.length - 1 && { opacity: 0.3 }]}
            >
              <Ionicons name="arrow-forward" size={18} color={CHARCOAL} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// ── Question Card ──────────────────────────────────────────────────
const QuestionCard = ({ item, onSave, onClear }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(item.number === 1);
  const [draftStory, setDraftStory] = useState(item);

  useEffect(() => { setDraftStory(item); }, [item]);

  const isSentencesValid = draftStory.sentences.length >= 3 && draftStory.sentences.length <= 6;
  const isTitleValid = draftStory.title.trim().length > 0;
  const isComplete = isSentencesValid && isTitleValid;

  const toggleExpand = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    setExpanded(v => !v);
  };

  const handleUpdateTitle = text => setDraftStory(prev => ({ ...prev, title: text }));

  const handleUpdateSentenceText = (id, text) =>
    setDraftStory(prev => ({
      ...prev,
      sentences: prev.sentences.map(s => s.id === id ? { ...s, text, vocabWords: [] } : s),
    }));

  const handleToggleVocab = (sentenceId, word) =>
    setDraftStory(prev => ({
      ...prev,
      sentences: prev.sentences.map(s => {
        if (s.id !== sentenceId) return s;
        const exists = s.vocabWords.includes(word);
        return { ...s, vocabWords: exists ? s.vocabWords.filter(v => v !== word) : [...s.vocabWords, word] };
      }),
    }));

  const handlePickIllustration = async id => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need photo library access to upload illustrations.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setDraftStory(prev => ({
        ...prev,
        sentences: prev.sentences.map(s => s.id === id ? { ...s, illustrationUri: result.assets[0].uri } : s),
      }));
    }
  };

  const handleAddSentence = () => {
    if (draftStory.sentences.length >= 6) {
      Alert.alert('Limit Reached', 'Stories are limited to a maximum of 6 sentences.');
      return;
    }
    const newId = `s${Date.now()}`;
    setDraftStory(prev => ({
      ...prev,
      sentences: [...prev.sentences, { id: newId, text: '', illustrationUri: null, vocabWords: [] }],
    }));
  };

  const handleRemoveSentence = id => {
    if (draftStory.sentences.length <= 3) {
      Alert.alert('Required Length', 'Stories must contain at least 3 sentences.');
      return;
    }
    setDraftStory(prev => ({ ...prev, sentences: prev.sentences.filter(s => s.id !== id) }));
  };

  const handleUpdateQuizText = (index, field, value) =>
    setDraftStory(prev => {
      const copy = [...prev.quizzes];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, quizzes: copy };
    });

  const handlePickQuizImage = async (index, choiceKey) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setDraftStory(prev => {
        const copy = [...prev.quizzes];
        copy[index] = { ...copy[index], [choiceKey]: result.assets[0].uri };
        return { ...prev, quizzes: copy };
      });
    }
  };

  const handleShuffleQuizChoices = quizIndex => {
    const quiz = draftStory.quizzes[quizIndex];
    if (!quiz) return;
    if (quiz.type === 'picture_comp' || quiz.type === 'sequence') {
      const originalChoices = [...quiz.choices];
      const correctItem = originalChoices[quiz.correctIndex];
      const shuffledChoices = [...originalChoices];
      for (let i = shuffledChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
      }
      const newCorrectIndex = shuffledChoices.indexOf(correctItem);
      setDraftStory(prev => {
        const copy = [...prev.quizzes];
        copy[quizIndex] = { ...copy[quizIndex], choices: shuffledChoices, correctIndex: newCorrectIndex };
        return { ...prev, quizzes: copy };
      });
    } else if (quiz.type === 'vocab_match') {
      const originalItems = [
        { uri: quiz.choice1Uri, index: 0 },
        { uri: quiz.choice2Uri, index: 1 },
        { uri: quiz.choice3Uri, index: 2 },
      ];
      const shuffled = [...originalItems];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const newCorrectIndex = shuffled.findIndex(x => x.index === quiz.correctIndex);
      setDraftStory(prev => {
        const copy = [...prev.quizzes];
        copy[quizIndex] = {
          ...copy[quizIndex],
          choice1Uri: shuffled[0].uri,
          choice2Uri: shuffled[1].uri,
          choice3Uri: shuffled[2].uri,
          correctIndex: newCorrectIndex,
        };
        return { ...prev, quizzes: copy };
      });
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale }], marginBottom: 14 }}>
      <View style={styles.qCard}>
        {/* Light Header */}
        <View style={styles.qHeader}>
          <TouchableOpacity onPress={toggleExpand} activeOpacity={0.85} style={styles.qHeaderTouchable}>
            <View style={styles.qBadge}>
              <Text style={styles.qBadgeText}>Q{item.number}</Text>
            </View>
            <View style={styles.qHeaderMiddle}>
              {item.saved && (
                <View style={styles.savedChip}>
                  <Ionicons name="checkmark-circle" size={11} color="#4CAF50" />
                  <Text style={styles.savedChipText}>SAVED</Text>
                </View>
              )}
              <Text style={styles.qProgress} numberOfLines={1}>
                {draftStory.title ? `"${draftStory.title}"` : 'No Title'} · {draftStory.sentences.length} pages
              </Text>
            </View>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={GOLD_DARK} />
          </TouchableOpacity>

          {/* Gold progress strip */}
          <View style={styles.cardProgressTrack}>
            <View style={[styles.cardProgressFill, { width: isComplete ? '100%' : '20%' }]} />
          </View>
        </View>

        {/* Expanded Body */}
        {expanded && (
          <View style={styles.qBody}>
            {/* Story Title */}
            <Text style={styles.sectionHeading}>STORY TITLE</Text>
            <View style={styles.metaCard}>
              <TextInput
                style={styles.titleInput}
                value={draftStory.title}
                onChangeText={handleUpdateTitle}
                placeholder=""
                placeholderTextColor="#90A4AE"
              />
            </View>

            {/* Pages Builder */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>STORY PAGES ({draftStory.sentences.length}/6)</Text>
              <TouchableOpacity style={styles.addPageBtn} onPress={handleAddSentence}>
                <Ionicons name="add-circle" size={17} color={CHARCOAL} />
                <Text style={styles.addPageText}>Add Page</Text>
              </TouchableOpacity>
            </View>

            {draftStory.sentences.map((sentence, sIdx) => (
              <View key={sentence.id} style={styles.pageEditorCard}>
                <View style={styles.pageEditorCardHeader}>
                  <View style={styles.pageNumberBadge}>
                    <Text style={styles.pageNumberBadgeText}>PG {sIdx + 1}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveSentence(sentence.id)}>
                    <Ionicons name="close-circle" size={20} color="#FF5252" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Sentence Text</Text>
                <TextInput
                  style={styles.sentenceInput}
                  value={sentence.text}
                  onChangeText={t => handleUpdateSentenceText(sentence.id, t)}
                  placeholder="Type sentence here..."
                  placeholderTextColor="#90A4AE"
                  multiline
                />

                <View style={styles.aiVoiceNotice}>
                  <Ionicons name="volume-high-outline" size={13} color={GOLD_DARK} />
                  <Text style={styles.aiVoiceNoticeText}>AI voice will read this sentence automatically</Text>
                </View>

                {sentence.text.trim().length > 0 && (
                  <View style={styles.vocabSelectorWrapper}>
                    <Text style={styles.helperText}>Tap words to mark as vocabulary:</Text>
                    <View style={styles.chipsRow}>
                      {sentence.text.split(' ').filter(Boolean).map((word, wordIdx) => {
                        const isHighlighted = sentence.vocabWords.includes(word);
                        return (
                          <TouchableOpacity
                            key={wordIdx}
                            onPress={() => handleToggleVocab(sentence.id, word)}
                            style={[styles.wordChip, isHighlighted && styles.wordChipActive]}
                          >
                            <Text style={[styles.wordChipText, isHighlighted && styles.wordChipTextActive]}>
                              {word}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.assetPicker, sentence.illustrationUri && styles.assetPickerActive]}
                  onPress={() => handlePickIllustration(sentence.id)}
                >
                  <Ionicons name="image" size={17} color={sentence.illustrationUri ? '#4CAF50' : CHARCOAL_LIGHT} />
                  <Text style={styles.assetPickerText}>
                    {sentence.illustrationUri ? 'Illustration Added ✓' : 'Add Page Illustration'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <StudentPreview title={draftStory.title} sentences={draftStory.sentences} />

            {/* Quiz Section */}
            <Text style={styles.sectionHeading}>CONNECTED QUIZ MANAGEMENT</Text>

            {/* Quiz 1 */}
            <View style={styles.quizCard}>
              <View style={styles.quizCardHeader}>
                <View style={styles.quizHeaderLeft}>
                  <Ionicons name="help-circle" size={16} color={GOLD_DARK} />
                  <Text style={styles.quizTypeLabel}>1. PICTURE COMPREHENSION</Text>
                </View>
                <TouchableOpacity style={styles.miniShuffleBtn} onPress={() => handleShuffleQuizChoices(0)}>
                  <Ionicons name="shuffle-outline" size={11} color={GOLD_DARK} />
                  <Text style={styles.miniShuffleText}>Shuffle</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quizCardBody}>
                <TextInput
                  style={styles.quizQuestionInput}
                  value={draftStory.quizzes[0]?.question}
                  onChangeText={t => handleUpdateQuizText(0, 'question', t)}
                  placeholder="Question (e.g. What color is Ben's ball?)"
                  placeholderTextColor="#90A4AE"
                />
                {draftStory.quizzes[0]?.choices.map((choice, cIdx) => (
                  <View key={cIdx} style={styles.choiceInputRow}>
                    <TouchableOpacity onPress={() => handleUpdateQuizText(0, 'correctIndex', cIdx)}>
                      <Ionicons
                        name={draftStory.quizzes[0].correctIndex === cIdx ? 'checkmark-circle' : 'ellipse-outline'}
                        size={20}
                        color={draftStory.quizzes[0].correctIndex === cIdx ? GOLD_DARK : '#B0BEC5'}
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={[styles.miniTextInput, draftStory.quizzes[0].correctIndex === cIdx && styles.correctBorderColor]}
                      value={choice}
                      onChangeText={t => {
                        const updatedChoices = [...draftStory.quizzes[0].choices];
                        updatedChoices[cIdx] = t;
                        handleUpdateQuizText(0, 'choices', updatedChoices);
                      }}
                      placeholder={`Choice ${cIdx + 1}`}
                      placeholderTextColor="#90A4AE"
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Quiz 2 */}
            <View style={styles.quizCard}>
              <View style={styles.quizCardHeader}>
                <View style={styles.quizHeaderLeft}>
                  <Ionicons name="list" size={16} color={GOLD_DARK} />
                  <Text style={styles.quizTypeLabel}>2. SEQUENCE QUIZ</Text>
                </View>
                <TouchableOpacity style={styles.miniShuffleBtn} onPress={() => handleShuffleQuizChoices(1)}>
                  <Ionicons name="shuffle-outline" size={11} color={GOLD_DARK} />
                  <Text style={styles.miniShuffleText}>Shuffle</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quizCardBody}>
                <TextInput
                  style={styles.quizQuestionInput}
                  value={draftStory.quizzes[1]?.question}
                  onChangeText={t => handleUpdateQuizText(1, 'question', t)}
                  placeholder="Instruction (e.g. What happened first?)"
                  placeholderTextColor="#90A4AE"
                />
                {draftStory.quizzes[1]?.choices.map((choice, cIdx) => (
                  <View key={cIdx} style={styles.choiceInputRow}>
                    <TouchableOpacity
                      style={[styles.sequenceIndexWrapper, draftStory.quizzes[1].correctIndex === cIdx && styles.sequenceIndexWrapperActive]}
                      onPress={() => handleUpdateQuizText(1, 'correctIndex', cIdx)}
                    >
                      <Text style={[styles.sequenceIndexText, draftStory.quizzes[1].correctIndex === cIdx && styles.sequenceIndexTextActive]}>
                        {cIdx + 1}
                      </Text>
                    </TouchableOpacity>
                    <TextInput
                      style={[styles.miniTextInput, draftStory.quizzes[1].correctIndex === cIdx && styles.correctBorderColor]}
                      value={choice}
                      onChangeText={t => {
                        const updatedChoices = [...draftStory.quizzes[1].choices];
                        updatedChoices[cIdx] = t;
                        handleUpdateQuizText(1, 'choices', updatedChoices);
                      }}
                      placeholder={`Event ${cIdx + 1}`}
                      placeholderTextColor="#90A4AE"
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Quiz 3 */}
            <View style={styles.quizCard}>
              <View style={styles.quizCardHeader}>
                <View style={styles.quizHeaderLeft}>
                  <Ionicons name="images-outline" size={16} color={GOLD_DARK} />
                  <Text style={styles.quizTypeLabel}>3. VOCABULARY MATCH</Text>
                </View>
                <TouchableOpacity style={styles.miniShuffleBtn} onPress={() => handleShuffleQuizChoices(2)}>
                  <Ionicons name="shuffle-outline" size={11} color={GOLD_DARK} />
                  <Text style={styles.miniShuffleText}>Shuffle</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quizCardBody}>
                <TextInput
                  style={styles.quizQuestionInput}
                  value={draftStory.quizzes[2]?.question}
                  onChangeText={t => handleUpdateQuizText(2, 'question', t)}
                  placeholder="Question (e.g. Which picture shows BALL?)"
                  placeholderTextColor="#90A4AE"
                />
                <View style={styles.vocabMatchPickersRow}>
                  {['choice1Uri', 'choice2Uri', 'choice3Uri'].map((key, idx) => {
                    const uri = draftStory.quizzes[2]?.[key];
                    const isCorrect = draftStory.quizzes[2]?.correctIndex === idx;
                    return (
                      <View key={idx} style={styles.vocabPickerWrapper}>
                        <TouchableOpacity
                          style={[styles.vocabRadioBtn, isCorrect && styles.vocabRadioBtnActive]}
                          onPress={() => handleUpdateQuizText(2, 'correctIndex', idx)}
                        >
                          <Ionicons name="checkmark" size={10} color={CHARCOAL} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.vocabPickerBox, isCorrect && styles.vocabPickerBoxCorrect]}
                          onPress={() => handlePickQuizImage(2, key)}
                        >
                          {uri ? (
                            <Image source={{ uri }} style={styles.vocabPickerImage} />
                          ) : (
                            <Ionicons name="add" size={24} color="#90A4AE" />
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Quiz 4 */}
            <View style={styles.quizCard}>
              <View style={styles.quizCardHeader}>
                <View style={styles.quizHeaderLeft}>
                  <Ionicons name="mic-outline" size={16} color={GOLD_DARK} />
                  <Text style={styles.quizTypeLabel}>4. READ ALOUD CHALLENGE</Text>
                </View>
              </View>
              <View style={styles.quizCardBody}>
                <TextInput
                  style={styles.quizQuestionInput}
                  value={draftStory.quizzes[3]?.targetSentence}
                  onChangeText={t => handleUpdateQuizText(3, 'targetSentence', t)}
                  placeholder="Target Sentence (e.g. Ben has a red ball.)"
                  placeholderTextColor="#90A4AE"
                />
              </View>
            </View>

            {/* ── Action Buttons ── */}
            <View style={styles.cardBtnRow}>
              {/* Clear Button */}
              <TouchableOpacity style={styles.clearBtn} onPress={() => onClear(item.id)}>
                <Ionicons name="trash-outline" size={15} color="#E53935" />
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>

              {/* Save Button — dark/gold when ready */}
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  if (isComplete) {
                    onSave(item.id, draftStory);
                    setExpanded(false);
                  }
                }}
                disabled={!isComplete}
              >
                {isComplete ? (
                  <LinearGradient
                    colors={[CHARCOAL, CHARCOAL_LIGHT]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveBtnInner}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={ACCENT_COLOR} />
                    <Text style={styles.saveBtnTextActive}>Save Question</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.saveBtnInnerDisabled}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#B0BEC5" />
                    <Text style={styles.saveBtnTextDisabled}>Save Question</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {!isComplete && (
              <Text style={styles.incompleteHint}>Add a title and fill all pages to save.</Text>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ── Main Screen ────────────────────────────────────────────────────
const Storytelling = ({ route, navigation }) => {
  const { roomName } = route.params ?? {};
  const [storyList, setStoryList] = useState(() => makeDefaultStory());
  const [publishModal, setPublishModal] = useState(false);

  const totalStoriesCount = storyList.length;
  const savedCount = storyList.filter(s => s.saved).length;
  const progressPercent = totalStoriesCount > 0 ? (savedCount / totalStoriesCount) * 100 : 0;

  const handleSaveStory = (id, updatedDraft) =>
    setStoryList(prev => prev.map(s => s.id === id ? { ...updatedDraft, saved: true } : s));

  const handleClearStory = id => {
    Alert.alert('Clear Story', 'Erase title, pages and quizzes in this story?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: () =>
          setStoryList(prev =>
            prev.map(s => s.id === id ? {
              ...s, saved: false, title: '',
              sentences: [
                { id: 's1', text: '', illustrationUri: null, vocabWords: [] },
                { id: 's2', text: '', illustrationUri: null, vocabWords: [] },
                { id: 's3', text: '', illustrationUri: null, vocabWords: [] },
              ],
              quizzes: [
                { id: 'q1', type: 'picture_comp', question: '', choices: ['', '', ''], correctIndex: 0 },
                { id: 'q2', type: 'sequence', question: '', choices: ['', '', ''], correctIndex: 0 },
                { id: 'q3', type: 'vocab_match', question: '', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 0 },
                { id: 'q4', type: 'read_aloud', targetSentence: '' },
              ],
            } : s)
          ),
      },
    ]);
  };

  const handleAddStory = () => {
    setStoryList(prev => {
      const nextNum = prev.length + 1;
      return [...prev, {
        id: `story_${nextNum}`, number: nextNum, title: '',
        sentences: [
          { id: 's1', text: '', illustrationUri: null, vocabWords: [] },
          { id: 's2', text: '', illustrationUri: null, vocabWords: [] },
          { id: 's3', text: '', illustrationUri: null, vocabWords: [] },
        ],
        quizzes: [
          { id: 'q1', type: 'picture_comp', question: '', choices: ['', '', ''], correctIndex: 0 },
          { id: 'q2', type: 'sequence', question: '', choices: ['', '', ''], correctIndex: 0 },
          { id: 'q3', type: 'vocab_match', question: '', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 0 },
          { id: 'q4', type: 'read_aloud', targetSentence: '' },
        ],
        saved: false,
      }];
    });
  };

  const handlePublish = () => {
    setPublishModal(false);
    Alert.alert('Published! 🎉', `Storytelling module is now live in ${roomName || 'Room'}.`);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {/* Clean background gradient matching sound module light layout */}
      <LinearGradient colors={['#F8FAFC', '#FFFDF4', '#F1F5F9']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        {/* Light Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={CHARCOAL} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSub}>{roomName ?? 'Room'}</Text>
            <Text style={styles.headerTitle}>Storytelling Module</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* ── Progress Bar ── */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            <Text style={styles.progressCountText}>{savedCount}</Text>
            <Text style={styles.progressTotalText}>/{totalStoriesCount} saved</Text>
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {storyList.map(s => (
            <QuestionCard key={s.id} item={s} onSave={handleSaveStory} onClear={handleClearStory} />
          ))}

          {/* Outlined clean Add Button */}
          <TouchableOpacity style={styles.addQuestionBtn} onPress={handleAddStory}>
            <View style={styles.addQuestionGrad}>
              <Ionicons name="add-circle" size={20} color={GOLD_DARK} />
              <Text style={styles.addQuestionText}>Add Story</Text>
            </View>
          </TouchableOpacity>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Bar — Slate with clean gold accent publish button */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomCount}>{savedCount}</Text>
            <Text style={styles.bottomLabel}>/{totalStoriesCount}</Text>
          </View>
          <TouchableOpacity
            style={[styles.publishBtn, savedCount < 1 && styles.publishDisabled]}
            onPress={() => savedCount > 0 && setPublishModal(true)}
          >
            <LinearGradient
              colors={savedCount > 0 ? [CHARCOAL, CHARCOAL_LIGHT] : ['#E2E8F0', '#E2E8F0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.publishGrad}
            >
              <Ionicons name="rocket-outline" size={18} color={savedCount > 0 ? ACCENT_COLOR : '#94A3B8'} />
              <Text style={[styles.publishText, savedCount > 0 ? { color: ACCENT_COLOR } : { color: '#94A3B8' }]}>
                Publish Module
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Publish Modal */}
      <Modal visible={publishModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={[CHARCOAL, CHARCOAL_LIGHT]} style={styles.modalIcon}>
              <Ionicons name="book" size={30} color={ACCENT_COLOR} />
            </LinearGradient>
            <Text style={styles.modalTitle}>Publish Module?</Text>
            <Text style={styles.modalSub}>
              {savedCount} story question{savedCount !== 1 ? 's' : ''} will go live for students in {roomName}.
            </Text>
            <View style={styles.modalChips}>
              {storyList.filter(s => s.saved).map(s => (
                <View key={s.id} style={styles.modalChip}>
                  <Text style={styles.modalChipText}>Q{s.number} · {s.sentences.length}p</Text>
                </View>
              ))}
            </View>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setPublishModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handlePublish}>
                <LinearGradient colors={[ACCENT_COLOR, GOLD_DARK]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalConfirmGrad}>
                  <Text style={styles.modalConfirmText}>Publish</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ── STYLES ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Header styles
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
    padding: 9,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerCenter: { alignItems: 'center' },
  headerSub: {
    fontSize: 10,
    fontWeight: '700',
    color: GOLD_DARK,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: CHARCOAL,
    marginTop: 1,
  },

  // Progress Bar
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 99,
    backgroundColor: PROGRESS_COLOR,
  },
  progressText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressCountText: {
    fontSize: 14,
    fontWeight: '900',
    color: PROGRESS_COLOR,
  },
  progressTotalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  scroll: { paddingHorizontal: 16, paddingTop: 14 },

  sectionHeading: {
    fontSize: 10,
    fontWeight: '900',
    color: '#78909C',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  addPageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,213,79,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,213,79,0.25)',
  },
  addPageText: {
    fontSize: 11,
    fontWeight: '800',
    color: CHARCOAL,
  },

  // Question Card (Clean, light layout with thin gold accent strip)
  qCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,            // Thinned out accent color bar (from 6 to 4)
    borderLeftColor: ACCENT_COLOR, // Gold accent highlight
  },
  qHeader: { 
    paddingTop: 14,
    backgroundColor: '#FFFFFF',
  },
  qHeaderTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 12,
  },
  qBadge: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 213, 79, 0.12)', // Light tint of gold
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 213, 79, 0.25)',
  },
  qBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: CHARCOAL, // Highly readable charcoal number
  },
  qHeaderMiddle: { flex: 1 },
  qProgress: {
    fontSize: 12,
    fontWeight: '700',
    color: CHARCOAL,
  },
  savedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(76,175,80,0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  savedChipText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#4CAF50',
    letterSpacing: 0.8,
  },
  cardProgressTrack: {
    height: 3,
    backgroundColor: '#F1F5F9',
  },
  cardProgressFill: {
    height: 3,
    backgroundColor: ACCENT_COLOR,
  },
  qBody: {
    padding: 16,
    backgroundColor: 'white',
  },

  metaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#78909C',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  titleInput: {
    height: 46,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
    color: CHARCOAL,
  },

  // Page editor
  pageEditorCard: {
    backgroundColor: '#FAFBFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    elevation: 1,
  },
  pageEditorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pageNumberBadge: {
    backgroundColor: CHARCOAL,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pageNumberBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: ACCENT_COLOR,
    letterSpacing: 1,
  },
  sentenceInput: {
    height: 62,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: CHARCOAL,
    textAlignVertical: 'top',
  },
  aiVoiceNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: 'rgba(255,213,79,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,213,79,0.2)',
  },
  aiVoiceNoticeText: {
    fontSize: 10,
    fontWeight: '700',
    color: GOLD_DARK,
  },
  vocabSelectorWrapper: {
    marginTop: 10,
    backgroundColor: '#F1F3F4',
    borderRadius: 12,
    padding: 10,
  },
  helperText: {
    fontSize: 9,
    color: '#78909C',
    fontWeight: '700',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  wordChip: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CFD8DC',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  wordChipActive: {
    backgroundColor: CHARCOAL,
    borderColor: CHARCOAL,
  },
  wordChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#546E7A',
  },
  wordChipTextActive: {
    color: ACCENT_COLOR,
  },
  assetPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    backgroundColor: 'white',
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 12,
  },
  assetPickerActive: {
    borderColor: '#A5D6A7',
    backgroundColor: '#F1FBF2',
  },
  assetPickerText: {
    fontSize: 12,
    fontWeight: '800',
    color: CHARCOAL,
  },

  // Student Preview
  previewBox: {
    backgroundColor: CHARCOAL,
    borderRadius: 22,
    padding: 14,
    marginVertical: 16,
  },
  previewLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  previewLabelLine: {
    width: 24,
    height: 1.5,
    backgroundColor: ACCENT_COLOR,
    opacity: 0.5,
  },
  previewLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: ACCENT_COLOR,
    letterSpacing: 2,
  },
  studentCard: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  studentCardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,213,79,0.2)',
  },
  studentStoryTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: ACCENT_COLOR,
    textAlign: 'center',
  },
  studentCardBody: {
    backgroundColor: 'white',
    padding: 14,
    alignItems: 'center',
  },
  studentIllustrationBox: {
    width: '100%',
    height: 130,
    backgroundColor: '#F8FBFF',
    borderWidth: 2,
    borderColor: '#E3F2FD',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 12,
  },
  studentImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderBox: { alignItems: 'center', gap: 6 },
  placeholderIconWrap: {
    backgroundColor: 'rgba(255,213,79,0.12)',
    padding: 10,
    borderRadius: 12,
  },
  placeholderText: { fontSize: 10, color: '#90A4AE', fontWeight: '700' },
  sentenceWordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  noSentenceText: { fontSize: 12, color: '#90A4AE', fontWeight: '700' },
  wordBubble: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  vocabWordBubble: { backgroundColor: CHARCOAL, borderColor: CHARCOAL },
  wordText: { fontSize: 13, fontWeight: '800', color: '#37474F' },
  vocabWordText: { color: ACCENT_COLOR },
  aiVoiceRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: CHARCOAL,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  aiVoiceIconWrap: {
    backgroundColor: 'rgba(255,213,79,0.15)',
    padding: 5,
    borderRadius: 8,
  },
  aiVoiceText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  bookNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    paddingTop: 10,
  },
  bookNavBtn: {
    padding: 7,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  pageCountBadge: {
    backgroundColor: CHARCOAL,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
  },
  pageCountText: { fontSize: 11, fontWeight: '800', color: ACCENT_COLOR },

  // Clean Quiz panels
  quizCard: {
    borderRadius: 18,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  quizCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  quizHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  quizTypeLabel: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: CHARCOAL, 
    letterSpacing: 0.8 
  },
  miniShuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,213,79,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,213,79,0.2)',
  },
  miniShuffleText: { fontSize: 9, fontWeight: '800', color: GOLD_DARK },
  quizCardBody: { padding: 14, backgroundColor: 'white' },
  quizQuestionInput: {
    height: 42,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#CFD8DC',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
    color: CHARCOAL,
    marginBottom: 8,
  },
  choiceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  miniTextInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#ECEFF1',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '600',
    color: CHARCOAL,
  },
  correctBorderColor: {
    borderColor: ACCENT_COLOR,
    backgroundColor: '#FFFBEA',
  },
  sequenceIndexWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sequenceIndexWrapperActive: {
    backgroundColor: CHARCOAL,
    borderColor: CHARCOAL,
  },
  sequenceIndexText: { fontSize: 11, fontWeight: '900', color: '#90A4AE' },
  sequenceIndexTextActive: { color: ACCENT_COLOR },
  vocabMatchPickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  vocabPickerWrapper: { flex: 1, alignItems: 'center', position: 'relative' },
  vocabRadioBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 10,
    backgroundColor: 'white',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vocabRadioBtnActive: { backgroundColor: ACCENT_COLOR, borderColor: GOLD_DARK },
  vocabPickerBox: {
    width: '100%',
    height: 70,
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FBFF',
    overflow: 'hidden',
  },
  vocabPickerBoxCorrect: {
    borderColor: ACCENT_COLOR,
    borderStyle: 'solid',
    backgroundColor: '#FFFBEA',
  },
  vocabPickerImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  // ── Action Buttons ──
  cardBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFF5F5',
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E53935',
  },
  saveBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
  },
  saveBtnInnerDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saveBtnTextActive: {
    fontSize: 14,
    fontWeight: '900',
    color: ACCENT_COLOR, // Gold text on charcoal button
  },
  saveBtnTextDisabled: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B0BEC5',
  },
  incompleteHint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#90A4AE',
    fontWeight: '700',
    marginTop: 8,
  },

  // Add Story Button
  addQuestionBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: CHARCOAL,
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
  },
  addQuestionGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  addQuestionText: {
    fontSize: 15,
    fontWeight: '900',
    color: CHARCOAL,
  },

  // Bottom Bar (Light modern style with Charcoal & Gold accent button)
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 14,
  },
  bottomCount: {
    fontSize: 30,
    fontWeight: '900',
    color: CHARCOAL,
  },
  bottomLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  publishBtn: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  publishDisabled: { opacity: 0.4 },
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
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 26,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 26,
    alignItems: 'center',
    elevation: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,213,79,0.2)',
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: CHARCOAL,
    marginBottom: 8,
  },
  modalSub: {
    textAlign: 'center',
    color: '#78909C',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },
  modalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalChip: {
    backgroundColor: CHARCOAL,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  modalChipText: { fontSize: 11, fontWeight: '800', color: ACCENT_COLOR },
  modalBtnRow: { flexDirection: 'row', gap: 10, width: '100%' },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  modalCancelText: { fontWeight: '800', fontSize: 14, color: '#78909C' },
  modalConfirmBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  modalConfirmGrad: { paddingVertical: 14, alignItems: 'center' },
  modalConfirmText: { fontWeight: '900', fontSize: 14, color: CHARCOAL },
});

export default Storytelling;