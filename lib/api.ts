import axios from 'axios';

import { type Note, type NewNote, type FetchTagNote } from '@/types/note';

interface Answer {
  notes: Note[];
  totalPages: number;
}

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export async function fetchFilterNotes(
  tag: FetchTagNote,
  page: number,
  search: string
): Promise<Answer> {
  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('perPage', '12');

  if (tag !== 'all') {
    params.append('tag', tag);
  }

  if (search.trim() !== '') {
    params.append('search', search);
  }

  const res = await axios.get<Answer>(
    `https://notehub-public.goit.study/api/notes?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}
export const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
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

export async function deleteNote(id: string): Promise<Note> {
  const res = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}