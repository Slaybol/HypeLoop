import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";
import { startVoiceInput } from "../voice";
import "../App.css";

const fallbackThemes = {
  "1990s": [
    "Invent a wild new Nickelodeon game show.",
    "What's in your Y2K bug-out bag?",
    "Describe your dream 90s toy mashup.",
  ],
  "sci-fi": [
    "Describe a malfunctioning AI assistant.",
    "Name a new alien species and their favorite food.",
    "Pitch a bad sci-fi sequel.",
  ],
  "adult": [
    "Write a terrible Tinder bio.",
    "Invent a new adult party game.",
    "Describe an awkward Zoom call.",
  ],
};

const musicTracks = ["track1", "track2", "track3"].map((name) =>
  `/assets/music/${name}.${new Audio().canPlayType("audio/ogg") ? "ogg" : "mp3"}`
);

export default function Game() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [theme, setTheme] = useState("1990s");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [voting, setVoting] = useState(false);
  const [winner, setWinner] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceOptions, setVoiceOptions] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [phase, setPhase] = useState("answer");
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const audioRef = useRef(null);
  const beepSound = new Audio("/assets/sounds/beep.mp3");

  useEffect(() => {
    const voices = speechSynthesis.getVoices();
    setVoiceOptions(voices);
    setSelectedVoice(voices.find((v) => v.name.includes("Google")) || voices[0]);

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        const updated = speechSynthesis.getVoices();
        setVoiceOptions(updated);
        setSelectedVoice(updated.find((v) => v.name.includes("Google")) || updated[0]);
      };
    }
  }, []);

  useEffect(() => {
    socket.on("player-list", setPlayers);
    socket.on("room-updated", ({ players }) => setPlayers(Object.values(players || {})));

    socket.on("game-started", (data) => {
      setPrompt(data.prompt);
      setGameStarted(true);
      setVoting(false);
      setAnswers([]);
      setWinner(null);
      setAnswer("");
      setPhase("answer");
      speak(data.prompt);
      setTimeout(() => {
        speak("Ready? ... GO!");
        setTimeLeft(15);
        setTimerActive(true);
      }, 3000);
    });

    socket.on("voting-phase", (data) => {
      setVoting(true);
      setAnswers(data.answers);
      setPhase("vote");
      setTimeLeft(15);
      setTimerActive(true);
    });

    socket.on("round-results", ({ roundWinner }) => {
      setWinner(roundWinner);
      setVoting(false);
      setTimerActive(false);
    });

    return () => socket.removeAllListeners();
  }, [voiceEnabled, selectedVoice]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next >= 0) beepSound.play().catch(() => {});
        if (next === 0) {
          setTimerActive(false);
          if (phase === "answer" && answer.trim()) {
            socket.emit("submit-answer", { room, answer });
            socket.emit("end-answer-phase", { room });
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, phase, answer]);

  useEffect(() => {
    if (joined && audioRef.current) {
      audioRef.current.src = musicTracks[trackIndex];
      audioRef.current.loop = isLooping;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [joined]);

  const speak = (text) => {
    if (voiceEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.pitch = 1.1;
      utterance.rate = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const joinRoom = () => {
    socket.emit("join-room", { name, room, theme: { name: theme } });
    setJoined(true);
  };

  const startGame = () => {
    socket.emit("start-game", { room });
  };

  const vote = (playerId) => socket.emit("submit-vote", { room, votedPlayerId: playerId });
  const nextRound = () => socket.emit("next-round", { room });

  return (
    <div className="game-screen">
      {!joined ? (
        <div className="join-screen">
          <h1>Join HypeLoop</h1>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room" />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <>
          <h1>Room: {room}</h1>
          <div className="players">
            {players.map((p, i) => (
              <div key={i} className="player">
                <img src={p.avatar} alt={p.name} />
                <p>{p.name}</p>
              </div>
            ))}
          </div>

          <label>🎭 Theme:</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="1990s">1990s</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="adult">Adult</option>
          </select>

          <label>🎤 Voice:</label>
          <select
            value={selectedVoice?.name}
            onChange={(e) => setSelectedVoice(voiceOptions.find((v) => v.name === e.target.value))}
          >
            {voiceOptions.map((v, i) => (
              <option key={i} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>

          <label>🎵 Music:</label>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current[isPlaying ? "pause" : "play"]();
                setIsPlaying(!isPlaying);
              }
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.loop = !isLooping;
                setIsLooping(!isLooping);
              }
            }}
          >
            Loop: {isLooping ? "On" : "Off"}
          </button>
          <select value={trackIndex} onChange={(e) => setTrackIndex(+e.target.value)}>
            {musicTracks.map((_, i) => (
              <option key={i} value={i}>{`Track ${i + 1}`}</option>
            ))}
          </select>
          <audio ref={audioRef} />

          <button onClick={() => setVoiceEnabled((v) => !v)}>
            Voice Prompts: {voiceEnabled ? "On 🔊" : "Off 🔇"}
          </button>

          {!gameStarted && <button onClick={startGame}>Start Game</button>}

          {gameStarted && !voting && !winner && (
            <>
              <h2>Prompt:</h2>
              <p>{prompt}</p>
              <h3>⏱️ {timeLeft}s</h3>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer..."
              />
              <button onClick={() => socket.emit("submit-answer", { room, answer })}>
                Submit
              </button>
              <button onClick={() => startVoiceInput(setAnswer)}>🎙️ Voice</button>
            </>
          )}

          {voting && (
            <>
              <h2>Vote!</h2>
              <h3>⏱️ {timeLeft}s</h3>
              {answers.map((a, i) => (
                <button key={i} onClick={() => vote(a.playerId)}>
                  {a.text}
                </button>
              ))}
            </>
          )}

          {winner && (
            <>
              <h2>🏆 Winner: {winner.name}</h2>
              <img src="/assets/images/winner.png" alt="winner" className="winner-img" />
              <button onClick={nextRound}>Next Round</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
