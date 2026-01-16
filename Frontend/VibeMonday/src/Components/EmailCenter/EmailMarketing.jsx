import {
  Box,
  Flex,
  Text,
  // Tabs,
  Tab,
  Search,
  Dropdown,
  Button,
  Table,
  Badge,
  TabList,
  TabsContext,
  TabPanels,
  TabPanel,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHeaderCell,
  Chips,
  Heading
} from "@vibe/core";
import { Add } from "@vibe/icons";
import { useState } from "react";
import './EmailMarketing.css'
import { Divider } from "monday-ui-react-core";

const EmailMarketing = () => {
  const [activeTab, setActiveTab] = useState("campaigns");

  const tableColumns = [
  { id: "name", title: "Campaign Name" },
  { id: "status", title: "Status" },
  { id: "audience", title: "Audience" },
  { id: "sentDate", title: "Sent Date" },
  { id: "actions", title: "Actions" },
];


  const data = [
    {
      id: 1,
      name: "Black Friday Sale",
      subject: "50% off everything!",
      status: "Sent",
      audience: "All Merchants",
      sentDate: "Nov 24, 2025",
    },
    {
      id: 2,
      name: "Winback - High Risk",
      subject: "We miss you...",
      status: "Draft",
      audience: "High Risk Churn",
      sentDate: "-",
    },
  ];

  return (
    <Box style={{ height: "100%" }}>

      <Flex direction="column" gap={12} align="start" style={{height:"100%"}}>
        {/* Header */}
     <Box style={{width:"100%"}}>
       <Flex justify="space-between" align="center" marginBottom="medium">
        <Heading type="h3" weight="medium" style={{fontFamily:"Figtree, sans-serif"}}>Email Marketing</Heading>
        <Button
          size="small"
          kind="primary"
          leftIcon={Add}
        >
          Create Campaign
        </Button>
      </Flex>
     </Box>

      {/* Tabs */}
      <Box border style={{height:"100%"}}>


        <TabsContext id="overview-tabs">
          <TabList id="overview-tab-list" className="tablist-em" stretchedUnderline="false">
            <Tab id="overview-tab-first">
              Campagains
            </Tab>
            <Tab id="overview-tab-second">
              Templates
            </Tab>
            <Tab id="overview-tab-third">
              Settings
            </Tab>
          </TabList>
          {/* <Divider withoutMargin />  */}
          <TabPanels id="overview-tab-panels">
            <TabPanel id="overview-panel-first">
              <Box
               
                padding="medium"
                style={{
                  height: '100%',
                  width: '100%'
                }}
              >

                {/* Filters */}
               <Flex direction="column" gap={10}>
                 <Box style={{width:"100%"}}>
                  <Flex
                  gap="small"
                  marginTop="medium"
                  marginBottom="medium"
                >
                  <Search
                    placeholder="Search campaigns..."
                    size="small"
                    style={{width:"70%" , flex: 1 }}
                  />

                  <Dropdown
                    className="dropstatus-em"
                    size="small"
                    value={{ label: "Status: All", value: "all" }}
                    options={[
                      { label: "Status: All", value: "all" },
                      { label: "Sent", value: "sent" },
                      { label: "Draft", value: "draft" },
                    ]}
                  />
                </Flex>
                </Box>

                {/* Table */}
               <Box style={{width:"100%" , height:"100%"}}>
                <Table size="large" columns={tableColumns}>
  {/* TABLE HEADER */}
  <TableHeader>
    {/* <TableRow highlighted > */}
      {tableColumns.map((col) => (
        <TableHeaderCell key={col.id} title={col.title} />
      ))}
    {/* </TableRow> */}
  </TableHeader>

  {/* TABLE BODY */}
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id} className="table-row-em">

        {/* Campaign Name */}
        <TableCell className="tbcell-em" >
          <Flex direction="column" gap={5} align="start">
            <Text weight="medium">{row.name}</Text>
            <Text type="text2" color="secondary">
              Subject: {row.subject}
            </Text>
          </Flex>
        </TableCell>

        {/* Status */}
        <TableCell>
          <Chips
          label= {row.status}
            color={row.status === "Sent" ? "positive" : "warning"}
          readOnly
          />
            
      
        </TableCell>

        {/* Audience */}
        <TableCell>
          <Text>{row.audience}</Text>
        </TableCell>

        {/* Sent Date */}
        <TableCell>
          <Text>{row.sentDate}</Text>
        </TableCell>

        {/* Actions */}
        <TableCell>
          <Text
            color="primary"
            weight="medium"
            style={{ cursor: "pointer" }}
            onClick={() =>
              row.status === "Sent"
                ? console.log("View Stats", row.id)
                : console.log("Edit", row.id)
            }
          >
            {row.status === "Sent" ? "View Stats" : "Edit"}
          </Text>
        </TableCell>

      </TableRow>
    ))}
  </TableBody>
</Table>
               </Box>
               </Flex>

              </Box>
            </TabPanel>
            <TabPanel id="overview-panel-second">
              <Box
                backgroundColor="greyBackgroundColor"
                padding="medium"
                style={{
                  height: '100%',
                  width: '100%'
                }}
              >
                Second slide
              </Box>
            </TabPanel>
            <TabPanel id="overview-panel-third">
              <Box
                backgroundColor="greyBackgroundColor"
                padding="medium"
                style={{
                  height: '100%',
                  width: '100%'
                }}
              >
                Third slide
              </Box>
            </TabPanel>
          </TabPanels>
        </TabsContext>
      </Box>
      </Flex>

    </Box>
  );
};

export default EmailMarketing;
