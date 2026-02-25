'use client';

import css from './NotePreview.module.css';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  function goBack() {
    router.back();
  }

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal onClose={goBack}>
        <p className={css.content}>Note is loading...</p>
      </Modal>
    );
  } else if (isError) {
    return (
      <Modal onClose={goBack}>
        <p className={css.content}>{error.message}</p>
        <button className={css.backBtn} onClick={goBack}>
          Go back
        </button>
      </Modal>
    );
  } else {
    return (
      <Modal onClose={goBack}>
        {note && (
          <div className={css.container}>
            <div className={css.item}>
              <div className={css.header}>
                <h2>{note.title}</h2>
                <button className={css.backBtn} onClick={goBack}>
                  Go back
                </button>
              </div>
              <p className={css.content}>{note.content}</p>
              <p className={css.date}>
                {note.updatedAt ? note.updatedAt : note.createdAt}
              </p>
              <p className={css.tag}>{note.tag}</p>
            </div>
          </div>
        )}
      </Modal>
    );
  }
}
