import CursoredShiftCell from '../../../cells/cursoredShiftCell/CursoredShiftCell'
import React from 'react';
import Utility from '../../../../../utils/Utility';
export default function EditableShiftCell(props){
  let QQ=Utility.withEditable(CursoredShiftCell);
  return <QQ {...props}>{props.children}</QQ>;
}