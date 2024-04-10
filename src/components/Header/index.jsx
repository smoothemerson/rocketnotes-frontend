import { Container, Profile  } from './style'

export function Header(){
  return(
    <Container>
      <Profile >
        <img
          src="https://github.com/smoothemerson.png"
          alt='Foto do usuário'
        />

        <div>
          <span>Bem-vindo</span>
          <strong>Emerson Rocha</strong>
        </div>

      </Profile>
    </Container>
  )
}
