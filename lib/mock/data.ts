import {
  type Announcement,
  type CarpoolGroup,
  type Event,
  type ExpenseItem,
  type ExpenseSplit,
  type Participant,
} from "./types";

// ─────────────────────────────────────────
// 이벤트 더미 데이터 (3개)
// ─────────────────────────────────────────
export const mockEvents: Event[] = [
  {
    id: "event-001",
    ownerId: "user-owner-001",
    title: "2024 가을 야유회",
    date: "2024-10-19T10:00:00+09:00",
    location: "경기도 가평 자라섬 캠핑장",
    description:
      "올 가을 소모임 야유회입니다. 바베큐와 다양한 레크리에이션 행사가 준비되어 있습니다.",
    maxParticipants: 20,
    inviteToken: "invite-tok-001",
    createdAt: "2024-09-01T09:00:00+09:00",
  },
  {
    id: "event-002",
    ownerId: "user-owner-001",
    title: "12월 송년 파티",
    date: "2024-12-21T18:30:00+09:00",
    location: "서울 강남구 역삼동 파티룸 A",
    description:
      "한 해를 마무리하는 송년 파티입니다. 저녁 식사와 미니 게임이 준비되어 있습니다.",
    maxParticipants: 15,
    inviteToken: "invite-tok-002",
    createdAt: "2024-11-15T10:00:00+09:00",
  },
  {
    id: "event-003",
    ownerId: "user-owner-002",
    title: "봄맞이 하이킹",
    date: "2025-04-05T08:00:00+09:00",
    location: "서울 북한산 국립공원 우이동 탐방지원센터",
    description: "봄꽃이 피는 북한산 하이킹입니다. 왕복 약 4시간 소요 예정.",
    inviteToken: "invite-tok-003",
    createdAt: "2025-03-10T11:00:00+09:00",
  },
];

// ─────────────────────────────────────────
// 참여자 더미 데이터 (이벤트별 5명 이상)
// ─────────────────────────────────────────
export const mockParticipants: Participant[] = [
  // event-001 참여자 (6명)
  {
    id: "part-001",
    eventId: "event-001",
    name: "김철수",
    phone: "010-1111-0001",
    status: "confirmed",
    joinToken: "join-tok-001",
    createdAt: "2024-09-02T10:00:00+09:00",
  },
  {
    id: "part-002",
    eventId: "event-001",
    name: "이영희",
    phone: "010-1111-0002",
    status: "confirmed",
    joinToken: "join-tok-002",
    createdAt: "2024-09-02T11:00:00+09:00",
  },
  {
    id: "part-003",
    eventId: "event-001",
    name: "박민준",
    phone: "010-1111-0003",
    status: "confirmed",
    joinToken: "join-tok-003",
    createdAt: "2024-09-03T09:00:00+09:00",
  },
  {
    id: "part-004",
    eventId: "event-001",
    name: "최수연",
    phone: "010-1111-0004",
    status: "pending",
    joinToken: "join-tok-004",
    createdAt: "2024-09-04T14:00:00+09:00",
  },
  {
    id: "part-005",
    eventId: "event-001",
    name: "정도현",
    phone: "010-1111-0005",
    status: "cancelled",
    joinToken: "join-tok-005",
    createdAt: "2024-09-05T16:00:00+09:00",
  },
  {
    id: "part-006",
    eventId: "event-001",
    name: "한지민",
    phone: "010-1111-0006",
    status: "confirmed",
    joinToken: "join-tok-006",
    createdAt: "2024-09-06T10:30:00+09:00",
  },

  // event-002 참여자 (5명)
  {
    id: "part-007",
    eventId: "event-002",
    name: "오승환",
    phone: "010-2222-0001",
    status: "confirmed",
    joinToken: "join-tok-007",
    createdAt: "2024-11-16T09:00:00+09:00",
  },
  {
    id: "part-008",
    eventId: "event-002",
    name: "윤서연",
    phone: "010-2222-0002",
    status: "confirmed",
    joinToken: "join-tok-008",
    createdAt: "2024-11-17T10:00:00+09:00",
  },
  {
    id: "part-009",
    eventId: "event-002",
    name: "임재원",
    phone: "010-2222-0003",
    status: "pending",
    joinToken: "join-tok-009",
    createdAt: "2024-11-18T11:00:00+09:00",
  },
  {
    id: "part-010",
    eventId: "event-002",
    name: "강나영",
    phone: "010-2222-0004",
    status: "confirmed",
    joinToken: "join-tok-010",
    createdAt: "2024-11-19T13:00:00+09:00",
  },
  {
    id: "part-011",
    eventId: "event-002",
    name: "신동욱",
    phone: "010-2222-0005",
    status: "cancelled",
    joinToken: "join-tok-011",
    createdAt: "2024-11-20T15:00:00+09:00",
  },

  // event-003 참여자 (5명)
  {
    id: "part-012",
    eventId: "event-003",
    name: "류지은",
    phone: "010-3333-0001",
    status: "confirmed",
    joinToken: "join-tok-012",
    createdAt: "2025-03-11T08:00:00+09:00",
  },
  {
    id: "part-013",
    eventId: "event-003",
    name: "문성준",
    phone: "010-3333-0002",
    status: "confirmed",
    joinToken: "join-tok-013",
    createdAt: "2025-03-12T09:00:00+09:00",
  },
  {
    id: "part-014",
    eventId: "event-003",
    name: "배소영",
    phone: "010-3333-0003",
    status: "pending",
    joinToken: "join-tok-014",
    createdAt: "2025-03-13T10:00:00+09:00",
  },
  {
    id: "part-015",
    eventId: "event-003",
    name: "서민호",
    phone: "010-3333-0004",
    status: "confirmed",
    joinToken: "join-tok-015",
    createdAt: "2025-03-14T11:00:00+09:00",
  },
  {
    id: "part-016",
    eventId: "event-003",
    name: "안혜진",
    phone: "010-3333-0005",
    status: "pending",
    joinToken: "join-tok-016",
    createdAt: "2025-03-15T12:00:00+09:00",
  },
];

