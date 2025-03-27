import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { ModifyBackground } from "../../components/ModifyBackground/ModifyBackground";
import Form from "react-bootstrap/Form";
import "./Login.scss";

export interface ILoginForm {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const EMAIL_REGEXP =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

  const [form, setForm] = useState<ILoginForm>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { login, logout, transferIn } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/movies/edit";

  useEffect(() => {
    transferIn();
    logout();
  }, [logout, transferIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const isEmailValid = (value: string) => {
    return EMAIL_REGEXP.test(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEmailValid(form.email)) {
      setError("Неверная запись E-mail");
      setLoading(false);
      setDisabled(false);
      return;
    } else {
      setError("");
    }

    const params = new FormData();
    params.set("login", form.email);
    params.set("password", form.password);

    try {
      setLoading(true);
      setDisabled(true);
      setError("");

      const response = await fetch("https://shfe-diplom.neto-server.ru/login", {
        method: "POST",
        body: params,
      });

      const data = await response.json();

      if (data.success === true) {
        login();
        navigate(from, { replace: true });
        setLoading(false);
        setDisabled(false);
        console.log("Авторизация пройдена успешно!");
      } else {
        setLoading(false);
        setDisabled(false);
        setError("Неверный email или пароль");
      }
    } catch (e) {
      setError(`Произошла ошибка ${e}. Попробуйте позже.`);
    }
  };

  return (
    <ModifyBackground>
      <div className="login">
        <Container className="p-0 login__container">
          <Row className="login__header mx-auto">
            <Col>
              <div className="">
                <Header />
              </div>
            </Col>
          </Row>
          <Row className="login__container-form  mx-auto">
            <Col className="p-0">
              <div className="login__title p-3">Авторизация</div>
              <Form
                className="login__form p-3"
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <Form.Group
                  className="login__input email mb-2"
                  controlId="formBasicEmail"
                >
                  <Form.Label className="mb-0">E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="shfe-diplom@netology.ru"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group
                  className="login__input password mb-3"
                  controlId="formBasicPassword"
                >
                  <Form.Label className="mb-0">Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="shfe-diplom"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                {error && (
                  <p style={{ color: "red", fontWeight: "600" }}>{error}</p>
                )}
                <Button
                  className="mb-3"
                  variant="secondary"
                  type="submit"
                  disabled={disabled}
                >
                  {isLoading ? "Загрузка…" : "Авторизоваться"}
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <div>E-mail: shfe-diplom@netology.ru</div>
                <div>Пароль: shfe-diplom</div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ModifyBackground>
  );
};
