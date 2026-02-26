'use client';
import type { Metadata } from 'next';
import css from './page.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const metadata: Metadata = {
  title: '404 - Page Not Found | NoteHub',
  description:
    'Сторінка не існує або була видалена. Повернення на головну сторінку NoteHub.',
  openGraph: {
    title: '404 - Page Not Found | NoteHub',
    description:
      'Сторінка не існує або була видалена. Повернення на головну сторінку NoteHub.',
    url: 'https://your-domain.com/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub 404 page',
      },
    ],
  },
};

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push('/'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={css.main}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
