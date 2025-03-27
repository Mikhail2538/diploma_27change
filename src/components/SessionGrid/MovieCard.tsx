import { useDrag } from "react-dnd";
import { IFilm } from "../../models";
import "./_sessionGrid.scss";

interface FilmCardProps {
  film: IFilm;
  onDeleteFilm: (filmId: number) => void;
}

const colorPalette = [
  "#85FFD3",
  "#CAFF85",
  "#85FF89",
  "#85E2FF",
  "#8599FF",
  "#85E2FF",
];

export const MovieCard: React.FC<FilmCardProps> = ({ film, onDeleteFilm }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "film",
    item: { filmId: film.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const cardColor = colorPalette[Math.floor(film.id / 5) % colorPalette.length];

  return (
    <div
      className="film-card"
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1, backgroundColor: cardColor }}
    >
      <img
        src={film.film_poster}
        alt={film.film_name}
        className="film-card__poster"
      />
      <div className="film-card__details">
        <h3>{film.film_name}</h3>
        <p>{film.film_duration} минут</p>
        <div
          className="film-card__delete-button"
          onClick={() => onDeleteFilm(film.id)}
        ></div>
      </div>
    </div>
  );
};
