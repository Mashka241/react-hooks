import React, { useReducer, useCallback, useMemo } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import Search from './Search'

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET': return action.ingredients
    case 'ADD': return [...currentIngredients, action.ingredient]
    case 'DELETE': return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get there!')
  }
}

const hhtpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND': return {
      ...httpState,
      loading: true
    }
    case 'RESPONSE': return {
      ...httpState,
      loading: false
    }
    case 'ERROR': return {
      ...httpState,
      loading: false,
      error: action.errorData
    }
    case 'CLEAR': return {
      ...httpState,
      error: null
    }
    default:
      throw new Error('Should not get there!')
  }
}

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(hhtpReducer, {
    loading: false,
    error: null
  })
  // const [ingredients, setIngredients] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState()

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setIngredients(filteredIngredients)
    dispatch({
      type: 'SET',
      ingredients: filteredIngredients
    })
  }, [])

  const addIngredientHandler = useCallback((ingredient) => {
    // setIsLoading(true)
    dispatchHttp({ type: 'SEND' })
    fetch('https://react-hooks-52b97.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      // setIsLoading(false)
      dispatchHttp({ type: 'RESPONSE' })
      return response.json()
    }).then(responseData => {
      // setIngredients((prevIngredients) => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient }
      // ])
      dispatch({
        type: 'ADD',
        ingredient: { id: responseData.name, ...ingredient }
      })
    })
  }, [])

  const removeIngredientHandler = useCallback((id) => {
    dispatchHttp({ type: 'SEND' })
    fetch(`https://react-hooks-52b97.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' })
      // setIngredients((prevIngredients) => prevIngredients.filter(el => el.id !== `${id}`))
      dispatch({
        type: 'DELETE',
        id
      })
    }).catch(() => {
      dispatchHttp({
        type: 'ERROR',
        errorData: 'Something went wrong!'
      })
      // setIsLoading(false)
      // setError('Something went wrong!')
    })
  }, [])

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' })
  }, [])

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
    )
  }, [ingredients, removeIngredientHandler])

  return (
    <div className='App'>
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  )
}

export default Ingredients
