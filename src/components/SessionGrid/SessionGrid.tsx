import { useState } from "react";
import { MovieCard } from "./MovieCard";
import { TimeLine } from "./TimeTracker";
import { NewSessionModal } from "./NewSessionModal";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { IFilm, IHall, ISeance } from "../../models";
import { useDrop } from "react-dnd";
import "./_sessionGrid.scss";

interface SessionGridProps {
  halls: IHall[];
  films: IFilm[];
  seances: ISeance[];
  setSeances: (seances: ISeance[]) => void;
  setFilms: (films: IFilm[]) => void;
  onSave: () => void;
}

export const SessionGrid: React.FC<SessionGridProps> = ({
  halls,
  films,
  seances,
  setSeances,
  setFilms,
  onSave,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalData, setModalData] = useState<null | {
    action: "add" | "delete";
    seanceId?: number;
    hallId?: number;
    filmName?: string;
    filmId?: number;
  }>(null);

  const [, drop] = useDrop({
    accept: "film",
    drop: (item: { filmId: number }, monitor) => {
      const dropResult = monitor.getDropResult() as { hallId: number } | null;
      if (dropResult && dropResult.hallId) {
        setModalData({
          action: "add",
          filmId: item.filmId,
          hallId: dropResult.hallId,
        });
        setIsModalOpen(true);
      }
    },
  });

  const handleAddSeance = async (time: string) => {
    if (!modalData?.filmId || !modalData?.hallId) return;

    const film = films.find((f) => f.id === modalData.filmId);
    if (!film) {
      setError("Фильм не найден");
      console.log("Фильм не найден");
      return;
    }

    const filmDuration = film.film_duration;

    const [hours, minutes] = time.split(":").map(Number);
    const startTime = hours * 60 + minutes;
    const endTime = startTime + filmDuration;

    if (endTime > 1439) {
      setError("Сеанс заканчивается после 23:59");
      console.log("Сеанс заканчивается после 23:59");
      return true;
    }

    const params = new FormData();
    params.set("seanceHallid", modalData.hallId.toString());
    params.set("seanceFilmid", modalData.filmId.toString());
    params.set("seanceTime", time);

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch(
        "https://shfe-diplom.neto-server.ru/seance",
        {
          method: "POST",
          body: params,
        }
      );

      const data = await response.json();

      if (data.success === true) {
        setSeances(data.result.seances);
        setIsModalOpen(false);
        setModalData(null);
        setError("");
        onSave();
      } else {
        setError(`${data.error}`)
      }
    } catch (e) {
      console.log(`Ошибка при добавлении сеанса ${e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSeance = async () => {
    if (!modalData?.seanceId) return;

    try {
      const response = await fetch(
        `https://shfe-diplom.neto-server.ru/seance/${modalData.seanceId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success === true) {
        setSeances(data.result.seances);
        setModalData(null);
        setIsModalOpen(false);
        onSave();
      }
    } catch (e) {
      console.error("Ошибка при удалении сеанса", e);
    }
  };

  const handleDeleteFilm = async (filmId: number) => {
    try {
      const response = await fetch(
        `https://shfe-diplom.neto-server.ru/film/${filmId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      setFilms(data.result.films);
      setSeances(data.result.seances);
      onSave();
    } catch (e) {
      console.error("Ошибка при удалении фильма", e);
    }
  };

  return (
    <div className="session-grid">
      <div className="film-list">
        {films.map((film) => (
          <MovieCard key={film.id} film={film} onDeleteFilm={handleDeleteFilm} />
        ))}
      </div>
      <div className="timeline-container" ref={drop}>
        {halls.map((hall) => (
          <TimeLine
            key={hall.id}
            hall={hall}
            films={films}
            seances={seances.filter((s) => s.seance_hallid === hall.id)}
            setModalData={setModalData}
            setIsModalOpen={setIsModalOpen}
          />
        ))}
      </div>
      {modalData?.action === "delete" && (
        <DeleteConfirmation
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteSeance}
          filmName={modalData?.filmName || ""}
        />
      )}
      {modalData?.action === "add" && (
        <NewSessionModal
          error={error}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setError("");
          }}
          onAdd={handleAddSeance}
          filmName={
            films.find((f) => f.id === modalData?.filmId)?.film_name || ""
          }
          hallName={
            halls.find((h) => h.id === modalData?.hallId)?.hall_name || ""
          }
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
