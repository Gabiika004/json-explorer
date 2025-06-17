"use client";

import { useEffect, useState } from "react";
import { SearchForm, FormValues } from "@/components/searchForm";
import { CardList } from "@/components/cardList";
import { ChatSummary } from "@/types";

export default function HomePage() {
  const [data, setData] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (filters?: FormValues) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (filters?.date)
        params.append("date", filters.date.toString().split("T")[0]);
      if (filters?.agent) params.append("agent", filters.agent);

      const res = await fetch(`/api/records?${params.toString()}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Hiba a lekérés során:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // első betöltéskor
  }, []);

  return (
    <main className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Chat naplók</h1>
      <SearchForm onSearch={fetchData} />
      {loading ? <p>Töltés...</p> : <CardList data={data} />}
    </main>
  );
}
