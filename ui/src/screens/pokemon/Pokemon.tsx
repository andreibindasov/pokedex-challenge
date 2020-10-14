import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps, Link } from '@reach/router'
import { useQuery, gql } from '@apollo/client'
import { Container as NesContainer } from 'nes-react'

const Container = styled(NesContainer)`
  && {
    background: white;
    margin: 2rem 25%;

    ::after {
      z-index: unset;
      pointer-events: none;
    }
  }
`

const List = styled.ul`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
`

const ListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;

  > *:first-child {
    margin-right: 1rem;
  }
`
// MY CSS STYLED-COMPONENTS
const SearchBox = styled.div`
  display: flex;
  width:100%;
  margin-top:1.2rem;
  flex-direction: column;
  justify-content:center;
  align-items: center;
`
const Filters = styled.div`
  display: flex;
  width:100%;
  margin-top:1.2rem;
  flex-direction: column;
  justify-content:center;
  align-items: center;
`

const Input = styled.input`
  width:33%;
  margin-top:.3rem;
`

const POKEMON_MANY = gql`
  query($skip: Int, $limit: Int) {
    pokemonMany(skip: $skip, limit: $limit) {
      id
      name
      num
      img
    }
  }
`

const Pokemon: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => {
  const { loading, error, data } = useQuery(POKEMON_MANY)
  const pokemonList:
    | Array<{ id: string; name: string; img: string; num: string }>
    | undefined = data?.pokemonMany

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !pokemonList) {
    return <p>Error!</p>
  }

  return (
    <div>
      <SearchBox>
          <h3>Search Box</h3>
          
            <Input></Input>
         
      </SearchBox>
      <Filters>
          <h2>Filters</h2>
          <h3>Types:</h3>
          <input type="checkbox" name="chk_group_1" value="value1" />Value 1<br />
          <input type="checkbox" name="chk_group_1" value="value2" />Value 2<br />
          <input type="checkbox" name="chk_group_1" value="value3" />Value 3<br />     
      </Filters>
      
      <Container rounded>
        
        <List>
          {pokemonList.map(pokemon => (
            <Link to={pokemon.id} onMouseDown={clickLink as any}>
              <ListItem>
                <img src={pokemon.img} />
                {pokemon.name} - {pokemon.num}
              </ListItem>
            </Link>
          ))}
        </List>
      </Container>
    </div>
  )
}

export default Pokemon
