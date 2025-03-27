import { useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import { Header } from "../../components/Header";
import { ModifyBackground } from "../../components/ModifyBackground/ModifyBackground";
import { DashboardPage } from "../../components/DashboardPage";
import { VenueCreationModal } from "../../components/VenueCreationModal";
import { VenueSettings } from "../../components/VenueSettings";
import { PriceConfig } from "../../components/PriceConfig";
import { IFilm, IHall, ISeance } from "../../models";
import { OpenSales } from "../../components/SalesOverview";
import { Notification } from "../../hooks/Notification";
import { CreatMovePopup } from "../../components/CreatMovePopup";
import { SessionGrid } from "../../components/SessionGrid/SessionGrid";
import "./AdminPage.scss";

export const AdminPage = () => {
  const [films, setFilms] = useState<IFilm[]>([]);
  const [halls, setHalls] = useState<IHall[]>([]);
  const [seances, setSeances] = useState<ISeance[]>([]);
  const [isHallModalOpen, setIsHallModalOpen] = useState(false);
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const [selectedHallForConfig, setSelectedHallForConfig] =
    useState<IHall | null>(null);
  const [selectedHallForPrice, setSelectedHallForPrice] =
    useState<IHall | null>(null);
  const [selectedHallForOrder, setSelectedHallForOrder] =
    useState<IHall | null>(null);
  const [sectionStates, setSectionStates] = useState([
    { id: "hallManagment", isOpen: true },
    { id: "hallConfig", isOpen: true },
    { id: "priceConfig", isOpen: true },
    { id: "sessionGrid", isOpen: true },
    { id: "openSales", isOpen: true },
  ]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await fetch("https://shfe-diplom.neto-server.ru/alldata", {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            setFilms(data.result.films);
            setSeances(data.result.seances);
            setHalls(data.result.halls);
            if (data.result.halls.length > 0) {
              setSelectedHallForConfig(data.result.halls[0]);
              setSelectedHallForPrice(data.result.halls[0]);
              setSelectedHallForOrder(data.result.halls[0]);
            }
          });
      } catch (e) {
        console.error("Ошибка загрузки данных", e);
      }
    };

    fetchAllData();
  }, []);

  const handleDeleteHall = async (id: number) => {
    try {
      await fetch(`https://shfe-diplom.neto-server.ru/hall/${id}`, {
        method: "DELETE",
      });
      setHalls((prevHalls) => prevHalls.filter((hall) => hall.id !== id));
    } catch (e) {
      console.error("Ошибка при удалении зала", e);
    }
  };

  const handleHallCreated = (updatedHalls: IHall[]) => {
    setHalls(updatedHalls);
  };

  const handleFilmAdded = (updatedFilms: IFilm[]) => {
    setFilms(updatedFilms);
    console.log(films);
  };

  const toggleSection = (id: string) => {
    setSectionStates((prevStates) =>
      prevStates.map((section) =>
        section.id === id ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  const isSectionOpen = (id: string) =>
    sectionStates.find((section) => section.id === id)?.isOpen;

  const handleHallConfigClick = (hall: IHall) => {
    if (selectedHallForConfig?.id !== hall.id) {
      setSelectedHallForConfig(hall);
    }
  };

  const handleHallPriceClick = (hall: IHall) => {
    if (selectedHallForPrice?.id !== hall.id) {
      setSelectedHallForPrice(hall);
    }
  };

  const handleHallOrderClick = (hall: IHall) => {
    if (selectedHallForOrder?.id !== hall.id) {
      setSelectedHallForOrder(hall);
    }
  };

  const handleSave = (updatedHallData: IHall) => {
    setHalls((prevHalls) =>
      prevHalls.map((hall) =>
        hall.id === updatedHallData.id ? updatedHallData : hall
      )
    );

    if (selectedHallForConfig?.id === updatedHallData.id) {
      setSelectedHallForConfig(updatedHallData);
    }

    if (selectedHallForPrice?.id === updatedHallData.id) {
      setSelectedHallForPrice(updatedHallData);
    }

    if (selectedHallForOrder?.id === updatedHallData.id) {
      setSelectedHallForOrder(updatedHallData);
    }
  };

  const handleCancel = () => {
    if (selectedHallForConfig) {
      const originalHall = halls.find(
        (hall) => hall.id === selectedHallForConfig.id
      );
      if (originalHall) {
        setSelectedHallForConfig(originalHall);
      }
    }

    if (selectedHallForPrice) {
      const originalHall = halls.find(
        (hall) => hall.id === selectedHallForPrice.id
      );
      if (originalHall) {
        setSelectedHallForPrice(originalHall);
      }
    }
  };

  return (
    <ModifyBackground>
      <Container className="admin-page__container">
        <div className="admin-page__header">
          <Header />
        </div>

        <Stack className="admin-section__container">
          <header className="admin-section__header admin-section__header-alone">
            <div className="admin-section__header-container">
              <div className="admin-section__header-tittle">
                Управление залами
              </div>
              <div
                className={`admin-section__header-close-button ${
                  isSectionOpen("hallManagment") ? "" : "rotated"
                }`}
                onClick={() => toggleSection("hallManagment")}
              ></div>
            </div>
          </header>
          <section
            className={`admin-section__body admin-section__body-both ${
              isSectionOpen("hallManagment") ? "" : "admin-section__hidden"
            }`}
          >
            <div>Доступные залы:</div>
            <div className="admin-section__hallSet">
              {halls.map((hall) => {
                if (halls.length === 0) return null;
                return (
                  <DashboardPage
                    key={hall.id}
                    hall={hall}
                    onDelete={handleDeleteHall}
                  />
                );
              })}
            </div>
            <button
              className="admin-section__btn"
              onClick={() => setIsHallModalOpen(true)}
            >
              Cоздать зал
            </button>
          </section>
        </Stack>

        <Stack className="admin-section__container">
          <header className="admin-section__header admin-section__header-alone admin-section__header-both">
            <div className="admin-section__header-container">
              <div className="admin-section__header-tittle">
                Конфигурация залов
              </div>
              <div
                className={`admin-section__header-close-button ${
                  isSectionOpen("hallConfig") ? "" : "rotated"
                }`}
                onClick={() => toggleSection("hallConfig")}
              ></div>
            </div>
          </header>
          <section
            className={`admin-section__body admin-section__body-both ${
              isSectionOpen("hallConfig") ? "" : "admin-section__hidden"
            }`}
          >
            <div className="mb-3">Выберите зал для конфигурации:</div>
            <div className="admin-section__hall-config">
              {halls.map((hall) => (
                <div
                  className={`admin-section__hall-item ${
                    selectedHallForConfig?.id === hall.id
                      ? "admin-section__hall-item-selected"
                      : ""
                  }`}
                  key={hall.id}
                  onClick={() => handleHallConfigClick(hall)}
                >
                  {hall.hall_name}
                </div>
              ))}
            </div>
            {selectedHallForConfig && (
              <VenueSettings
                hallData={selectedHallForConfig}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </section>
        </Stack>

        <Stack className="admin-section__container">
          <header className="admin-section__header admin-section__header-alone admin-section__header-both">
            <div className="admin-section__header-container">
              <div className="admin-section__header-tittle">
                Конфигурация цен
              </div>
              <div
                className={`admin-section__header-close-button ${
                  isSectionOpen("priceConfig") ? "" : "rotated"
                }`}
                onClick={() => toggleSection("priceConfig")}
              ></div>
            </div>
          </header>
          <section
            className={`admin-section__body admin-section__body-both ${
              isSectionOpen("priceConfig") ? "" : "admin-section__hidden"
            }`}
          >
            <div className="mb-3">Выберите зал для конфигурации:</div>
            <div className="admin-section__hall-config">
              {halls.map((hall) => (
                <div
                  className={`admin-section__hall-item ${
                    selectedHallForPrice?.id === hall.id
                      ? "admin-section__hall-item-selected"
                      : ""
                  }`}
                  key={hall.id}
                  onClick={() => handleHallPriceClick(hall)}
                >
                  {hall.hall_name}
                </div>
              ))}
            </div>
            {selectedHallForPrice && (
              <PriceConfig
                hallData={selectedHallForPrice}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </section>
        </Stack>

        <Stack className="admin-section__container">
          <header className="admin-section__header admin-section__header-alone admin-section__header-both">
            <div className="admin-section__header-container">
              <div className="admin-section__header-tittle">Сетка сеансов</div>
              <div
                className={`admin-section__header-close-button ${
                  isSectionOpen("sessionGrid") ? "" : "rotated"
                }`}
                onClick={() => toggleSection("sessionGrid")}
              ></div>
            </div>
          </header>
          <section
            className={`admin-section__body admin-section__body-both ${
              isSectionOpen("sessionGrid") ? "" : "admin-section__hidden"
            }`}
          >
            <button
              className="admin-section__btn"
              onClick={() => {
                setIsFilmModalOpen(true);
              }}
            >
              Добавить фильм
            </button>
            <SessionGrid
              halls={halls}
              films={films}
              seances={seances}
              setSeances={setSeances}
              setFilms={setFilms}
              onSave={() => setIsNotificationVisible(true)}
            />
          </section>
        </Stack>

        <Stack className="admin-section__container">
          <header className="admin-section__header admin-section__header-last">
            <div className="admin-section__header-container">
              <div className="admin-section__header-tittle">
                Открыть продажи
              </div>
              <div
                className={`admin-section__header-close-button ${
                  isSectionOpen("openSales") ? "" : "rotated"
                }`}
                onClick={() => toggleSection("openSales")}
              ></div>
            </div>
          </header>
          <section
            className={`admin-section__body ${
              isSectionOpen("openSales") ? "" : "admin-section__hidden"
            }`}
          >
            <div className="mb-3">
              Выберите зал для открытия/закрытия продаж:
            </div>
            <div className="admin-section__hall-config">
              {halls.map((hall) => (
                <div
                  className={`admin-section__hall-item ${
                    selectedHallForOrder?.id === hall.id
                      ? "admin-section__hall-item-selected"
                      : ""
                  }`}
                  key={hall.id}
                  onClick={() => handleHallOrderClick(hall)}
                >
                  {hall.hall_name}
                </div>
              ))}
            </div>
            {selectedHallForOrder && (
              <OpenSales hallData={selectedHallForOrder} onSave={handleSave} />
            )}
          </section>
        </Stack>
      </Container>
      {isHallModalOpen && (
        <VenueCreationModal
          onClose={() => setIsHallModalOpen(false)}
          onHallCreated={handleHallCreated}
          onSave={() => setIsNotificationVisible(true)}
        />
      )}
      {isFilmModalOpen && (
        <CreatMovePopup
          onClose={() => setIsFilmModalOpen(false)}
          onFilmAdded={handleFilmAdded}
          onSave={() => setIsNotificationVisible(true)}
        />
      )}
      {isNotificationVisible && (
        <Notification
          message="Данные успешно сохранены!"
          onClose={() => setIsNotificationVisible(false)}
        />
      )}
    </ModifyBackground>
  );
};
