import "../DashboardPage/DashboardPage.scss";

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  filmName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteConfirmation: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onConfirm,
  filmName,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal__overlay">
      <div className="modal__content">
        <header className="modal__header">
          <h2>Подтверждение удаления</h2>
          <div className="modal__close" onClick={onClose}></div>
        </header>
        <div className="modal__form">
          <p className="m-0">
            Вы уверены, что хотите удалить фильм
            <span style={{ fontWeight: "bold" }}>&quot;{filmName}&quot;</span> с
            сеанса?
          </p>
          <div className="modal__actions">
            <button className="btn-box btn__primary" onClick={onConfirm}>
              Удалить
            </button>
            <button className="btn-box btn__secondary" onClick={onClose}>
              Отменить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
