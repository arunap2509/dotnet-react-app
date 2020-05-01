import React, { useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import ActivityStore from '../../app/stores/activityStores';
import { observer } from "mobx-react-lite";

const NavBar: React.FC = () => {

  const activityStore = useContext(ActivityStore);
  return (
    <Menu fixed="top" inverted>
        <Container>
            <Menu.Item header>
                <img src="/assets/logo.png" alt="Logo" style={{marginRight: '10px'}} />
                DotNet-React App
            </Menu.Item>
            <Menu.Item name="Activities" />
            <Menu.Item>
                <Button onClick={activityStore.openCreateForm} positive content="Create Activity" />
            </Menu.Item>
        </Container>
    </Menu>
  );
};

export default observer(NavBar);
