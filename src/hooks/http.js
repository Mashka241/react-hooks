import { useReducer, useCallback } from 'react'

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
}

const hhtpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND': return {
      ...httpState,
      loading: true,
      data: null,
      extra: null,
      identifier: action.identifier
    }
    case 'RESPONSE': return {
      ...httpState,
      loading: false,
      data: action.responseData,
      extra: action.extra
    }
    case 'ERROR': return {
      ...httpState,
      loading: false,
      error: action.errorData
    }
    case 'CLEAR': return initialState
    default:
      throw new Error('Should not get there!')
  }
}

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(hhtpReducer, initialState)

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), [])

  const sendRequest = useCallback((url, method, body, extra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier })
    // fetch(`https://react-hooks-52b97.firebaseio.com/ingredients/${id}.json`, {
    //   method: 'DELETE'
    fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      // dispatchHttp({ type: 'RESPONSE' })
      // dispatch({
      //   type: 'DELETE',
      //   id
      // })
      return response.json()
    }).then(responseData => {
      dispatchHttp({ type: 'RESPONSE', responseData, extra })
    }).catch(() => {
      dispatchHttp({
        type: 'ERROR',
        errorData: 'Something went wrong!'
      })
    })
  }, [])

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear
  }
}

export default useHttp
