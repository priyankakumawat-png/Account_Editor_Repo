import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Search,
  Label,
} from "@vibe/core";
import { Filter, Add, Sort } from "@vibe/icons";


const tableHeaders = [
  { key: "name", title: "Name" },
  { key: "price", title: "Price" },
  { key: "interval", title: "Interval" },
  { key: "type", title: "Type" },
  { key: "merchants", title: "Merchants" },
  { key: "mrr", title: "MRR" }
];

const PlanAndDetails = () => {



  const data = [
    {
      name: "Free",
      price: "$0",
      interval: "Monthly",
      type: "Public",
      merchants: "1,442",
      mrr: "0",
    },
    {
      name: "Bronze",
      price: "$25",
      interval: "Monthly",
      type: "Public",
      merchants: "680",
      mrr: "$17k",
    },
    {
      name: "Silver",
      price: "$75",
      interval: "Monthly",
      type: "Public",
      merchants: "312",
      mrr: "$23k",
    },
    {
      name: "Gold",
      price: "$200",
      interval: "Monthly",
      type: "Public",
      merchants: "47",
      mrr: "$9k",
    },
  ];



  return (
    <Box padding="large">

      {/* HEADER */}
      <Flex justify="space-between" align="center" marginBottom="medium">
        <Text type="text1" weight="bold">
          Plans & Subscriptions
        </Text>

        <Flex gap="small">
          <Search size="small" placeholder="Search plans" />
          <Button kind="tertiary" leftIcon={Filter} size="small">
            Filter
          </Button>
          <Button kind="tertiary" leftIcon={Add} size="small">
            Add
          </Button>
          <Button kind="tertiary" leftIcon={Sort} size="small">
            Sort
          </Button>
        </Flex>
      </Flex>

      {/* STATS */}
      <Flex gap="small" marginBottom="medium">
        {[
          { label: "Total Plans", value: "14" },
          { label: "Total MRR", value: "$22,450" },
          { label: "Avg CLV", value: "$180" },
          { label: "Trials", value: "120 act." },
        ].map((item, index) => (
          <Box
            key={index}
            padding="medium"
            style={{
              background: "#F5F6FA",
              borderRadius: 8,
              minWidth: 160,
            }}
          >
            <Text color="secondary">{item.label}</Text>
            <Text type="text1" weight="bold">
              {item.value}
            </Text>
          </Box>
        ))}
      </Flex>

      {/* TABLE */}




      <Table id="overview-table" 
      columns={tableHeaders}
      >
        <TableHeader>
          {tableHeaders.map((item) => (
            <TableHeaderCell key={item.key} title={item.title} />
          ))}
        </TableHeader>
        <TableBody>
          {data.map(rowItem => <TableRow key={rowItem.id}>
            <TableCell>{rowItem.name}</TableCell>
            <TableCell>{rowItem.price}</TableCell>
            <TableCell>
              {rowItem.interval}
            </TableCell>
            <TableCell>
              <Label text={rowItem.type} color="positive" />
            </TableCell>
            <TableCell>{rowItem.merchants}</TableCell>
            <TableCell>{rowItem.mrr}</TableCell>
          </TableRow>)}
        </TableBody>
      </Table>


    </Box>
  );
};

export default PlanAndDetails;
