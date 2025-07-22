import axios from 'axios';

export type Pokemon = {
  name: string;
  image: string;
};

const LIMIT = 12;

export const fetchPokemonsPage = async (page: number): Promise<{
  pokemons: Pokemon[];
  total: number;
}> => {
  const offset = (page - 1) * LIMIT;

  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon`, {
    params: { offset, limit: LIMIT },
  });

  if (res.status !== 200) {
    throw new Error('Помилка при завантаженні списку покемонів');
  }

  const data = res.data;

  const pokemonsDetails = await Promise.all(
    data.results.map(async (p: any) => {
      const resDetails = await axios.get(p.url);
      if (resDetails.status !== 200) {
        throw new Error('Помилка при завантаженні деталей');
      }

      const details = resDetails.data;

      return {
        name: p.name,
        image: details.sprites.front_default || '',
      };
    })
  );

  return {
    pokemons: pokemonsDetails,
    total: data.count,
  };
};

export const getPokemonsLimit = () => LIMIT;
