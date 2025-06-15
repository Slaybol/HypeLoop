
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io(`http://${window.location.hostname}:3000`);
const beepSound = new Audio("/assets/sounds/beep.mp3");
const musicTracksRaw = [
  "track1",
  "track2",
  "track3"
];

const supportedAudioType = new Audio().canPlayType('audio/ogg') ? 'ogg' : 'mp3';
const musicTracks = musicTracksRaw.map(name => `/assets/music/${name}.${supportedAudioType}`);


function App() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [voting, setVoting] = useState(false);
  const [winner, setWinner] = useState(null);
  const [audio, setAudio] = useState(new Audio(musicTracks[0]));
  const [trackIndex, setTrackIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceOptions, setVoiceOptions] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [phase, setPhase] = useState("answer");

  useEffect(() => {
    const voices = speechSynthesis.getVoices();
    setVoiceOptions(voices);
    setSelectedVoice(voices.find(v => v.name.includes("Google")) || voices[0]);

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = speechSynthesis.getVoices();
        setVoiceOptions(updatedVoices);
        setSelectedVoice(updatedVoices.find(v => v.name.includes("Google")) || updatedVoices[0]);
      };
    }
  }, []);

  useEffect(() => {
    socket.on("player-list", setPlayers);

    socket.on("game-started", (game) => {
      setPrompt(game.prompt);
      setGameStarted(true);
      setVoting(false);
      setAnswers([]);
      setWinner(null);
      setAnswer("");
      setPhase("answer");

      const speak = (text) => {
        if (voiceEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = selectedVoice;
          utterance.pitch = 1.1;
          utterance.rate = 1;
          speechSynthesis.speak(utterance);
        }
      };

      speak(game.prompt);
      setTimeout(() => {
        speak("Ready? ... GO!");
        setTimeLeft(15);
        setTimerActive(true);
      }, 3000);
    });

    socket.on("voting-phase", (answers) => {
      setVoting(true);
      setAnswers(answers);
      setTimeLeft(15);
      setPhase("vote");
      setTimerActive(true);
    });

    socket.on("round-winner", ({ winner, votes }) => {
      setWinner(winner);
      setVoting(false);
      setTimerActive(false);
    });

    return () => {
      socket.off("player-list");
      socket.off("game-started");
      socket.off("voting-phase");
      socket.off("round-winner");
    };
  }, [voiceEnabled, selectedVoice]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next >= 0) {
          beepSound.currentTime = 0;
          beepSound.play().catch(() => {});
        }
        if (next === 0) {
          setTimerActive(false);
          if (phase === "answer") {
            if (answer.trim()) {
              socket.emit("submit-answer", { room, answer });
            }
            socket.emit("end-answer-phase", room);
          }
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft, phase, answer]);

  const joinRoom = () => {
    socket.emit("join-room", { name, room });
    setJoined(true);

    if (!audioStarted) {
      const firstTrack = new Audio(musicTracks[trackIndex]);
      firstTrack.loop = isLooping;
      firstTrack.play().then(() => {
        setIsPlaying(true);
        setAudio(firstTrack);
      }).catch((e) => console.error("Audio error:", e));
      setAudioStarted(true);
    }
  };

  const startGame = () => {
    socket.emit("start-game", room);
  };

  const vote = (playerId) => {
    socket.emit("submit-vote", { room, votedPlayerId: playerId });
    setTimerActive(false); // stop timer once vote is submitted
  };

  const nextRound = () => {
    socket.emit("next-round", room);
  };

  
  const changeTrack = (index) => {
    audio.pause();
    const newTrack = new Audio(musicTracks[index]);
    newTrack.loop = isLooping;
    newTrack.play().catch(() => {});
    setAudio(newTrack);
    setTrackIndex(index);
    setAudioStarted(true);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleLoop = () => {
    audio.loop = !isLooping;
    setIsLooping(!isLooping);
  };



  return (
    <div className="game-screen">
      <img src="/assets/images/logo.png" alt="Logo" className="logo" />
      {!joined ? (
        <>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join</button>
        </>
      ) : (
        <>
          <h1>Room: {room}</h1>
          <div className="players">
            {players.map((p, i) => (
              <div key={i} className="player">
                <img src={`/assets/images/player_${["red", "green", "blue", "yellow"][i % 4]}.png`} alt={p.name} />
                <p>{p.name}</p>
              </div>
            ))}
          </div>

          <div>
            <label>🎤 Voice: </label>
            <select value={selectedVoice?.name} onChange={(e) =>
              setSelectedVoice(voiceOptions.find(v => v.name === e.target.value))
            }>
              {voiceOptions.map((v, i) => (
                <option key={i} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>🎵 Music: </label>
            <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
            <button onClick={toggleLoop}>Loop: {isLooping ? "On 🔁" : "Off"}</button>
            <select value={trackIndex} onChange={(e) => changeTrack(Number(e.target.value))}>
              {musicTracks.map((track, i) => (
                <option key={i} value={i}>{`Track ${i + 1}`}</option>
              ))}
            </select>
          </div>

          <button onClick={() => setVoiceEnabled(v => !v)}>
            Voice Prompts: {voiceEnabled ? "On 🔊" : "Off 🔇"}
          </button>

          {!gameStarted && <button onClick={startGame}>Start Game</button>}

          {gameStarted && !voting && !winner && (
            <>
              <h2>Prompt:</h2>
              <p>{prompt}</p>
              <h3>⏱️ Time Left: {timeLeft}s</h3>
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
                disabled={timeLeft === 0}
              />
              <button onClick={() => {
                socket.emit("submit-answer", { room, answer });
              }} disabled={timeLeft === 0}>Submit Answer</button>
            </>
          )}

          {voting && (
            <>
              <h2>Vote for the best answer:</h2>
              <h3>⏱️ Time Left: {timeLeft}s</h3>
              {answers.map((a, i) => (
                <div key={i}>
                  <button onClick={() => vote(a.playerId)}>{a.text}</button>
                </div>
              ))}
            </>
          )}

          {winner && (
            <>
              <h2>🏆 {winner.name} wins the round!</h2>
              <img src="/assets/images/winner.png" alt="Winner" className="winner-img" />
              <button onClick={nextRound}>Next Round</button>
            </>
          )}

          <img src="/assets/images/stage.png" alt="Stage" className="stage-img" />
        </>
      )}
    </div>
  );
}

export default App;
