// server/chaos.js
export function applyChaosMode(roomState) {
  const rules = ['reverse_scores', 'double_points', 'mute_next', 'improv_round'];
  const random = rules[Math.floor(Math.random() * rules.length)];
  roomState.chaos = random;
  return roomState;
}
