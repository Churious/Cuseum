import type { Metadata } from "next";
import { ExhibitDetail } from "@/components/exhibit/ExhibitDetail";
import { getServerTranslations } from "@/lib/i18n/server";

interface ExhibitPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Exhibit data lives in the visitor's browser, so the title is resolved on the
 * client. The server only hands over the id — and the language for the title.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return { title: t.exhibit.pageTitle };
}


export default async function ExhibitPage({ params }: ExhibitPageProps) {
  const { id } = await params;

  return <ExhibitDetail id={id} />;
}
