import { useEffect, useState } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../../services/api";

import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { Container, Form, Background, StatusCard } from "./styles";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [statusMessage, setStatusMessage] = useState("");
  const [isStatusVisible, setIsStatusVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  } 

  async function handleSignUp() {
    if (!name || !email || !password) {
      setStatusMessage("Preencha todos os campos!");
      setIsStatusVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setStatusMessage("O e-mail fornecido não é válido.");
      setIsStatusVisible(true);
      return;
    }

    setIsLoading(true);
    setIsStatusVisible(true);
    setStatusMessage("Cadastrando usuário...");

    try {
      await api.post("/users", { name, email, password });
      setStatusMessage("Usuário cadastrado com sucesso!");
    } catch (error) {
      if (error.response) {
        setStatusMessage(error.response.data.message);
      } else {
        setStatusMessage("Não foi possível cadastrar");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleCloseStatus() {
    setIsStatusVisible(false);
    if (statusMessage === "Usuário cadastrado com sucesso!") {
      navigate("/");
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        if (isStatusVisible && !isLoading) {
          handleCloseStatus();
        } else if (!isStatusVisible) {
          handleSignUp();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isStatusVisible, isLoading, name, email, password]);

  return (
    <Container>
      <Background />

      <Form>
        <h1>RocketNotes</h1>
        <p>Aplicação para salvar e gerenciar seus links úteis.</p>

        <h2>Crie sua conta</h2>

        <Input
          placeholder="Nome"
          type="text"
          icon={FiUser}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="E-mail"
          type="text"
          icon={FiMail}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Senha"
          type="password"
          icon={FiLock}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button title="Cadastrar" onClick={handleSignUp} />

        <Link to="/">Voltar para o login</Link>
      </Form>

      {isStatusVisible && (
        <StatusCard>
          <p>{statusMessage}</p>
          {!isLoading && <Button title="OK" onClick={handleCloseStatus} />}
        </StatusCard>
      )}
    </Container>
  );
}
