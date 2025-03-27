import { useDrag } from "react-dnd";
import { ISeance, IFilm } from "../../models";
import "./_sessionGrid.scss";

interface SeanceItemProps {
  seance: ISeance;
  film: IFilm | undefined;
  backgroundColor: string;
  leftPosition?: number;
  width?: number;
  setIsDragging: (isDragging: boolean) => void;
}

export const SessionItem: React.FC<SeanceItemProps> = ({
  seance,
  film,
  backgroundColor,
  leftPosition,
  width,
  setIsDragging,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "seance",
    item: () => {
      setIsDragging(true);
      return { seanceId: seance.id, filmName: film?.film_name };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: () => {
      setIsDragging(false);
    },
  }));

  return (
    <div>
      <div
        className="timeline__seance"
        ref={drag}
        style={{
          left: `${leftPosition}%`,
          width: `${width}%`,
          opacity: isDragging ? 0.5 : 1,
          backgroundColor,
        }}
      >
        <p className="timeline__film-name">
          {film?.film_name || "Неизвестный фильм"}
        </p>
      </div>
      <div>
        <p
          className="timeline__start-time"
          style={{
            left: `${leftPosition}%`,
          }}
        >
          {seance.seance_time}
        </p>
      </div>
    </div>
  );
};
