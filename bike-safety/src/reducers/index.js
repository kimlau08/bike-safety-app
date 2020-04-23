
const initialState = {

    proximity: "Austin, TX",

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