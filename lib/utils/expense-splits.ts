/**
 * 정산 균등 분배 순수 함수
 * - 총 금액을 참여자 수로 나누어 균등 분배
 * - 나머지는 첫 번째 참여자에게 귀속
 */
export function calculateEvenSplits(
  amount: number,
  participantIds: string[]
): { participant_id: string; amount: number; is_paid: boolean }[] {
  const count = participantIds.length;
  if (count === 0) return [];

  const base = Math.floor(amount / count);
  const remainder = amount - base * count;

  return participantIds.map((participant_id, index) => ({
    participant_id,
    // 첫 번째 참여자에게 나머지 귀속
    amount: index === 0 ? base + remainder : base,
    is_paid: false,
  }));
}
