import React from 'react';
import { Drawer } from 'antd-mobile';

import { Wrapper } from './';

class drawerContainer extends React.Component {

    constructor(props) {
        super(props);

        this.onOpenChange = this.onOpenChange.bind(this);
    }

    onOpenChange(status, target){
        const { onEvents } = this.props;

        if(onEvents){
            if(status){
                return onEvents({
                    events : 'open',
                    payload : {
                        name : 'drawer',
                        target : target
                    }
                });
            }
            return onEvents({
                events : 'close',
                payload : {
                    name : 'drawer',
                    target : target
                }
            });
        }
    }

    render() {
        const { children, status } = this.props;

        return (
            <Drawer
                className="drawer-container"
                style={{minHeight : document.documentElement.clientHeight}}
                position="right"
                sidebar={(<Wrapper />)}
                open={status}
                onOpenChange={this.onOpenChange}
                sidebarStyle={{width:'70%', backgroundColor : '#fff'}}
            >
                {children}
            </Drawer>
        );
    }

}

export default drawerContainer;
