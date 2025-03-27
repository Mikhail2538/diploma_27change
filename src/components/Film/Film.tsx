import { useNavigate } from "react-router-dom";
import { IFilm, IHall, ISeance } from "../../models";
import "./Film.scss";

interface IMovie {
  films: IFilm[];
  halls: IHall[];
  seances: ISeance[];
  selectedDate: string | null;
}

export const Movie: React.FC<IMovie> = ({
  films,
  halls,
  seances,
  selectedDate,
}) => {
  const navigate = useNavigate();

  const handleSeanceClick = (seanceId: number) => {
    const selectedSeance = seances.find((seance) => seance.id === seanceId);
    const selectedFilm = films.find(
      (film) => film.id === selectedSeance?.seance_filmid
    );
    const selectedHall = halls.find(
      (hall) => hall.id === selectedSeance?.seance_hallid
    );

    if (!selectedSeance || !selectedFilm || !selectedHall) {
      console.error("Не удалось найти данные для выбранного сеанса");
      return;
    }

    sessionStorage.setItem(
      "movieSeanceData",
      JSON.stringify({
        seance: selectedSeance,
        film: selectedFilm,
        hall: selectedHall,
        selectedDate: selectedDate,
      })
    );

    navigate(`/movies/${seanceId}`);
  };

  return (
    <div className="movie">
      {films.map((film) => (
        <div className="movie__container p-3" key={film.id}>
          <div className="movie__content">
            <img
              src={film.film_poster}
              alt={film.film_name}
              className="movie__picture"
            />
            <div className="movie__picture-figure"></div>
            <div className="movie__tittle">
              <h3 className="movie__tittle-heading">{film.film_name}</h3>
              <p className="movie__tittle-description">
                {film.film_description}
              </p>
              <p className="movie__tittle-movie-time">
                {film.film_duration} минут {film.film_origin}
              </p>
            </div>
          </div>
          <div className="movie__halls">
            {halls.map((hall) => {
              const hallSeances = seances.filter(
                (seance) =>
                  seance.seance_filmid === film.id &&
                  seance.seance_hallid === hall.id &&
                  hall.hall_open === 1
              );
              if (hallSeances.length === 0) return null;
              return (
                <div key={hall.id} className="movie__halls-tittle">
                  <h4 className="movie__halls-tittle-heading">
                    Зал: {hall.hall_name}
                  </h4>
                  <div className="movie__halls-seance">
                    {hallSeances.map((seance) => (
                      <button
                        key={seance.id}
                        onClick={() => handleSeanceClick(seance.id)}
                        className="movie__halls-seance-time"
                      >
                        {seance.seance_time}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
