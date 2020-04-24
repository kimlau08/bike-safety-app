
const initialState = {

    proximity: "Austin, TX",  //current proximity to be displayed next to nav bar

 };
  
  function reducer(state = initialState, action) {
    switch(action.type) {

      case 'SET_PROXMITY':
        return {
            proximity: action.newProximity
        };

      default:
        return state;
    }
  }
  
  export default reducer;