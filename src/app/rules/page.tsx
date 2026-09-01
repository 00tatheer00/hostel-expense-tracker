import { Metadata } from "next";
import { RulesView } from "@/features/rules/components/rules-view";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ContentWrapper } from "@/components/layout/content-wrapper";

export const metadata: Metadata = {
  title: "Hostel Rules & Guidelines | RoomHesabKitaab",
  description: "Room 14, Al Syed Hostel 19 Golden Rules & Guidelines for discipline, cleanliness, respect, and peaceful living.",
};

export default function RulesPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <RulesView />
      </ContentWrapper>
    </PageWrapper>
  );
}
