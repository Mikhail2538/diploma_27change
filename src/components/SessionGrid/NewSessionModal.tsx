import { useState } from "react";
import "../DashboardPage/DashboardPage.scss";

interface AddSeanceModalProps {
  error: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (time: string) => void;
  filmName: string;
  hallName: string;
  isSubmitting: boolean;
}

export const NewSessionModal: React.FC<AddSeanceModalProps> = ({
  error,
  isOpen,
  onClose,
  onAdd,
  filmName,
  hallName,
  isSubmitting,
}) => {
  const [sessionTime, setSessionTime] = useState("");

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSessionTime(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sessionTime) {
      onAdd(sessionTime);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal__overlay">
      <div className="modal__content">
        <header className="modal__header">
          <h2>Добавить сеанс</h2>
          <div className="modal__close" onClick={onClose}></div>
        </header>
        <form onSubmit={handleFormSubmit} className="modal__form">
          <div className="w-100">
            <label htmlFor="hallName">Название зала</label>
            <input
              id="hallName"
              name="hallName"
              type="text"
              value={hallName}
              readOnly
            />
          </div>
          <div className="w-100">
            <label htmlFor="filmName">Название фильма</label>
            <input
              id="filmName"
              name="filmName"
              type="text"
              value={filmName}
              readOnly
            />
          </div>
          <div className="w-100">
            <label htmlFor="filmTime">Время начала</label>
            <input
              id="filmTime"
              name="duration"
              type="time"
              inputMode="numeric"
              min={1}
              placeholder="Время начала"
              value={sessionTime}
              onChange={handleTimeChange}
              onBlur={(event) => {
                if (!event.target.value) {
                  setSessionTime("00:00");
                }
              }}
              required
            />
          </div>

          {error && (
            <p className="m-0" style={{ color: "red", fontWeight: "600" }}>
              {error}
            </p>
          )}

          <div className="modal__actions">
            <button
              type="submit"
              className="btn-box btn__primary"
              disabled={isSubmitting}
            >
              Добавить Фильм
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
