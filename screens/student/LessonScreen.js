import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  Dimensions, Modal, StatusBar, Platform, ScrollView, Animated, PanResponder, Image 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

const CONGRATS = ["AWESOME!", "GREAT JOB!", "VERY GOOD!", "PERFECT!", "FANTASTIC!"];

// Fallback letter-recognition data matching the teacher's default setups
const DEFAULT_LETTER_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    pairCount: 3,
    pairs: [
      { pairId: 'p1', uppercase: 'A', lowercase: 'a' },
      { pairId: 'p2', uppercase: 'B', lowercase: 'b' },
      { pairId: 'p3', uppercase: 'C', lowercase: 'c' },
    ],
  },
  {
    id: 'q2',
    number: 2,
    pairCount: 3,
    pairs: [
      { pairId: 'p1', uppercase: 'S', lowercase: 's' },
      { pairId: 'p2', uppercase: 'M', lowercase: 'm' },
      { pairId: 'p3', uppercase: 'T', lowercase: 't' },
    ],
  }
];

// Fallback picture-matching data matching the teacher's default setups
const DEFAULT_PICTURE_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    imageUri: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300', // Apple
    correctWord: 'Apple',
    distractor1: 'Banana',
    distractor2: 'Orange',
  },
  {
    id: 'q2',
    number: 2,
    imageUri: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300', // Banana
    correctWord: 'Banana',
    distractor1: 'Apple',
    distractor2: 'Orange',
  }
];

// Fallback word-matching data matching the teacher's default setups
const DEFAULT_WORD_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    targetWord: 'CAT',
    correctImageUri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200', // Cat
    distractor1ImageUri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200', // Dog
    distractor2ImageUri: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200', // Bird
  },
  {
    id: 'q2',
    number: 2,
    targetWord: 'DOG',
    correctImageUri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200', // Dog
    distractor1ImageUri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200', // Cat
    distractor2ImageUri: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200', // Bird
  }
];

// Fallback number-matching data matching the teacher's default setups
const DEFAULT_NUMBER_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    targetNumber: '3',
    correctWord: 'Three',
    distractor1: 'Two',
    distractor2: 'Four',
  },
  {
    id: 'q2',
    number: 2,
    targetNumber: '5',
    correctWord: 'Five',
    distractor1: 'Four',
    distractor2: 'Six',
  }
];

// Fallback sound-matching data matching the teacher's default setups
const DEFAULT_SOUND_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    audioUri: 'Banana',
    optionalImageUri: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300', // Banana
    correctWord: 'Banana',
    distractor1: 'Apple',
    distractor2: 'Orange',
  },
  {
    id: 'q2',
    number: 2,
    audioUri: 'Apple',
    optionalImageUri: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300', // Apple
    correctWord: 'Apple',
    distractor1: 'Banana',
    distractor2: 'Orange',
  }
];

// Fallback storytelling data matching the teacher's default setups
const DEFAULT_STORY_QUESTIONS = [
  {
    id: 'story_1',
    number: 1,
    title: 'Ben and the Red Ball',
    sentences: [
      { id: 's1', text: 'Ben has a red ball.', illustrationUri: null, vocabWords: ['red', 'ball'] },
      { id: 's2', text: 'He played outside today.', illustrationUri: null, vocabWords: ['played', 'outside'] },
      { id: 's3', text: 'The ball bounced high.', illustrationUri: null, vocabWords: ['bounced', 'high'] },
    ],
    quizzes: [
      { id: 'q1', type: 'picture_comp', question: "What color is Ben's ball?", choices: ['Blue', 'Red', 'Green'], correctIndex: 1 },
      { id: 'q2', type: 'sequence', question: 'What happened first?', choices: ['Ben played outside', 'Ben found the ball', 'Ben smiled'], correctIndex: 0 },
      { id: 'q3', type: 'vocab_match', question: 'Which picture shows BALL?', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 1 },
      { id: 'q4', type: 'read_aloud', targetSentence: 'Ben has a red ball.' },
    ],
  },
  {
    id: 'story_2',
    number: 2,
    title: 'The Little Yellow Bird',
    sentences: [
      { id: 's1', text: 'A little bird sang a sweet song.', illustrationUri: null, vocabWords: ['bird', 'sang', 'song'] },
      { id: 's2', text: 'It sat on a tall green tree.', illustrationUri: null, vocabWords: ['tall', 'green', 'tree'] },
      { id: 's3', text: 'It flew high up in the blue sky.', illustrationUri: null, vocabWords: ['flew', 'blue', 'sky'] },
    ],
    quizzes: [
      { id: 'q1', type: 'picture_comp', question: 'What color was the bird?', choices: ['Blue', 'Yellow', 'Red'], correctIndex: 1 },
      { id: 'q2', type: 'sequence', question: 'What did the bird do first?', choices: ['It flew away', 'It sang a song', 'It slept'], correctIndex: 1 },
      { id: 'q3', type: 'vocab_match', question: 'Which picture shows TREE?', choice1Uri: null, choice2Uri: null, choice3Uri: null, correctIndex: 1 },
      { id: 'q4', type: 'read_aloud', targetSentence: 'A little bird sang a sweet song.' },
    ],
  }
];

const DrawConnectingLine = ({ p1, p2, color }) => {
  if (!p1 || !p2) return null;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const cx = (p1.x + p2.x) / 2;
  const cy = (p1.y + p2.y) / 2;

  return (
    <View 
      style={[
        styles.drawnLineSegment, 
        {
          left: cx - distance / 2,
          top: cy - 4,
          width: distance,
          backgroundColor: color,
          transform: [{ rotate: `${angle}deg` }]
        }
      ]} 
    />
  );
};

