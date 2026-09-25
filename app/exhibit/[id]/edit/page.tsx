import type { Metadata } from "next";
import { ExhibitEditor } from "@/components/exhibit/ExhibitEditor";
import { getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations();
  return { title: t.editExhibit.eyebrow };
}

export default async function EditExhibitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ExhibitEditor id={id} />;
}
