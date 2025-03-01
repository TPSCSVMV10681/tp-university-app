export function Table({ children }) {
    return <table className="w-full border-collapse border border-gray-200">{children}</table>;
  }
  
  export function TableHeader({ children }) {
    return <thead className="bg-gray-100">{children}</thead>;
  }
  
  export function TableHead({ children }) {
    return <th className="border border-gray-300 px-4 py-2 text-left">{children}</th>;
  }
  
  export function TableBody({ children }) {
    return <tbody>{children}</tbody>;
  }
  
  export function TableRow({ children }) {
    return <tr className="border border-gray-200">{children}</tr>;
  }
  
  export function TableCell({ children }) {
    return <td className="border border-gray-300 px-4 py-2">{children}</td>;
  }
  