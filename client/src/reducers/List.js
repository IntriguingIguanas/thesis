const initialState = {
  id: 1,
  boardname: 'INCONCEIVABLE IGUANAS',
  lists: [
    {
      id: 1,
      listname: 'CURRENT SPRINT',
      board_id: 1,
      tasks: [
        {
          id: 1,
          text: 'Set up database',
          list_id: 1,
          assigned: 'Enoch'
        },
        {
          id: 2,
          text: 'Build front-end!',
          list_id: 1,
          assigned: 'Christine'
        }
      ]
    },
    {
      id: 2,
      listname: 'FOR REVIEW',
      board_id: 1,
      tasks: [
        {
          id: 3,
          text: 'Passport authentication',
          list_id: 2,
          assigned: 'Kevin'
        },
        {
          id: 4,
          text: 'Deployment',
          list_id: 2,
          assigned: 'Allen'
        }
      ]
    }
  ],
  fetching: false,
  createError: null,
  fetchError: null
}

const list = (state = initialState, action) => {
  switch (action.type) {
    // ------------ CREATE ------------
    case 'LIST_CREATED':
      return {
        ...state
      }
    case 'CREATE_LIST_ERROR':
      return {
        ...state,
        createError: action.createError
      }
    case 'CREATE_LIST':
      return {
        ...state,
        lists: [...state.lists, { listname: action.listname, board_id: action.board_id, tasks: [] }]
      }

    // ------------ FETCH ------------
    case 'FETCHING_LISTS':
      // for UX purpose – might take long to fetch
      return {
        ...state,
        fetchingLists: true
      }
    case 'LISTS_FETCHED':
      return {
        ...state,
        lists: action.lists
      }
    case 'FETCH_LISTS_ERROR':
      return {
        ...state,
        fetchError: action.fetchError
      }

    default:
      return state
  }
}

export default list