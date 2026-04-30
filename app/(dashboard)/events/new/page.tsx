import { NewEventForm } from "@/components/events/new-event-form";

/**
 * 이벤트 생성 페이지 (Server Component)
 * - 폼 로직은 NewEventForm Client 컴포넌트에 위임
 */
export default function NewEventPage() {
  return <NewEventForm />;
}
