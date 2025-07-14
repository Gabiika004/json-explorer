"use client";

import { useEffect, useState } from "react";
import { SearchForm, FormValues } from "@/components/searchForm";
import { CardList } from "@/components/cardList";
import { ChatSummary } from "@/types";

export default function HomePage() {
  const [allData, setAllData] = useState<ChatSummary[]>([]);
  const [data, setData] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triedCreate, setTriedCreate] = useState(false);

  const createJSON = async () => {
    await fetch("/api/reload", { method: "POST" });
    setTriedCreate(true);
    // Nem hívunk window.location.reload()-t, hanem újra próbáljuk betölteni az index.json-t
    fetchIndexJson();
  };

  // index.json betöltése külön függvényben
  const fetchIndexJson = () => {
    setLoading(true);
    setError(null);
    fetch("/index.json")
      .then((res) => {
        if (!res.ok)
          throw new Error("Az index.json nem található vagy nem elérhető.");
        return res.json();
      })
      .then((json) => {
        if (!Array.isArray(json) || json.length === 0) {
          setError(
            "Nincs elérhető adat. Kérlek, generáld újra az index.json-t az 'Adatok beolvasása' gombbal!"
          );
          setAllData([]);
          setData([]);
        } else {
          setAllData(json);
          setData(json);
        }
      })
      .catch((err) => {
        if (!triedCreate) {
          // Ha még nem próbáltuk létrehozni, próbáljuk meg
          createJSON();
        } else {
          setError(
            "Hiba az index.json betöltésekor: " +
              (err instanceof Error ? err.message : String(err)) +
              "\nKérlek, generáld újra az index.json-t az 'Adatok beolvasása' gombbal!"
          );
          setAllData([]);
          setData([]);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIndexJson();
    // csak egyszer fusson le
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kliensoldali szűrés
  const handleSearch = (filters?: FormValues) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = allData;
      if (filters) {
        if (filters.date)
          filtered = filtered.filter(
            (item) => item.date === String(filters.date).split("T")[0]
          );
        if (filters.email)
          filtered = filtered.filter(
            (item) =>
              item.agentEmails?.some((email) =>
                email.toLowerCase().includes(filters.email!.toLowerCase())
              ) ||
              item.customerEmail
                ?.toLowerCase()
                .includes(filters.email!.toLowerCase())
          );
        if (filters.customerName)
          filtered = filtered.filter((item) =>
            item.customerName
              ?.toLowerCase()
              .includes(filters.customerName!.toLowerCase())
          );
        if (filters.ticketId)
          filtered = filtered.filter((item) =>
            item.id?.toLowerCase().includes(filters.ticketId!.toLowerCase())
          );
      }
      setData(filtered);
      setLoading(false);
    }, 0);
  };

  return (
    <main className="p-6 max-w-5xl mx-auto text-white pt-32">
      <h1 className="text-2xl font-bold mb-6 text-center">Chat naplók</h1>
      <SearchForm onSearch={handleSearch} />
      {loading ? (
        <p>Töltés...</p>
      ) : error ? (
        <div className="bg-red-900 text-red-200 p-4 rounded-xl text-center font-semibold my-8 whitespace-pre-line">
          {error}
        </div>
      ) : data.length === 0 ? (
        <p className="text-gray-400 text-center mt-8">Nincs találat.</p>
      ) : (
        <CardList data={data} />
      )}
    </main>
  );
}
