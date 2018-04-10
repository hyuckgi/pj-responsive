import React from 'react';
import Responsive from 'react-responsive';

const DesktopLayout = (props) => {
    console.log("props", props);
    return (<Responsive {...props} minWidth={768} />);
}

const MobileLayout = (props) => {
    console.log("props", props);
    return (<Responsive {...props} maxWidth={767} />);
}

export {
    DesktopLayout,
    MobileLayout,
}
