import { Metadata } from 'next';
import PlayerClient from './PlayerClient';

const TMDB_API_KEY = 'aa844700ff3f44363be5bf50f78df0b1';

// Dynamic SEO meta tags (Feature #24)
export async function generateMetadata({ params, searchParams }: { params: { id: string }; searchParams: { type?: string } }): Promise<Metadata> {
  try {
    const type = searchParams.type || 'movie';
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${params.id}?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    const title = data.title || data.name || 'MFLIX';
    const description = data.overview || 'Watch on MFLIX';
    const image = data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : undefined;
    return {
      title: `${title} - MFLIX`,
      description,
      openGraph: {
        title: `${title} - MFLIX`,
        description,
        images: image ? [{ url: image, width: 500, height: 750 }] : undefined,
        type: 'video.movie',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - MFLIX`,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: 'MFLIX', description: 'Watch on MFLIX' };
  }
}

export default function PlayerPage({ params, searchParams }: { params: { id: string }; searchParams: { type?: string } }) {
  return <PlayerClient id={Number(params.id)} type={(searchParams.type || 'movie') as 'movie' | 'tv'} />;
}
