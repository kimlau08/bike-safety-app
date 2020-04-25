
const initialState = {

    proximity: "Houston, TX",  //current proximity to be displayed next to nav bar

    filter: {}

 };
  
  function reducer(state = initialState, action) {
    switch(action.type) {

      case 'SET_FILTER':
        return {
            filter: action.newFilter
        };

      default:
        return state;
    }
  }
  
  export default reducer;