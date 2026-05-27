import React, { useState, useRef, useEffect  } from 'react';
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

const ACCENT_COLOR = '#FFD54F'; // Creative Gold/Yellow accent
const CHARCOAL = '#263238';      // Dark theme background
const LIGHT_BG = '#ECEFF1';

// ── Default State Builder (Preloaded with Ben and the Red Ball & Yellow Bird) ──
const makeDefaultStory = () => [
  // Question/Story 1: Pre-saved "Ben and the Red Ball"
  {
    id: 'story_1',
    number: 1,
    title: 'Ben and the Red Ball',
    sentences: [
      {
        id: 's1',
        text: 'Ben has a red ball.',
        illustrationUri: null,
        narrationFile: 'ben_has_ball.mp3',
        vocabWords: ['red', 'ball.'],
      },
      {
        id: 's2',
        text: 'He played outside today.',
        illustrationUri: null,
        narrationFile: 'played_outside.mp3',
        vocabWords: ['played', 'outside'],
      },
      {
        id: 's3',
        text: 'The ball bounced high.',
        illustrationUri: null,
        narrationFile: 'bounced_high.mp3',
        vocabWords: ['bounced', 'high.'],
      },
    ],
    quizzes: [
      {
        id: 'q1',
        type: 'picture_comp',
        question: "What color is Ben's ball?",
        choices: ['Blue', 'Red', 'Green'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        type: 'sequence',
        question: 'What happened first?',
        choices: ['Ben found the ball', 'Ben played outside', 'Ben smiled'],
        correctIndex: 1,
      },
      {
        id: 'q3',
        type: 'vocab_match',
        question: 'Which picture shows BALL?',
        choice1Uri: null,
        choice2Uri: null,
        choice3Uri: null,
        correctIndex: 1,
      },
      {
        id: 'q4',
        type: 'read_aloud',
        targetSentence: 'Ben has a red ball.',
      }
    ],
    saved: true
  },
  // Question/Story 2: Pre-saved "The Little Yellow Bird"
  {
    id: 'story_2',
    number: 2,
    title: 'The Little Yellow Bird',
    sentences: [
      {
        id: 's1',
        text: 'A little bird sang a sweet song.',
        illustrationUri: null,
        narrationFile: 'bird_sang_song.mp3',
        vocabWords: ['bird', 'sang', 'song.'],
      },
      {
        id: 's2',
        text: 'It sat on a tall green tree.',
        illustrationUri: null,
        narrationFile: 'sat_on_tree.mp3',
        vocabWords: ['tall', 'green', 'tree.'],
      },
      {
        id: 's3',
        text: 'It flew high up in the blue sky.',
        illustrationUri: null,
        narrationFile: 'flew_high.mp3',
        vocabWords: ['flew', 'blue', 'sky.'],
      },
    ],
    quizzes: [
      {
        id: 'q1',
        type: 'picture_comp',
        question: 'What color was the bird?',
        choices: ['Blue', 'Yellow', 'Red'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        type: 'sequence',
        question: 'What did the bird do first?',
        choices: ['It flew away', 'It sang a song', 'It slept'],
        correctIndex: 1,
      },
      {
        id: 'q3',
        type: 'vocab_match',
        question: 'Which picture shows TREE?',
        choice1Uri: null,
        choice2Uri: null,
        choice3Uri: null,
        correctIndex: 1,
      },
      {
        id: 'q4',
        type: 'read_aloud',
        targetSentence: 'A little bird sang a sweet song.',
      }
    ],
    saved: true
  },
  // Stories 3 to 9: Empty placeholders
  ...Array.from({ length: 7 }, (_, i) => {
    const num = i + 3;
    return {
      id: `story_${num}`,
      number: num,
      title: '',
      sentences: [
        { id: 's1', text: '', illustrationUri: null, narrationFile: '', vocabWords: [] },
        { id: 's2', text: '', illustrationUri: null, narrationFile: '', vocabWords: [] },
        { id: 's3', text: '', illustrationUri: null, narrationFile: '', vocabWords: [] },
      ],
      quizzes: [
        { id: 'q1', type: 'picture_comp', question: '', choices: ['', '', ''], correctIndex: 0 },
        { id: 'q2', type: 'sequence', question: '', choices: ['', '', ''], correctIndex: 0 },
        { id: 'q3', type: 'vocab_match', question: '', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 0 },
        { id: 'q4', type: 'read_aloud', targetSentence: '' }
      ],
      saved: false
    };
  })
];

// ── Interactive Student Book Preview ──────────────────────────────
const StudentPreview = ({ title, sentences }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const activeSentence = sentences?.[currentPage];

  // Reset page when preview bounds change
  React.useEffect(() => {
    setCurrentPage(0);
  }, [sentences]);

  if (!activeSentence) return null;

  const words = (activeSentence.text || '').split(' ').filter(Boolean);

  return (
    <View style={styles.previewBox}>
      <Text style={styles.previewLabel}>STUDENT VIEW </Text>

      <View style={styles.studentCard}>
        {/* Story Title */}
        <Text style={styles.studentStoryTitle}>"{title || 'Untitled Story'}"</Text>

        {/* Story Illustration Container */}
        <View style={styles.studentIllustrationBox}>
          {activeSentence.illustrationUri ? (
            <Image source={{ uri: activeSentence.illustrationUri }} style={styles.studentImage} />
          ) : (
            <View style={styles.placeholderBox}>
              <Ionicons name="image-outline" size={32} color="#90A4AE" />
              <Text style={styles.placeholderText}>Page {currentPage + 1} Illustration</Text>
            </View>
          )}
        </View>

        {/* Interactive Text Row */}
        <View style={styles.sentenceWordsRow}>
          {words.length > 0 ? (
            words.map((word, idx) => {
              const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
              const isVocab = activeSentence.vocabWords?.some(v => 
                v.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") === cleanWord
              );

              return (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.wordBubble, isVocab && styles.vocabWordBubble]}
                  onPress={() => Alert.alert('Pronunciation', `Champ says: "${cleanWord}"`)}
                >
                  <Text style={[styles.wordText, isVocab && styles.vocabWordText]}>
                    {word}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noSentenceText}>No sentence text typed yet.</Text>
          )}
        </View>

        {/* Audio Narration Bar */}
        <View style={styles.narrationRow}>
          <TouchableOpacity style={styles.playBtn} onPress={() => Alert.alert('Audio Narration', `Playing: ${activeSentence.narrationFile || 'None'}`)}>
            <Ionicons name="play" size={16} color="white" />
            <Text style={styles.playBtnText}>Read Sentence</Text>
          </TouchableOpacity>
          {activeSentence.narrationFile && (
            <Text style={styles.narrationFileName}>{activeSentence.narrationFile}</Text>
          )}
        </View>

        {/* Book Navigation controls */}
        <View style={styles.bookNavRow}>
          <TouchableOpacity 
            disabled={currentPage === 0} 
            onPress={() => setCurrentPage(p => Math.max(0, p - 1))}
            style={[styles.bookNavBtn, currentPage === 0 && { opacity: 0.3 }]}
          >
            <Ionicons name="arrow-back" size={20} color="#1565C0" />
          </TouchableOpacity>
          <Text style={styles.pageCountText}>
            Page {currentPage + 1} of {sentences.length}
          </Text>
          <TouchableOpacity 
            disabled={currentPage === sentences.length - 1} 
            onPress={() => setCurrentPage(p => Math.min(sentences.length - 1, p + 1))}
            style={[styles.bookNavBtn, currentPage === sentences.length - 1 && { opacity: 0.3 }]}
          >
            <Ionicons name="arrow-forward" size={20} color="#1565C0" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ── Single Question Card (accordion editor) ───────────────────────
const QuestionCard = ({ item, onSave, onClear }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(item.number === 1);

  // Local draft state isolates keyboard edits from global state, preventing typing lag
  const [draftStory, setDraftStory] = useState(item);

  // Synchronize draft state if parent item properties change (e.g., cleared by parent)
  useEffect(() => {
    setDraftStory(item);
  }, [item]);

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

  const handleUpdateTitle = (text) => {
    setDraftStory(prev => ({ ...prev, title: text }));
  };

  const handleUpdateSentenceText = (id, text) => {
    setDraftStory(prev => ({
      ...prev,
      sentences: prev.sentences.map(s => s.id === id ? { ...s, text, vocabWords: [] } : s)
    }));
  };

  const handleToggleVocab = (sentenceId, word) => {
    setDraftStory(prev => ({
      ...prev,
      sentences: prev.sentences.map(s => {
        if (s.id !== sentenceId) return s;
        const exists = s.vocabWords.includes(word);
        return {
          ...s,
          vocabWords: exists ? s.vocabWords.filter(v => v !== word) : [...s.vocabWords, word]
        };
      })
    }));
  };

  const handlePickIllustration = async (id) => {
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setDraftStory(prev => ({
        ...prev,
        sentences: prev.sentences.map(s => s.id === id ? { ...s, illustrationUri: result.assets[0].uri } : s)
      }));
    }
  };

  const handlePickAudio = (id) => {
    const mockFiles = ['narration_voice_A.mp3', 'sentence_reading_B.mp3', 'audio_female_C.mp3'];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setDraftStory(prev => ({
      ...prev,
      sentences: prev.sentences.map(s => s.id === id ? { ...s, narrationFile: randomFile } : s)
    }));
  };

  const handleAddSentence = () => {
    if (draftStory.sentences.length >= 6) {
      Alert.alert('Limit Reached', 'Stories are limited to a maximum of 6 sentences.');
      return;
    }
    const newId = `s${Date.now()}`;
    setDraftStory(prev => ({
      ...prev,
      sentences: [...prev.sentences, { id: newId, text: '', illustrationUri: null, narrationFile: '', vocabWords: [] }]
    }));
  };

  const handleRemoveSentence = (id) => {
    if (draftStory.sentences.length <= 3) {
      Alert.alert('Required Length', 'Stories must contain at least 3 sentences.');
      return;
    }
    setDraftStory(prev => ({
      ...prev,
      sentences: prev.sentences.filter(s => s.id !== id)
    }));
  };

  const handleUpdateQuizText = (index, field, value) => {
    setDraftStory(prev => {
      const copy = [...prev.quizzes];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, quizzes: copy };
    });
  };

  const handlePickQuizImage = async (index, choiceKey) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setDraftStory(prev => {
        const copy = [...prev.quizzes];
        copy[index] = { ...copy[index], [choiceKey]: result.assets[0].uri };
        return { ...prev, quizzes: copy };
      });
    }
  };

  const handleShuffleQuizChoices = (quizIndex) => {
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
        copy[quizIndex] = { 
          ...copy[quizIndex], 
          choices: shuffledChoices, 
          correctIndex: newCorrectIndex 
        };
        return { ...prev, quizzes: copy };
      });
    } else if (quiz.type === 'vocab_match') {
      const originalItems = [
        { uri: quiz.choice1Uri, key: 'choice1Uri', index: 0 },
        { uri: quiz.choice2Uri, key: 'choice2Uri', index: 1 },
        { uri: quiz.choice3Uri, key: 'choice3Uri', index: 2 }
      ];
      const correctOriginalIndex = quiz.correctIndex;

      const shuffled = [...originalItems];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      const newCorrectIndex = shuffled.findIndex(item => item.index === correctOriginalIndex);

      setDraftStory(prev => {
        const copy = [...prev.quizzes];
        copy[quizIndex] = {
          ...copy[quizIndex],
          choice1Uri: shuffled[0].uri,
          choice2Uri: shuffled[1].uri,
          choice3Uri: shuffled[2].uri,
          correctIndex: newCorrectIndex
        };
        return { ...prev, quizzes: copy };
      });
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View style={[
  styles.qCard, 
  item.saved ? styles.qCardSaved : styles.qCardUnsaved,  // ← add unsaved style
  { borderLeftColor: ACCENT_COLOR }
]}>
        
        {/* Card Header */}
        <TouchableOpacity style={styles.qHeader} onPress={toggleExpand} activeOpacity={0.8}>
          <View style={[styles.qBadge, { backgroundColor: LIGHT_BG }]}>
            <Text style={[styles.qBadgeText, { color: '#37474F' }]}>Q{item.number}</Text>
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
              {draftStory.title ? `"${draftStory.title}"` : 'No Title'} • {draftStory.sentences.length} pages config
            </Text>
          </View>

          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={ACCENT_COLOR}   
          />
        </TouchableOpacity>

        {/* Card Mini Progress Bar */}
        <View style={styles.cardProgressTrack}>
          <View
            style={[
              styles.cardProgressFill,
              { width: `${isComplete ? 100 : 30}%`, backgroundColor: ACCENT_COLOR }
            ]}
          />
        </View>

        {/* Expanded Body */}
        {expanded && (
          <View style={styles.qBody}>
            {/* Story Title Input */}
            <Text style={styles.sectionHeading}>STORY TITLE</Text>
            <View style={styles.metaCard}>
              <TextInput
                style={styles.titleInput}
                value={draftStory.title}
                onChangeText={handleUpdateTitle}
                placeholder="e.g. Ben and the Red Ball"
                placeholderTextColor="#90A4AE"
              />
            </View>

            {/* Sentences/Pages Builder */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>STORY PAGES ({draftStory.sentences.length}/6)</Text>
              <TouchableOpacity style={styles.addPageBtn} onPress={handleAddSentence}>
                <Ionicons name="add-circle" size={18} color="#0288D1" />
                <Text style={styles.addPageText}>Add Page</Text>
              </TouchableOpacity>
            </View>

            {draftStory.sentences.map((sentence, sIdx) => (
              <View key={sentence.id} style={styles.pageEditorCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.pageNumberLabel}>PAGE {sIdx + 1}</Text>
                  <TouchableOpacity onPress={() => handleRemoveSentence(sentence.id)}>
                    <Ionicons name="close-circle" size={20} color="#FF5252" />
                  </TouchableOpacity>
                </View>

                {/* Text Input */}
                <Text style={styles.label}>Sentence Text</Text>
                <TextInput
                  style={styles.sentenceInput}
                  value={sentence.text}
                  onChangeText={t => handleUpdateSentenceText(sentence.id, t)}
                  placeholder="Type sentence here..."
                  placeholderTextColor="#90A4AE"
                  multiline
                />

                {/* Interactive Word Chips for Vocab selection */}
                {sentence.text.trim().length > 0 && (
                  <View style={styles.vocabSelectorWrapper}>
                    <Text style={styles.helperText}>Tap words below to highlight them as vocabulary:</Text>
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

                {/* Illustration and Audio Row */}
                <View style={styles.assetsRow}>
                  {/* Illustration Picker */}
                  <TouchableOpacity 
                    style={[styles.assetPicker, sentence.illustrationUri && styles.assetPickerActive]}
                    onPress={() => handlePickIllustration(sentence.id)}
                  >
                    <Ionicons name="image" size={18} color={sentence.illustrationUri ? '#4CAF50' : '#546E7A'} />
                    <Text style={styles.assetPickerText}>
                      {sentence.illustrationUri ? 'Illustration OK' : 'Add Image'}
                    </Text>
                  </TouchableOpacity>

                  {/* Audio Picker */}
                  <TouchableOpacity 
                    style={[styles.assetPicker, sentence.narrationFile && styles.assetPickerActive]}
                    onPress={() => handlePickAudio(sentence.id)}
                  >
                    <Ionicons name="musical-notes" size={18} color={sentence.narrationFile ? '#4CAF50' : '#546E7A'} />
                    <Text style={styles.assetPickerText}>
                      {sentence.narrationFile ? 'Audio Added' : 'Add Narration'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Book Preview */}
            <StudentPreview title={draftStory.title} sentences={draftStory.sentences} />

            {/* Quiz Manager Section */}
            <Text style={styles.sectionHeading}>CONNECTED QUIZ MANAGEMENT</Text>

            {/* Quiz Type 1: Picture Comprehension */}
            <View style={styles.quizCard}>
              <View style={styles.quizCardHeaderRow}>
                <View style={styles.quizHeader}>
                  <Ionicons name="help-circle" size={18} color={CHARCOAL} />
                  <Text style={styles.quizTypeLabel}>1. PICTURE COMPREHENSION QUIZ</Text>
                </View>
                <TouchableOpacity style={styles.miniShuffleBtn} onPress={() => handleShuffleQuizChoices(0)}>
                  <Ionicons name="shuffle-outline" size={12} color="#546E7A" />
                  <Text style={styles.miniShuffleText}>Shuffle</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.quizQuestionInput}
                value={draftStory.quizzes[0]?.question}
                onChangeText={t => handleUpdateQuizText(0, 'question', t)}
                placeholder="Question (e.g. What color is Ben's ball?)"
              />
              {draftStory.quizzes[0]?.choices.map((choice, cIdx) => (
                <View key={cIdx} style={styles.choiceInputRow}>
                  <TouchableOpacity onPress={() => handleUpdateQuizText(0, 'correctIndex', cIdx)}>
                    <Ionicons 
                      name={draftStory.quizzes[0].correctIndex === cIdx ? "checkmark-circle" : "ellipse-outline"} 
                      size={20} 
                      color={draftStory.quizzes[0].correctIndex === cIdx ? "#4CAF50" : "#90A4AE"} 
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
                  />
                </View>
              ))}
            </View>

            {/* Quiz Type 2: Sequence Quiz */}
            <View style={styles.quizCard}>
              <View style={styles.quizCardHeaderRow}>
                <View style={styles.quizHeader}>
                  <Ionicons name="list" size={18} color={CHARCOAL} />
                  <Text style={styles.quizTypeLabel}>2. SEQUENCE QUIZ</Text>
                </View>
                <TouchableOpacity style={styles.miniShuffleBtn} onPress={() => handleShuffleQuizChoices(1)}>
                  <Ionicons name="shuffle-outline" size={12} color="#546E7A" />
                  <Text style={styles.miniShuffleText}>Shuffle</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.quizQuestionInput}
                value={draftStory.quizzes[1]?.question}
                onChangeText={t => handleUpdateQuizText(1, 'question', t)}
                placeholder="Instruction (e.g. What happened first?)"
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
                  />
                </View>
              ))}
            </View>

            {/* Quiz Type 3: Vocabulary Match Quiz */}
            <View style={styles.quizCard}>
              <View style={styles.quizCardHeaderRow}>
                <View style={styles.quizHeader}>
                  <Ionicons name="images-outline" size={18} color={CHARCOAL} />
                  <Text style={styles.quizTypeLabel}>3. VOCABULARY MATCH QUIZ</Text>
                </View>
                <TouchableOpacity style={styles.miniShuffleBtn} onPress={() => handleShuffleQuizChoices(2)}>
                  <Ionicons name="shuffle-outline" size={12} color="#546E7A" />
                  <Text style={styles.miniShuffleText}>Shuffle</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.quizQuestionInput}
                value={draftStory.quizzes[2]?.question}
                onChangeText={t => handleUpdateQuizText(2, 'question', t)}
                placeholder="Question (e.g. Which picture shows BALL?)"
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
                        <Ionicons name="checkmark" size={10} color={isCorrect ? 'white' : '#90A4AE'} />
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

            {/* Quiz Type 4: Read Aloud Challenge */}
            <View style={styles.quizCard}>
              <View style={styles.quizHeader}>
                <Ionicons name="mic-outline" size={18} color={CHARCOAL} />
                <Text style={styles.quizTypeLabel}>4. READ ALOUD CHALLENGE</Text>
              </View>
              <TextInput
                style={styles.quizQuestionInput}
                value={draftStory.quizzes[3]?.targetSentence}
                onChangeText={t => handleUpdateQuizText(3, 'targetSentence', t)}
                placeholder="Target Sentence (e.g. Ben has a red ball.)"
              />
            </View>

            {/* Action buttons */}
            <View style={styles.cardBtnRow}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => onClear(item.id)}>
                <Ionicons name="trash-outline" size={15} color="#FF5252" />
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, !isComplete && styles.saveBtnDisabled]}
                onPress={() => { if (isComplete) { onSave(item.id, draftStory); setExpanded(false); } }}
                disabled={!isComplete}
              >
                <LinearGradient
                  colors={isComplete ? [CHARCOAL, CHARCOAL] : ['#ECEFF1', '#ECEFF1']}
                  style={styles.saveBtnGrad}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={15}
                    color={isComplete ? ACCENT_COLOR : '#B0BEC5'}
                  />
                  <Text style={[styles.saveBtnText, !isComplete && { color: '#B0BEC5' }]}>
                    Save Question
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {!isComplete && (
              <Text style={styles.incompleteHint}>
                Add the title and fill all pages to save.
              </Text>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ── Main Screen Component ──────────────────────────────────────────
const Storytelling = ({ route, navigation }) => {
  const { roomName } = route.params ?? {};
  const [storyList, setStoryList] = useState(() => makeDefaultStory());
  const [publishModal, setPublishModal] = useState(false);

  const totalStoriesCount = storyList.length;
  const savedCount = storyList.filter(s => s.saved).length;
  const progressPercent = totalStoriesCount > 0 ? (savedCount / totalStoriesCount) * 100 : 0;

  const handleSaveStory = (id, updatedDraft) => {
    setStoryList(prev => prev.map(s => s.id === id ? { ...updatedDraft, saved: true } : s));
  };

  const handleClearStory = (id) => {
    Alert.alert('Clear Story', 'Erase title, pages and quizzes in this story?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: () =>
          setStoryList(prev =>
            prev.map(s => s.id === id
              ? {
                  ...s,
                  saved: false,
                  title: '',
                  sentences: [
                    { id: 's1', text: '', illustrationUri: null, narrationFile: '', vocabWords: [] },
                    { id: 's2', text: '', illustrationUri: null, narrationFile: '', vocabWords: [] },
                    { id: 's3', text: '', illustrationUri: null, narrationFile: '', vocabWords: [] },
                  ],
                  quizzes: [
                    { id: 'q1', type: 'picture_comp', question: '', choices: ['', '', ''], correctIndex: 0 },
                    { id: 'q2', type: 'sequence', question: '', choices: ['', '', ''], correctIndex: 0 },
                    { id: 'q3', type: 'vocab_match', question: '', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 0 },
                    { id: 'q4', type: 'read_aloud', targetSentence: '' }
                  ]
                }
              : s
            )
          ),
      },
    ]);
  };

  const handleAddStory = () => {
    setStoryList(prev => {
      const nextNum = prev.length + 1;
      return [
        ...prev,
        {
          id: `story_${nextNum}`,
          number: nextNum,
          title: '',
          sentences: [
            { id: 's1', text: '', illustrationUri: null, narrationFile: '', vocabWords: [] },
            { id: 's2', text: '', illustrationUri: null, narrationFile: '', vocabWords: [] },
            { id: 's3', text: '', illustrationUri: null, narrationFile: '', vocabWords: [] },
          ],
          quizzes: [
            { id: 'q1', type: 'picture_comp', question: '', choices: ['', '', ''], correctIndex: 0 },
            { id: 'q2', type: 'sequence', question: '', choices: ['', '', ''], correctIndex: 0 },
            { id: 'q3', type: 'vocab_match', question: '', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 0 },
            { id: 'q4', type: 'read_aloud', targetSentence: '' }
          ],
          saved: false
        }
      ];
    });
  };

  const handlePublish = () => {
    setPublishModal(false);
    Alert.alert('Published! 🎉', `Storytelling module is now live in ${roomName || 'Room'}.`);
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
            <Text style={styles.headerTitle}>Storytelling Module</Text>
          </View>
          <View style={{ width: 45 }} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{savedCount}/{totalStoriesCount} saved</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {storyList.map(s => (
            <QuestionCard
              key={s.id}
              item={s}
              onSave={handleSaveStory}
              onClear={handleClearStory}
            />
          ))}

          {/* ── ADD STORY BUTTON ── */}
          <TouchableOpacity style={styles.addQuestionBtn} onPress={handleAddStory}>
            <Ionicons name="add-circle" size={20} color={CHARCOAL} />
            <Text style={styles.addQuestionText}>Add Story</Text>
          </TouchableOpacity>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Bar */}
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
              colors={savedCount > 0 ? [CHARCOAL, CHARCOAL] : ['#ECEFF1', '#ECEFF1']}
              style={styles.publishGrad}
            >
              <Ionicons name="rocket-outline" size={18} color={savedCount > 0 ? ACCENT_COLOR : '#B0BEC5'} />
              <Text style={[styles.publishText, savedCount < 1 && { color: '#B0BEC5' }]}>
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
            <LinearGradient colors={[CHARCOAL, '#1E282D']} style={styles.modalIcon}>
              <Ionicons name="book" size={32} color={ACCENT_COLOR} />
            </LinearGradient>
            <Text style={styles.modalTitle}>Publish Module?</Text>
            <Text style={styles.modalSub}>
              {savedCount} story question{savedCount !== 1 ? 's' : ''} will go live for students in {roomName}.
            </Text>

            {/* Summary chips */}
            <View style={styles.modalChips}>
              {storyList.filter(s => s.saved).map(s => (
                <View key={s.id} style={[styles.modalChip, { backgroundColor: LIGHT_BG }]}>
                  <Text style={[styles.modalChipText, { color: CHARCOAL }]}>
                    Q{s.number} · {s.sentences.length}p
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#F5F5F5' }]} onPress={() => setPublishModal(false)}>
                <Text style={[styles.modalBtnText, { color: '#546E7A' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={handlePublish}>
                <LinearGradient colors={[CHARCOAL, '#1E282D']} style={styles.modalBtnGrad}>
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
  scroll: { paddingHorizontal: 18, paddingTop: 10 },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.muted,
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.muted,
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 14,
  },
  metaCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78909C',
    marginBottom: 6,
  },
  titleInput: {
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
  },
  addPageText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0288D1',
  },
  pageEditorCard: {
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageNumberLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0288D1',
  },
  sentenceInput: {
    height: 64,
    backgroundColor: '#F8FBFF',
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 10,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    textAlignVertical: 'top',
  },

  // Interactive Vocabulary Highlight Chips
  vocabSelectorWrapper: {
    marginTop: 10,
    backgroundColor: '#ECEFF1',
    borderRadius: 12,
    padding: 10,
  },
  helperText: {
    fontSize: 9,
    color: '#546E7A',
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
    paddingHorizontal: 8,
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

  assetsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  assetPicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    backgroundColor: '#F8FBFF',
    paddingVertical: 10,
    borderRadius: 12,
  },
  assetPickerActive: {
    borderColor: '#A5D6A7',
    backgroundColor: '#E8F5E9',
  },
  assetPickerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#37474F',
  },

  // Preview Box (Student side rendering preview matching mockup)
  previewBox: {
    backgroundColor: '#ECEFF1',
    borderRadius: 24,
    padding: 14,
    marginVertical: 18,
  },
  previewLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#78909C',
    letterSpacing: 1.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  studentCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
  },
  studentStoryTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1565C0',
    marginBottom: 12,
  },
  studentIllustrationBox: {
    width: '100%',
    height: 140,
    backgroundColor: '#F8FBFF',
    borderWidth: 2,
    borderColor: '#E3F2FD',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 14,
  },
  studentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderBox: {
    alignItems: 'center',
    gap: 4,
  },
  placeholderText: {
    fontSize: 10,
    color: '#90A4AE',
    fontWeight: '700',
  },
  sentenceWordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 14,
  },
  noSentenceText: {
    fontSize: 12,
    color: '#90A4AE',
    fontWeight: '700',
  },
  wordBubble: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E3F2FD',
    backgroundColor: 'white',
  },
  vocabWordBubble: {
    backgroundColor: CHARCOAL,
    borderColor: CHARCOAL,
  },
  wordText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#37474F',
  },
  vocabWordText: {
    color: ACCENT_COLOR,
  },
  narrationRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 14,
    marginBottom: 12,
    gap: 10,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1565C0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  playBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'white',
  },
  narrationFileName: {
    fontSize: 10,
    color: '#78909C',
    fontWeight: '600',
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
    padding: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  pageCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#546E7A',
  },

  // Quiz Management Layouts
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  quizCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quizTypeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#37474F',
    letterSpacing: 0.5,
  },
  miniShuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(120, 144, 156, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  miniShuffleText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#546E7A',
  },
  quizQuestionInput: {
    height: 44,
    backgroundColor: '#F8FBFF',
    borderWidth: 1.2,
    borderColor: '#CFD8DC',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
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
    height: 38,
    backgroundColor: '#F8FBFF',
    borderWidth: 1.2,
    borderColor: '#ECEFF1',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  correctBorderColor: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1FBF2',
  },
  sequenceIndexWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sequenceIndexWrapperActive: {
    backgroundColor: '#4CAF50',
  },
  sequenceIndexText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#90A4AE',
  },
  sequenceIndexTextActive: {
    color: 'white',
  },
  vocabPickerWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  vocabRadioBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 10,
    backgroundColor: 'white',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#CFD8DC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vocabRadioBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  vocabMatchPickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
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
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  vocabPickerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Add Question Button style
  addQuestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: CHARCOAL,
    borderStyle: 'dashed',
    borderRadius: 22,
    paddingVertical: 16,
    marginVertical: 12,
    backgroundColor: '#F5F5F5',
  },
  addQuestionText: {
    fontSize: 15,
    fontWeight: '850',
    color: CHARCOAL,
  },

  // Bottom Navigation Bar
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
    color: CHARCOAL,
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

  // Replace or add these styles:
