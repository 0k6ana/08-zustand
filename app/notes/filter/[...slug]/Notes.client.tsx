'use client';

import css from './page.module.css';

import { type Note, type FetchTagNote } from '@/types/note';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchFilterNotes } from '@/lib/api';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import CreateMessage from '@/components/CreateMessage/CreateMessage';

type Modal = 'form' | 'error' | 'create' | 'delete';

interface NotesClientProps {
  tag: FetchTagNote;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [isModal, setIsModal] = useState(false);
  const [word, setWord] = useState('');
  const [typeModal, setTypeModal] = useState<Modal>('form');
  const [message, setMessage] = useState<Note | null>(null);

  const { data } = useQuery({
    queryKey: ['notes', tag, page, word],
    queryFn: () => fetchFilterNotes(tag, page, word),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    throwOnError: true,
  });

  function closeModal() {
    setIsModal(false);
  }

  function cancelForm() {
    setIsModal(false);
  }

  function createBtn() {
    setIsModal(true);
    setTypeModal('form');
  }

  const changeWord = useDebouncedCallback((newWord: string) => {
    const page = 1;
    setPage(page);
    setWord(newWord);
  }, 500);

  return (
    <div className={css.notes}>
      <div className={css.toolbar}>
        <SearchBox changeWord={changeWord} />
        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            setPage={setPage}
          />
        )}
        <button className={css.toolBtn} onClick={createBtn}>
          Create note +
        </button>
      </div>
      {data && data.notes.length > 0 && (
        <NoteList
          setIsModal={setIsModal}
          setMessage={setMessage}
          setTypeModal={setTypeModal}
          noteList={data.notes}
        />
      )}
      {isModal && (
        <Modal onClose={closeModal}>
          {typeModal === 'form' && (
            <NoteForm
              setIsModal={setIsModal}
              setMessage={setMessage}
              setTypeModal={setTypeModal}
              onCancel={cancelForm}
            />
          )}
          {typeModal === 'create' && message && (
            <CreateMessage note={message} mess="Is created" />
          )}
          {typeModal === 'delete' && message && (
            <CreateMessage note={message} mess="Is deleted" />
          )}
        </Modal>
      )}
    </div>
  );
}
