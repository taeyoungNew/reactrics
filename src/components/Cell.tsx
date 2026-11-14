import React from 'react';
import { TETROMINOS } from '@/constans/tetrominos';

interface CellProps {
  type: string | number;
  isMerged: boolean;
  gameOver: boolean;
}

// 개별 블록 셀 컴포넌트
export const Cell: React.FC<CellProps> = React.memo(({ type, isMerged, gameOver }) => {
  const tetrominoInfo = TETROMINOS[type as keyof typeof TETROMINOS] || TETROMINOS[0];
  const color = gameOver && isMerged ? '148, 163, 184' : tetrominoInfo.color;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        maxWidth: '30px',
        maxHeight: '30px',
        background: `rgba(${color}, 0.8)`,
        border: type === 0 ? '0px solid' : '4px solid',
        borderColor: type === 0 ? 'transparent' : `rgba(${color}, 1)`,
        borderRadius: '4px',
        boxSizing: 'border-box',
      }}
    />
  );
});