qCard: {
  borderRadius: 22,
  marginBottom: 14,
  borderLeftWidth: 4,
  overflow: 'hidden',
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.12,
  shadowRadius: 6,
},
qCardSaved: {
  backgroundColor: 'white',
},
qCardUnsaved: {
  backgroundColor: 'white',   // body stays white
},
qHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 14,
  gap: 12,
  backgroundColor: CHARCOAL,   // ← BLACK header for all cards
},
qBadge: {
  width: 36,
  height: 36,
  borderRadius: 10,
  backgroundColor: ACCENT_COLOR,  // ← GOLD badge
  justifyContent: 'center',
  alignItems: 'center',
},
qBadgeText: {
  fontSize: 13,
  fontWeight: '900',
  color: CHARCOAL,   // dark text on gold
},
qHeaderMiddle: {
  flex: 1,
},
qHeaderTopRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
},
qProgress: {
  fontSize: 12,
  fontWeight: '700',
  color: '#B0BEC5',   // light grey text on dark bg
},
savedChip: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  backgroundColor: 'rgba(76,175,80,0.18)',
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 20,
  marginBottom: 2,
},
savedChipText: {
  fontSize: 9,
  fontWeight: '900',
  color: '#4CAF50',
  letterSpacing: 0.8,
},
cardProgressTrack: {
  height: 3,
  backgroundColor: 'rgba(255,255,255,0.1)',
  // sits between dark header and white body — looks like a divider
},
cardProgressFill: {
  height: 3,
},
qBody: {
  padding: 16,
  backgroundColor: 'white',
},


});

export default Storytelling;