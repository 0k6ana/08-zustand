import type { Metadata } from 'next';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { FetchTagNote } from '@/types/note';
import { fetchFilterNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import css from './page.module.css';

interface NotesProps {
  params: { slug?: string[] };
}

// ---------------- generateMetadata ----------------
export async function generateMetadata({ params }: NotesProps): Promise<Metadata> {
  const { slug } = await params; 
  const tag = slug?.[0] || 'Todo'; 

  const title = `Notes filtered by "${tag}" | NoteHub`;
  const description = `Перегляд нотаток з фільтром "${tag}" у застосунку NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://your-domain.com/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes filtered by ${tag}`,
        },
      ],
    },
  };
}

// ---------------- page.tsx (Notes function) ----------------
export default async function Notes({ params }: NotesProps) {
  const { slug } = await params; 
  const tag = (slug?.[0] as FetchTagNote) || 'Todo'; 

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag, 1, ''],
    queryFn: () => fetchFilterNotes(tag, 1, ''),
  });

  return (
    <main className={css.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </main>
  );
}