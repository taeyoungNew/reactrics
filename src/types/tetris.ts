// 셀의 상태: [블록 타입/0, 'clear'(움직이는 중) | 'merged'(고정됨)]
export type CellState = [string | number, string];

// 10열 x 20행 2차원 배열
export type BoardMatrix = CellState[][];

// 좌표 타입
export interface Position {
  x: number;
  y: number;
}

// 테트로미노 형태 (2D 배열)
export type TetrominoShape = (string | number)[][];

// 테트로미노 상수 구조
export interface Tetromino {
  shape: TetrominoShape;
  color: string;
}

// 7가지 테트로미노 키
export type TetrominoKey = 0 | 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

// 현재 조종 중인 플레이어 상태
export interface PlayerState {
  pos: Position;
  tetromino: TetrominoShape;
  collided: boolean;
}
