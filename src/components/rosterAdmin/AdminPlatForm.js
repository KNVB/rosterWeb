import Sidebar from './sideBar/SideBar';
function AdminPlatForm(props){
    return(
        <div id="admin">
            <Sidebar pageWrapId={'page-wrap'} auth={props.auth} outerContainerId={"admin"}/>
            <main id="page-wrap">
                <div className="d-flex justify-content-center m-0 flex-grow-1">
                    <h1 className="p-0 m-0">EMSTF Roster Admin. Page</h1>
                </div>
            </main>    
        </div>
    )
}
export default AdminPlatForm;