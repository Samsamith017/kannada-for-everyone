'use client';

import React, { useState, useEffect, useMemo } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('words');

  // Dark / Light Theme state (Defaulted to True / Dark Mode)
  const [darkMode, setDarkMode] = useState(true);

  //block to register the service worker
  
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch((err) => console.log('Service Worker registration failed: ', err));
    }
  }, []);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state & Review Round state
  const [shuffledQuiz, setShuffledQuiz] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [isReviewRound, setIsReviewRound] = useState(false);
  const [pendingReviewQuestions, setPendingReviewQuestions] = useState([]);

  // Streak & Lost Streaks state with localStorage & 24h window logic
  const [streak, setStreak] = useState(1);
  const [lostStreaks, setLostStreaks] = useState(0);

  useEffect(() => {
    const savedStreak = localStorage.getItem('kannada_streak');
    const savedLastActive = localStorage.getItem('kannada_last_active');
    const savedLost = localStorage.getItem('kannada_lost_streaks');

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (savedLastActive) {
      const lastActive = parseInt(savedLastActive, 10);
      const diff = now - lastActive;

      if (diff <= oneDayMs) {
        if (savedStreak) setStreak(parseInt(savedStreak, 10));
      } else if (diff <= 2 * oneDayMs) {
        const currentStreak = savedStreak ? parseInt(savedStreak, 10) : 1;
        setStreak(currentStreak + 1);
        localStorage.setItem('kannada_streak', (currentStreak + 1).toString());
      } else {
        const missedDays = Math.floor(diff / oneDayMs) - 1;
        const currentLost = savedLost ? parseInt(savedLost, 10) : 0;
        const totalLost = currentLost + missedDays;
        setLostStreaks(totalLost);
        localStorage.setItem('kannada_lost_streaks', totalLost.toString());
        setStreak(1);
        localStorage.setItem('kannada_streak', '1');
      }
    } else {
      localStorage.setItem('kannada_streak', '1');
    }

    localStorage.setItem('kannada_last_active', now.toString());
  }, []);

  const [completedFlashcards, setCompletedFlashcards] = useState(new Set());

  // Translator state
  const [searchTerm, setSearchTerm] = useState('');
  const [targetLang, setTargetLang] = useState('kn');

  // Basic Words Category Selector
  const [activeWordCategory, setActiveWordCategory] = useState('Question Words');

  // Interactive Sub-Box State for "How"
  const [showHowSubBox, setShowHowSubBox] = useState(false);

  // Modal State for Daily Phrases Situation Subheadings
  const [selectedPhraseCategory, setSelectedPhraseCategory] = useState('Travel');

  // Variations for "How"
  const howPhrases = [
    { kannada: 'ಎಷ್ಟು?', english: 'How much?', phonetic: 'Eshtu?' },
    { kannada: 'ಎಷ್ಟು ಜನರು / ಸಂಖ್ಯೆ?', english: 'How many?', phonetic: 'Eshtu janaru / sankhye?' },
    { kannada: 'ಎಷ್ಟು ಸಮಯ?', english: 'How long?', phonetic: 'Eshtu samaya?' },
    { kannada: 'ಎಷ್ಟು ದೂರ?', english: 'How far?', phonetic: 'Eshtu dūra?' },
    { kannada: 'ಎಷ್ಟು ಬಾರಿ?', english: 'How often?', phonetic: 'Eshtu bāri?' }
  ];

  // 1. Core Vocabulary Database (Basic Words)
  const words = useMemo(() => [
    { kannada: 'ಏನು', english: 'What', phonetic: 'Yēnu', category: 'Question Words', keywords: ['what', 'yenu', 'enu'] },
    { kannada: 'ಯಾರು', english: 'Who', phonetic: 'Yāru', category: 'Question Words', keywords: ['who', 'yaru'] },
    { kannada: 'ಯಾವಾಗ', english: 'When', phonetic: 'Yāvāga', category: 'Question Words', keywords: ['when', 'yavaga'] },
    { kannada: 'ಏಕೆ / ಏತಕ್ಕೆ', english: 'Why', phonetic: 'Ēkē / Ētakke', category: 'Question Words', keywords: ['why', 'eke', 'etakke'] },
    { kannada: 'ಹೇಗೆ', english: 'How', phonetic: 'Hēge', category: 'Question Words', isHowWord: true, keywords: ['how', 'hege'] },
    { kannada: 'ಯಾವುದು', english: 'Which', phonetic: 'Yāvudu', category: 'Question Words', keywords: ['which', 'yavudu'] },
    { kannada: 'ಯಾರದ್ದು', english: 'Whose', phonetic: 'Yāraddu', category: 'Question Words', keywords: ['whose', 'yaraddu'] },
    { kannada: 'ಎಲ್ಲಿ', english: 'Where', phonetic: 'Elli', category: 'Question Words', keywords: ['where', 'elli'] },

    { kannada: 'ನೀವು', english: 'You', phonetic: 'Neevu', category: 'Pronouns', keywords: ['you', 'neevu'] },
    { kannada: 'ನನಗೆ / ನಾನು', english: 'Me / I', phonetic: 'Nanage / Nānu', category: 'Pronouns', keywords: ['me', 'i', 'nanage', 'naanu'] },
    { kannada: 'ಅವರು', english: 'They', phonetic: 'Avaru', category: 'Pronouns', keywords: ['they', 'avaru'] },
    { kannada: 'ಅವರಿಗೆ', english: 'Them', phonetic: 'Avarige', category: 'Pronouns', keywords: ['them', 'avarige'] },
    { kannada: 'ನಮಗೆ', english: 'Us', phonetic: 'Namage', category: 'Pronouns', keywords: ['us', 'namage'] },
    { kannada: 'ಎಲ್ಲರೂ', english: 'All', phonetic: 'Ellarū', category: 'Pronouns', keywords: ['all', 'ellaru'] },
    { kannada: 'ನಾವು', english: 'We', phonetic: 'Nāvu', category: 'Pronouns', keywords: ['we', 'naavu'] },

    { kannada: 'ಉತ್ತರ', english: 'North', phonetic: 'Uttara', category: 'Directions', keywords: ['north', 'uttara'] },
    { kannada: 'ದಕ್ಷಿಣ', english: 'South', phonetic: 'Dakshina', category: 'Directions', keywords: ['south', 'dakshina'] },
    { kannada: 'ಪೂರ್ವ', english: 'East', phonetic: 'Pūrva', category: 'Directions', keywords: ['east', 'purva'] },
    { kannada: 'ಪಶ್ಚಿಮ', english: 'West', phonetic: 'Paschima', category: 'Directions', keywords: ['west', 'paschima'] },
    { kannada: 'ನೇರವಾಗಿ', english: 'Straight', phonetic: 'Nēravāgi', category: 'Directions', keywords: ['straight', 'neravaagi'] },
    { kannada: 'ಬಲಗಡೆ', english: 'Right', phonetic: 'Balagade', category: 'Directions', keywords: ['right', 'balagade'] },
    { kannada: 'ಎಡಗಡೆ', english: 'Left', phonetic: 'Edagade', category: 'Directions', keywords: ['left', 'edagade'] },

    { kannada: 'ನಮಸ್ಕಾರ', english: 'Hello / Greetings', phonetic: 'Namaskāra', category: 'Greetings', keywords: ['hi', 'hello', 'hey', 'namaste', 'greetings', 'namaskara'] },
    { kannada: 'ಧನ್ಯವಾದ', english: 'Thank you', phonetic: 'Dhanyavāda', category: 'Greetings', keywords: ['thanks', 'thank you', 'thx', 'dhanyavada'] },
    { kannada: 'ಶುಭೋದಯ', english: 'Good Morning', phonetic: 'Shubhōdaya', category: 'Greetings', keywords: ['good morning', 'morning', 'shubhodaya'] },
    { kannada: 'ಶುಭರಾತ್ರಿ', english: 'Good Night', phonetic: 'Shubharātri', category: 'Greetings', keywords: ['good night', 'night', 'shubharatri'] },
    { kannada: 'ನೀವು ಹೇಗಿದ್ದೀರಾ?', english: 'How are you?', phonetic: 'Neevu hēgiddīrā?', category: 'Greetings', keywords: ['how are you', 'how r u', 'hru', 'neevu hegiddira'] },
    { kannada: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ', english: 'I am fine', phonetic: 'Nānu chennāgiddēne', category: 'Greetings', keywords: ['i am fine', 'fine', 'good', 'naanu chennaagiddene'] },
    { kannada: 'ವಿದಾಯ', english: 'Goodbye', phonetic: 'Vidāya', category: 'Greetings', keywords: ['bye', 'goodbye', 'see you', 'vidaaya'] },

    { kannada: 'ಹೌದು', english: 'Yes', phonetic: 'Haudu', category: 'Basics', keywords: ['yes', 'yeah', 'yep', 'haudu'] },
    { kannada: 'ಇಲ್ಲ', english: 'No', phonetic: 'Illa', category: 'Basics', keywords: ['no', 'nope', 'nah', 'illa'] },
    { kannada: 'ಬನ್ನಿ', english: 'Come / Welcome', phonetic: 'Banni', category: 'Basics', keywords: ['come', 'welcome', 'banni', 'in'] },
    { kannada: 'ಹೋಗಿ', english: 'Go', phonetic: 'Hōgi', category: 'Basics', keywords: ['go', 'hogi', 'leave'] },
    { kannada: 'ದಯವಿಟ್ಟು', english: 'Please', phonetic: 'Dayavittu', category: 'Basics', keywords: ['please', 'pls', 'dayavittu'] },
    { kannada: 'ಕ್ಷಮಿಸಿ', english: 'Sorry / Excuse me', phonetic: 'Kshamisi', category: 'Basics', keywords: ['sorry', 'excuse me', 'kshamisi'] },
    { kannada: 'ಸರಿ', english: 'Okay / Correct', phonetic: 'Sari', category: 'Basics', keywords: ['ok', 'okay', 'correct', 'right', 'sari'] },
    { kannada: 'ಹೆಸರು', english: 'Name', phonetic: 'Hesaru', category: 'Basics', keywords: ['name', 'hesaru'] },
    { kannada: 'ಊಟ', english: 'Food / Meal', phonetic: 'Ūta', category: 'Basics', keywords: ['food', 'meal', 'lunch', 'dinner', 'oota'] }
  ], []);

  // 2. Grouped Daily Phrases by Context
  const phraseCategories = useMemo(() => [
    {
      context: 'Travel',
      icon: '🚕',
      badgeColor: darkMode ? 'bg-blue-900/40 text-blue-300 border-blue-800/60' : 'bg-blue-100 text-blue-800 border-blue-200',
      items: [
        { kannada: 'ಇಲ್ಲಿಗೆ ಎಷ್ಟು ಆಗುತ್ತೆ?', english: 'How much to go here?', phonetic: 'Illige eshtu aagutte?', keywords: ['how much to go here', 'auto fare'] },
        { kannada: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', english: 'Where is the bus stop?', phonetic: 'Bus nildāna ellide?', keywords: ['where is the bus stop', 'bus stop'] },
        { kannada: 'ನನಗೆ ಇಲ್ಲಿ ಇಳಿಯಬೇಕು', english: 'I need to get off here', phonetic: 'Nanage illi iliyabēku', keywords: ['stop here', 'get off here'] },
        { kannada: 'ಮೀಟರ್ ಹಾಕಿ', english: 'Please turn on the meter', phonetic: 'Meter hāki', keywords: ['meter', 'auto meter'] },
        { kannada: 'ನಿಧಾನವಾಗಿ ಚಲಾಯಿಸಿ', english: 'Drive slowly please', phonetic: 'Nidhānavāgi chalāyisi', keywords: ['drive slowly'] }
      ]
    },
    {
      context: 'Shopping',
      icon: '🛍️',
      badgeColor: darkMode ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800/60' : 'bg-emerald-100 text-emerald-800 border-emerald-200',
      items: [
        { kannada: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?', english: 'What is the price of this?', phonetic: 'Idara bele eshtu?', keywords: ['what is the price of this'] },
        { kannada: 'ತುಂಬಾ ಜಾಸ್ತಿ', english: 'Too expensive / Too much', phonetic: 'Tumbā jāsti', keywords: ['too expensive'] },
        { kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ', english: 'Reduce the price a little', phonetic: 'Svalpa kadime mādi', keywords: ['discount', 'reduce price'] },
        { kannada: 'ಒಂದು ಕೆಜಿ ಕೊಡಿ', english: 'Give me one kilogram', phonetic: 'Ondu kg kodi', keywords: ['1kg', 'one kg'] },
        { kannada: 'ಯುಪಿಐ ಪಾವತಿ ಇದೆಯಾ?', english: 'Is UPI / Online payment available?', phonetic: 'UPI pāvati ideyā?', keywords: ['gpay', 'upi'] }
      ]
    },
    {
      context: 'Dining',
      icon: '🍽️',
      badgeColor: darkMode ? 'bg-amber-900/40 text-amber-300 border-amber-800/60' : 'bg-amber-100 text-amber-800 border-amber-200',
      items: [
        { kannada: 'ಊಟ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ', english: 'The food is very tasty', phonetic: 'Ūta tumbā chennāgide', keywords: ['food is very tasty'] },
        { kannada: 'ಕುಡಿಯುವ ನೀರು ಬೇಕು', english: 'Need drinking water', phonetic: 'Kudiyuva neeru bēku', keywords: ['need drinking water'] },
        { kannada: 'ಖಾರ ಕಡಿಮೆ ಮಾಡಿ', english: 'Make it less spicy', phonetic: 'Khāra kadime mādi', keywords: ['make it less spicy'] },
        { kannada: 'ಬಿಲ್ ಕೊಡಿ', english: 'Please bring the bill', phonetic: 'Bill kodi', keywords: ['please bring the bill'] },
        { kannada: 'ತಿಂಡಿ ಏನಿದೆ?', english: 'What breakfast / snacks are available?', phonetic: 'Thindi ēnide?', keywords: ['what breakfast'] }
      ]
    },
    {
      context: 'Directions',
      icon: '🗺️',
      badgeColor: darkMode ? 'bg-purple-900/40 text-purple-300 border-purple-800/60' : 'bg-purple-100 text-purple-800 border-purple-200',
      items: [
        { kannada: 'ಇದು ಎಲ್ಲಿ ಇದೆ?', english: 'Where is this located?', phonetic: 'Idu elli ide?', keywords: ['where is this located'] },
        { kannada: 'ನೇರವಾಗಿ ಹೋಗಿ', english: 'Go straight', phonetic: 'Nēravāgi hōgi', keywords: ['go straight'] },
        { kannada: 'ಬಲಗಡೆ ತಿರುಗಿ', english: 'Turn right', phonetic: 'Balagade tirugi', keywords: ['turn right'] },
        { kannada: 'ಎಡಗಡೆ ತಿರುಗಿ', english: 'Turn left', phonetic: 'Edagade tirugi', keywords: ['turn left'] },
        { kannada: 'ಹತ್ತಿರನಾ ಅಥವಾ ದೂರನಾ?', english: 'Is it near or far?', phonetic: 'Hattiranā athavā dūranā?', keywords: ['is it near or far'] },
        { kannada: 'ಮುಂದೆ ಹೋಗಿ', english: 'Go further ahead', phonetic: 'Munde hōgi', keywords: ['go further ahead'] }
      ]
    },
    {
      context: 'Polite Refusals',
      icon: '🛑',
      badgeColor: darkMode ? 'bg-orange-900/40 text-orange-300 border-orange-800/60' : 'bg-orange-100 text-orange-800 border-orange-200',
      items: [
        { kannada: 'ನನಗೆ ಬೇಡ.', english: "I don't want it.", phonetic: 'Nanage beda.', keywords: ['dont want it', 'beda'] },
        { kannada: 'ಬೇಡ, ಧನ್ಯವಾದ.', english: 'No, thank you.', phonetic: 'Beda, dhanyavada.', keywords: ['no thank you', 'beda dhanyavada'] },
        { kannada: 'ನನಗೆ ಗೊತ್ತಿಲ್ಲ.', english: "I don't know.", phonetic: 'Nanage gothilla.', keywords: ['dont know', 'gothilla'] },
        { kannada: 'ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ.', english: "I don't understand.", phonetic: 'Nanage arthavagthilla.', keywords: ['dont understand', 'arthavagthilla'] },
        { kannada: 'ಇರ್ಲಿ ಬಿಡಿ', english: 'Leave it / Let it be.', phonetic: 'Irli bidi', keywords: ['leave it', 'let it be', 'irli bidi'] }
      ]
    },
    {
      context: 'Emergency',
      icon: '🚨',
      badgeColor: darkMode ? 'bg-rose-900/40 text-rose-300 border-rose-800/60' : 'bg-rose-100 text-rose-800 border-rose-200',
      items: [
        { kannada: 'ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ', english: 'Please help me', phonetic: 'Dayavittu sahāya mādi', keywords: ['please help me'] },
        { kannada: 'ನನಗೆ ಕನ್ನಡ ಬರುವುದಿಲ್ಲ', english: 'I do not know Kannada', phonetic: 'Nanage Kannada baruvudilla', keywords: ['i do not know kannada'] },
        { kannada: 'ವೈದ್ಯರನ್ನು ಕರೆಯಿರಿ', english: 'Call a doctor', phonetic: 'Vaidyarannu kareyiri', keywords: ['call a doctor'] },
        { kannada: 'ಪೋಲಿಸರಿಗೆ ಕರೆ ಮಾಡಿ', english: 'Call the police', phonetic: 'Polisarige kare mādi', keywords: ['call the police'] }
      ]
    }
  ], [darkMode]);

  const allPhrases = useMemo(() => {
    return phraseCategories.flatMap(c => c.items.map(item => ({ ...item, context: c.context })));
  }, [phraseCategories]);

  const allVocabulary = useMemo(() => {
    return [...words, ...allPhrases];
  }, [words, allPhrases]);

  // Dynamically generate diverse quiz questions from all Words and Phrases with shuffled options
  const baseQuizQuestions = useMemo(() => {
    return allVocabulary.map((item) => {
      // Pick 3 random distractor answers from other vocabulary items
      const distractors = allVocabulary
        .filter((v) => v.english !== item.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((v) => v.english);

      const options = [item.english, ...distractors].sort(() => Math.random() - 0.5);

      return {
        question: `What is the English meaning of "${item.kannada}" (${item.phonetic})?`,
        options,
        answer: item.english
      };
    });
  }, [allVocabulary]);

  const initializeQuiz = () => {
    const shuffled = [...baseQuizQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffledQuiz(shuffled);
    setQuizIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setWrongQuestions([]);
    setIsReviewRound(false);
    setPendingReviewQuestions([]);
  };

  React.useEffect(() => {
    initializeQuiz();
  }, [baseQuizQuestions]);

  const progressMetrics = useMemo(() => {
    const cardsMastered = completedFlashcards.size;
    const quizWeight = (score / (shuffledQuiz.length || 10)) * 50; 
    const flashcardWeight = (cardsMastered / words.length) * 50; 
    const percentage = Math.min(100, Math.round(quizWeight + flashcardWeight));

    let levelBadge = 'Beginner Explorer';
    if (percentage >= 80) levelBadge = 'Kannada Master 🌟';
    else if (percentage >= 50) levelBadge = 'Intermediate Scholar 💬';
    else if (percentage >= 25) levelBadge = 'Active Learner 📚';

    return { percentage, levelBadge };
  }, [completedFlashcards, score, shuffledQuiz.length, words.length]);

  const localMatch = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const cleanQuery = searchTerm.toLowerCase().trim();

    let exact = allVocabulary.find((item) => {
      const matchEngExact = item.english.toLowerCase() === cleanQuery;
      const matchKanExact = item.kannada === cleanQuery;
      const matchKwExact = item.keywords && item.keywords.some((kw) => kw.toLowerCase() === cleanQuery);
      return matchEngExact || matchKanExact || matchKwExact;
    });
    if (exact) return exact;

    return allVocabulary.find((item) => {
      const matchEng = item.english.toLowerCase().includes(cleanQuery);
      const matchKan = item.kannada.includes(cleanQuery);
      const matchPhon = item.phonetic.toLowerCase().includes(cleanQuery);
      const matchKw = item.keywords && item.keywords.some((kw) => kw.toLowerCase().includes(cleanQuery));
      return matchEng || matchKan || matchPhon || matchKw;
    });
  }, [searchTerm, allVocabulary]);

  const googleTranslateUrl = useMemo(() => {
    if (!searchTerm.trim()) return 'https://translate.google.com/?sl=auto&tl=kn';
    const source = targetLang === 'kn' ? 'en' : 'kn';
    const target = targetLang === 'kn' ? 'kn' : 'en';
    return `https://translate.google.com/?sl=${source}&tl=${target}&text=${encodeURIComponent(searchTerm.trim())}&op=translate`;
  }, [searchTerm, targetLang]);

  const filteredWords = useMemo(() => {
    return words.filter((w) => w.category === activeWordCategory);
  }, [activeWordCategory, words]);

  const activePhraseCategoryObj = useMemo(() => {
    return phraseCategories.find((c) => c.context === selectedPhraseCategory) || phraseCategories[0];
  }, [selectedPhraseCategory, phraseCategories]);

  const handleNextCard = () => {
    setIsFlipped(false);
    setCompletedFlashcards((prev) => new Set(prev).add(cardIndex));
    setCardIndex((prev) => (prev + 1) % words.length);
  };

  const handleAnswerSelect = (option) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    const currentQ = shuffledQuiz[quizIndex];
    const isCorrect = option === currentQ.answer;
    
    if (isCorrect) {
      if (!isReviewRound) {
        setScore((prev) => prev + 1);
      }
    } else {
      if (!isReviewRound) {
        if (!wrongQuestions.some(q => q.question === currentQ.question)) {
          setWrongQuestions((prev) => [...prev, currentQ]);
        }
      }
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex + 1 < shuffledQuiz.length) {
      setQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      if (isReviewRound) {
        setIsReviewRound(false);
        setShowResult(true);
      } else {
        setShowResult(true);
        setPendingReviewQuestions(wrongQuestions);
      }
    }
  };

  const startReviewRound = () => {
    if (pendingReviewQuestions.length > 0) {
      setShuffledQuiz([...pendingReviewQuestions].sort(() => Math.random() - 0.5));
      setQuizIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsReviewRound(true);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <main className={`min-h-screen relative overflow-x-hidden transition-colors duration-500 font-sans flex flex-col justify-between p-3 sm:p-6 pb-40 ${
        darkMode ? 'bg-gray-950 text-gray-100' : 'bg-amber-50/90 text-gray-900'
      }`}>
        
        {/* Fixed Slantly Flowing Yellow River Gradient on Top Left Corner */}
        <div className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity duration-500 ${
          darkMode 
            ? 'bg-[linear-gradient(135deg,rgba(250,204,21,0.25)_0%,rgba(245,158,11,0.08)_40%,transparent_70%)]' 
            : 'bg-[linear-gradient(135deg,rgba(250,204,21,0.45)_0%,rgba(251,191,36,0.2)_40%,transparent_70%)]'
        }`} />

        {/* Fixed Slantly Flowing Red River Gradient on Bottom Right Corner */}
        <div className={`fixed bottom-0 right-0 w-full h-full pointer-events-none z-0 transition-opacity duration-500 ${
          darkMode 
            ? 'bg-[linear-gradient(315deg,rgba(239,68,68,0.3)_0%,rgba(225,29,72,0.1)_40%,transparent_70%)]' 
            : 'bg-[linear-gradient(315deg,rgba(225,29,72,0.55)_0%,rgba(244,63,94,0.25)_40%,transparent_70%)]'
        }`} />

        <div className="max-w-5xl mx-auto space-y-6 w-full relative z-10 mb-12">

          {/* Dynamic Header & Progress Dashboard with Ultra Glassmorphism */}
          <header className={`backdrop-blur-2xl rounded-2xl p-5 sm:p-6 shadow-2xl border transition-colors duration-300 ${
            darkMode ? 'bg-gray-900/30 border-white/10 shadow-black/40' : 'bg-white/35 border-white/60 shadow-orange-500/5'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-5">
              <div className="text-center md:text-left">
                <div className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full font-bold mb-2 border ${
                  darkMode ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-orange-100/80 text-orange-800 border-orange-200/50'
                }`}>
                  <span>✨ Interactive Kannada Learning</span>
                </div>
                <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  darkMode ? 'text-yellow-400' : 'text-orange-600'
                }`}>
                  Kannada for Everyone
                </h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Learn daily travel, shopping, dining, and direction phrases with instant guides & translator
                </p>
              </div>

              {/* Dashboard Stats & Theme Toggle Button */}
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
                {/* Dark/Light Toggle Button */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`backdrop-blur-xl border px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all font-bold text-sm ${
                    darkMode ? 'bg-white/10 border-white/20 hover:bg-white/20 text-gray-100' : 'bg-white/60 border-orange-200/60 hover:bg-white/80 text-gray-800'
                  }`}
                  title="Toggle Light/Dark Mode"
                >
                  <span className="text-lg">{darkMode ? '🌙' : '☀️'}</span>
                  <span>{darkMode ? 'Dark' : 'Light'}</span>
                </button>

                <div className={`backdrop-blur-xl border px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
                  darkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/60'
                }`}>
                  <div className="relative flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle cx="24" cy="24" r="18" stroke={darkMode ? "#374151" : "#FED7AA"} strokeWidth="4" fill="transparent" />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke={darkMode ? "#FACC15" : "#EA580C"}
                        strokeWidth="4"
                        strokeDasharray={113}
                        strokeDashoffset={113 - (113 * progressMetrics.percentage) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <span className={`absolute text-xs font-bold ${darkMode ? 'text-yellow-400' : 'text-orange-700'}`}>{progressMetrics.percentage}%</span>
                  </div>
                  <div>
                    <span className={`text-xs font-semibold block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Overall Mastery</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{progressMetrics.levelBadge}</span>
                  </div>
                </div>

                <div className={`backdrop-blur-xl border px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 ${
                  darkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/60'
                }`}>
                  <span className="text-2xl animate-pulse">🔥</span>
                  <div>
                    <span className={`text-xs font-semibold block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Streak</span>
                    <span className={`text-base font-bold ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>
                      {streak} Days {lostStreaks > 0 && <span className="text-xs text-rose-500 font-normal">({lostStreaks} lost)</span>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation Tabs with Glassmorphism */}
          <nav className={`backdrop-blur-2xl p-2 rounded-2xl shadow-xl border flex flex-wrap justify-center gap-2 ${
            darkMode ? 'bg-gray-900/30 border-white/10 shadow-black/20' : 'bg-white/40 border-white/60 shadow-orange-500/5'
          }`}>
            {[
              { id: 'words', label: 'Basic Words 📖' },
              { id: 'phrases', label: 'Daily Phrases 💬' },
              { id: 'translator', label: 'Translator 🌐' },
              { id: 'flashcards', label: 'Flashcards ⚡' },
              { id: 'quiz', label: 'Quiz 🎯' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'quiz') initializeQuiz();
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 focus:outline-none cursor-pointer ${
                  activeTab === tab.id
                    ? darkMode ? 'bg-yellow-500 text-gray-950 shadow-lg' : 'bg-orange-500 text-white shadow-lg'
                    : darkMode ? 'text-gray-300 hover:bg-white/10 hover:text-yellow-300' : 'text-gray-700 hover:bg-white/60 hover:text-orange-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* TAB 1: BASIC WORDS */}
          {activeTab === 'words' && (
            <section className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                {['Question Words', 'Pronouns', 'Directions', 'Greetings', 'Basics'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveWordCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer backdrop-blur-xl border ${
                      activeWordCategory === cat
                        ? darkMode ? 'bg-yellow-500 text-gray-950 border-yellow-400 shadow-lg' : 'bg-orange-600 text-white border-orange-500 shadow-lg'
                        : darkMode ? 'bg-gray-900/30 text-gray-200 border-white/10 hover:bg-white/10' : 'bg-white/50 text-gray-700 border-white/60 hover:bg-white/80'
                    }`}
                  >
                    {cat === 'Question Words' && '❓ Question Words'}
                    {cat === 'Pronouns' && '👤 Pronouns'}
                    {cat === 'Directions' && '🧭 Directions'}
                    {cat === 'Greetings' && '🙏 Greetings'}
                    {cat === 'Basics' && '💬 Basics'}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWords.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (item.isHowWord) setShowHowSubBox(true);
                    }}
                    className={`backdrop-blur-2xl p-5 rounded-2xl shadow-xl border transition-all flex flex-col justify-between ${
                      darkMode ? 'bg-gray-900/30 shadow-black/20' : 'bg-white/40 shadow-orange-500/5'
                    } ${
                      item.isHowWord
                        ? darkMode ? 'border-yellow-500/50 bg-yellow-950/20 hover:bg-yellow-900/30 cursor-pointer relative ring-2 ring-yellow-400/30' : 'border-orange-400 bg-orange-50/70 hover:bg-orange-100/80 cursor-pointer relative ring-2 ring-orange-400/30'
                        : darkMode ? 'border-white/10 hover:border-yellow-500/50' : 'border-white/60 hover:border-orange-300'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          darkMode ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-orange-100/80 text-orange-800 border-orange-200/50'
                        }`}>
                          {item.category}
                        </span>
                        {item.isHowWord && (
                          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md animate-pulse ${
                            darkMode ? 'bg-red-500 text-white' : 'bg-orange-600 text-white'
                          }`}>
                            Click for variations ➔
                          </span>
                        )}
                      </div>
                      <h3 className={`text-2xl font-extrabold mb-1 ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>{item.kannada}</h3>
                      <p className={`text-xs font-semibold italic mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{item.phonetic}</p>
                    </div>
                    <div className={`border-t pt-2 font-semibold text-sm ${darkMode ? 'border-white/10 text-gray-200' : 'border-white/60 text-gray-800'}`}>
                      {item.english}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-Box Modal for "How" */}
              {showHowSubBox && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                  <div className={`backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border space-y-4 ${
                    darkMode ? 'bg-gray-900/90 border-white/20' : 'bg-white/90 border-white/60'
                  }`}>
                    <div className={`flex justify-between items-center border-b pb-3 ${darkMode ? 'border-white/10' : 'border-orange-100'}`}>
                      <div>
                        <h3 className={`text-2xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>
                          <span>❓</span> Variations of "How" (ಹೇಗೆ)
                        </h3>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Everyday Kannada phrases built with "How"</p>
                      </div>
                      <button
                        onClick={() => setShowHowSubBox(false)}
                        className={`font-extrabold text-xl p-1 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors ${
                          darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {howPhrases.map((h, idx) => (
                        <div key={idx} className={`border p-4 rounded-xl flex justify-between items-center backdrop-blur-xl ${
                          darkMode ? 'bg-white/5 border-white/10' : 'bg-orange-50/70 border-orange-200/60'
                        }`}>
                          <div>
                            <span className={`text-xs font-extrabold uppercase tracking-wide block ${darkMode ? 'text-yellow-400' : 'text-orange-700'}`}>{h.english}</span>
                            <span className="text-xs text-gray-400 italic">{h.phonetic}</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold block ${darkMode ? 'text-gray-100' : 'text-orange-600'}`}>{h.kannada}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowHowSubBox(false)}
                      className={`w-full font-bold py-3 rounded-xl shadow-lg transition-all cursor-pointer ${
                        darkMode ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:opacity-90' : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* TAB 2: DAILY PHRASES */}
          {activeTab === 'phrases' && (
            <section className="space-y-6">
              <div className={`backdrop-blur-2xl border p-4 rounded-xl text-center shadow-md ${
                darkMode ? 'bg-gray-900/40 border-white/10 text-yellow-300' : 'bg-white/40 border-white/60 text-orange-900'
              }`}>
                <p className="text-sm font-semibold">
                  📌Choose a situation to explore essential phrases ✦
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {phraseCategories.map((cat) => (
                  <button
                    key={cat.context}
                    onClick={() => setSelectedPhraseCategory(cat.context)}
                    className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer flex items-center gap-2 backdrop-blur-xl border ${
                      selectedPhraseCategory === cat.context
                        ? darkMode ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white border-transparent shadow-lg ring-2 ring-yellow-400/40' : 'bg-orange-600 text-white border-orange-500 shadow-lg ring-2 ring-orange-400/50'
                        : darkMode ? 'bg-gray-900/40 text-gray-200 border-white/10 hover:bg-white/10' : 'bg-white/40 text-gray-700 border-white/60 hover:bg-white/70'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    {cat.context}
                  </button>
                ))}
              </div>

              <div className={`backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl border space-y-6 ${
                darkMode ? 'bg-gray-900/40 border-white/10 shadow-black/30' : 'bg-white/40 border-white/60 shadow-orange-500/5'
              }`}>
                <div className={`flex items-center justify-between border-b pb-4 ${darkMode ? 'border-white/10' : 'border-orange-100'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activePhraseCategoryObj.icon}</span>
                    <div>
                      <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{activePhraseCategoryObj.context} Phrases</h2>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Essential expressions for {activePhraseCategoryObj.context.toLowerCase()} situations</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${activePhraseCategoryObj.badgeColor}`}>
                    {activePhraseCategoryObj.items.length} Phrases
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {activePhraseCategoryObj.items.map((phrase, pIdx) => (
                    <div
                      key={pIdx}
                      className={`backdrop-blur-xl p-5 rounded-2xl shadow-md border transition-all flex flex-col justify-between gap-2 ${
                        darkMode ? 'bg-white/5 border-white/10 hover:border-yellow-500/50' : 'bg-white/50 border-white/60 hover:border-orange-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>{phrase.kannada}</h3>
                        <p className={`text-xs font-semibold italic ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{phrase.phonetic}</p>
                      </div>
                      <p className={`text-sm font-medium pt-2 border-t ${darkMode ? 'border-white/10 text-gray-200' : 'border-white/60 text-gray-700'}`}>
                        {phrase.english}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: ACCURATE TRANSLATOR */}
          {activeTab === 'translator' && (
            <section className="max-w-2xl mx-auto space-y-6">
              <div className={`backdrop-blur-2xl p-6 sm:p-8 rounded-2xl shadow-2xl border ${
                darkMode ? 'bg-gray-900/40 border-white/10 shadow-black/30' : 'bg-white/40 border-white/60 shadow-orange-500/5'
              }`}>
                <div className="text-center mb-6">
                  <span className="text-3xl mb-2 block">🌐</span>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>Smart Translator & Google Engine</h2>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Type any word, sentence, or phonetic sound in English or Kannada for instant accurate translation.
                  </p>

                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => setTargetLang('kn')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer backdrop-blur-xl ${
                        targetLang === 'kn' ? (darkMode ? 'bg-yellow-500 text-gray-950 border-transparent shadow-md' : 'bg-orange-500 text-white border-transparent shadow-md') : (darkMode ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10' : 'bg-white/50 text-gray-700 border-white/60 hover:bg-white/80')
                      }`}
                    >
                      English ➔ Kannada
                    </button>
                    <button
                      onClick={() => setTargetLang('en')}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer backdrop-blur-xl ${
                        targetLang === 'en' ? (darkMode ? 'bg-yellow-500 text-gray-950 border-transparent shadow-md' : 'bg-orange-500 text-white border-transparent shadow-md') : (darkMode ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10' : 'bg-white/50 text-gray-700 border-white/60 hover:bg-white/80')
                      }`}
                    >
                      Kannada ➔ English
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <textarea
                    rows={3}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={
                      targetLang === 'kn'
                        ? 'Type English phrase (e.g., "Nanage beda", "how far", "bus stop")...'
                        : 'Type Kannada text or phonetic word (e.g., "ನನಗೆ ಬೇಡ", "ನೀವು")...'
                    }
                    className={`w-full p-4 backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 font-medium shadow-inner resize-none text-sm ${
                      darkMode ? 'border-white/10 bg-white/5 focus:ring-yellow-400 text-gray-100 placeholder-gray-500' : 'border-white/60 bg-white/50 focus:ring-orange-500 text-gray-800 placeholder-gray-400'
                    }`}
                  />

                  <div className="flex flex-wrap sm:flex-nowrap gap-3">
                    <a
                      href={googleTranslateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-sm text-center"
                    >
                      <span>🚀 Translate via Google Translate</span>
                    </a>

                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className={`px-4 py-3 font-bold rounded-xl text-sm transition-colors cursor-pointer backdrop-blur-xl ${
                          darkMode ? 'bg-white/10 hover:bg-white/20 text-gray-300' : 'bg-white/60 hover:bg-white/90 text-gray-700'
                        }`}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {searchTerm.trim() && (
                  <div className={`backdrop-blur-xl border p-5 rounded-xl space-y-3 shadow-lg ${
                    darkMode ? 'bg-gradient-to-br from-yellow-950/30 to-red-950/40 border-white/10' : 'bg-gradient-to-br from-orange-50/80 to-amber-50/80 border-orange-200/80'
                  }`}>
                    <div className={`flex justify-between items-center border-b pb-2 ${darkMode ? 'border-white/10' : 'border-orange-200/80'}`}>
                      <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-yellow-400' : 'text-orange-700'}`}>
                        Offline Quick Dictionary Lookup
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                        darkMode ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-orange-200/80 text-orange-800 border-orange-300/40'
                      }`}>
                        {localMatch ? 'Direct Match Found' : 'Extended Google Translation Ready'}
                      </span>
                    </div>

                    {localMatch ? (
                      <div className="space-y-2 pt-1">
                        <div className={`text-2xl font-extrabold ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>{localMatch.kannada}</div>
                        <div className={`text-sm font-semibold italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Pronunciation: "{localMatch.phonetic}"
                        </div>
                        <div className={`backdrop-blur-xl p-3 rounded-lg border mt-2 shadow-sm font-bold text-base ${
                          darkMode ? 'bg-white/5 border-white/10 text-gray-200' : 'bg-white/80 border-orange-200 text-gray-800'
                        }`}>
                          English Meaning: {localMatch.english}
                        </div>
                        {localMatch.category && (
                          <span className={`inline-block text-xs px-2.5 py-0.5 rounded-md font-semibold mt-1 border ${
                            darkMode ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-orange-100 text-orange-800 border-orange-200/50'
                          }`}>
                            Category: {localMatch.category}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 py-1">
                        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          No direct match found in quick phrasebook for "<span className={`font-bold ${darkMode ? 'text-yellow-400' : 'text-orange-700'}`}>{searchTerm}</span>".
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Click the blue button above to translate full sentences accurately with Google Translate.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* TAB 4: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <section className="max-w-md mx-auto text-center space-y-6">
              <div className={`flex justify-between items-center text-sm font-semibold px-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>Card {cardIndex + 1} of {words.length}</span>
                <span className={`font-bold ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>
                  {completedFlashcards.has(cardIndex) ? '✓ Mastered' : 'Tap Card to Flip'}
                </span>
              </div>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border-2 h-72 flex flex-col justify-center items-center cursor-pointer transition-all duration-300 transform active:scale-98 relative ${
                  darkMode ? 'bg-gray-900/40 border-white/10 shadow-black/30' : 'bg-white/40 border-white/60 shadow-orange-500/5'
                }`}
              >
                {!isFlipped ? (
                  <div className="space-y-3">
                    <span className={`text-xs font-extrabold uppercase tracking-widest block ${darkMode ? 'text-yellow-500' : 'text-orange-400'}`}>
                      Kannada Word
                    </span>
                    <h2 className={`text-4xl font-extrabold ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>{words[cardIndex].kannada}</h2>
                    <p className={`text-sm font-semibold italic ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{words[cardIndex].phonetic}</p>
                    <span className={`text-xs border px-3 py-1.5 rounded-full font-bold inline-block mt-4 backdrop-blur-xl ${
                      darkMode ? 'bg-white/5 text-yellow-300 border-white/10' : 'bg-orange-50 text-orange-600 border-orange-200'
                    }`}>
                      🔄 Click to Reveal Meaning
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className={`text-xs font-extrabold uppercase tracking-widest block ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      English Meaning
                    </span>
                    <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{words[cardIndex].english}</h2>
                    <p className={`text-xs font-semibold mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Phonetic: {words[cardIndex].phonetic}</p>
                    <span className={`text-xs border px-3 py-1.5 rounded-full font-bold inline-block mt-4 backdrop-blur-xl ${
                      darkMode ? 'bg-white/5 text-emerald-300 border-white/10' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>
                      Category: {words[cardIndex].category}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={() => setCardIndex((prev) => (prev === 0 ? words.length - 1 : prev - 1))}
                  className={`backdrop-blur-xl font-bold px-5 py-3 rounded-xl border transition-colors shadow-md cursor-pointer ${
                    darkMode ? 'bg-white/10 border-white/10 text-gray-200 hover:bg-white/20' : 'bg-white/60 border-white/60 text-gray-700 hover:bg-white/90'
                  }`}
                >
                  ◀ Previous
                </button>
                <button
                  onClick={handleNextCard}
                  className={`flex-1 font-bold py-3 rounded-xl transition-all shadow-lg cursor-pointer ${
                    darkMode ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:opacity-90' : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  Next Card ➔
                </button>
              </div>
            </section>
          )}

          {/* TAB 5: QUIZ */}
          {activeTab === 'quiz' && (
            <section className={`backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl border max-w-xl mx-auto ${
              darkMode ? 'bg-gray-900/40 border-white/10 shadow-black/30' : 'bg-white/40 border-white/60 shadow-orange-500/5'
            }`}>
              {!showResult ? (
                <div className="space-y-6">
                  <div className={`flex justify-between items-center pb-3 border-b text-sm font-bold ${
                    darkMode ? 'border-white/10 text-yellow-400' : 'border-orange-100 text-orange-600'
                  }`}>
                    <span>
                      {isReviewRound ? '🔄 Review Round (Practice)' : `Question ${quizIndex + 1} of ${shuffledQuiz.length}`}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs border ${
                      darkMode ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' : 'bg-orange-100 text-orange-800 border-orange-200/50'
                    }`}>
                      Current Score: {score}
                    </span>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-extrabold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {shuffledQuiz[quizIndex]?.question}
                  </h3>

                  <div className="space-y-3">
                    {shuffledQuiz[quizIndex]?.options.map((option, idx) => {
                      let btnStyle = darkMode ? 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-yellow-500/50' : 'bg-white/50 border-white/60 text-gray-800 hover:bg-white/90 hover:border-orange-300';
                      if (selectedAnswer !== null) {
                        if (option === shuffledQuiz[quizIndex].answer) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md';
                        } else if (option === selectedAnswer) {
                          btnStyle = 'bg-rose-500 text-white border-rose-500';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-xl border font-semibold transition-all duration-150 focus:outline-none cursor-pointer shadow-sm backdrop-blur-xl ${btnStyle}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswer !== null && (
                    <button
                      onClick={handleNextQuestion}
                      className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg cursor-pointer ${
                        darkMode ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:opacity-90' : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {quizIndex + 1 === shuffledQuiz.length ? 'View Scoreboard 🏆' : 'Next Question ➔'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 space-y-6">
                  <div className="text-5xl animate-bounce">🏆</div>
                  <div>
                    <h3 className={`text-3xl font-extrabold ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>Quiz Completed!</h3>
                    <p className={`font-medium mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Here is your Kannada Mastery Assessment</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className={`backdrop-blur-xl border p-4 rounded-2xl shadow-md ${
                      darkMode ? 'bg-white/5 border-white/10' : 'bg-orange-50/80 border-orange-200/60'
                    }`}>
                      <span className={`text-xs font-bold block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Correct Answers</span>
                      <span className={`text-3xl font-extrabold ${darkMode ? 'text-yellow-400' : 'text-orange-600'}`}>{score} / 10</span>
                    </div>
                    <div className={`backdrop-blur-xl border p-4 rounded-2xl shadow-md ${
                      darkMode ? 'bg-white/5 border-white/10' : 'bg-emerald-50/80 border-emerald-200/60'
                    }`}>
                      <span className={`text-xs font-bold block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quiz Accuracy</span>
                      <span className={`text-3xl font-extrabold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        {Math.round((score / 10) * 100)}%
                      </span>
                    </div>
                  </div>

                  {pendingReviewQuestions.length > 0 && !isReviewRound && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-3">
                      <p className={`text-sm font-semibold ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                        You have {pendingReviewQuestions.length} missed questions to practice!
                      </p>
                      <button
                        onClick={startReviewRound}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Start Review Round 🔄 (Practice Only)
                      </button>
                    </div>
                  )}

                  <button
                    onClick={initializeQuiz}
                    className={`font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer ${
                      darkMode ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:opacity-90' : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    Retake Quiz 🔄
                  </button>
                </div>
              )}
            </section>
          )}

        </div>

        {/* Fixed Glassy Footer */}
        <footer className={`fixed bottom-0 left-0 right-0 z-40 text-center py-3 backdrop-blur-2xl border-t shadow-2xl transition-colors duration-300 ${
          darkMode ? 'bg-gray-950/85 border-white/10 text-gray-400' : 'bg-white/85 border-white/60 text-gray-500'
        }`}>
          <p className={`text-xs font-bold ${darkMode ? 'text-yellow-400' : 'text-orange-700'}`}>Accelerated survival kit</p>
          <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>It takes you from absolute zero to an advanced beginner level, helping you get around smoothly without feeling stuck!</p>
        </footer>
      </main>
    </div>
  );
}