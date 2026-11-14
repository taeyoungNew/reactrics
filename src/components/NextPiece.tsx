import type { Tetromino } from '@/types/tetris';

interface NextPieceProps {
  piece: Tetromino;
}

export const NextPiece = ({ piece }: NextPieceProps) => {
  const cellSize = 12;

  return (
    <div
      aria-label="Next piece"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '8px',
        border: '1px solid #334155',
        borderRadius: '6px',
        background: '#1e293b',
      }}
    >
      <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 'bold' }}>NEXT</span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${piece.shape[0].length}, ${cellSize}px)`,
          gap: '2px',
        }}
      >
        {piece.shape.flatMap((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                borderRadius: '2px',
                background: cell === 0 ? 'transparent' : `rgba(${piece.color}, 0.8)`,
                border: cell === 0 ? 'none' : `2px solid rgba(${piece.color}, 1)`,
              }}
            />
          )),
        )}
      </div>
    </div>
  );
};
