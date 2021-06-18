import BigStepSelectorBody from './BigStepSelectorBody';
import BigStepSelectorFooter from './BigStepSelectorFooter';
import BigStepSelectorHeader from './BigStepSelectorHeader';
export default function BigStepSelector(props) {
  return (
    <div className="BigStepSelectorContainer">
      <table className="BigStepSelector">
        <BigStepSelectorHeader
          context={props.context}
          setContext={props.setContext}
        />
        <BigStepSelectorBody
          context={props.context}
          setContext={props.setContext}
        />
        <BigStepSelectorFooter
          context={props.context}
          setContext={props.setContext}
        />
      </table>
    </div>
  );
}
