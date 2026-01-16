import { TableRow, TableCell, Skeleton } from "@vibe/core";

const TableSkeleton = ({
  rows = 8,
  columns = 7,
  showCheckbox = false,
}) => {
  return Array.from({ length: rows }).map((_, rowIndex) => (
    <TableRow key={`skeleton-row-${rowIndex}`}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <TableCell key={`skeleton-cell-${colIndex}`}>
          {showCheckbox && colIndex === 0 ? (
            <Skeleton
              width={16}
              height={16}
              borderRadius="50%"
            />
          ) : (
            <Skeleton height={36} width={100} />
          )}
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableSkeleton;
