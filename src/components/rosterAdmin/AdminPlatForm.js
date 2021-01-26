import Sidebar from './sideBar/SideBar';
function AdminPlatForm(props){
    return(
        <div>
            <Sidebar pageWrapId={'page-wrap'} auth={props.auth}/>
            <div id="page-wrap">
                <div className="d-flex justify-content-center m-0 flex-grow-1">
                    <h1 className="p-0 m-0">EMSTF Roster Admin. Page</h1>
                </div>
            </div>    
        </div>
    )
}
export default AdminPlatForm;