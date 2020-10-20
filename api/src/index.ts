import { ApolloServer, gql, IResolvers } from 'apollo-server'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import pokemon from './pokemon.json'

interface Pokemon {
  id: string
  num: string
  name: string
  img: string
  types: string[]
  weaknesses: string[]
  height: string
  weight: string
  egg: string
  prevEvolutions?: Array<{ num: string; name: string }>
  nextEvolutions?: Array<{ num: string; name: string }>
  candy?: string
  candyCount?: number
}



// Declare arrays to dynamically fill with types and weakness properties
// of pokemon.json objects
let typesArray: Array<string> = []
let wknArray: Array<string> = []

// Extracting types and weaknesses properties from pokemon.json objects by
// using Object.values() javascript method which returns an array whose 
// elements are the enumerable property values found on the object.
Object.values(pokemon).forEach(val => {
  val.types.map(t => typesArray.push(t))
  val.weaknesses.map(w => wknArray.push(w))
})

// Filtering out typesArray && wknArray to have only unique values
typesArray = [...new Set(typesArray)]
wknArray = [...new Set(wknArray)]

// Declare myFilters object with properties types && weakness assigning values to them  
// with sorted arrays typesArray && wknArray respectively to be returned as a result 
// in resolvers section when executing a query
const myFilters = {
  types: typesArray.sort(),
  weaknesses: wknArray.sort()
}

// Declare type MyFilters and query populateFilters with type MyFilters in the Schema
const typeDefs = gql`
  type Pokemon {
    id: ID!
    num: ID!
    name: String!
    img: String!
    types: [String!]!
    weaknesses: [String!]!
    height: String!
    weight: String!
    egg: String!
    prevEvolutions: [Pokemon!]!
    nextEvolutions: [Pokemon!]!
    candy: String
    candyCount: Int
  }

  type MyFilters {
    types: [String!]!
    weaknesses: [String!]!
  }
  

  type Query {
    pokemonMany(skip: Int, limit: Int): [Pokemon!]!
    pokemonOne(id: ID!): Pokemon

    populateFilters(query: String):MyFilters!
  }
`

const resolvers: IResolvers<any, any> = {
  Pokemon: {
    prevEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.prevEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
    nextEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.nextEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
  },
  Query: {
    pokemonMany(
      _,
      { skip = 0, limit = 999 }: { skip?: number; limit?: number }
    ): Pokemon[] {
      return sortBy(pokemon, poke => parseInt(poke.id, 10)).slice(
        skip,
        limit + skip
      )
    },
    pokemonOne(_, { id }: { id: string }): Pokemon {
      return (pokemon as Record<string, Pokemon>)[id]
    },

    // Retrieving myFilters object with the technique for fetching the types 
    // defined in the schema by declaring populateFilters Query resolver
    populateFilters(_,__,___): object {
      return myFilters
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
