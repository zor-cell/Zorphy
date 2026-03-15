export enum GameMode {
  DUEL = 'DUELS',
  CLASSIC = 'CLASSIC'
}

export function getGameModeName(mode: GameMode) {
  switch (mode) {
    case GameMode.DUEL:
      return '1 vs 1';
    case GameMode.CLASSIC:
      return 'Classic';
    default:
      return 'Unknown';
  }
}