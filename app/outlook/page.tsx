import type { Metadata } from "next";
import { getCountries, getFields } from "@/lib/service";
import OutlookClient from "./OutlookClient";

export const metadata: Metadata = {
  title: "5-Year Outlook | VacancyRatio",
  description:
    "Where could this field be heading? See a 5-year vacancy and graduate supply outlook.",
};

export default function OutlookPage() {
  const countries = getCountries();
  const fields = getFields();
  return (
    <div style={{ background: "#F0F0F0" }} className="min-h-screen">
      <OutlookClient countries={countries} fields={fields} />
    </div>
  );
}
