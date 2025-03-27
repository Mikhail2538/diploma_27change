import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import { ModifyBackground } from "../ModifyBackground";
import { Header } from "../Header";
import "./TicketReservations.scss";
import { Container, Stack } from "react-bootstrap";

export const TicketReservations: React.FC = () => {
  const [isTicketGenerated, setIsTicketGenerated] = useState(false);
  const [qrData, setQrData] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const {
    seanceId,
    hall,
    filmName,
    hallName,
    seanceTime,
    selectedSeats,
    selectedSeatsString,
    totalPrice,
    selectedDate,
  } = location.state || {};

  if (!filmName || !hallName || !seanceTime || !selectedSeatsString) {
    return <div>Данные для бронирования отсутствуют.</div>;
  }

  const handleConfirmBooking = async () => {
    setIsTicketGenerated(true);

    if (!hall) {
      console.error("Зал не найден.");
      return;
    }

    const tickets = selectedSeats.map(([row, place]: [number, number]) => {
      const seatType = hall.hall_config[row - 1]?.[place - 1];
      if (seatType === "vip") {
        return {
          row,
          place,
          coast: hall.hall_price_vip,
        };
      }
      if (seatType === "standart") {
        return {
          row,
          place,
          coast: hall.hall_price_standart,
        };
      }
      if (!seatType) {
        throw new Error(`Некорректный тип места: row=${row}, place=${place}`);
      }

      return {
        row,
        place,
        coast: 0,
      };
    });

    const params = new FormData();
    params.set("seanceId", String(seanceId));
    params.set("ticketDate", selectedDate);
    params.set("tickets", JSON.stringify(tickets));

    try {
      setLoading(true);
      const response = await fetch(
        "https://shfe-diplom.neto-server.ru/ticket",
        {
          method: "POST",
          body: params,
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const result = await response.json();
      setQrData(result);
      setLoading(false);
      console.log("Билеты успешно забронированы:", result);
    } catch (error) {
      console.error("Ошибка бронирования:", error);
    }
  };

  return (
    <ModifyBackground>
      <Container className="booking-tickets__container p-0">
        <Stack direction="horizontal" className="main__header">
          <div className="main__header-title">
            <Header />
          </div>
        </Stack>
        <Stack className="booking-tickets">
          {(!isTicketGenerated && (
            <div>
              <div className="booking-tickets__tittle tickets-decorator">
                <h1>Вы выбрали билеты:</h1>
              </div>
              <div className="tickets__separator"></div>
              <div className="booking-tickets__details-container  tickets-decorator">
                <div className="booking-tickets__details">
                  <p className="mb-2">
                    На фильм: <span>{filmName}</span>
                  </p>
                  <p className="mb-2">
                    Места: <span>{selectedSeatsString}</span>
                  </p>
                  <p className="mb-2">
                    В зале: <span>{hallName}</span>
                  </p>
                  <p className="mb-2">
                    Начало сеанса: <span>{seanceTime}</span>
                  </p>
                  <p>
                    Стоимость: <span>{totalPrice}</span> рублей
                  </p>
                </div>
                <button onClick={handleConfirmBooking}>
                  Получить код бронирования
                </button>
                <div className="booking-tickets__note">
                  <p className="mb-2">
                    После оплаты билет будет доступен в этом окне, а также
                    придет вам на почту. Покажите QR-код нашему контролеру у
                    входа в зал.
                  </p>
                  <p>Приятного просмотра!</p>
                </div>
              </div>
            </div>
          )) ||
            (isTicketGenerated && (
              <div>
                <div className="booking-tickets__tittle tickets-decorator">
                  <h1>Вы выбрали билеты:</h1>
                </div>
                <div className="tickets__separator"></div>
                <div className="booking-tickets__details-container tickets-decorator">
                  <div className="booking-tickets__details">
                    <p className="mb-2">
                      На фильм: <span>{filmName}</span>
                    </p>
                    <p className="mb-2">
                      Места: <span>{selectedSeatsString}</span>
                    </p>
                    <p className="mb-2">
                      В зале: <span>{hallName}</span>
                    </p>
                    <p className="">
                      Начало сеанса: <span>{seanceTime}</span>
                    </p>
                  </div>
                  {loading ? (
                    <div className="booking-tickets__ticketQr">
                      <div>
                        <p>Обрабатываем запрос...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="booking-tickets__ticketQr">
                      <div>
                        <QRCode value={JSON.stringify(qrData)} size={200} />
                      </div>
                    </div>
                  )}
                  <div className="booking-tickets__note">
                    <p className="mb-2">
                      Покажите QR-код нашему контролеру для подтверждения
                      бронирования.
                    </p>
                    <p>Приятного просмотра!</p>
                  </div>
                </div>
              </div>
            ))}
        </Stack>
      </Container>
    </ModifyBackground>
  );
};
