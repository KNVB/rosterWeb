import React from 'react';
import CaptionCell from "../cells/CaptionCell";
export default function CaptionRow({caption}) {
  return (
    <tr>
      <CaptionCell colSpan="42">
        {caption}        
      </CaptionCell>
    </tr>
  );
}
