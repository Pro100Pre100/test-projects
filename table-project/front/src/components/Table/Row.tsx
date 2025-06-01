import type { RowProps } from "../../interface/main";

export function Row({ index, style, data, isItemLoaded, tableHead }: RowProps) {


  if (!isItemLoaded(index)) {
    return (
      <div style={{ ...style, display: 'flex'}}>
       
      </div>
    );
  }

  return (
    <div style={{ ...style, width: 'auto', display: 'flex', overflow:'hidden'}}>
      <div className="tableRow">
        {tableHead?.map((cell) =>
          <div key={cell}
            className="tableCell body"
            
          > {data[cell] ? data[cell] : ''}</div>)}

      </div>
    </div>
  );
};