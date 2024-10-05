import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

export const TableRenderer = ({ content }: { content: string }) => {
  const tryParseJSON = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return null;
    }
  };

  const extractJSONFromString = (str: string) => {
    const match = str.match(/\[[\s\S]*\]/);
    return match ? tryParseJSON(match[0]) : null;
  };

  const tableData = extractJSONFromString(content);

  if (Array.isArray(tableData) && tableData.length > 0) {
    const headers = Object.keys(tableData[0]);

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={`${index}-${header}`}>
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return <div className="whitespace-pre-wrap">{content}</div>;
};
