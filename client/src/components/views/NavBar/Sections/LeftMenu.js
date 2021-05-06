import React from "react";
// import { USER_SERVER } from "../../../Config";
import { Menu } from "antd";
import { Link } from "react-router-dom";
// import axios from "axios";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  // const [notify, setNotify] = useState();

  // useEffect(() => {
  //   getNotificationCount();
  // }, []);

  // const getNotificationCount = async () => {
  //   const id = localStorage.getItem("userId");
  //   await axios
  //     .get(`${USER_SERVER}/users/${id}`)
  //     .then((res) => {
  //       setNotify(res.data.notifications.length);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <Link to="/"> Home </Link>
      </Menu.Item>
      <Menu.Item key="mail1">
        <Link to="/myprofile"> My Profile </Link>
      </Menu.Item>
      <Menu.Item key="mail2">
        <Link to="/mutualprofile"> Matched Profiles </Link>
      </Menu.Item>
      <Menu.Item key="mail3">
        <Link to="/notifications"> Notifications</Link>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
