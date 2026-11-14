import { useCallback, useMemo, useState } from 'react';
import { createStage, STAGE_WIDTH } from '@/utils/gameHelpers';
import type { BoardMatrix, PlayerState, CellState } from '@/types/tetris';

export const useBoard = (
  player: PlayerState,
  onRowsCleared: (lines: number) => void,
) => {
  const [board, setBoard] = useState<BoardMatrix>(createStage());
  const [rowsCleared, setRowsCleared] = useState<number>(0);

  const stage = useMemo(() => {
    const displayedStage = board.map((row) => row.map((cell) => [...cell] as CellState));

    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        const stageY = y + player.pos.y;
        const stageX = x + player.pos.x;
        if (value !== 0 && stageY >= 0 && stageY < displayedStage.length) {
          displayedStage[stageY][stageX] = [value, 'clear'];
        }
      });
    });

    return displayedStage;
  }, [board, player]);

  const lockPlayer = useCallback(
    (lockedPlayer: PlayerState) => {
      const mergedStage = board.map((row) =>
        row.map((cell) => (cell[1] === 'merged' ? [...cell] : [0, 'clear'])) as CellState[],
      );

      lockedPlayer.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          const stageY = y + lockedPlayer.pos.y;
          const stageX = x + lockedPlayer.pos.x;
          if (value !== 0 && stageY >= 0 && stageY < mergedStage.length) {
            mergedStage[stageY][stageX] = [value, 'merged'];
          }
        });
      });

      let cleared = 0;
      const sweptStage = mergedStage.reduce((ack, row) => {
        if (row.every((cell) => cell[0] !== 0)) {
          cleared += 1;
          ack.unshift(new Array(STAGE_WIDTH).fill([0, 'clear']) as CellState[]);
        } else {
          ack.push(row);
        }
        return ack;
      }, [] as BoardMatrix);

      setBoard(sweptStage);
      if (cleared > 0) {
        setRowsCleared((prev) => prev + cleared);
        onRowsCleared(cleared);
      }
      return sweptStage;
    },
    [board, onRowsCleared],
  );

  const resetRowsCleared = useCallback(() => setRowsCleared(0), []);

  return { stage, setStage: setBoard, rowsCleared, resetRowsCleared, lockPlayer };
};
