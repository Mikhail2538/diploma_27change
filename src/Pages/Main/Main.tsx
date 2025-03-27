import React, { useState, useEffect } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ModifyBackground } from "../../components/ModifyBackground/ModifyBackground";
import { Header } from "../../components/Header";
import { Movie } from "../../components/Film";
import { IFilm, IHall, ISeance } from "../../models";

import "./Main.scss";

export const Main: React.FC = () => {
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [halls, setHalls] = useState<IHall[]>([]);
  const [seances, setSeances] = useState<ISeance[]>([]);
  const [loading, setLoading] = useState(false);
  const [films, setFilms] = useState<IFilm[]>([]);


  const navigate = useNavigate();
  const { transferIn, transferOut, logout } = useAuth();

  useEffect(() => {
    transferOut();
    logout();
    // Генерация дат (6 дней начиная с текущей)
    const today = new Date();
    const generatedDates = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date;
    });
    setDates(generatedDates);

    // Установка текущей даты по умолчанию
    const todayString = today.toISOString().split("T")[0];
    setSelectedDate(todayString);
    fetchMovies();
  }, [transferOut, logout]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      await fetch("https://shfe-diplom.neto-server.ru/alldata", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          const filteredFilms = data.result.films.filter((film: IFilm) => {
            return data.result.seances.some(
              (seance: ISeance) =>
                seance.seance_filmid === film.id &&
                data.result.halls.some(
                  (hall: IHall) =>
                    hall.id === seance.seance_hallid && hall.hall_open === 1
                )
            );
          });

          setFilms(filteredFilms);
          setHalls(data.result.halls);
          setSeances(data.result.seances);
        });
    } catch (e) {
      console.error("Ошибка загрузки фильмов", e);
    } finally {
      setLoading(false);
    }
  };



  const handleNextDate = () => {
    if (dates.length && selectedDate) {
      const currentIndex = dates.findIndex(
        (d) => d.toISOString().split("T")[0] === selectedDate
      );
      const nextIndex = (currentIndex + 1) % dates.length; 
      handleDateClick(dates[nextIndex]);
    }
  };

  const handleLogin = () => {
    transferIn();
    navigate("/login");
  };

  const handleDateClick = (date: Date): void => {
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString);
  };

  return (
    <ModifyBackground>
      <Container className="main p-0">
        <Stack direction="horizontal" className="main__header">
          <div className="main__header-title">
            <Header />
          </div>
          <div className="main__header-button ms-auto ">
            <Button variant="secondary" onClick={handleLogin}>
              Войти
            </Button>
          </div>
        </Stack>
        <Stack direction="horizontal" className="main__nav-date-container">
          {dates.map((date, index) => {
            const dateString = date.toISOString().split("T")[0];
            const isSelected = dateString === selectedDate;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Проверка на выходные

            const changeSize = isSelected
              ? "main__nav-date-active"
              : "main__nav-date";

            return (
              <div
                key={dateString}
                className={`md="auto" ${changeSize}`}
                onClick={() => handleDateClick(date)}
                style={{
                  color: isWeekend ? "red" : "black", // Выделение выходных красным цветом
                }}
              >
                <div>
                  {index === 0
                    ? "Сегодня"
                    : `${date.toLocaleDateString("ru-RU", {
                        weekday: "short",
                      })},`}
                </div>
                <div>
                  {index === 0
                    ? `${date.toLocaleDateString("ru-RU", {
                        weekday: "short",
                      })}, ${date.getDate()}`
                    : `${date.getDate()}`}
                </div>
              </div>
            );
          })}
          <button
            className={`md="auto" main__nav-date-button`}
            onClick={handleNextDate}
          >
            {">"}
          </button>
        </Stack>
        <Stack>
          {loading ? (
            <div style={{ marginTop: "40px" }}>Загрузка...</div>
          ) : (
            <div style={{ marginTop: "40px" }}>
              {films.length > 0 ? (
                <Movie
                  films={films}
                  halls={halls}
                  seances={seances}
                  selectedDate={selectedDate}
                />
              ) : (
                <div>Фильмы не найдены</div>
              )}
            </div>
          )}
        </Stack>
      </Container>
    </ModifyBackground>
  );
};
