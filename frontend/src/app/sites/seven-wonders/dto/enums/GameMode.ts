export enum GameMode {
  DUEL = 'DUEL',
  CLASSIC = 'CLASSIC'
}

export function getGameModeName(mode: GameMode) {
  switch (mode) {
    case GameMode.DUEL:
      return 'Duel';
    case GameMode.CLASSIC:
      return 'Classic';
    default:
      return 'Unknown';
  }
}