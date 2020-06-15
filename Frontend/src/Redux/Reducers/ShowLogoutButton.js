const ShowLogoutButton = function (state = false, action) {
    if(action.type === "Show"){
        state = true;
        return state;
    }
    if(action.type === "Hide"){
        state = false;
        return state;
    }
    return state;
}

export default ShowLogoutButton;