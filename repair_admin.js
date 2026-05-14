
const fs = require('fs');
const path = 'd:/play-11-main/frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const anchor = 'alert("Failed to parse file: " + err.message);';
const insertion = `
      setIsParsing(false);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    const questions = parseTextToQuestions(pastedText);
    if (questions.length === 0) {
      alert("No questions found in the pasted text. Please check the format.");
      return;
    }
    setIngestedQuestions(questions);
    setShowPasteModal(false);
    setPastedText('');
    setShowIngestionPreview(true);
  };

  const confirmIngestion = () => {
    setNewQuiz(prev => ({ 
      ...prev, 
      questions: ingestedQuestions, 
      total_questions: ingestedQuestions.length 
    }));
    setShowIngestionPreview(false);
    setActiveTab('Create Quiz');
  };
`;

// Find where to insert. We need to find the catch block end.
// Currently it might be alert(...); } } };
// Let's just find the alert and then the next }
const index = content.indexOf(anchor);
if (index !== -1) {
    const endOfCatch = content.indexOf('}', index);
    const endOfFunction = content.indexOf('}', endOfCatch + 1);
    
    // We want to replace from after the alert until where the next function starts.
    // Or just re-write that middle part.
    
    const repairPoint = index + anchor.length;
    // We'll replace everything from repairPoint to 'const parseTextToQuestions'
    const nextFunc = 'const parseTextToQuestions';
    const nextFuncIndex = content.indexOf(nextFunc, repairPoint);
    
    if (nextFuncIndex !== -1) {
        const newContent = content.substring(0, repairPoint) + insertion + '\n\n  ' + content.substring(nextFuncIndex);
        fs.writeFileSync(path, newContent);
        console.log("Repair successful!");
    } else {
        console.log("Could not find next function anchor.");
    }
} else {
    console.log("Could not find anchor.");
}
