import React from 'react';
import NewBusinessContext from './NewBusinessContext';

const NewBusinessContextState = (props) => {
    return (
        <NewBusinessContextState.provider>
            {props.children}
        </NewBusinessContextState.provider>
    )

}


export default NewBusinessContextState;