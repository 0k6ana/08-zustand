import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import { FetchTagNote } from '@/types/note';
import { fetchFilterNotes } from '@/lib/api';
import NotesClient from './Notes.client';

import css from './page.module.css';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Notes({ params }: NotesProps) {
  const queryClient = new QueryClient();

  const { slug } = await params;
  const tag = slug[0] as FetchTagNote;

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
