import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { IHall, ISeance, IFilm } from "../../models";
import { SessionItem } from "./SessionItem";
import "./_sessionGrid.scss";

const sessionColors = [
  "#85FFD3",
  "#CAFF85",
  "#85FF89",
  "#85E2FF",
  "#8599FF",
  "#85E2FF",
];

interface TimeLineProps {
  hall: IHall;
  seances: ISeance[];
  films: IFilm[];
  setModalData: (data: {
    action: "delete";
    seanceId?: number;
    filmName?: string;
  }) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const TimeLine: React.FC<TimeLineProps> = ({
  hall,
  seances,
  films,
  setModalData,
  setIsModalOpen,
}) => {
  const [draggingState, setDraggingState] = useState(false);

  const [, dropRef] = useDrop(() => ({
    accept: ["film"],
    drop: (item: { filmId?: number; seanceId?: number; filmName: string }) => {
      if (item.filmId) {
        return { hallId: hall.id };
      }
    },
  }));

  const [{ isTrashOver }, trashDropRef] = useDrop(() => ({
    accept: "seance",
    drop: (item: { seanceId: number; filmName: string }) => {
      setModalData({
        action: "delete",
        seanceId: item.seanceId,
        filmName: item.filmName,
      });
      setIsModalOpen(true);
    },
    collect: (monitor) => ({
      isTrashOver: monitor.isOver(),
    }),
  }));

  const arrangedSeances = [...seances].sort((a, b) => {
    const [aHrs, aMins] = a.seance_time.split(":" ).map(Number);
    const [bHrs, bMins] = b.seance_time.split(":" ).map(Number);
    return aHrs * 60 + aMins - (bHrs * 60 + bMins);
  });

  return (
    <div className="timeline" ref={dropRef}>
      {draggingState && (
        <div
          className={`timeline__trash ${isTrashOver ? "highlight" : ""}`}
          ref={trashDropRef}
        ></div>
      )}
      <h2 className="timeline__hall-name">{hall.hall_name}</h2>
      <div className="timeline__container">
        {arrangedSeances.map((seance) => {
          const film = films.find((film) => film.id === seance.seance_filmid);
          const startTime = seance.seance_time.split(":" ).map(Number);
          const leftOffset = ((startTime[0] * 60 + startTime[1]) / 1440) * 100;
          const colorIndex = film ? Math.floor(film.id / 5) % sessionColors.length : 0;
          const duration = film?.film_duration || 0;
          const itemWidth = (duration / 1440) * 100;
          const backgroundColor = sessionColors[colorIndex];
          return (
            <SessionItem
              key={seance.id}
              seance={seance}
              film={film}
              backgroundColor={backgroundColor}
              leftPosition={leftOffset}
              width={itemWidth}
              setIsDragging={setDraggingState}
            />
          );
        })}
      </div>
    </div>
  );
};