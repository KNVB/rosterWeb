import Utility from '../../utils/Utility';
function AdminPlatForm(props){
    function logout(){
        Utility.fetchAPI('/privateAPI/logout','POST')
        .then(result=>{
            props.auth("false");
        })
        .catch(err=>{
          alert("Something wrong when logout the system: "+err.message);  
        })
    }
    return(
        <div>
            <div> This is Admin Platform</div>
            <button onClick={logout}>Logout</button>
        </div>
    )
}
export default AdminPlatForm;