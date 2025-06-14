import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import socket from './socket';

export default function GameRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const { name, room } = location.state || {};
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [voted, setVoted] = useState(false);

  const chime = new Audio('/sounds/chime.mp3');
  const voteSound = new Audio('/sounds/vote.mp3');

  useEffect(() => {
    socket.on('game_update', (state) => {
      console.log("Client got game update:", state);
      setPlayers(state.players || []);
      setGameStarted(state.gameStarted || false);
    });

    socket.on('answers_update', setAnswers);

    socket.on('new_round', async (state) => {
      setSubmitted(false);
      setVoted(false);
      setAnswer('');
      setAnswers([]);
      const res = await axios.get('http://localhost:3001/prompt');
      setPrompt(res.data.prompt);
    });

    return () => {
      socket.off('game_update');
      socket.off('answers_update');
      socket.off('new_round');
    };
  }, []);

  useEffect(() => {
    if (gameStarted) {
      axios.get('http://localhost:3001/prompt').then((res) => {
        setPrompt(res.data.prompt);
        chime.play();
      });
    }
  }, [gameStarted]);

  const handleSubmit = () => {
    if (answer.trim()) {
      socket.emit('submit_answer', { room: roomId, answer });
      setSubmitted(true);
    }
  };

  const handleVote = (id) => {
    voteSound.play();
    socket.emit('vote', { room: roomId, votedId: id });
    setVoted(true);
  };

  const handleNextRound = () => {
    socket.emit('next_round', { room: roomId });
  };

  const handleStartGame = () => {
    console.log("START GAME pressed, emitting to server");
    socket.emit('start_game', { room: roomId });
  };

  if (!gameStarted) {
    return (
      <div className="p-6 text-white">
        <h2 className="text-2xl mb-4">Waiting Room: {roomId}</h2>
        <ul className="mb-4">{players.map(p => <li key={p.id}>{p.name}</li>)}</ul>
        {players[0]?.id === socket.id && (
          <button onClick={handleStartGame} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
            Start Game
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <h2 className="text-xl mb-2">Room: {roomId}</h2>
      <h3 className="text-lg mb-4 text-yellow-300">Prompt: {prompt}</h3>

      {!submitted ? (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            className="w-full p-2 rounded text-black"
          />
          <button
            className="mt-2 bg-green-600 px-4 py-2 rounded hover:bg-green-500"
            onClick={handleSubmit}
          >
            Submit Answer
          </button>
        </>
      ) : (
        <div className="mt-4">
          <p className="text-green-400">Answer submitted. Waiting for others...</p>
          <ul className="mt-4 space-y-2">
            {answers.map((a, idx) => (
              <li key={idx} className="bg-gray-700 p-3 rounded">
                <p>{a.answer}</p>
                {!voted && (
                  <button
                    className="bg-blue-500 px-3 py-1 rounded mt-2"
                    onClick={() => handleVote(a.id)}
                  >
                    Vote
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {voted && (
        <button
          className="mt-6 bg-purple-600 px-4 py-2 rounded hover:bg-purple-500"
          onClick={handleNextRound}
        >
          Next Round
        </button>
      )}
    </div>
  );
}
