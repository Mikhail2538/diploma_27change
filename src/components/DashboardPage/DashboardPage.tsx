import { IHall } from "../../models";
import "./DashboardPage.scss";

interface IHallManagement {
  hall: IHall;
  onDelete: (id: number) => void;
}

export const DashboardPage: React.FC<IHallManagement> = ({
  hall,
  onDelete,
}) => {
  return (
    <div className="hallSet__list-item">
      <div>–</div>
      <div>{hall.hall_name}</div>
      <div
        className="hallSet__delete-button"
        onClick={() => onDelete(hall.id)}
      ></div>
    </div>
  );
};
