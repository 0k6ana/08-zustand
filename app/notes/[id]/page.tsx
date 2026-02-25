import type { Metadata } from 'next';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface NoteProps {
  params: { id: string };
}

export async function generateMetadata(
  { params }: NoteProps
): Promise<Metadata> {
  const note = await fetchNoteById(params.id);

  const title = `${note.title} | NoteHub`;
  const description =
    note.content?.slice(0, 150) ||
    'Детальний перегляд нотатки в застосунку NoteHub.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://your-domain.com/notes/${params.id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

export default async function NoteDetails({ params }: NoteProps) {
  const { id } = params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