// ─────────────────────────────────────────
// 공지사항 더미 데이터 (이벤트별 2-3개)
// ─────────────────────────────────────────
export const mockAnnouncements: Announcement[] = [
  // event-001 공지사항 (3개)
  {
    id: "ann-001",
    eventId: "event-001",
    title: "야유회 준비물 안내",
    content:
      "개인 텀블러, 선크림, 편한 복장을 준비해 주세요. 공동 바베큐 도구는 주최 측에서 준비합니다.",
    createdAt: "2024-09-10T10:00:00+09:00",
  },
  {
    id: "ann-002",
    eventId: "event-001",
    title: "카풀 신청 마감 안내",
    content:
      "카풀 신청이 9월 15일(일)까지 마감됩니다. 신청하지 않으신 분은 별도 이동 수단을 준비해 주세요.",
    createdAt: "2024-09-12T14:00:00+09:00",
  },
  {
    id: "ann-003",
    eventId: "event-001",
    title: "집결 장소 및 시간 최종 안내",
    content:
      "당일 오전 9시 가평역 1번 출구 앞에서 집결합니다. 지각 시 카풀팀에 개별 연락 바랍니다.",
    createdAt: "2024-10-17T09:00:00+09:00",
  },

  // event-002 공지사항 (2개)
  {
    id: "ann-004",
    eventId: "event-002",
    title: "송년 파티 드레스코드 안내",
    content:
      "이번 파티의 드레스코드는 '골드 & 실버'입니다. 화려한 복장으로 참석해 주시면 더욱 즐거운 시간이 될 것입니다.",
    createdAt: "2024-12-10T11:00:00+09:00",
  },
  {
    id: "ann-005",
    eventId: "event-002",
    title: "정산 방법 안내",
    content:
      "파티 비용은 1인당 35,000원으로 책정되었습니다. 당일 현금 또는 계좌이체로 납부 가능합니다.",
    createdAt: "2024-12-15T13:00:00+09:00",
  },

  // event-003 공지사항 (2개)
  {
    id: "ann-006",
    eventId: "event-003",
    title: "하이킹 코스 안내",
    content:
      "우이동 → 도선사 → 백운대 → 위문 → 북한산성 탐방지원센터 코스로 진행됩니다. 총 거리 약 8km.",
    createdAt: "2025-03-20T10:00:00+09:00",
  },
  {
    id: "ann-007",
    eventId: "event-003",
    title: "당일 준비물 체크리스트",
    content:
      "등산화 필수, 간식 및 물 500ml 이상, 여벌 양말, 우비(날씨에 따라)를 준비해 주세요.",
    createdAt: "2025-04-01T09:00:00+09:00",
  },
];

