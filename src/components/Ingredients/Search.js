import React, { useState, useEffect, useRef } from 'react'

import Card from '../UI/Card'
import './Search.css'

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('')

  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`
        fetch('https://react-hooks-52b97.firebaseio.com/ingredients.json' + query)
          .then(response => {
            return response.json()
          })
          .then(responseData => {
            const loadedIngredients = []
            for (const key in responseData) {
              loadedIngredients.push({
                amount: responseData[key].amount,
                title: responseData[key].title,
                id: key
              })
            }
            onLoadIngredients(loadedIngredients)
          })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, onLoadIngredients, inputRef])

  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
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
