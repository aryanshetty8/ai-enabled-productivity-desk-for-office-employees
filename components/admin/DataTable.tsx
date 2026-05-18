import { Card } from "@/components/ui/card";

export function DataTable({
  headers,
  rows
}: {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-forest-900/55">
            <tr>
              {headers.map((header) => (
                <th key={header} className="pb-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-900/8">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} className="py-3 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