// ─────────────────────────────────────────
// 카풀 그룹 더미 데이터 (이벤트별 2개)
// ─────────────────────────────────────────
export const mockCarpoolGroups: CarpoolGroup[] = [
  // event-001 카풀 (2개)
  {
    id: "carpool-001",
    eventId: "event-001",
    driverParticipantId: "part-001", // 김철수
    seats: 4,
    memberIds: ["part-002", "part-003"], // 이영희, 박민준
  },
  {
    id: "carpool-002",
    eventId: "event-001",
    driverParticipantId: "part-006", // 한지민
    seats: 3,
    memberIds: ["part-004"], // 최수연
  },

  // event-002 카풀 (2개)
  {
    id: "carpool-003",
    eventId: "event-002",
    driverParticipantId: "part-007", // 오승환
    seats: 5,
    memberIds: ["part-008", "part-009", "part-010"], // 윤서연, 임재원, 강나영
  },
  {
    id: "carpool-004",
    eventId: "event-002",
    driverParticipantId: "part-011", // 신동욱
    seats: 3,
    memberIds: [], // 탑승자 없음
  },

  // event-003 카풀 (2개)
  {
    id: "carpool-005",
    eventId: "event-003",
    driverParticipantId: "part-012", // 류지은
    seats: 4,
    memberIds: ["part-013", "part-014"], // 문성준, 배소영
  },
  {
    id: "carpool-006",
    eventId: "event-003",
    driverParticipantId: "part-015", // 서민호
    seats: 3,
    memberIds: ["part-016"], // 안혜진
  },
];

// ─────────────────────────────────────────
// 정산 항목 더미 데이터 (이벤트별 2-3개)
// ─────────────────────────────────────────
export const mockExpenseItems: ExpenseItem[] = [
  // event-001 정산 항목 (3개)
  {
    id: "expense-001",
    eventId: "event-001",
    name: "캠핑장 이용료",
    amount: 120000,
  },
  {
    id: "expense-002",
    eventId: "event-001",
    name: "바베큐 재료비",
    amount: 80000,
  },
  {
    id: "expense-003",
    eventId: "event-001",
    name: "음료 및 간식",
    amount: 40000,
  },

  // event-002 정산 항목 (2개)
  {
    id: "expense-004",
    eventId: "event-002",
    name: "파티룸 대관료",
    amount: 150000,
  },
  {
    id: "expense-005",
    eventId: "event-002",
    name: "케이터링 음식",
    amount: 200000,
  },

  // event-003 정산 항목 (2개)
  {
    id: "expense-006",
    eventId: "event-003",
    name: "국립공원 입장료",
    amount: 32000,
  },
  {
    id: "expense-007",
    eventId: "event-003",
    name: "단체 간식비",
    amount: 45000,
  },
];

