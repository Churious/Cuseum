import { redirect } from "next/navigation";

export default async function EditExhibitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/exhibit/${id}`);
}
