import './ItemList.css';
export default function ItemList(){
    let logout=()=>{
        
    }
    return (
        <ul className='itemList'>
            <li>
                <a href="/rosterWeb/admin/rosterScheduler">Roster Scheduler</a>
            </li>
            <li>
                <a href="/rosterWeb/admin/itoManagement">ITO Management</a>
            </li>
            <li>
                <span className='logout' onClick={logout}>
                    Logout
                </span>
            </li>    
        </ul>
    );        
}