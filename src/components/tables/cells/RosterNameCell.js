import React from 'react';
import NameCell from './nameCell/NameCell';
export default function RosterNameCell(props){
    return (
      <NameCell {...props}>
        {props.children}
      </NameCell>
    )
}