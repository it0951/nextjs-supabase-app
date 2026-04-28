/**
 * 참여자 상태 타입
 * - pending: 대기 중 (초대 수락 전)
 * - confirmed: 참석 확정
 * - cancelled: 참석 취소
 */
export type ParticipantStatus = "pending" | "confirmed" | "cancelled";

/**
 * 이벤트(소모임) 타입
 */
export interface Event {
  /** 이벤트 고유 ID */
  id: string;
  /** 이벤트 생성자(주최자) 유저 ID */
  ownerId: string;
  /** 이벤트 제목 */
  title: string;
  /** 이벤트 날짜 (ISO 8601 형식) */
  date: string;
  /** 이벤트 장소 */
  location: string;
  /** 이벤트 설명 (선택) */
  description?: string;
  /** 최대 참여 인원 (선택) */
  maxParticipants?: number;
  /** 초대 토큰 (공유용 고유 링크) */
  inviteToken: string;
  /** 생성 일시 */
  createdAt: string;
}

/**
 * 참여자 타입
 */
export interface Participant {
  /** 참여자 고유 ID */
  id: string;
  /** 소속 이벤트 ID */
  eventId: string;
  /** 참여자 이름 */
  name: string;
  /** 참여자 전화번호 */
  phone: string;
  /** 참석 상태 */
  status: ParticipantStatus;
  /** 참가 토큰 (개인 확인용) */
  joinToken: string;
  /** 생성 일시 */
  createdAt: string;
}

/**
 * 공지사항 타입
 */
export interface Announcement {
  /** 공지사항 고유 ID */
  id: string;
  /** 소속 이벤트 ID */
  eventId: string;
  /** 공지사항 제목 */
  title: string;
  /** 공지사항 내용 */
  content: string;
  /** 생성 일시 */
  createdAt: string;
}

/**
 * 카풀 그룹 타입
 */
export interface CarpoolGroup {
  /** 카풀 그룹 고유 ID */
  id: string;
  /** 소속 이벤트 ID */
  eventId: string;
  /** 운전자 참여자 ID */
  driverParticipantId: string;
  /** 탑승 가능 인원 (운전자 포함) */
  seats: number;
  /** 탑승 참여자 ID 목록 (운전자 제외) */
  memberIds: string[];
}

/**
 * 정산 항목 타입
 */
export interface ExpenseItem {
  /** 정산 항목 고유 ID */
  id: string;
  /** 소속 이벤트 ID */
  eventId: string;
  /** 항목 이름 */
  name: string;
  /** 총 금액 (원) */
  amount: number;
}

/**
 * 정산 분배 타입
 */
export interface ExpenseSplit {
  /** 분배 고유 ID */
  id: string;
  /** 소속 정산 항목 ID */
  expenseItemId: string;
  /** 참여자 ID */
  participantId: string;
  /** 분담 금액 (원) */
  amount: number;
  /** 납부 여부 */
  isPaid: boolean;
}
