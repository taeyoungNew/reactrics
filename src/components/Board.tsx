import type { BoardMatrix } from '@/types/tetris';
import { Cell } from '@/components/Cell';

interface BoardProps {
  board: BoardMatrix;
  gameOver?: boolean;
}

// 10x20 그리드 보드판 컴포넌트
export const Board: React.FC<BoardProps> = ({ board, gameOver = false }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(10, 30px)`,
      gridTemplateRows: `repeat(20, 30px)`,
      gridGap: '1px',
      border: '3px solid #334155',
      background: '#0f172a',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    }}
  >
    {board.map((row, y) =>
      row.map((cell, x) => (
        <Cell
          key={`${y}-${x}`}
          type={cell[0]}
          isMerged={cell[1] === 'merged'}
          gameOver={gameOver}
        />
      )),
    )}
  </div>
);
