import { FetchTagNote } from '@/types/note';
import Link from 'next/link';
import css from './default.module.css';

export default function Sidebar() {
  const tags: FetchTagNote[] = [
    'all',
    'Todo',
    'Work',
    'Personal',
    'Meeting',
    'Shopping',
  ];

  return (
    <ul className={css.menuList}>
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag === 'all' ? 'All notes' : tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}