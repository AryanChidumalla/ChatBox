import MyProfile from "./myProfile"
import SearchBar from "./seachBar"

function SideBar() {

    return (
        <div className="sidebarContainer">
            <div className="sidebarWrapper">
                <div className="sideBarTitle">ChatBox</div>
                <MyProfile/>
                <SearchBar/>
            </div>
        </div>
    )
}

export default SideBar