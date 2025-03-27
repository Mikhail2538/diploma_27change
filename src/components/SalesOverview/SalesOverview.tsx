import { useEffect, useState } from "react";
import { Notification } from "../../hooks/Notification";
import { IHall } from "../../models";
import "./SalesOverview.scss";

type OpenSalesProps = {
  hallData: IHall;
  onSave: (updatedHallData: IHall) => void;
};

export const OpenSales: React.FC<OpenSalesProps> = ({ hallData, onSave }) => {
  const [isHallOpen, setIsHallOpen] = useState(hallData.hall_open);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setIsHallOpen(hallData.hall_open);
  }, [hallData]);

  const toggleHallStatus = () => {
    const newStatus = isHallOpen === 1 ? 0 : 1;
    const updatedHallData: IHall = {
      ...hallData,
      hall_open: newStatus,
    };

    const params = new FormData();
    params.set("hallOpen", newStatus.toString());

    fetch(`https://shfe-diplom.neto-server.ru/open/${hallData.id}`, {
      method: "POST",
      body: params,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        onSave(updatedHallData);
        setShowNotification(true);
      })
      .catch((error) => console.error("Ошибка обновления статуса: ", error));
  };

  return (
    <div className="open-sales">
      <div className="open-sales__title">
        Зал: {isHallOpen ? "Открыт" : "Закрыт"}
      </div>
      <div className="open-sales__actions">
        <button onClick={toggleHallStatus}>
          {isHallOpen ? "ЗАКРЫТЬ ПРОДАЖУ БИЛЕТОВ" : "ОТКРЫТЬ ПРОДАЖУ БИЛЕТОВ"}
        </button>
      </div>
      {showNotification && (
        <Notification
          message="Данные успешно обновлены!"
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};