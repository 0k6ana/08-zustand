'use client';

import { useState, useEffect } from 'react';
import { useNoteStore } from '@/lib/store/noteStore';
import { useRouter } from 'next/navigation';
import css from './NoteForm.module.css';

import { type Note } from '@/types/note';

type ModalType = 'form' | 'error' | 'create' | 'delete';

interface NoteFormProps {
  setIsModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage?: React.Dispatch<React.SetStateAction<Note | null>>;
  setTypeModal?: React.Dispatch<React.SetStateAction<ModalType>>;
  onCancel?: () => void;
}

const initialDraft = {
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
  const { draft, setDraft, clearDraft } = useNoteStore();

  const [form, setForm] = useState(draft || initialDraft);

  useEffect(() => {
    setForm(draft || initialDraft);
  }, [draft]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setDraft({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      clearDraft();

      const newNote = {
        id: Date.now().toString(),
        title: form.title,
        content: form.content,
        tag: form.tag,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Note;

      if (setTypeModal && setMessage) {
        setMessage(newNote);
        setTypeModal('create');
      } else {
        router.push('/notes');
      }
    } catch (err) {
      console.error(err);
      setTypeModal?.('error');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label>Title</label>
        <input
          className={css.input}
          name="title"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label>Content</label>
        <textarea
          className={css.textarea}
          name="content"
          value={form.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label>Tag</label>
        <select
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
        <button type="submit" className={css.submitButton}>
          Save
        </button>

        <button type="button" className={css.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}