import { useState, useCallback } from 'react';
import { TETROMINOS, randomTetromino } from '@/constans/tetrominos';
import type { BoardMatrix, PlayerState, Tetromino, TetrominoShape } from '@/types/tetris';
import { STAGE_WIDTH, checkCollision } from '@/utils/gameHelpers';

const SPAWN_Y = -2;

export const usePlayer = () => {
  const [nextPiece, setNextPiece] = useState<Tetromino>(() => randomTetromino());
  const [player, setPlayer] = useState<PlayerState>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  // 블록 회전 행렬 연산 (Transpose + Reverse)
  const rotate = (matrix: TetrominoShape): TetrominoShape => {
    // 1. 행과 열을 바꿈 (Transpose - 표준 자바스크립트 2D 배열 방식)
    const transposed = matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
    // 2. 각 행을 뒤집어서 90도 회전 완성 (Reverse)
    return transposed.map((row) => row.reverse());
  };

  const playerRotate = (stage: BoardMatrix) => {
    const clonedPlayer: PlayerState = {
      ...player,
      pos: { ...player.pos },
      tetromino: rotate(player.tetromino),
    };

    // 회전했을 때 벽이나 다른 블록과 충돌하는지 확인
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        // 회전 불가 시 원복
        clonedPlayer.tetromino = player.tetromino;
        clonedPlayer.pos.x = pos;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: prev.pos.x + x, y: prev.pos.y + y },
      collided,
    }));
  };

  const resetPlayer = useCallback((stage: BoardMatrix): boolean => {
    const nextPlayer: PlayerState = {
      pos: { x: STAGE_WIDTH / 2 - 2, y: SPAWN_Y },
      tetromino: nextPiece.shape,
      collided: false,
    };
    setNextPiece(randomTetromino());

    if (checkCollision(nextPlayer, stage, { x: 0, y: 0 })) {
      setPlayer({ ...nextPlayer, tetromino: TETROMINOS[0].shape });
      return false;
    }

    setPlayer(nextPlayer);
    return true;
  }, [nextPiece]);

  return { player, nextPiece, updatePlayerPos, resetPlayer, playerRotate, setPlayer };
};
