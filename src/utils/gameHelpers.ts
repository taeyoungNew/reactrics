import type { BoardMatrix, PlayerState } from '@/types/tetris';

export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

// 10열 x 20행의 빈 보드판 배열을 생성하는 함수
export const createStage = (): BoardMatrix =>
  Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, 'clear']));

// 충돌 감지 핵심 순수 함수
export const checkCollision = (
  player: PlayerState,
  stage: BoardMatrix,
  { x: moveX, y: moveY }: { x: number; y: number },
): boolean => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // 1. 테트로미노에서 블록이 존재하는 칸(0이 아닌 칸)만 검사
      if (player.tetromino[y][x] !== 0) {
        // 2. 이동 후 예상되는 보드판 상의 절대 좌표 계산
        const nextX = player.pos.x + x + moveX;
        const nextY = player.pos.y + y + moveY;

        // 3. 경계 체크: 게임판 좌/우 벽을 벗어났거나, 아래쪽 바닥을 벗어났는지 확인
        if (nextX < 0 || nextX >= STAGE_WIDTH || nextY >= STAGE_HEIGHT) {
          return true;
        }

        // 4. 상단 천장 위(nextY < 0)는 아직 화면에 안 보인 영역이므로 무시하고,
        //    보드판 안쪽(nextY >= 0)에서 이미 고정된 블록('merged')과 겹치는지 확인
        if (nextY >= 0 && stage[nextY][nextX][1] === 'merged') {
          return true;
        }
      }
    }
  }
  return false;
};
