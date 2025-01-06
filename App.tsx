import React, { useState, useEffect, useCallback } from 'react';

interface Player {
  name: string;
  score: number;
}

const grades = [
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'Impossible',
];

const insults = [
  'You are a fucking moron!',
  'What the fuck is wrong with you?',
  'You are a fucking idiot!',
  'How the fuck did you mess that up?',
  'You are a fucking disgrace!',
  'You are a fucking imbecile!',
  'You are a fucking dumbass!',
  'You are a fucking clown!',
  'You are a fucking joke!',
  'You are a fucking failure!',
];

const praises = [
  'You are a fucking genius!',
  'You are a fucking legend!',
  'You are a fucking wizard!',
  'You are a fucking prodigy!',
  'You are a fucking mastermind!',
  'You are a fucking champion!',
  'You are a fucking superstar!',
  'You are a fucking hero!',
  'You are a fucking marvel!',
  'You are a fucking wonder!',
];

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const getRandomWord = async (grade: string) => {
    const response = await fetch(`https://api.datamuse.com/words?sp=${grade}&max=1`);
    const data = await response.json();
    return data[0]?.word || 'default';
  };

  const spinWheel = async () => {
    setIsSpinning(true);
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];
    setSelectedGrade(randomGrade);
    const word = await getRandomWord(randomGrade);
    setCurrentWord(word);
    setIsSpinning(false);
    speak(`It's your turn, ${players[currentPlayerIndex].name}. The word is ${word}.`);
  };

  const handleGuess = () => {
    if (inputValue.toLowerCase() === currentWord.toLowerCase()) {
      const newPlayers = [...players];
      newPlayers[currentPlayerIndex].score += 1;
      setPlayers(newPlayers);
      speak(praises[Math.floor(Math.random() * praises.length)]);
    } else {
      speak(insults[Math.floor(Math.random() * insults.length)]);
    }
    setInputValue('');
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const handleRepeatWord = () => {
    speak(`The word is ${currentWord}.`);
  };

  const handleRandomInsult = () => {
    speak(insults[Math.floor(Math.random() * insults.length)]);
  };

  const handleGameOver = () => {
    const maxScore = Math.max(...players.map((p) => p.score));
    const winningPlayer = players.find((p) => p.score === maxScore);
    setWinner(winningPlayer || null);
    setGameOver(true);
    speak(`Game over! The winner is ${winningPlayer?.name}. You are a fucking champion!`);
  };

  useEffect(() => {
    if (players.length === 2 && !gameOver) {
      spinWheel();
    }
  }, [players, gameOver]);

  return (
    <div className="min- bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-white mb-8">Spelling Bee Fuckery</h1>
      {!players.length ? (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Enter Player Names</h2>
          <input
            type="text"
            placeholder="Player 1 Name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            onBlur={(e) => setPlayers([...players, { name: e.target.value, score: 0 }])}
          />
          <input
            type="text"
            placeholder="Player 2 Name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            onBlur={(e) => setPlayers([...players, { name: e.target.value, score: 0 }])}
          />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Current Player: {players[currentPlayerIndex].name}</h2>
          <div className="flex flex-col items-center">
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-blue-500 text-white px-6 py-2 rounded-full mb-4"
            >
              {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
            </button>
            {selectedGrade && (
              <p className="text-xl font-semibold mb-4">Selected Grade: {selectedGrade}</p>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <button
              onClick={handleGuess}
              className="bg-green-500 text-white px-6 py-2 rounded-full mb-4"
            >
              Submit Guess
            </button>
            <button
              onClick={handleRepeatWord}
              className="bg-yellow-500 text-white px-6 py-2 rounded-full mb-4"
            >
              Repeat Word
            </button>
            <button
              onClick={handleRandomInsult}
              className="bg-red-500 text-white px-6 py-2 rounded-full mb-4"
            >
              Random Insult
            </button>
            <button
              onClick={handleGameOver}
              className="bg-purple-500 text-white px-6 py-2 rounded-full mb-4"
            >
              End Game
            </button>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Scores</h3>
            {players.map((player, index) => (
              <p key={index} className="text-lg">
                {player.name}: {player.score}
              </p>
            ))}
          </div>
        </div>
      )}
      {gameOver && winner && (
        <div className="bg-white p-8 rounded-lg shadow-lg mt-8">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl">The winner is {winner.name} with {winner.score} points!</p>
        </div>
      )}
    </div>
  );
};

export default App;
