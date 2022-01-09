import { SimResults } from "./Viewer";

export function Details({ data }: { data: SimResults }) {

  return (
    <div>
      <div className="m-2 p-2 rounded-md bg-gray-600">
        <pre className="whitespace-pre-wrap">{data.text}</pre>
      </div>
    </div>
  );
}
