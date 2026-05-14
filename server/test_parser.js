
function parseTextToQuestions(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const questions = [];
    let currentQ = null;

    lines.forEach(line => {
        // New Question detection
        const qMatch = line.match(/^(\d+)[\.\)]\s*(.*)/i) || line.match(/^Q:\s*(.*)/i);
        if (qMatch) {
            if (currentQ) questions.push(currentQ);
            currentQ = {
                text: qMatch[qMatch[2] ? 2 : 1].trim(),
                options: [],
                correctOptionIndex: 0
            };
        }
        // Option detection (A/B/C/D)
        else if (/^[A-D][\.\)]/i.test(line) && currentQ) {
            currentQ.options.push({ text: line.replace(/^[A-D][\.\)]/i, '').trim(), hindiText: '' });
        }
        // Answer detection
        else if (/Ans:|Answer:/i.test(line) && currentQ) {
            const ans = line.replace(/Ans:|Answer:/i, '').trim().toUpperCase();
            const index = ['A', 'B', 'C', 'D'].indexOf(ans[0]);
            if (index !== -1) currentQ.correctOptionIndex = index;
        }
        else if (currentQ && currentQ.options.length === 0) {
            currentQ.text += " " + line;
        }
    });

    if (currentQ) questions.push(currentQ);
    return questions.map(q => {
        while (q.options.length < 4) q.options.push({ text: '', hindiText: '' });
        return q;
    });
}

const sampleText = `
1. Who is the prime minister of India?
A. Narendra Modi
B. Rahul Gandhi
C. Amit Shah
D. Arvind Kejriwal
Ans: A

Q: What is the capital of France?
A. London
B. Paris
C. Berlin
D. Madrid
Answer: B
`;

const result = parseTextToQuestions(sampleText);
console.log(JSON.stringify(result, null, 2));
