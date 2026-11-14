import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createStage, checkCollision } from '@/utils/gameHelpers';
import { usePlayer } from '@/hooks/usePlayer';
import { useBoard } from '@/hooks/useBoard';
import { useInterval } from '@/hooks/useInterval';
import { Board } from '@/components/Board';
import { NextPiece } from '@/components/NextPiece';

const SCORE_PER_LEVEL = 1000;
const INITIAL_DROP_INTERVAL = 1000;
const DROP_INTERVAL_DECREASE = 25;
const MIN_DROP_INTERVAL = 350;
const LINE_CLEAR_POINTS = [0, 100, 300, 500, 800];
const HORIZONTAL_REPEAT_DELAY = 150;
const HORIZONTAL_REPEAT_INTERVAL = 50;

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isHorizontalRepeating, setIsHorizontalRepeating] = useState<boolean>(false);
  const heldDirection = useRef<number | null>(null);
  const repeatDelay = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { player, nextPiece, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const level = Math.floor(score / SCORE_PER_LEVEL) + 1;
  const handleRowsCleared = useCallback(
    (lines: number) => {
      setScore((prev) => prev + (LINE_CLEAR_POINTS[lines] ?? 0) * level);
    },
    [level],
  );
  const { stage, setStage, rowsCleared, resetRowsCleared, lockPlayer } = useBoard(
    player,
    handleRowsCleared,
  );

  // 게임 시작
  const startGame = () => {
    stopHorizontalRepeat();
    const newStage = createStage();
    setStage(newStage);
    resetRowsCleared();
    setScore(0);
    const canSpawn = resetPlayer(newStage);
    setIsPlaying(canSpawn);
    setGameOver(!canSpawn);
  };

  const lockAndSpawn = (lockedPlayer: typeof player) => {
    const lockedStage = lockPlayer(lockedPlayer);
    if (!resetPlayer(lockedStage)) {
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  const hasBlocksAboveBoard = (piece: typeof player) =>
    piece.tetromino.some((row, y) => row.some((cell) => cell !== 0) && piece.pos.y + y < 0);

  // 플레이어 이동 처리
  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  // 아래로 한 칸 낙하
  const drop = () => {
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // 바닥이나 다른 블록에 닿았을 때
      if (hasBlocksAboveBoard(player)) {
        console.log('GAME OVER!');
        setGameOver(true);
        setIsPlaying(false);
        return;
      }
      lockAndSpawn(player);
    }
  };

  const hardDrop = () => {
    let distance = 0;
    while (!checkCollision(player, stage, { x: 0, y: distance + 1 })) {
      distance += 1;
    }
    const landedPlayer = {
      ...player,
      pos: { ...player.pos, y: player.pos.y + distance },
      collided: true,
    };
    if (hasBlocksAboveBoard(landedPlayer)) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }
    lockAndSpawn(landedPlayer);
  };

  const stopHorizontalRepeat = () => {
    heldDirection.current = null;
    if (repeatDelay.current !== null) {
      clearTimeout(repeatDelay.current);
      repeatDelay.current = null;
    }
    setIsHorizontalRepeating(false);
  };

  useEffect(
    () => () => {
      if (repeatDelay.current !== null) {
        clearTimeout(repeatDelay.current);
      }
    },
    [],
  );

  // 키 입력 핸들러
  const move = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isPlaying || gameOver) {
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      if (event.repeat) {
        return;
      }
      stopHorizontalRepeat();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      heldDirection.current = direction;
      movePlayer(direction);
      repeatDelay.current = setTimeout(
        () => setIsHorizontalRepeating(true),
        HORIZONTAL_REPEAT_DELAY,
      );
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      drop();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      playerRotate(stage);
    } else if (event.code === 'Space') {
      event.preventDefault();
      hardDrop();
    }
  };

  // 자동 낙하 루프
  useInterval(() => {
    drop();
  }, isPlaying
    ? Math.max(
        INITIAL_DROP_INTERVAL - (level - 1) * DROP_INTERVAL_DECREASE,
        MIN_DROP_INTERVAL,
      )
    : null);
  useInterval(() => {
    if (heldDirection.current !== null) {
      movePlayer(heldDirection.current);
    }
  }, isHorizontalRepeating ? HORIZONTAL_REPEAT_INTERVAL : null);

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={move}
      onKeyUp={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          stopHorizontalRepeat();
        }
      }}
      onBlur={stopHorizontalRepeat}
      style={{
        outline: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
        <header
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '90px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <NextPiece piece={nextPiece} />
          </div>
          <h1 style={{ color: '#f8fafc', fontSize: '2rem' }}>Reactris 🎮</h1>
        </header>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <Board board={stage} gameOver={gameOver} />
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {gameOver ? (
              <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Game Over!
              </div>
            ) : (
              <div>
                <div style={{ color: '#94a3b8' }}>Score: {score}</div>
                <div style={{ color: '#94a3b8' }}>Rows: {rowsCleared}</div>
                <div style={{ color: '#94a3b8' }}>Level: {level}</div>
              </div>
            )}
            <button
              onClick={startGame}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {gameOver ? 'Restart' : 'Start Game'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
