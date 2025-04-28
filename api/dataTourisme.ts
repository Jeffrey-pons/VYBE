import { Event } from "../interfaces/event";

//model dexemple
const DATATOURISME_URL = 'exemple'

export const fetchDatatourismeData = async () => {
  try {
    const response = await fetch(DATATOURISME_URL);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data["@graph"] || [];
  } catch (error) {
    console.error("Erreur récupération data Datatourisme:", error);
    return [];
  }
};

// Parse uniq les events a venir
export const getDatatourismeEvents = async () => {
  const allData = await fetchDatatourismeData();
  const now = new Date();

  const events: Event[] = allData
    .filter((item: any) => item?.startDate && new Date(item.startDate) > now)
    .map((event: any) => ({
      id: event["@id"],
      title: event?.name || "Sans titre",
      description: event?.description || "",
      date: event?.startDate || "",
      location: event?.hasAddress?.addressLocality || "",
      image: event?.image || null,
      source: "datatourisme",
    }));

  return events;
};

// Parse les lieux culturel uniquement
export const getDatatourismeSpots = async () => {
  const allData = await fetchDatatourismeData();

  const spots = allData
    .filter((item: any) => item?.@type === "Place" || item?.name)
    .map((place: any) => ({
      id: place["@id"],
      name: place?.name || "Lieu sans nom",
      location: place?.hasAddress?.addressLocality || "",
      image: place?.image || null,
      description: place?.description || "",
    }));

  return spots;
};
