/**
 * Server Action 공통 결과 타입
 * 성공 시 data를 반환하고, 실패 시 error 메시지를 반환한다.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
