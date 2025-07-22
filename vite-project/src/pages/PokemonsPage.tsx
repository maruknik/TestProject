import { useEffect, useState } from 'react';
import { fetchPokemonsPage, getPokemonsLimit } from '../service/pokemonService';

type Pokemon = {
  name: string;
  image: string;
};

const PokemonsPage = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const LIMIT = getPokemonsLimit();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const { pokemons: results, total: totalCount } = await fetchPokemonsPage(page);
        setPokemons(results);
        setTotal(totalCount);
      } catch (err: any) {
        setError(err.message || 'Помилка при завантаженні');
        setPokemons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Список Покемонів</h1>

      {loading && <p>Завантаження...</p>}
      {error && <p className="text-red-600 dark:text-red-400">Помилка: {error}</p>}
      {!loading && !error && pokemons.length === 0 && (
        <p>Список порожній.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pokemons.map(({ name, image }) => (
          <div
            key={name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center"
          >
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-24 h-24 object-contain mb-4"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 mb-4 flex items-center justify-center">
                Немає зображення
              </div>
            )}
            <p className="capitalize font-semibold text-lg">{name}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center space-x-2 flex-wrap">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          ←
        </button>

        {(() => {
          const pageButtons = [];
          const start = Math.max(2, page - 2);
          const end = Math.min(totalPages - 1, page + 2);

          pageButtons.push(
            <button
              key={1}
              onClick={() => setPage(1)}
              className={`w-10 h-10 rounded-full ${
                page === 1
                  ? 'bg-green-100 text-green-600 font-semibold'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              1
            </button>
          );

          if (start > 2) {
            pageButtons.push(<span key="start-ellipsis" className="px-2">...</span>);
          }

          for (let i = start; i <= end; i++) {
            pageButtons.push(
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-10 h-10 rounded-full ${
                  page === i
                    ? 'bg-green-100 text-green-600 font-semibold'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {i}
              </button>
            );
          }

          if (end < totalPages - 1) {
            pageButtons.push(<span key="end-ellipsis" className="px-2">...</span>);
          }

          if (totalPages > 1) {
            pageButtons.push(
              <button
                key={totalPages}
                onClick={() => setPage(totalPages)}
                className={`w-10 h-10 rounded-full ${
                  page === totalPages
                    ? 'bg-green-100 text-green-600 font-semibold'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {totalPages}
              </button>
            );
          }

          return pageButtons;
        })()}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default PokemonsPage;
