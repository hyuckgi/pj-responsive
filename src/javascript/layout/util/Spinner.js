import React from 'react';

import { DesktopLayout, MobileLayout } from '../../commons/components';

import { Spin, Icon } from 'antd';
import { ActivityIndicator } from 'antd-mobile';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

class Spinner extends React.Component {

    render() {
        const { tip, spinning, children, toast } = this.props;

        return (
            <div className="spinning-wrapper">
                <DesktopLayout>
                    <Spin tip={tip} spinning={spinning} indicator={antIcon}>
                        {children}
                    </Spin>
                </DesktopLayout>
                <MobileLayout>
                    <ActivityIndicator
                        toast={toast}
                        text={tip}
                        animating={spinning}
                    />
                </MobileLayout>
            </div>

        );
    }
}

export default Spinner;
