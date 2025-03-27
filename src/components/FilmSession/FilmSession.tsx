import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ISeance, IHall, IFilm } from "../../models/index";
import { ModifyBackground } from "../ModifyBackground";
import { Container, Stack } from "react-bootstrap";
import { Header } from "../Header";
import HintSvg from "../../assets/hint.svg";
import Monitor from "../../assets/Monitor.png";
import "./FilmSession.scss";

export const MovieSeance: React.FC = () => {
  const { seanceId } = useParams<{ seanceId: string }>();
  const [seance, setSeance] = useState<ISeance | null>(null);
  const [film, setFilm] = useState<IFilm | null>(null);
  const [hall, setHall] = useState<IHall | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[][]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [seatConfig, setSeatConfig] = useState<string[][]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedData = sessionStorage.getItem("movieSeanceData");
    if (storedData) {
      const { seance, film, hall, selectedDate } = JSON.parse(storedData);
      setSeance(seance);
      setFilm(film);
      setHall(hall);
      setSelectedDate(selectedDate)
    } else {
      console.error("Данные для сеанса не найдены в sessionStorage");
    }
  }, []);

  useEffect(() => {
    const fetchSeatConfig = async () => {
      if (!seanceId || !selectedDate || !hall) return;
  
      try {
        const response = await fetch(
          `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${selectedDate}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (data.result) {
          setSeatConfig(data.result);
        } else {
          console.error("Ошибка получения конфигурации мест: ", data);
        }
      } catch (error) {
        console.error("Ошибка загрузки конфигурации мест: ", error);
      }
    };

    fetchSeatConfig()
  }, [selectedDate, hall, seanceId]);

  if (!seance || !film || !hall) {
    return (
      <ModifyBackground>
        <Container className="main p-0">
          <Stack direction="horizontal" className="main__header">
            <div className="main__header-title">
              <Header />
            </div>
          </Stack>
          <Stack>
            <div className="container ms-auto w-100 h-100 d-flex justify-content-center">
              <div className="p-9">Загрузка...</div>
            </div>
          </Stack>
        </Container>
      </ModifyBackground>
    );
  }

  // const seatConfig = hall.hall_config;

  const handleSeatClick = (row: number, col: number) => {
    const rowIndex = row + 1; // Переносим нумерацию на 1
    const colIndex = col + 1; // Переносим нумерацию на 1

    const isSelected = selectedSeats.some(
      ([r, c]) => r === rowIndex && c === colIndex
    );

    setSelectedSeats((prev) => {
      const updatedSeats = isSelected
        ? prev.filter(([r, c]) => r !== rowIndex || c !== colIndex)
        : [...prev, [rowIndex, colIndex]];

      // Сортировка мест по ряду и месту
      return updatedSeats.sort(([r1, c1], [r2, c2]) =>
        r1 === r2 ? c1 - c2 : r1 - r2
      );
    });
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, [row, col]) => {
      const seatType = hall?.hall_config[row - 1]?.[col - 1];
      if (seatType === "vip") {
        return total + hall.hall_price_vip;
      }
      if (seatType === "standart") {
        return total + hall.hall_price_standart;
      }
      return total;
    }, 0);
  };

  const getSelectedSeatsString = () => {
    return selectedSeats
      .map(([row, col]) => `Ряд ${row}, Место ${col}`)
      .join(" | ");
  };

  const handleBooking = () => {
    const totalPrice = calculateTotalPrice();
    const selectedSeatsString = getSelectedSeatsString();

    console.log(`Места: ${selectedSeats}`);
    console.log(`Итоговая стоимость: ${totalPrice}`);
    console.log(`Выбранные места: ${selectedSeatsString}`);

    navigate("/booking-tickets", {
      state: {
        seanceId: seanceId,
        hall,
        filmName: film.film_name,
        hallName: hall.hall_name,
        seanceTime: seance.seance_time,
        selectedSeats,
        selectedSeatsString,
        totalPrice,
        selectedDate: selectedDate,
      },
    });
  };

  return (
    <ModifyBackground>
      <Container className="seances__container p-0">
        <Stack direction="horizontal" className="main__header">
          <div className="main__header-title">
            <Header />
          </div>
        </Stack>
        <Stack className="seance">
          <div className="seance__tittle p-3 d-flex justify-content-between">
            <div>
              <h1>{film.film_name}</h1>
              <h2>Начало сеанса: {seance.seance_time}</h2>
              <h1>{hall.hall_name}</h1>
            </div>
            <div className="seance__tap d-flex align-items-center">
              <div>
                <img src={HintSvg} alt="Тап" />
              </div>
              <div className="seance__tap-tittle d-flex">
                Тапните дважды, чтобы увеличить
              </div>
            </div>
          </div>
          <div className="seance__places p-3 d-flex justify-content-center">
            <div className="seance__places-container ">
              <div className="w-100">
                <img className="seance__places-screen" src={Monitor} alt="" />
                <div className="seance__seats-grid">
                  {seatConfig.map((row, rowIndex) => (
                    <div key={rowIndex} className="seance__seats-row">
                      {row.map((col, colIndex) => {
                        const seatRow = rowIndex + 1; // Нумерация с 1
                        const seatCol = colIndex + 1; // Нумерация с 1

                        const isSelected = selectedSeats.some(
                          ([r, c]) => r === seatRow && c === seatCol
                        );
                        const isDisabled = col === "disabled";
                        const isTaken = col === "taken"
                        const isVip = col === "vip";

                        return (
                          <button
                            key={`${rowIndex}-${colIndex}`}
                            className={`seance__seat ${
                              isDisabled
                                ? "disabled"
                                : isSelected
                                ? "selected"
                                : isVip
                                ? "vip"
                                : isTaken 
                                ? "taken"
                                : "standart"
                            }`}
                            onClick={() =>
                              !isDisabled && handleSeatClick(rowIndex, colIndex)
                            }
                            disabled={isDisabled || isTaken}
                          ></button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="legend d-flex justify-content-center">
                <div className="gap">
                  <div className="legend-item">
                    <span className="box free"></span> Свободно (
                    {hall.hall_price_standart}руб)
                  </div>
                  <div className="legend-item">
                    <span className="box vip"></span> Свободно VIP (
                    {hall.hall_price_vip}руб)
                  </div>
                </div>
                <div className="gap">
                  <div className="legend-item">
                    <span className="box"></span> Занято
                  </div>
                  <div className="legend-item">
                    <span className="box selected"></span> Выбрано
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="actions">
            <button
              className=""
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
            >
              Забронировать
            </button>
          </div>
        </Stack>
      </Container>
    </ModifyBackground>
  );
};
