import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import socket, { emitWhenConnected, getConnectionState } from '../components/socket';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function GameRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const { name } = location.state || {};

  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [voted, setVoted] = useState(false);
  const [isConnected, setIsConnected] = useState(getConnectionState());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const chime = useRef(new Audio('/assets/sounds/chime.mp3'));
  const voteSound = useRef(new Audio('/assets/sounds/vote.mp3'));

  const playChime = () => chime.current.play().catch(() => {});
  const playVote = () => voteSound.current.play().catch(() => {});

  const fetchPrompt = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/prompt`);
      setPrompt(res.data.prompt);
      playChime();
    } catch (err) {
      console.warn("⚠️ OpenAI fallback:", err.response?.data?.error?.message || err.message);
      setPrompt("Invent a new emoji that doesn't exist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleJoin = () =>
      emitWhenConnected('join-room', {
        name,
        room: roomId,
        theme: { name: '1990s' }
      });

    handleJoin();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('room-updated', ({ players }) => setPlayers(Object.values(players || {})));
    socket.on('game-started', ({ prompt }) => {
      setPrompt(prompt);
      setGameStarted(true);
      setAnswers([]);
      setSubmitted(false);
      setVoted(false);
    });
    socket.on('voting-phase', ({ answers }) => setAnswers(answers));
    socket.on('round-results', () => {
      setSubmitted(false);
      setVoted(false);
      setAnswer('');
    });

    return () => socket.removeAllListeners();
  }, [name, roomId]);

  const submitAnswer = () => {
    if (!answer.trim()) return;
    socket.emit('submit-answer', { room: roomId, answer });
    socket.emit('end-answer-phase', { room: roomId });
    setSubmitted(true);
  };

  const voteAnswer = (id) => {
    socket.emit('submit-vote', { room: roomId, votedPlayerId: id });
    setVoted(true);
    playVote();
  };

  const startGame = () => socket.emit('start-game', { room: roomId });
  const nextRound = () => socket.emit('next-round', { room: roomId });

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl mb-4">Room {roomId}</h1>
        <h2 className="mb-4">Players:</h2>
        <ul className="mb-4">
          {players.map(p => (
            <li key={p.id}>{p.name}{p.id === socket.id ? ' (You)' : ''}</li>
          ))}
        </ul>
        <button onClick={startGame} className="bg-blue-600 px-4 py-2 rounded">
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      {loading && <p className="text-yellow-400">Loading prompt...</p>}

      <h2 className="text-2xl font-bold text-center mb-6">{prompt}</h2>

      {!submitted && (
        <div>
          <textarea
            className="w-full text-black p-2 rounded"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
          />
          <button onClick={submitAnswer} className="bg-green-600 mt-2 px-4 py-2 rounded">
            Submit
          </button>
        </div>
      )}

      {submitted && answers.length === 0 && (
        <p className="text-green-400">Answer submitted! Waiting for others...</p>
      )}

      {answers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg mb-2">Vote for your favorite answer:</h3>
          {answers.map((a, idx) => (
            <div key={idx} className="p-4 bg-gray-800 rounded">
              <p>{a.answer}</p>
              {!voted && a.id !== socket.id && (
                <button
                  onClick={() => voteAnswer(a.id)}
                  className="mt-2 bg-blue-600 px-4 py-2 rounded"
                >
                  Vote
                </button>
              )}
              {a.id === socket.id && (
                <p className="text-yellow-400 mt-2">Your answer</p>
              )}
            </div>
          ))}
        </div>
      )}

      {voted && (
        <button onClick={nextRound} className="bg-purple-600 px-6 py-2 rounded">
          Next Round
        </button>
      )}
    </div>
  );
}
