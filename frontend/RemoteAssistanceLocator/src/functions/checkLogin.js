function checkLogin(){
    if(!localStorage.getItem("token")){
        return false;
    }
    return true;
}
export default checkLogin;