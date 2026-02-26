'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNoteStore } from '@/lib/store/noteStore';
import { type Note } from '@/types/note';

import css from './NoteForm.module.css';

type ModalType = 'form' | 'error' | 'create' | 'delete';

interface NoteFormProps {
  setIsModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage?: React.Dispatch<React.SetStateAction<Note | null>>;
  setTypeModal?: React.Dispatch<React.SetStateAction<ModalType>>;
  onCancel?: () => void;
}

interface CreateNoteDto {
  title: string;
  content: string;
  tag: string;
}

const initialDraft: CreateNoteDto = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({
  setIsModal,
  setMessage,
  setTypeModal,
  onCancel,
}: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const [form, setForm] = useState<CreateNoteDto>(draft || initialDraft);

  useEffect(() => {
    setForm(draft || initialDraft);
  }, [draft]);

  // ---------------- API ----------------

  const createNote = async (note: CreateNoteDto): Promise<Note> => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      throw new Error('Failed to create note');
    }

    return response.json();
  };

  // ---------------- Mutation ----------------

  const mutation = useMutation<Note, Error, CreateNoteDto>({
    mutationFn: createNote,
    onSuccess: (data: Note) => {
      // інвалідуємо список нотаток
      queryClient.invalidateQueries({ queryKey: ['notes'] });

      clearDraft();

      if (setTypeModal && setMessage) {
        setMessage(data);
        setTypeModal('create');
        setIsModal?.(true);
      } else {
        router.push('/notes');
      }
    },
    onError: () => {
      setTypeModal?.('error');
      setIsModal?.(true);
    },
  });

  // ---------------- Handlers ----------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setDraft({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    mutation.mutate({
      title: form.title,
      content: form.content,
      tag: form.tag,
    });
  };

  const handleCancel = (): void => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  // ---------------- UI ----------------

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className={css.input}
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          className={css.textarea}
          name="content"
          value={form.content}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          className={css.select}
          name="tag"
          value={form.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving...' : 'Save'}
        </button>

        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}