const setProximity = (proximity) => {
    return {                //return an object
        type: "SET_PROXMITY",
        newProximity: proximity
    }
}

export default setProximity;
