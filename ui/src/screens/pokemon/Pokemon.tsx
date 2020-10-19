import React, {useState} from 'react'
import styled from 'styled-components'
import { RouteComponentProps, Link } from '@reach/router'
import { useQuery, gql } from '@apollo/client'
import { Container as NesContainer } from 'nes-react'

import Fuse from 'fuse.js'
import { TupleType } from 'typescript'
import { type } from 'os'
import { AnyMxRecord } from 'dns'

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
const FilterTitles = styled.div`
  display: flex;
  margin-top:1.2rem;
  flex-direction: column;
  width:100%;
  justify-content:center;
  align-items:center;
  font-size:.9rem;
  span{
    display:flex;
    flex-direction:row;
    justify-content:space-around;
    align-items:center;
    width:100%;
  }
`
const FilterContainer = styled.div`
  display: flex;
  margin-top:.3rem;
  flex-direction: row;
  justify-content:space-around;
 
`
const Filters = styled.div`
  display: flex;
  
  margin-top:.3rem;
  flex-direction: column;
  justify-content:flex-start;
  align-items: left;
  font-size:.6rem;
  color:black;
  font-weight:200;
  font-family: "Arial";
  padding:.3rem;
`

const CheckboxDiv = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
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
      types
      weaknesses
    }
    populateFilters {
      types
      weaknesses
    }
  }
`
const Pokemon: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => {
  

  const { loading, error, data } = useQuery(POKEMON_MANY)
  const pokemonList:
    | Array<{ id: string; name: string; img: string; num: string; types:string[]; weaknesses:string[]}>
    | undefined = data?.pokemonMany

  const pokemonFilters: 
    | any 
    | undefined = data?.populateFilters
   
  

  const [text, setText] = useState('');
  
  const [tArr, setTypesArr] = useState<Array<string>>([]);
  const [wArr, setWeakArr] = useState<Array<string>>([]);

  
  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !pokemonList || !pokemonFilters) {
    return <p>Error!</p>
  }

  const pokemonTypes:Array<string> = pokemonFilters.types
  const pokemonWeaknesses:Array<string> = pokemonFilters.weaknesses

  

  // FUZZY_SEARCH 

  
  const options = {
    includeScore:true,
    keys: ['name']
  }

  
    const fuse = new Fuse(pokemonList, options)
    const filteredPokemons = fuse.search(text).map(el => el.item)
    
    
    let result = text ? filteredPokemons : pokemonList
    
    // FILTERING 
    
    if (tArr.length > 0) {
      result = result.filter((res)=>{
        if (tArr.every(i => res.types.includes(i))) {
          return res
        }
      })
    }

    if (wArr.length > 0) {
      result = result.filter((res)=>{
        if (wArr.every(i => res.weaknesses.includes(i))) {
          return res
        }
      })
    }


  

  return (
    <div>
      <SearchBox>
          <h3>Search Box</h3>
          
      <Input 
          value={text} 
          onChange={(e)=>{
            setText(e.target.value)
            
          }}
      ></Input>
         
      </SearchBox>
      <FilterTitles>
          <h3>Filter By:</h3>
          <span>
            <h6>Types</h6>
            <h6>Weaknesses</h6>
          </span>
      </FilterTitles>
      <FilterContainer>
        
        <Filters>
         
            {
              
              pokemonTypes.map(t => (
                <CheckboxDiv>
                    {t}
                    <input 
                      type="checkbox" 
                      value={t}
                      onChange={(e)=>{
                        
                        e.target.checked ? (
                          setTypesArr([
                            ...tArr,
                            e.target.value
                          ])
                          
                          
                        ) : (
                          setTypesArr(tArr.filter((item) => item !== e.target.value))
                        )
                      }}
                      
                    />
                    
                </CheckboxDiv>
                
              ))
            }
        </Filters>
        
        <Filters>
          
            {
              pokemonWeaknesses.map(w => (
                <CheckboxDiv>
                  {w}
                  <input 
                    type="checkbox" 
                    value={w}
                    onChange={(e)=>{
                        
                      e.target.checked ? (
                        setWeakArr([
                          ...wArr,
                          e.target.value
                        ])
                        
                        
                      ) : (
                        setWeakArr(wArr.filter((item) => item !== e.target.value))
                      )
                    }}
                  />
                </CheckboxDiv>
                
              ))
            }
        </Filters>
      </FilterContainer>
      <Container rounded>
        
        <List>
          {
            
            result.map(pokemon => (
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
