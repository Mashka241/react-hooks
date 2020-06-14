import React, { useState, useEffect, useRef } from 'react'

import Card from '../UI/Card'
import ErrorModal from '../UI/ErrorModal'
import './Search.css'
import useHttp from '../../hooks/http'

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef = useRef()
  const { isLoading, data, error, sendRequest, clear } = useHttp()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`
        const url = 'https://react-hooks-52b97.firebaseio.com/ingredients.json' + query
        sendRequest(url, 'GET')
        // fetch('https://react-hooks-52b97.firebaseio.com/ingredients.json' + query)
        //   .then(response => {
        //     return response.json()
        //   })
        //   .then(responseData => {
        //     const loadedIngredients = []
        //     for (const key in responseData) {
        //       loadedIngredients.push({
        //         amount: responseData[key].amount,
        //         title: responseData[key].title,
        //         id: key
        //       })
        //     }
        //     onLoadIngredients(loadedIngredients)
        //   })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, inputRef, sendRequest])

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = []
      for (const key in data) {
        loadedIngredients.push({
          amount: data[key].amount,
          title: data[key].title,
          id: key
        })
      }
      onLoadIngredients(loadedIngredients)
    }
  }, [data, isLoading, error, onLoadIngredients])

  return (
    <section className='search'>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            ref={inputRef}
            type='text'
            value={enteredFilter}
            onChange={(evt) => setEnteredFilter(evt.target.value.trim())}
          />
        </div>
      </Card>
    </section>
  )
})

export default Search
