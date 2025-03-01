export function Accordion({ children }) {
    return <div className="border border-gray-200 rounded-md">{children}</div>;
  }
  
  export function AccordionItem({ title, children }) {
    return (
      <div className="border-b">
        <button className="w-full text-left px-4 py-2 font-medium bg-gray-100">{title}</button>
        <div className="px-4 py-2">{children}</div>
      </div>
    );
  }
  