export interface IAuthContext {
  isAuthenticated: boolean;
  isTransferred: boolean;
  login: () => void;
  logout: () => void;
  transferIn: () => void;
  transferOut: () => void;
}

export interface IAllData {
    halls: IHall[], // Список залов 
    films: IFilm[], // Список фильмов 
    seances: ISeance[] // Список сеансов
}


export interface IHall {
  id: number; // ID кинозала
  hall_name: string; // Название кинозала
  hall_rows: number; // Кол-во рядов с зрительными местами в кинозале
  hall_places: number; // Кол-во зрительных мест в одном ряду
  hall_config: string[][]; // Конфигурация посадочных мест в кинозале
  hall_price_standart: number; // Цена обычного билета
  hall_price_vip: number; // Цена ВИП билета
  hall_open: number; // Открыт ли кинозал для продажи билетов
}

export interface IFilm {
  id: number; // ID фильма
  film_name: string; // Название фильма
  film_duration: number; // Длительность фильма в минутах
  film_description: string; // Описание фильма
  film_origin: string; // Страна
  film_poster: string; // URL адрес к постеру (картинке) фильма
}

export interface ISeance {
  id: number; // ID сеанса
  seance_filmid: number; // ID фильма
  seance_hallid: number; // ID зала
  seance_time: string; // Время начала сеанса
}