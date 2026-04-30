import { mockEvents, mockParticipants } from "./data";

// ─────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: string;
  eventCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalParticipants: number;
  confirmedParticipants: number;
}

export interface SystemConfig {
  serviceName: string;
  contactEmail: string;
  maxEventsPerUser: number;
  maintenanceMode: boolean;
}

// ─────────────────────────────────────────
// 더미 사용자 데이터 (10명)
// ─────────────────────────────────────────
export const mockAdminUsers: AdminUser[] = [
  {
    id: "admin-user-001",
    email: "cheonsik.park@gsitm.com",
    name: "박천식",
    role: "admin",
    createdAt: "2024-01-15T09:00:00+09:00",
    eventCount: 0,
  },
  {
    id: "user-owner-001",
    email: "organizer1@example.com",
    name: "김주최",
    role: "user",
    createdAt: "2024-02-10T10:00:00+09:00",
    eventCount: 2,
  },
  {
    id: "user-owner-002",
    email: "organizer2@example.com",
    name: "이행사",
    role: "user",
    createdAt: "2024-03-05T11:00:00+09:00",
    eventCount: 1,
  },
  {
    id: "user-003",
    email: "user3@example.com",
    name: "박소모",
    role: "user",
    createdAt: "2024-04-20T14:00:00+09:00",
    eventCount: 3,
  },
  {
    id: "user-004",
    email: "user4@example.com",
    name: "최동아리",
    role: "user",
    createdAt: "2024-05-12T09:30:00+09:00",
    eventCount: 1,
  },
  {
    id: "user-005",
    email: "user5@example.com",
    name: "정번개",
    role: "user",
    createdAt: "2024-06-01T08:00:00+09:00",
    eventCount: 0,
  },
  {
    id: "user-006",
    email: "user6@example.com",
    name: "한모임",
    role: "user",
    createdAt: "2024-07-18T15:00:00+09:00",
    eventCount: 2,
  },
  {
    id: "user-007",
    email: "user7@example.com",
    name: "오클럽",
    role: "user",
    createdAt: "2024-08-22T10:00:00+09:00",
    eventCount: 1,
  },
  {
    id: "user-008",
    email: "user8@example.com",
    name: "윤행사",
    role: "user",
    createdAt: "2024-09-30T13:00:00+09:00",
    eventCount: 4,
  },
  {
    id: "user-009",
    email: "user9@example.com",
    name: "임소풍",
    role: "user",
    createdAt: "2024-10-15T09:00:00+09:00",
    eventCount: 0,
  },
];

// ─────────────────────────────────────────
// 통계 데이터 (mockEvents, mockParticipants 기반 집계)
// ─────────────────────────────────────────
export const mockAdminStats: AdminStats = {
  totalUsers: mockAdminUsers.length,
  totalEvents: mockEvents.length,
  totalParticipants: mockParticipants.length,
  confirmedParticipants: mockParticipants.filter(
    (p) => p.status === "confirmed"
  ).length,
};

// ─────────────────────────────────────────
// 시스템 설정 더미 데이터
// ─────────────────────────────────────────
export const mockSystemConfig: SystemConfig = {
  serviceName: "소모임 매니저",
  contactEmail: "support@somomim.com",
  maxEventsPerUser: 10,
  maintenanceMode: false,
};
