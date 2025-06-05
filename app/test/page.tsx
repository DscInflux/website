import { WidgetCard } from "@/components/cards/WidgetCard";

export default async function UserSettingsPage() {
  const data = await fetch(
    "https://dscinflux.xyz/api/get/entity?name=selectdev",
  ).then((res) => res.json());
  return <WidgetCard profileData={data} />;
}
