import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import NotePreviewClient from './NotePreview.client';

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

export default async function NotePreview({ params }: NotePreviewProps) {
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['notes', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
