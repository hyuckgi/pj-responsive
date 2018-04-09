import React from 'react';
import Responsive from 'react-responsive';

const Desktop = (props) => {
    return (<Responsive {...props} minWidth={768} />);
}

const Mobile = (props) => {
    return (<Responsive {...props} maxWidth={767} />);
}

export {
    Desktop,
    Mobile,
}