// ─────────────────────────────────────────
// 정산 분배 더미 데이터 (각 항목별 참여자 분배)
// ─────────────────────────────────────────
export const mockExpenseSplits: ExpenseSplit[] = [
  // expense-001 (캠핑장 이용료 120,000원 / 6명 = 20,000원)
  {
    id: "split-001",
    expenseItemId: "expense-001",
    participantId: "part-001",
    amount: 20000,
    isPaid: true,
  },
  {
    id: "split-002",
    expenseItemId: "expense-001",
    participantId: "part-002",
    amount: 20000,
    isPaid: true,
  },
  {
    id: "split-003",
    expenseItemId: "expense-001",
    participantId: "part-003",
    amount: 20000,
    isPaid: true,
  },
  {
    id: "split-004",
    expenseItemId: "expense-001",
    participantId: "part-004",
    amount: 20000,
    isPaid: false,
  },
  {
    id: "split-005",
    expenseItemId: "expense-001",
    participantId: "part-005",
    amount: 20000,
    isPaid: false,
  },
  {
    id: "split-006",
    expenseItemId: "expense-001",
    participantId: "part-006",
    amount: 20000,
    isPaid: true,
  },

  // expense-002 (바베큐 재료비 80,000원 / 6명 ≈ 13,333원)
  {
    id: "split-007",
    expenseItemId: "expense-002",
    participantId: "part-001",
    amount: 14000,
    isPaid: true,
  },
  {
    id: "split-008",
    expenseItemId: "expense-002",
    participantId: "part-002",
    amount: 13000,
    isPaid: true,
  },
  {
    id: "split-009",
    expenseItemId: "expense-002",
    participantId: "part-003",
    amount: 13000,
    isPaid: false,
  },
  {
    id: "split-010",
    expenseItemId: "expense-002",
    participantId: "part-004",
    amount: 13000,
    isPaid: false,
  },
  {
    id: "split-011",
    expenseItemId: "expense-002",
    participantId: "part-005",
    amount: 13000,
    isPaid: false,
  },
  {
    id: "split-012",
    expenseItemId: "expense-002",
    participantId: "part-006",
    amount: 14000,
    isPaid: true,
  },

  // expense-003 (음료 및 간식 40,000원 / 6명 ≈ 6,666원)
  {
    id: "split-013",
    expenseItemId: "expense-003",
    participantId: "part-001",
    amount: 7000,
    isPaid: true,
  },
  {
    id: "split-014",
    expenseItemId: "expense-003",
    participantId: "part-002",
    amount: 7000,
    isPaid: true,
  },
  {
    id: "split-015",
    expenseItemId: "expense-003",
    participantId: "part-003",
    amount: 6500,
    isPaid: false,
  },
  {
    id: "split-016",
    expenseItemId: "expense-003",
    participantId: "part-004",
    amount: 6500,
    isPaid: false,
  },
  {
    id: "split-017",
    expenseItemId: "expense-003",
    participantId: "part-005",
    amount: 6500,
    isPaid: false,
  },
  {
    id: "split-018",
    expenseItemId: "expense-003",
    participantId: "part-006",
    amount: 6500,
    isPaid: true,
  },

  // expense-004 (파티룸 대관료 150,000원 / 5명 = 30,000원)
  {
    id: "split-019",
    expenseItemId: "expense-004",
    participantId: "part-007",
    amount: 30000,
    isPaid: true,
  },
  {
    id: "split-020",
    expenseItemId: "expense-004",
    participantId: "part-008",
    amount: 30000,
    isPaid: true,
  },
  {
    id: "split-021",
    expenseItemId: "expense-004",
    participantId: "part-009",
    amount: 30000,
    isPaid: false,
  },
  {
    id: "split-022",
    expenseItemId: "expense-004",
    participantId: "part-010",
    amount: 30000,
    isPaid: true,
  },
  {
    id: "split-023",
    expenseItemId: "expense-004",
    participantId: "part-011",
    amount: 30000,
    isPaid: false,
  },

  // expense-005 (케이터링 음식 200,000원 / 5명 = 40,000원)
  {
    id: "split-024",
    expenseItemId: "expense-005",
    participantId: "part-007",
    amount: 40000,
    isPaid: true,
  },
  {
    id: "split-025",
    expenseItemId: "expense-005",
    participantId: "part-008",
    amount: 40000,
    isPaid: true,
  },
  {
    id: "split-026",
    expenseItemId: "expense-005",
    participantId: "part-009",
    amount: 40000,
    isPaid: false,
  },
  {
    id: "split-027",
    expenseItemId: "expense-005",
    participantId: "part-010",
    amount: 40000,
    isPaid: true,
  },
  {
    id: "split-028",
    expenseItemId: "expense-005",
    participantId: "part-011",
    amount: 40000,
    isPaid: false,
  },

  // expense-006 (국립공원 입장료 32,000원 / 4명 = 8,000원)
  {
    id: "split-029",
    expenseItemId: "expense-006",
    participantId: "part-012",
    amount: 8000,
    isPaid: true,
  },
  {
    id: "split-030",
    expenseItemId: "expense-006",
    participantId: "part-013",
    amount: 8000,
    isPaid: true,
  },
  {
    id: "split-031",
    expenseItemId: "expense-006",
    participantId: "part-014",
    amount: 8000,
    isPaid: false,
  },
  {
    id: "split-032",
    expenseItemId: "expense-006",
    participantId: "part-015",
    amount: 8000,
    isPaid: true,
  },

  // expense-007 (단체 간식비 45,000원 / 5명 = 9,000원)
  {
    id: "split-033",
    expenseItemId: "expense-007",
    participantId: "part-012",
    amount: 9000,
    isPaid: true,
  },
  {
    id: "split-034",
    expenseItemId: "expense-007",
    participantId: "part-013",
    amount: 9000,
    isPaid: true,
  },
  {
    id: "split-035",
    expenseItemId: "expense-007",
    participantId: "part-014",
    amount: 9000,
    isPaid: false,
  },
  {
    id: "split-036",
    expenseItemId: "expense-007",
    participantId: "part-015",
    amount: 9000,
    isPaid: true,
  },
  {
    id: "split-037",
    expenseItemId: "expense-007",
    participantId: "part-016",
    amount: 9000,
    isPaid: false,
  },
];
