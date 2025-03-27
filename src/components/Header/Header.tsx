import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Header.scss";

export const Header = () => {
  const { isTransferred, transferOut, logout } = useAuth();
  const navigate = useNavigate();

  const handleExit = () => {
    logout();
    transferOut();
    navigate("/");
  };

  return (
    <header className="header">
      {isTransferred ? (
        <div className="header__title">
          <div>
            <span onClick={handleExit}>
              ИДЁМ<span className="header__title-letter">В</span>КИНО
            </span>
          </div>
          <div className="header__title-administrate" onClick={handleExit}>
            <span>Администраторская</span>
          </div>
        </div>
      ) : (
        <div className="header__title" onClick={handleExit}>
          <span>
            ИДЁМ<span className="header__title-letter">В</span>КИНО
          </span>
        </div>
      )}
    </header>
  );
};
