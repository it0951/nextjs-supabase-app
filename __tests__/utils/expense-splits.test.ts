import { describe, it, expect } from "vitest";
import { calculateEvenSplits } from "@/lib/utils/expense-splits";

describe("calculateEvenSplits - 정산 균등 분배 순수 함수", () => {
  /**
   * 참여자 0명인 경우 빈 배열 반환
   */
  it("참여자 0명 → 빈 배열 반환", () => {
    const result = calculateEvenSplits(120000, []);
    expect(result).toEqual([]);
  });

  /**
   * 참여자 1명인 경우 전액 귀속
   */
  it("참여자 1명 → 전액 1명에게 귀속", () => {
    const result = calculateEvenSplits(10000, ["p1"]);
    expect(result).toHaveLength(1);
    expect(result[0]?.participant_id).toBe("p1");
    expect(result[0]?.amount).toBe(10000);
    expect(result[0]?.is_paid).toBe(false);
  });

  /**
   * 6명, 120,000원 → 각 20,000원 균등 분배
   */
  it("6명 120,000원 → 각 20,000원", () => {
    const ids = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const result = calculateEvenSplits(120000, ids);
    expect(result).toHaveLength(6);
    result.forEach((split, index) => {
      expect(split.amount).toBe(20000);
      expect(split.participant_id).toBe(ids[index]);
      expect(split.is_paid).toBe(false);
    });
  });

  /**
   * 3명, 10,000원 → 나머지 첫 번째에 귀속, 합계 검증
   * base = 3333, remainder = 1 → [3334, 3333, 3333]
   */
  it("3명 10,000원 → 나머지 첫 참여자에 귀속, 합계 10,000원", () => {
    const ids = ["p1", "p2", "p3"];
    const result = calculateEvenSplits(10000, ids);
    expect(result).toHaveLength(3);
    // 첫 번째는 나머지 포함
    expect(result[0]?.amount).toBe(3334);
    // 나머지는 균등
    expect(result[1]?.amount).toBe(3333);
    expect(result[2]?.amount).toBe(3333);
    // 합계 검증
    const total = result.reduce((sum, s) => sum + s.amount, 0);
    expect(total).toBe(10000);
  });

  /**
   * 7명, 100원 → 합계가 정확히 100원
   */
  it("7명 100원 → 합계 정확히 100원 (나머지 처리)", () => {
    const ids = ["p1", "p2", "p3", "p4", "p5", "p6", "p7"];
    const result = calculateEvenSplits(100, ids);
    const total = result.reduce((sum, s) => sum + s.amount, 0);
    expect(total).toBe(100);
  });

  /**
   * 2명, 1원 → 첫 번째에 1원, 두 번째에 0원
   */
  it("2명 1원 → 첫 번째 1원, 두 번째 0원", () => {
    const ids = ["p1", "p2"];
    const result = calculateEvenSplits(1, ids);
    expect(result[0]?.amount).toBe(1);
    expect(result[1]?.amount).toBe(0);
    const total = result.reduce((sum, s) => sum + s.amount, 0);
    expect(total).toBe(1);
  });

  /**
   * 모든 분배 결과의 is_paid는 false
   */
  it("모든 분배 결과의 is_paid는 false", () => {
    const ids = ["p1", "p2", "p3"];
    const result = calculateEvenSplits(30000, ids);
    result.forEach((split) => {
      expect(split.is_paid).toBe(false);
    });
  });

  /**
   * 반환 결과에 participant_id 포함 확인
   */
  it("반환 결과에 participant_id가 올바르게 포함됨", () => {
    const ids = ["abc-123", "def-456"];
    const result = calculateEvenSplits(20000, ids);
    expect(result[0]?.participant_id).toBe("abc-123");
    expect(result[1]?.participant_id).toBe("def-456");
  });
});
