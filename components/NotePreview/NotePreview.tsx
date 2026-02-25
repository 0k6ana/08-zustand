"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";

type Props = {
  id: string;
};

export default function NotePreview({ id }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load note</p>;
  if (!data) return null;

  return (
    <div className={css.container}>
      <h2 className={css.title}>{data.title}</h2>
      <p className={css.content}>{data.content}</p>
      <p className={css.tag}>Tag: {data.tag}</p>
    </div>
  );
}