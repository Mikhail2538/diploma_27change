import { useState } from "react";

import "../DashboardPage/DashboardPage.scss";
import { IHall } from "../../models";
interface CreateHallModalProps {
  onHallCreated: (updatedHalls: IHall[]) => void;
  onSave: () => void;
  onClose: () => void;
}

export const VenueCreationModal: React.FC<CreateHallModalProps> = ({
  onClose,
  onHallCreated,
  onSave,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hallName, setHallName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const params = new FormData();
    params.set("hallName", hallName);

    try {
      const response = await fetch("https://shfe-diplom.neto-server.ru/hall", {
        method: "POST",
        body: params,
      });
      const data = await response.json();

      if (data.success && data.result?.halls) {
        onHallCreated(data.result.halls);
        onSave();
        onClose();
      } else {
        console.error("Ошибка создания зала:", data.message);
      }
    } catch (error) {
      console.error("Ошибка сети при создании зала:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal__overlay">
      <div className="modal__content">
        <header className="modal__header">
          <h2>Добавление зала</h2>
          <div className="modal__close" onClick={onClose}></div>
        </header>
        <form onSubmit={handleSubmit} className="modal__form">
          <div className="w-100">
            <label htmlFor="hallName">Название зала</label>
            <input
              id="hallName"
              type="text"
              value={hallName}
              onChange={(e) => setHallName(e.target.value)}
              placeholder="Название зала"
              required
            />
          </div>
          <div className="modal__actions">
            <button
              type="submit"
              className="btn-box btn__primary"
              disabled={isSubmitting}
            >
              Добавить
            </button>
            <button
              type="button"
              className="btn-box btn__secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
