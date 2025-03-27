import { useEffect, useState } from "react";
import { Notification } from "../../hooks/Notification";
import { IHall } from "../../models";
import "./PriceConfig.scss";

type PriceConfigProps = {
  hallData: IHall;
  onSave: (updatedHallData: IHall) => void;
  onCancel: () => void;
};

export const PriceConfig: React.FC<PriceConfigProps> = ({
  hallData,
  onSave,
  onCancel,
}) => {
  const [priceStandart, setPriceStandart] = useState(
    hallData.hall_price_standart
  );
  const [priceVip, setPriceVip] = useState(hallData.hall_price_vip);
  const [isModified, setIsModified] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  useEffect(() => {
    setPriceStandart(hallData.hall_price_standart);
    setPriceVip(hallData.hall_price_vip);
    setIsModified(false);
  }, [hallData]);

  const handleSave = () => {
    const updatedHallData: IHall = {
      ...hallData,
      hall_price_standart: priceStandart,
      hall_price_vip: priceVip,
    };

    const params = new FormData();
    params.set("priceStandart", priceStandart.toString());
    params.set("priceVip", priceVip.toString());

    fetch(`https://shfe-diplom.neto-server.ru/price/${hallData.id}`, {
      method: "POST",
      body: params,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        onSave(updatedHallData);
        setIsNotificationVisible(true);
      })
      .catch((error) =>
        console.error("Ошибка сохранения конфигурации: ", error)
      );

    setIsModified(false);
  };

  const handlePriceStandartChange = (newStandartPrice: string) => {
    if (newStandartPrice === "") {
      setPriceStandart(0);
      setIsModified(true);
      return;
    }

    const parsedStandartPrice = parseInt(newStandartPrice, 10);

    if (!isNaN(parsedStandartPrice)) {
      setPriceStandart(parsedStandartPrice);
      setIsModified(true);
    }
  };

  const handlePriceVipChange = (newViptPrice: string) => {
    if (newViptPrice === "") {
      setPriceVip(0);
      setIsModified(true);
      return;
    }

    const parsedVipPrice = parseInt(newViptPrice, 10);

    if (!isNaN(parsedVipPrice)) {
      setPriceVip(parsedVipPrice);
      setIsModified(true);
    }
  };

  const handleCancel = () => {
    setPriceStandart(hallData.hall_price_standart);
    setPriceVip(hallData.hall_price_vip);
    setIsModified(false);
    onCancel();
  };

  return (
    <div className="price-config">
      <div className="price-config__controls-prices">
        <div className="price-config__controls-prices-tittle">
          Установите цены для типов кресел:
        </div>
        <div className="price-config__controls-prices-container">
          <div className="price-config__controls-prices-info">
            <label>
              Цена, рублей
              <div className="price-config__controls-prices-set-price">
                <input
                  type="number"
                  value={priceStandart || ""}
                  inputMode="numeric"
                  min="1"
                  max="2000"
                  onChange={(e) => handlePriceStandartChange(e.target.value)}
                  onBlur={() => {
                    if (!priceStandart || priceStandart < 1)
                      setPriceStandart(1);
                    if (priceStandart > 2000) setPriceStandart(2000);
                  }}
                />
                <div>за</div>
                <div className="box price-config__controls-prices-standart"></div>
                <div>обычные кресла</div>
              </div>
            </label>
          </div>
          <div className="price-config__controls-prices-info">
            <label>
              Цена, рублей
              <div className="price-config__controls-prices-set-price">
                <input
                  type="number"
                  value={priceVip || ""}
                  inputMode="numeric"
                  min="1"
                  max="2000"
                  onChange={(e) => handlePriceVipChange(e.target.value)}
                  onBlur={() => {
                    if (!priceVip || priceVip < 1) setPriceVip(1);
                    if (priceVip > 2000) setPriceVip(2000);
                  }}
                />
                <div>за</div>
                <div className="box price-config__controls-prices-vip"></div>
                <div>VIP кресла</div>
              </div>
            </label>
          </div>
        </div>
      </div>
      {isModified && (
        <div className="price-config__actions">
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