const LessonScreen = ({ route, navigation }) => {
  // Retrieve level configuration and dynamic arrays from teacher modules
  const { 
    levelId = 1, 
    letterQuestions, 
    pictureQuestions, 
    wordQuestions,
    numberQuestions,
    soundQuestions,
    storyQuestions
  } = route.params || {};

  // Active question extraction based on selected level number
  const activeLetterQuestions = letterQuestions || DEFAULT_LETTER_QUESTIONS;
  const activeLetterQuestion = activeLetterQuestions.find(q => q.number === levelId) || activeLetterQuestions[0];
  const activePairs = activeLetterQuestion.pairs || [];

  const activePicQuestion = (pictureQuestions || DEFAULT_PICTURE_QUESTIONS).find(q => q.number === levelId) || DEFAULT_PICTURE_QUESTIONS[0];
  const activeWordQuestion = (wordQuestions || DEFAULT_WORD_QUESTIONS).find(q => q.number === levelId) || DEFAULT_WORD_QUESTIONS[0];
  const activeNumQuestion = (numberQuestions || DEFAULT_NUMBER_QUESTIONS).find(q => q.number === levelId) || DEFAULT_NUMBER_QUESTIONS[0];
  const activeSoundQuestion = (soundQuestions || DEFAULT_SOUND_QUESTIONS).find(q => q.number === levelId) || DEFAULT_SOUND_QUESTIONS[0];
  
  const activeStoryQuestions = storyQuestions || DEFAULT_STORY_QUESTIONS;
  const activeStory = activeStoryQuestions.find(s => s.number === levelId) || activeStoryQuestions[0];

  // --- STAGES & STEPS ---
  const [stage, setStage] = useState('exercise_intro'); 
  const [currentSubStep, setCurrentSubStep] = useState(0); 
  const [storySentenceIndex, setStorySentenceIndex] = useState(0);

  // --- STATE VARIABLES ---
  const [isCorrect, setIsCorrect] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lives, setLives] = useState(5);
  const [xpEarned, setXpEarned] = useState(0);
  const [score, setScore] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // --- LINE MATCHING STATE ---
  const [connections, setConnections] = useState([]); // [{ from, to, color }]
  const [activeDragLine, setActiveDragLine] = useState(null); // { fromNode, startPt, endPt }
  const [selectedLeftNode, setSelectedLeftNode] = useState(null); // Highlight for tap connections

  // --- DYNAMIC DATA & COORDINATE COMPUTATION ---
  const leftItems = useMemo(() => activePairs.map(p => p.uppercase), [activePairs]);

  // Shuffled sequence for lowercase characters (computed once on level mount)
  const [rightItems, setRightItems] = useState([]);
  useEffect(() => {
    if (activePairs.length > 0) {
      const shuffled = activePairs.map(p => p.lowercase);
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setRightItems(shuffled);
    }
  }, [activePairs]);

  // Shuffled options for Exercise 2 (Picture Matching)
  const picChoices = useMemo(() => {
    if (!activePicQuestion) return [];
    const list = [
      { text: activePicQuestion.correctWord, isCorrect: true },
      { text: activePicQuestion.distractor1, isCorrect: false },
      { text: activePicQuestion.distractor2, isCorrect: false }
    ].filter(c => c.text?.trim());

    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [activePicQuestion]);

  // Shuffled options for Exercise 3 (Word Matching)
  const wordChoices = useMemo(() => {
    if (!activeWordQuestion) return [];
    const list = [
      { uri: activeWordQuestion.correctImageUri, isCorrect: true },
      { uri: activeWordQuestion.distractor1ImageUri, isCorrect: false },
      { uri: activeWordQuestion.distractor2ImageUri, isCorrect: false }
    ].filter(c => c.uri);

    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [activeWordQuestion]);

  // Shuffled options for Exercise 4 (Number Matching)
  const numChoices = useMemo(() => {
    if (!activeNumQuestion) return [];
    const list = [
      { text: activeNumQuestion.correctWord, isCorrect: true },
      { text: activeNumQuestion.distractor1, isCorrect: false },
      { text: activeNumQuestion.distractor2, isCorrect: false }
    ].filter(c => c.text?.trim());

    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [activeNumQuestion]);

  // Shuffled options for Exercise 5 (Sound Matching)
  const soundChoices = useMemo(() => {
    if (!activeSoundQuestion) return [];
    const list = [
      { text: activeSoundQuestion.correctWord, isCorrect: true },
      { text: activeSoundQuestion.distractor1, isCorrect: false },
      { text: activeSoundQuestion.distractor2, isCorrect: false }
    ].filter(c => c.text?.trim());

    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [activeSoundQuestion]);

  // Shuffled choices for Story Comprehension (Quiz 1)
  const quiz1Choices = useMemo(() => {
    const q = activeStory?.quizzes?.[0];
    if (!q) return [];
    const list = q.choices.map((choice, index) => ({
      text: choice,
      isCorrect: index === q.correctIndex
    }));
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [activeStory]);

  // Shuffled choices for Story Sequencing (Quiz 2)
  const quiz2Choices = useMemo(() => {
    const q = activeStory?.quizzes?.[1];
    if (!q) return [];
    const list = q.choices.map((choice, index) => ({
      text: choice,
      isCorrect: index === q.correctIndex
    }));
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [activeStory]);

  // Shuffled choices for Story Vocabulary Matching (Quiz 3)
  const quiz3Choices = useMemo(() => {
    const q = activeStory?.quizzes?.[2];
    if (!q) return [];
    const list = [
      { uri: q.choice1Uri, isCorrect: q.correctIndex === 0, fallbackIcon: 'car-sports' },
      { uri: q.choice2Uri, isCorrect: q.correctIndex === 1, fallbackIcon: 'basketball' },
      { uri: q.choice3Uri, isCorrect: q.correctIndex === 2, fallbackIcon: 'cookie' }
    ];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [activeStory]);

  // Dynamic coordinate points calculated mathematically based on list index
  const leftCoords = useMemo(() => {
    const coords = {};
    leftItems.forEach((item, index) => {
      coords[item] = { x: 50, y: 60 + index * 120 };
    });
    return coords;
  }, [leftItems]);

  const rightCoords = useMemo(() => {
    const coords = {};
    rightItems.forEach((item, index) => {
      coords[item] = { x: 240, y: 60 + index * 120 };
    });
    return coords;
  }, [rightItems]);

  // Dynamic pairings maps
  const correctMatches = useMemo(() => {
    const map = {};
    activePairs.forEach(p => {
      map[p.uppercase] = p.lowercase;
    });
    return map;
  }, [activePairs]);

  const lineColors = useMemo(() => {
    const colors = {};
    const palette = ['#FF6B6B', '#9B51E0', '#2F80ED'];
    leftItems.forEach((item, index) => {
      colors[item] = palette[index % palette.length];
    });
    return colors;
  }, [leftItems]);

  // Reset line matches when substeps or stages shift
  useEffect(() => {
    setConnections([]);
    setActiveDragLine(null);
    setSelectedLeftNode(null);
  }, [currentSubStep, stage]);

  // Highlight index for active words during story narration
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);

  useEffect(() => {
    announceStep();
  }, [stage, currentSubStep, storySentenceIndex]);

  const speak = (text, rate = 0.8) => {
    Speech.stop();
    Speech.speak(text, { language: 'en-US', pitch: 1.15, rate });
  };

  const announceStep = () => {
    if (stage === 'exercise_intro') {
      speak("Welcome! Let's have fun first with the Matchy-Matchy Game! Are you ready?");
    } else if (stage === 'exercise') {
      if (currentSubStep === 0) speak("Connect the big letters to the small letters! You can drag them, or tap them!");
      if (currentSubStep === 1) speak("Tap the word that matches the picture!");
      if (currentSubStep === 2) speak("Which word matches the cat?");
      if (currentSubStep === 3) speak("Match the number three to the correct word!");
      if (currentSubStep === 4) speak("Listen closely and choose the correct word!");
    } else if (stage === 'story_intro') {
      speak("Great job! Now let's read the story together. Are you ready to read?");
    } else if (stage === 'story') {
      speak(`Let's read ${activeStory.title} together. Tap any word to hear it out loud!`);
    } else if (stage === 'quiz_intro') {
      speak("Let's check what you learned! Are you ready for the quiz?");
    } else if (stage === 'quiz') {
      if (currentSubStep === 0) speak(activeStory.quizzes[0]?.question || "What color is Ben's ball?");
      if (currentSubStep === 1) speak(activeStory.quizzes[1]?.question || "What happened first in our story?");
      if (currentSubStep === 2) speak(activeStory.quizzes[2]?.question || "Which picture shows a ball?");
      if (currentSubStep === 3) speak("Read Aloud Challenge! Tap the microphone and read the sentence out loud!");
    }
  };

  const handleAnswer = (answer) => {
    if (answer) {
      const randomMsg = CONGRATS[Math.floor(Math.random() * CONGRATS.length)];
      setFeedbackMsg(randomMsg);
      setIsCorrect(true);
      setXpEarned(prev => prev + 10);
      setScore(prev => prev + 100);
      speak(randomMsg);
    } else {
      if (stage === 'quiz') {
        const newLives = lives - 1;
        setLives(newLives);
        setIsCorrect(false);
        speak("Oops! Let's try again!");
        if (newLives <= 0) setIsGameOver(true);
      } else {
        setIsCorrect(false);
        speak("Oops! Let's try again!");
      }
    }
  };

  const handleNext = () => {
    setIsCorrect(null);
    if (stage === 'exercise') {
      if (currentSubStep < 4) {
        setCurrentSubStep(currentSubStep + 1);
      } else {
        setStage('story_intro');
      }
    } else if (stage === 'quiz') {
      if (currentSubStep < 3) {
        setCurrentSubStep(currentSubStep + 1);
      } else {
        setShowReward(true);
      }
    }
  };

  const handleFeedbackDismiss = () => {
    if (isCorrect) {
      handleNext();
    } else {
      setIsCorrect(null);
    }
  };

  // --- DYNAMIC LINE DRAG RESPONDERS ---
  const createLinePanResponder = (nodeKey) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const startPt = leftCoords[nodeKey];
        setActiveDragLine({
          fromNode: nodeKey,
          startPt,
          endPt: startPt
        });
        setSelectedLeftNode(nodeKey);
      },
      onPanResponderMove: (e, gestureState) => {
        const startPt = leftCoords[nodeKey];
        const currentX = startPt.x + gestureState.dx;
        const currentY = startPt.y + gestureState.dy;

        setActiveDragLine({
          fromNode: nodeKey,
          startPt,
          endPt: { x: currentX, y: currentY }
        });
      },
      onPanResponderRelease: (e, gestureState) => {
        const startPt = leftCoords[nodeKey];
        const endX = startPt.x + gestureState.dx;
        const endY = startPt.y + gestureState.dy;

        const isTap = Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2) < 8;

        if (isTap) {
          setSelectedLeftNode(nodeKey);
          speak(nodeKey);
        } else {
          let matchedRightKey = null;
          Object.keys(rightCoords).forEach((key) => {
            const rPt = rightCoords[key];
            const dist = Math.sqrt((endX - rPt.x) ** 2 + (endY - rPt.y) ** 2);
            if (dist < 45) {
              matchedRightKey = key;
            }
          });

          if (matchedRightKey) {
            handleCompleteMatch(nodeKey, matchedRightKey);
          } else {
            setSelectedLeftNode(null);
          }
        }
        setActiveDragLine(null);
      }
    });
  };

  // Tap-to-Connect fallback for emulator accessibility
  const handleRightNodePress = (rightKey) => {
    if (selectedLeftNode) {
      handleCompleteMatch(selectedLeftNode, rightKey);
    } else {
      speak(rightKey);
    }
  };

  const handleCompleteMatch = (leftKey, rightKey) => {
    if (correctMatches[leftKey] === rightKey) {
      const alreadyExists = connections.some(c => c.from === leftKey);
      if (!alreadyExists) {
        const newConnection = { from: leftKey, to: rightKey, color: lineColors[leftKey] };
        const newConnectionsList = [...connections, newConnection];
        setConnections(newConnectionsList);
        setSelectedLeftNode(null);
        
        if (newConnectionsList.length === activePairs.length) {
          setTimeout(() => handleAnswer(true), 600);
        } else {
          speak("Matched! Find another one!");
        }
      }
    } else {
      handleAnswer(false);
      setSelectedLeftNode(null);
    }
  };

  // Dual playback audio executor: plays voice recording or synthesizes text templates
  const playExerciseAudio = async () => {
    if (!activeSoundQuestion?.audioUri) return;
    try {
      const isLocalFile =
        activeSoundQuestion.audioUri.startsWith('file://') ||
        activeSoundQuestion.audioUri.includes('.wav') ||
        activeSoundQuestion.audioUri.includes('.mp3') ||
        activeSoundQuestion.audioUri.includes('.m4a');

      if (isLocalFile) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: activeSoundQuestion.audioUri },
          { shouldPlay: true }
        );
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } else {
        speak(activeSoundQuestion.audioUri, 0.8);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- STORY FUNCTIONS ---
  const handleWordTap = (word) => {
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    speak(cleanWord, 0.75);
  };

  const handleReadFullSentence = () => {
    const currentSentence = activeStory.sentences[storySentenceIndex];
    if (!currentSentence) return;
    const sentence = currentSentence.text;
    const words = sentence.split(" ");
    speak(sentence, 0.8);

    words.forEach((_, index) => {
      setTimeout(() => {
        setHighlightedWordIndex(index);
      }, index * 450);
    });

    setTimeout(() => {
      setHighlightedWordIndex(-1);
    }, words.length * 480);
  };

  // --- RENDER INTROS ---
  const RenderIntroScreen = ({ icon, title, description, buttonText, onStart }) => (
    <View style={styles.introContainer}>
      <View style={styles.introCard}>
        <View style={styles.introIconFrame}>
          <Ionicons name={icon} size={90} color="#1E62D0" />
        </View>
        <Text style={styles.introTitle}>{title}</Text>
        <Text style={styles.introDescription}>{description}</Text>
        
        <TouchableOpacity style={styles.introButton} onPress={onStart}>
          <View style={styles.introButtonInner}>
            <Text style={styles.introButtonText}>{buttonText}</Text>
            <Ionicons name="arrow-forward" size={24} color="#FFF" style={{ marginLeft: 6 }} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- RENDER EXERCISES (STAGE 1) ---
  const RenderExercise = () => (
    <View style={styles.gameBox}>
      {/* Ex 1: Letter Line Matching (Reflects Teacher configurations dynamically) */}
      {currentSubStep === 0 && (
        <View style={styles.gameCardLarge}>
          <Text style={styles.instruction}>Draw lines to match the letters!</Text>
          
          <View style={styles.matchingBoard}>
            {/* Draw active connected lines dynamically */}
            {connections.map((c, i) => (
              <DrawConnectingLine 
                key={i} 
                p1={leftCoords[c.from]} 
                p2={rightCoords[c.to]} 
                color={c.color} 
              />
            ))}

            {/* Draw active drag path preview line */}
            {activeDragLine && (
              <DrawConnectingLine 
                p1={activeDragLine.startPt} 
                p2={activeDragLine.endPt} 
                color={lineColors[activeDragLine.fromNode]} 
              />
            )}

            {/* Render left-hand column nodes dynamically */}
            {leftItems.map((item, index) => {
              const isSelected = selectedLeftNode === item;
              const isConnected = connections.some(c => c.from === item);
              return (
                <View 
                  key={item}
                  style={[
                    styles.nodeContainer, 
                    { left: 10, top: 20 + index * 120 },
                    isSelected && styles.nodeSelectedGlow,
                    isConnected && { borderColor: lineColors[item] }
                  ]} 
                  {...createLinePanResponder(item).panHandlers}
                >
                  <Text style={[styles.letterNodeText, { color: lineColors[item] }]}>{item}</Text>
                </View>
              );
            })}

            {/* Render right-hand column nodes dynamically (shuffled) */}
            {rightItems.map((item, index) => {
              const isConnected = connections.some(c => c.to === item);
              const matchingLeftItem = leftItems.find(l => correctMatches[l] === item);
              const borderColor = isConnected && matchingLeftItem ? lineColors[matchingLeftItem] : '#E2E8F0';
              const textColor = matchingLeftItem ? lineColors[matchingLeftItem] : '#37474F';

              return (
                <TouchableOpacity 
                  key={item}
                  activeOpacity={0.8}
                  onPress={() => handleRightNodePress(item)}
                  style={[
                    styles.nodeContainer, 
                    { right: 10, top: 20 + index * 120, borderColor }
                  ]}
                >
                  <Text style={[styles.letterNodeText, { color: textColor }]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Ex 2: Picture Matching (Dynamically displays teacher's configured picture) */}
      {currentSubStep === 1 && (
        <View style={styles.gameCard}>
          <Text style={styles.instruction}>Picture Matching</Text>
          <View style={styles.focusContainer}>
            {activePicQuestion.imageUri ? (
              <Image source={{ uri: activePicQuestion.imageUri }} style={styles.focusImage} />
            ) : (
              <FontAwesome5 name="apple-alt" size={90} color="#FF5E5E" />
            )}
          </View>
          <View style={styles.optionsColumn}>
            {picChoices.map((opt, idx) => (
              <TouchableOpacity key={idx} style={styles.tactileOptionLong} onPress={() => handleAnswer(opt.isCorrect)}>
                <Text style={styles.optionTextLong}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Ex 3: Word Matching (Dynamically displays teacher's configured word and choices) */}
      {currentSubStep === 2 && (
        <View style={styles.gameCard}>
          <Text style={styles.instruction}>Word Matching</Text>
          <View style={styles.focusContainer}>
            <Text style={styles.bigFocusText}>{activeWordQuestion.targetWord || 'WORD'}</Text>
          </View>
          <View style={styles.optionsRow}>
            {wordChoices.map((opt, idx) => (
              <TouchableOpacity key={idx} style={styles.tactileIconOption} onPress={() => handleAnswer(opt.isCorrect)}>
                {opt.uri ? (
                  <Image source={{ uri: opt.uri }} style={styles.choiceImage} />
                ) : (
                  <Ionicons name="image-outline" size={40} color="#1E62D0" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Ex 4: Number Matching (Dynamically displays teacher's configured numeral and choices) */}
      {currentSubStep === 3 && (
        <View style={styles.gameCard}>
          <Text style={styles.instruction}>Number Matching</Text>
          <View style={styles.focusContainer}>
            <Text style={styles.bigFocusText}>{activeNumQuestion.targetNumber || '?'}</Text>
          </View>
          <View style={styles.optionsColumn}>
            {numChoices.map((opt, idx) => (
              <TouchableOpacity key={idx} style={styles.tactileOptionLong} onPress={() => handleAnswer(opt.isCorrect)}>
                <Text style={styles.optionTextLong}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Ex 5: Phonics Sound Matching (Dynamically executes custom voice and features side-by-side optional image) */}
      {currentSubStep === 4 && (
        <View style={styles.gameCard}>
          <Text style={styles.instruction}>Phonics Sound Matching</Text>
          <View style={styles.centerSectionRow}>
            <TouchableOpacity onPress={playExerciseAudio} style={styles.soundButton}>
              <Ionicons name="volume-high" size={50} color="#FFFFFF" />
            </TouchableOpacity>
            {activeSoundQuestion.optionalImageUri && (
              <View style={styles.studentOptionalImageContainer}>
                <Image source={{ uri: activeSoundQuestion.optionalImageUri }} style={styles.studentOptionalImage} />
              </View>
            )}
          </View>
          <View style={styles.optionsColumn}>
            {soundChoices.map((opt, idx) => (
              <TouchableOpacity key={idx} style={styles.tactileOptionLong} onPress={() => handleAnswer(opt.isCorrect)}>
                <Text style={styles.optionTextLong}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  // --- RENDER STORYTELLING (STAGE 2) ---
  const RenderStory = () => {
    const currentSentence = activeStory.sentences[storySentenceIndex];
    if (!currentSentence) return null;

    return (
      <ScrollView contentContainerStyle={styles.storyScrollView}>
        <Text style={styles.storyHeaderTitle}>"{activeStory.title}"</Text>
        
        <View style={styles.storySceneFrame}>
          {currentSentence.illustrationUri ? (
            <Image source={{ uri: currentSentence.illustrationUri }} style={styles.storyIllustration} />
          ) : (
            <>
              <MaterialCommunityIcons name="dog" size={80} color="#8D6E63" style={{ marginRight: 25 }} />
              <Ionicons name="basketball" size={80} color="#FF6B6B" />
            </>
          )}
        </View>

        <View style={styles.sentenceWrapper}>
          <View style={styles.wordPillContainer}>
            {currentSentence.text.split(" ").map((word, idx) => (
              <TouchableOpacity 
                key={idx} 
                onPress={() => handleWordTap(word)}
                style={[
                  styles.wordPill,
                  highlightedWordIndex === idx && styles.activeWordPill
                ]}
              >
                <Text style={[styles.wordText, highlightedWordIndex === idx && styles.activeWordText]}>
                  {word}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.storyGuideText}>Tap words above to hear Champ pronounce them!</Text>

        <TouchableOpacity onPress={handleReadFullSentence} style={styles.storySpeakBtn}>
          <Ionicons name="play-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.storySpeakBtnText}>Read Sentence</Text>
        </TouchableOpacity>

        <View style={styles.storyNavControls}>
          {storySentenceIndex > 0 ? (
            <TouchableOpacity onPress={() => setStorySentenceIndex(storySentenceIndex - 1)} style={styles.storyNavPill}>
              <Ionicons name="arrow-back" size={24} color="#1E62D0" />
            </TouchableOpacity>
          ) : <View style={{ width: 60 }} />}

          {storySentenceIndex < activeStory.sentences.length - 1 ? (
            <TouchableOpacity onPress={() => setStorySentenceIndex(storySentenceIndex + 1)} style={styles.storyNavPill}>
              <Ionicons name="arrow-forward" size={24} color="#1E62D0" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setStage('quiz_intro')} style={styles.startQuizBtn}>
              <Text style={styles.startQuizBtnText}>Done Reading!</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  };

  // --- RENDER QUIZ GAME (STAGE 3) ---
  const RenderQuiz = () => (
    <View style={styles.gameBox}>
      {/* Quiz 1: Picture Comprehension (picture_comp) */}
      {currentSubStep === 0 && (
        <View style={styles.gameCard}>
          <Text style={styles.instruction}>{activeStory.quizzes[0]?.question || "Comprehension Question"}</Text>
          <View style={styles.focusContainer}>
            <Ionicons name="basketball" size={100} color="#FF6B6B" />
          </View>
          <View style={styles.optionsColumn}>
            {quiz1Choices.map((opt, idx) => (
              <TouchableOpacity key={idx} style={styles.tactileOptionLong} onPress={() => handleAnswer(opt.isCorrect)}>
                <Text style={styles.optionTextLong}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Quiz 2: Sequence */}
      {currentSubStep === 1 && (
        <View style={styles.gameCard}>
          <Text style={styles.instruction}>{activeStory.quizzes[1]?.question || "What happened first?"}</Text>
          <View style={styles.optionsColumn}>
            {quiz2Choices.map((opt, idx) => (
              <TouchableOpacity key={idx} style={styles.tactileOptionLong} onPress={() => handleAnswer(opt.isCorrect)}>
                <Text style={styles.optionTextLong}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Quiz 3: Vocabulary Match */}
      {currentSubStep === 2 && (
        <View style={styles.gameCard}>
          <Text style={styles.instruction}>{activeStory.quizzes[2]?.question || "Which picture shows?"}</Text>
          <View style={styles.optionsRow}>
            {quiz3Choices.map((opt, idx) => (
              <TouchableOpacity key={idx} style={styles.tactileIconOption} onPress={() => handleAnswer(opt.isCorrect)}>
                {opt.uri ? (
                  <Image source={{ uri: opt.uri }} style={styles.choiceImage} />
                ) : (
                  <MaterialCommunityIcons name={opt.fallbackIcon} size={50} color="#FF6B6B" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Quiz 4: Read Aloud Challenge */}
      {currentSubStep === 3 && (
        <View style={styles.gameCard}>
          <Text style={styles.instruction}>Challenge: Read Aloud!</Text>
          <View style={styles.speakingBox}>
            <Text style={styles.speakingText}>
              "{activeStory.quizzes[3]?.targetSentence || activeStory.sentences[0]?.text}"
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              speak("Amazing reading! Checking results!");
              setTimeout(() => handleAnswer(true), 1500);
            }} 
            style={styles.micCircleButton}
          >
            <Ionicons name="mic" size={44} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.storyGuideText}>Tap the mic and read out loud!</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER WITH PROGRESS TRACKERS */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => { Speech.stop(); navigation.goBack(); }}>
          <Ionicons name="close" size={30} color="#B0BEC5" />
        </TouchableOpacity>
        
        <View style={styles.pBarBg}>
          <Animated.View 
            style={[
              styles.pBarFill, 
              { 
                width: stage === 'exercise' ? `${((currentSubStep + 1) / 10) * 100}%` :
                       stage === 'story' ? '50%' :
                       stage === 'quiz' ? `${((currentSubStep + 6) / 10) * 100}%` : '100%'
              }
            ]} 
          />
        </View>

        {stage === 'quiz' ? (
          <View style={styles.heartBox}>
            <Ionicons name="heart" size={24} color="#FF5252" />
            <Text style={styles.heartText}>{lives}</Text>
          </View>
        ) : (
          <View style={styles.practiceBadge}>
            <Ionicons name="school" size={20} color="#1E62D0" style={{ marginRight: 4 }} />
            <Text style={styles.practiceBadgeText}>Practice</Text>
          </View>
        )}
      </SafeAreaView>

      {/* BACKGROUND DECORATIONS */}
      <View style={styles.bgDecorations} pointerEvents="none">
        <Text style={[styles.bgDecorLetter, { top: '15%', left: '8%', color: '#FF6B6B' }]}>A</Text>
        <Text style={[styles.bgDecorLetter, { top: '18%', right: '12%', color: '#4D96FF' }]}>B</Text>
        <Text style={[styles.bgDecorLetter, { top: '48%', left: '6%', color: '#6BCB77' }]}>C</Text>
        <Text style={[styles.bgDecorLetter, { bottom: '24%', left: '12%', color: '#4D96FF' }]}>1</Text>
        <Text style={[styles.bgDecorLetter, { bottom: '20%', right: '12%', color: '#FF6B6B' }]}>2</Text>
        <View style={[styles.bgCircle, { top: '25%', right: '20%', width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFD93D' }]} />
        <View style={[styles.bgCircle, { bottom: '38%', left: '20%', width: 22, height: 22, borderRadius: 11, backgroundColor: '#6BCB77' }]} />
      </View>

      {/* DYNAMIC SCREEN VIEWPORT */}
      <View style={{ flex: 1, justifyContent: 'center', zIndex: 5 }}>
        {stage === 'exercise_intro' && (
          <RenderIntroScreen 
            icon="game-controller-outline"
            title="Welcome! let's have fun first with Matchy-Matchy Game!"
            description="Play games to warm up your brain! There are no penalties here, so let's have fun!"
            buttonText="Are you ready?"
            onStart={() => { setStage('exercise'); setCurrentSubStep(0); }}
          />
        )}
        
        {stage === 'exercise' && <RenderExercise />}
        
        {stage === 'story_intro' && (
          <RenderIntroScreen 
            icon="book-outline"
            title="Great job! Now let's read the story together."
            description={`We are going to read '${activeStory.title}'. You can click words to learn their sounds!`}
            buttonText="Are you ready to read?"
            onStart={() => { setStage('story'); setStorySentenceIndex(0); }}
          />
        )}
        
        {stage === 'story' && <RenderStory />}
        
        {stage === 'quiz_intro' && (
          <RenderIntroScreen 
            icon="checkmark-done-circle-outline"
            title="Let's check what you learned! Are you ready for the quiz?"
            description="This is the main challenge where your hearts count. Read carefully!"
            buttonText="Start Quiz!"
            onStart={() => { setStage('quiz'); setCurrentSubStep(0); }}
          />
        )}
        
        {stage === 'quiz' && <RenderQuiz />}
      </View>

      {/* CENTERED FEEDBACK POP-UP */}
      <Modal visible={isCorrect !== null} transparent animationType="fade">
        <View style={styles.centerOverlay}>
          <View style={[styles.feedbackCard, { backgroundColor: isCorrect ? '#78C800' : '#FF5252' }]}>
            <Text style={styles.feedbackText}>{isCorrect ? feedbackMsg : "TRY AGAIN!"}</Text>
            {isCorrect && <Text style={styles.xpGain}>+10 XP ✨</Text>}
            <TouchableOpacity 
              style={styles.popBtn} 
              onPress={handleFeedbackDismiss}
            >
              <Text style={{ fontWeight: '900', color: isCorrect ? '#78C800' : '#FF5252' }}>
                {isCorrect ? "CONTINUE" : "TRY AGAIN"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* GAME OVER MODAL */}
      <Modal visible={isGameOver} transparent animationType="slide">
        <View style={styles.rewardOverlay}>
          <View style={[styles.rewardCard, { backgroundColor: '#FF5252' }]}>
            <Ionicons name="heart-dislike" size={80} color="white" />
            <Text style={styles.rewardTitle}>YOU LOSE!</Text>
            <Text style={styles.rewardXP}>YOU USED ALL OF YOUR LIVES.</Text>
            <TouchableOpacity 
              style={styles.doneBtn} 
              onPress={() => { setLives(5); setIsGameOver(false); setStage('exercise_intro'); setCurrentSubStep(0); }}
            >
              <Text style={[styles.doneText, { color: '#FF5252' }]}>TRY AGAIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: 'white', marginTop: 20, fontWeight: 'bold' }}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS REWARD MODAL */}
      <Modal visible={showReward} transparent animationType="slide">
        <View style={styles.rewardOverlay}>
          <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.rewardCard}>
            <MaterialCommunityIcons name="party-popper" size={60} color="white" />
            <Text style={styles.rewardTitle}>LEVEL {levelId} CLEAR!</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>SCORE</Text>
                <Text style={styles.statVal}>{score}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>XP</Text>
                <Text style={styles.statVal}>+{xpEarned}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>LIVES USED</Text>
                <Text style={styles.statVal}>{5 - lives}</Text>
              </View>
            </View>
            
            <View style={styles.badgeBox}>
              <MaterialCommunityIcons name="trophy-variant" size={50} color="#FFA000" />
              <Text style={styles.badgeName}>Level 1 Reading Hero Unlocked!</Text>
            </View>
            
            <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.doneText}>FINISH</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#EBF5FF' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, 
    paddingBottom: 15, 
    elevation: 4, 
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#D0E1FD',
  },
  pBarBg: { 
    flex: 1, 
    height: 16, 
    backgroundColor: '#F0F0F0', 
    borderRadius: 10, 
    marginHorizontal: 15, 
    overflow: 'hidden' 
  },
  pBarFill: { 
    height: '100%', 
    backgroundColor: '#78C800', 
    borderRadius: 10 
  },
  heartBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF1F0', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 15 
  },
  heartText: { 
    marginLeft: 5, 
    fontWeight: '900', 
    color: '#FF5252', 
    fontSize: 16 
  },
  practiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#D0E1FD',
  },
  practiceBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E62D0',
  },
  bgDecorations: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  bgDecorLetter: {
    position: 'absolute',
    fontWeight: '900',
    fontSize: 34,
    opacity: 0.1,
  },
  bgCircle: {
    position: 'absolute',
    opacity: 0.15,
  },
  gameBox: { 
    flex: 1, 
    padding: 24, 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 5,
  },
  instruction: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#1E62D0', 
    textAlign: 'center', 
    marginBottom: 20,
    lineHeight: 32,
  },
  gameCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D0E1FD',
    borderBottomWidth: 6,
    borderBottomColor: '#B5D3F7',
    elevation: 3,
  },
  gameCardLarge: {
    width: '100%',
    height: '92%', 
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D0E1FD',
    borderBottomWidth: 6,
    borderBottomColor: '#B5D3F7',
    elevation: 3,
  },
  focusContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E2E8F0',
    marginBottom: 25,
    overflow: 'hidden', 
  },
  focusImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bigFocusText: {
    fontSize: 65,
    fontWeight: '900',
    color: '#1E62D0',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  optionsColumn: {
    width: '100%',
    gap: 12,
    marginTop: 10,
  },
  tactileOption: {
    width: '30%',
    height: 65,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E0',
    borderBottomWidth: 5,
    borderBottomColor: '#CBD5E0',
  },
  tactileOptionLong: {
    width: '100%',
    height: 58,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D0E1FD',
    borderBottomWidth: 5,
    borderBottomColor: '#B5D3F7',
  },
  tactileIconOption: {
    width: '30%',
    height: 75,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D0E1FD',
    borderBottomWidth: 5,
    borderBottomColor: '#B5D3F7',
    overflow: 'hidden',
  },
  choiceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 18,
  },
  optionText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E62D0',
  },
  optionTextLong: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4A5568',
  },
  soundButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4D96FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#1E62D0',
  },
  studentOptionalImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D0E1FD',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  studentOptionalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  micCircleButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: '#E04A4A',
    marginBottom: 15,
  },
  speakingBox: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  speakingText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E62D0',
    textAlign: 'center',
  },
  centerOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  feedbackCard: { 
    width: width * 0.85, 
    padding: 30, 
    borderRadius: 35, 
    alignItems: 'center', 
    elevation: 20 
  },
  feedbackText: { 
    color: 'white', 
    fontSize: 32, 
    fontWeight: '900', 
    textAlign: 'center' 
  },
  xpGain: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 5 
  },
  popBtn: { 
    backgroundColor: 'white', 
    paddingHorizontal: 50, 
    paddingVertical: 15, 
    borderRadius: 25, 
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rewardOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.85)', 
    justifyContent: 'center', 
    padding: 30 
  },
  rewardCard: { 
    borderRadius: 50, 
    padding: 30, 
    alignItems: 'center', 
    width: '100%' 
  },
  rewardTitle: { 
    color: 'white', 
    fontSize: 32, 
    fontWeight: '900', 
    marginTop: 10 
  },
  rewardXP: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginVertical: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    padding: 15, 
    borderRadius: 20 
  },
  statItem: { 
    alignItems: 'center' 
  },
  statLabel: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold', 
    opacity: 0.8 
  },
  statVal: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '900' 
  },
  badgeBox: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 30, 
    alignItems: 'center', 
    width: '100%', 
    elevation: 5 
  },
  badgeName: { 
    fontWeight: '900', 
    color: '#455A64', 
    marginTop: 10,
    fontSize: 16,
  },
  doneBtn: { 
    backgroundColor: 'white', 
    paddingVertical: 15, 
    paddingHorizontal: 50, 
    borderRadius: 25, 
    marginTop: 30 
  },
  doneText: { 
    color: '#FFA000', 
    fontWeight: '900', 
    fontSize: 18 
  },
  // --- STORYTELLING SPECIFIC STYLES ---
  storyScrollView: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyHeaderTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E62D0',
    textAlign: 'center',
    marginBottom: 4,
  },
  storySceneFrame: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#D0E1FD',
    marginBottom: 20,
    width: '100%',
  },
  storyIllustration: {
    width: '100%',
    height: 150,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  sentenceWrapper: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D0E1FD',
    marginBottom: 15,
  },
  wordPillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  wordPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeWordPill: {
    backgroundColor: '#FFD93D',
    borderColor: '#E2C010',
  },
  wordText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3748',
  },
  activeWordText: {
    color: '#000000',
  },
  storyGuideText: {
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
    fontWeight: '700',
  },
  storySpeakBtn: {
    flexDirection: 'row',
    backgroundColor: '#1E62D0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#124190',
    marginBottom: 25,
  },
  storySpeakBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },
  storyNavControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  storyNavPill: {
    width: 60,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#D0E1FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#B5D3F7',
  },
  startQuizBtn: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#E04A4A',
  },
  startQuizBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  // --- TRANSITIONAL SCREEN STYLES ---
  introContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  introCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 35,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D0E1FD',
    borderBottomWidth: 8,
    borderBottomColor: '#B5D3F7',
    elevation: 4,
  },
  introIconFrame: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1E62D0',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 38,
  },
  introDescription: {
    fontSize: 18,
    fontWeight: '800',
    color: '#718096',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 30,
  },
  introButton: {
    width: '90%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E04A4A',
    justifyContent: 'flex-start',
  },
  introButtonInner: {
    flex: 1,
    height: 54,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introButtonText: {
    fontSize: 20,
    fontWeight: '950',
    color: '#FFFFFF',
  },
  // --- LINE DRAWING STYLES ---
  matchingBoard: {
    width: 290,
    height: 360,
    alignSelf: 'center',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  nodeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E2E8F0',
    borderStyle: 'solid',
    elevation: 3,
    position: 'absolute',
  },
  nodeSelectedGlow: {
    borderWidth: 4,
    borderColor: '#FFD93D',
  },
  letterNodeText: {
    fontSize: 32,
    fontWeight: '900',
  },
  drawnLineSegment: {
    position: 'absolute',
    height: 8, 
    borderRadius: 4,
    zIndex: 5, 
  },
  centerSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  studentOptionalImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D0E1FD',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  studentOptionalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }
});

export default LessonScreen;