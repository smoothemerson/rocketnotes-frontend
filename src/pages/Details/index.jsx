import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Tag } from "../../components/Tag";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Section } from "../../components/Section";
import { ButtonText } from "../../components/ButtonText";
import { Container, Links, Content, StatusCard } from "./styles";

import { api } from "../../services/api";

export function Details() {
  const [data, setData] = useState(null);

  const [statusMessage, setStatusMessage] = useState("");
  const [isStatusVisible, setIsStatusVisible] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  async function handleRemove() {
    setStatusMessage("Deseja realmente remover a nota?");
    setIsStatusVisible(true);
  }

  async function deleteNote() {
    await api.delete(`/notes/${params.id}`);
    navigate(-1);
    setIsStatusVisible(false);
  }

  function handleCloseStatus() {
    setIsStatusVisible(false);
    setStatusMessage("");
  }

  useEffect(() => {
    async function fetchNote() {
      const response = await api.get(`/notes/${params.id}`);
      setData(response.data);
    }

    fetchNote();
  }, []);

  return (
    <Container>
      <Header />
      {data && (
        <main>
          <Content>
            <div className="title">
              <h1>{data.title}</h1>
              <ButtonText title="Excluir nota" onClick={handleRemove} />
            </div>

            <p>{data.description}</p>

            {data.links && (
              <Section title="Links úteis">
                <Links>
                  {data.links.map((link) => (
                    <li key={String(link.id)}>
                      <a href={link.url} target="_blank">
                        {link.url}
                      </a>
                    </li>
                  ))}
                </Links>
              </Section>
            )}

            {data.tags && (
              <Section title="Marcadores">
                {data.tags.map((tag) => (
                  <Tag key={String(tag.id)} title={tag.name} />
                ))}
              </Section>
            )}

            <Button title="Voltar" onClick={handleBack} />
          </Content>
        </main>
      )}

      {isStatusVisible && (
        <StatusCard>
          <p>{statusMessage}</p>
          <Button title="Sim" onClick={deleteNote} />
          <Button title="Não" onClick={handleCloseStatus} />
        </StatusCard>
      )}
    </Container>
  );
}
