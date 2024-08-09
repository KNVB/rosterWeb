import { Outlet } from 'react-router-dom';
import ItemList from './ItemList';
import SideBar from "./sideBar/SideBar";
export default function RosterAdminContent(){
    return <SideBar content={<Outlet/>} navItemList={<ItemList/>}/>    
}