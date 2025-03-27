import { useEffect, useState } from "react";
import { IHall } from "../../models";
import { Notification } from "../../hooks/Notification";
import "./VenueSettings.scss";

type HallConfigProps = {
  hallData: IHall;
  onSave: (updatedHallData: IHall) => void;
  onCancel: () => void;
};

export const VenueSettings: React.FC<HallConfigProps> = ({
  hallData,
  onSave,
  onCancel,
}) => {
  const [rows, setRows] = useState(hallData.hall_rows);
  const [config, setConfig] = useState(hallData.hall_config);
  const [isModified, setIsModified] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [places, setPlaces] = useState(hallData.hall_places);

  useEffect(() => {
    setRows(hallData.hall_rows);
    setConfig(hallData.hall_config);
    setIsModified(false);
    setPlaces(hallData.hall_places);
  }, [hallData]);

  useEffect(() => {
    const updatedConfig = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from(
        { length: places },
        (_, placeIndex) => config[rowIndex]?.[placeIndex] || "disabled"
      )
    );
    setConfig(updatedConfig);
  }, [rows, places]);

  const handleSeatClick = (rowIndex: number, placeIndex: number) => {
    const updatedConfig = config.map((row, rIndex) =>
      rIndex === rowIndex
        ? row.map((seat, pIndex) =>
            pIndex === placeIndex
              ? seat === "standart"
                ? "vip"
                : seat === "vip"
                ? "disabled"
                : "standart"
              : seat
          )
        : row
    );

    setConfig(updatedConfig);
    setIsModified(true);
  };

  const handleSave = () => {
    const updatedHallData: IHall = {
      ...hallData,
      hall_places: places,
      hall_config: config,
      hall_rows: rows,
    };

    const params = new FormData();
    params.set("placeCount", places.toString());
    params.set("config", JSON.stringify(config));
    params.set("rowCount", rows.toString());

    fetch(`https://shfe-diplom.neto-server.ru/hall/${hallData.id}`, {
      method: "POST",
      body: params,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsNotificationVisible(true);
        onSave(updatedHallData);
      })
      .catch((error) =>
        console.error("Ошибка сохранения конфигурации: ", error)
      );

    setIsModified(false);
  };

  const handleCancel = () => {
    setRows(hallData.hall_rows);

    setIsModified(false);
    setPlaces(hallData.hall_places);
    setConfig(hallData.hall_config);
    onCancel();
  };

  const handleRowsChange = (newRows: string) => {
    if (newRows === "") {
      setRows(0);
      setIsModified(true);
      return;
    }

    const parsedRows = parseInt(newRows, 10);

    if (!isNaN(parsedRows)) {
      setRows(parsedRows);
      setIsModified(true);
    }
  };

  const handlePlacesChange = (newPlaces: string) => {
    if (newPlaces === "") {
      setPlaces(0);
      setIsModified(true);
      return;
    }

    const parsedPlaces = parseInt(newPlaces, 10);

    if (!isNaN(parsedPlaces)) {
      setPlaces(parsedPlaces);
      setIsModified(true);
    }
  };

  return (
    <div className="hall-config">
      <div className="hall-config__controls">
        <div className="hall-config__controls-tittle">
          Укажите количество рядов и максимальное количество кресел в ряду:
        </div>
        <div className="hall-config__controls-places">
          <label>
            Рядов, шт
            <input
              type="number"
              value={rows || ""}
              inputMode="numeric"
              min="1"
              max="10"
              onChange={(e) => handleRowsChange(e.target.value)}
              onBlur={() => {
                if (!rows || rows < 1) setRows(1);
                if (rows > 10) setRows(10);
              }}
            />
          </label>
          <span>x</span>
          <label>
            Мест, шт
            <input
              type="number"
              value={places || ""}
              inputMode="numeric"
              min="1"
              max="10"
              onChange={(e) => handlePlacesChange(e.target.value)}
              onBlur={() => {
                if (!places || places < 1) setPlaces(1);
                if (places > 10) setPlaces(10);
              }}
            />
          </label>
        </div>
      </div>
      <div className="hall-config__types-of-chairs">
        <div className="hall-config__types-of-chairs-info">
          <span>Теперь вы можете указать типы кресел на схеме зала:</span>
          <div className="hall-config__types-of-chairs-info-container">
            <div className="hall-config__types-of-chairs-info-row">
              <div className="box hall-config__types-of-chairs-seat-standart"></div>
              <div>— обычные кресла</div>
            </div>{" "}
            <div className="hall-config__types-of-chairs-info-row">
              <div className="box hall-config__types-of-chairs-seat-vip"></div>
              <div>— VIP кресла</div>
            </div>{" "}
            <div className="hall-config__types-of-chairs-info-row">
              <div className="box hall-config__types-of-chairs-seat-disabled "></div>
              <div>— заблокированные (нет кресла)</div>
            </div>
          </div>
        </div>
        <div className="hall-config__types-of-chairs-tittle">
          Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
        </div>
        <div className="hall-config__types-of-chairs-screen">
          <div className="hall-config__types-of-chairs-screen-tittle">
            ЭКРАН
          </div>
          <div className="hall-config__types-of-chairs-seats">
            {config.map((row, rowIndex) => (
              <div key={rowIndex} className="hall-config__types-of-chairs-row">
                {row.map((seat, placeIndex) => (
                  <button
                    key={placeIndex}
                    className={`box hall-config__types-of-chairs-seat hall-config__types-of-chairs-seat-${seat}`}
                    onClick={() => handleSeatClick(rowIndex, placeIndex)}
                  ></button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModified && (
        <div className="hall-config__actions">
          <button onClick={handleCancel}>ОТМЕНА</button>
          <button onClick={handleSave}>СОХРАНИТЬ</button>
        </div>
      )}
      {isNotificationVisible && (
        <Notification
          message="Данные успешно сохранены!"
          onClose={() => setIsNotificationVisible(false)}
        />
      )}
    </div>
  );
};
